import Matter, { Engine, Events, IEventCollision } from 'matter-js';

const SPEED = 4;
const JUMP_FORCE = -10;

const Physics = (entities: any, { time }: any) => {
  const engine: Engine = entities.physics.engine;
  const player = entities.player.body;
  const controls = entities.player.controls;

  let velocityX = 0;
  let velocityY = player.velocity.y;

  if (controls.left) velocityX = -SPEED;
  if (controls.right) velocityX = SPEED;

  if (controls.jump && entities.player.jumps > 0) {
    velocityY = JUMP_FORCE;
    entities.player.jumps--;
    entities.player.controls.jump = false;
  }

  Matter.Body.setVelocity(player, { x: velocityX, y: velocityY });

  Events.on(engine, 'collisionStart', (event: IEventCollision<Engine>) => {
    event.pairs.forEach((pair) => {
      if (pair.bodyA === player || pair.bodyB === player) {
        const other = pair.bodyA === player ? pair.bodyB : pair.bodyA;

        // reset skoków po lądowaniu
        if (other.isStatic) {
          entities.player.jumps = entities.player.maxJumps;
        }

        // dotknięcie podłogi = reset pozycji
        if (other === entities.floor.body) {
          Matter.Body.setPosition(player, { x: 500, y: 4000 - 150 - 50 });
          Matter.Body.setVelocity(player, { x: 0, y: 0 });
          entities.player.jumps = entities.player.maxJumps;
        }
      }
    });
  });

  // Kamera śledzi gracza
  const camX = player.position.x - entities.screenWidth / 2;
  const camY = player.position.y - entities.screenHeight / 2;
  entities.camera.x = Math.max(0, Math.min(camX, 4200 - entities.screenWidth));
  entities.camera.y = Math.max(0, Math.min(camY, 4000 - entities.screenHeight));

  // aktualizacja kamer w entity
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
