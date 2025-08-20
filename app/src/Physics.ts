import Matter, { Engine, Events, IEventCollision } from 'matter-js';

const SPEED = 4;
const JUMP_FORCE = -10;

const RUN_FPS = 12;
const IDLE_FPS = 3;
const JUMP_FPS = 6;

const COYOTE_TIME = 100;         // ms po zejściu z krawędzi
const JUMP_CUT_MULTIPLIER = 0.5; // skrócenie skoku po puszczeniu

const WORLD_W = 4200;
const WORLD_H = 4000;

const ATTACHED_ENGINES = new WeakSet<Engine>();

function isOnAnyPlatform(player: Matter.Body, entities: any) {
  const halfH = (player.bounds.max.y - player.bounds.min.y) / 2;
  const playerBottom = player.position.y + halfH;

  const surfaces: Matter.Body[] = [
    entities.floor?.body,
    ...Object.keys(entities)
      .filter((k) => k.startsWith('platform'))
      .map((k) => entities[k].body),
  ].filter(Boolean);

  return surfaces.some((s: Matter.Body) => {
    const sH = s.bounds.max.y - s.bounds.min.y;
    const surfaceTop = s.position.y - sH / 2;

    const overlapX = !(
      player.bounds.max.x < s.bounds.min.x || player.bounds.min.x > s.bounds.max.x
    );
    const closeVertically = Math.abs(playerBottom - surfaceTop) < 30;
    const smallVy = Math.abs(player.velocity.y) < 1;

    return overlapX && closeVertically && smallVy;
  });
}

// --- NEW: zbiera ciała lavy z entities (lava1, lava2, ...)
function getLavaBodies(entities: any): Matter.Body[] {
  return Object.keys(entities)
    .filter((k) => k.startsWith('lava'))
    .map((k) => entities[k]?.body as Matter.Body)
    .filter(Boolean);
}

const Physics = (entities: any, { time }: any) => {
  const engine: Engine = entities.physics.engine;
  const playerEnt = entities.player;
  const player = playerEnt.body;
  const controls = playerEnt.controls;

  let vx = 0;
  let vy = player.velocity.y;

  const now = Date.now();

  // Ruch poziomy
  if (controls.left) vx = -SPEED;
  if (controls.right) vx = SPEED;

  // Czy stoimy na czymś?
  const onGround = isOnAnyPlatform(player, entities);

  // Coyote time
  if (onGround) {
    playerEnt.jumps = playerEnt.maxJumps;
    playerEnt.lastGroundTime = now;
  }
  const canCoyoteJump = now - (playerEnt.lastGroundTime || 0) <= COYOTE_TIME && playerEnt.jumps > 0;

  // --- Jump state tracking ---
  if (playerEnt.jumpHeld === undefined) playerEnt.jumpHeld = false;
  if (playerEnt.jumpStartedAt === undefined) playerEnt.jumpStartedAt = 0;
  const wasHeld = playerEnt.jumpHeld;
  playerEnt.jumpHeld = !!controls.jump;

  // Skok (double + coyote) — tylko gdy przycisk właśnie wciśnięty
  if (controls.jump && !wasHeld && (onGround || canCoyoteJump)) {
    vy = JUMP_FORCE;
    playerEnt.jumps -= 1;
    playerEnt.jumpStartedAt = now;
  }

  // Jump-cut: tylko gdy puszczono przycisk po starcie skoku
  const JUST_RELEASED = wasHeld && !playerEnt.jumpHeld;
  const sinceStart = now - (playerEnt.jumpStartedAt || 0);
  if (JUST_RELEASED && sinceStart > 60 && vy < 0) {
    vy *= JUMP_CUT_MULTIPLIER;
  }

  Matter.Body.setVelocity(player, { x: vx, y: vy });

  // --- Animacja ---
  let state: 'idle' | 'run' | 'jump' = 'idle';
  if (!onGround) state = 'jump';
  else if (Math.abs(player.velocity.x) > 0.1) state = 'run';

  if (controls.left)  playerEnt.anim.facing = -1;
  if (controls.right) playerEnt.anim.facing =  1;

  playerEnt.anim._acc = (playerEnt.anim._acc || 0) + time.delta;
  const frameDur =
    state === 'run'  ? 1000 / RUN_FPS :
    state === 'idle' ? 1000 / IDLE_FPS :
                       1000 / JUMP_FPS;

  if (playerEnt.anim.state !== state) {
    playerEnt.anim.state = state;
    playerEnt.anim.frame = 0;
    playerEnt.anim._acc = 0;
  } else {
    while (playerEnt.anim._acc >= frameDur) {
      playerEnt.anim._acc -= frameDur;
      playerEnt.anim.frame += 1;
    }
  }

  // Listener kolizji — tylko raz
  if (!ATTACHED_ENGINES.has(engine)) {
    Events.on(engine, 'collisionStart', (event: IEventCollision<Engine>) => {
      const lavaBodies = getLavaBodies(entities); // <— NEW

      for (const pair of event.pairs) {
        const a = pair.bodyA;
        const b = pair.bodyB;

        if (a !== player && b !== player) continue;
        const other = a === player ? b : a;

        // --- ŚMIERĆ: Floor LUB Lava ---
        if (other === entities.floor.body || lavaBodies.includes(other)) {
          const floorTop = other.position.y - (other.bounds.max.y - other.bounds.min.y) / 2;
          const playerBottom = player.position.y + (player.bounds.max.y - player.bounds.min.y) / 2;
          const fromAbove = playerBottom <= floorTop + 5 || player.velocity.y >= 0;

          if (fromAbove) {
            // respawn jak dotąd
            Matter.Body.setPosition(player, { x: 500, y: WORLD_H - 150 - 50 });
            Matter.Body.setVelocity(player, { x: 0, y: 0 });
            playerEnt.jumps = playerEnt.maxJumps;
            playerEnt.lastGroundTime = Date.now();
          }
        }
      }
    });
    ATTACHED_ENGINES.add(engine);
  }

  // Kamera
  const camX = player.position.x - entities.screenWidth / 2;
  const camY = player.position.y - entities.screenHeight / 2;
  entities.camera.x = Math.max(0, Math.min(camX, WORLD_W - entities.screenWidth));
  entities.camera.y = Math.max(0, Math.min(camY, WORLD_H - entities.screenHeight));

  // Aktualizacja offsetu kamery w encjach
  Object.values(entities).forEach((ent: any) => {
    if (ent && ent.camera) {
      ent.camera.x = entities.camera.x;
      ent.camera.y = entities.camera.y;
    }
  });

  Matter.Engine.update(engine, Math.min(time.delta, 16.667));
  return entities;
};

export default Physics;
