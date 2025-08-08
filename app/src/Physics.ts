import Matter from 'matter-js';

const SPEED = 4;
const JUMP_FORCE = -10;

const Physics = (entities: any, { time }: any) => {
  const engine = entities.physics.engine;
  const player = entities.player.body;
  const controls = entities.player.controls;

  let velocityX = 0;
  let velocityY = player.velocity.y;

  if (controls.left) {
    velocityX = -SPEED;
  }
  if (controls.right) {
    velocityX = SPEED;
  }

  // Skok (jeśli jest "na ziemi")
  if (controls.jump && isOnGround(player, entities.floor.body)) {
    console.log('SKOK!');
    velocityY = JUMP_FORCE;
    entities.player.controls.jump = false;
  }

  // Ustaw prędkość tylko raz, z uwzględnieniem obu osi
  Matter.Body.setVelocity(player, {
    x: velocityX,
    y: velocityY
  });

  Matter.Engine.update(engine, Math.min(time.delta, 16.667));
  entities.player.body = player;

  return entities;
};

// Prosta detekcja kolizji z podłogą
function isOnGround(player: Matter.Body, floor: Matter.Body) {
  const dist = Math.abs(player.position.y + 25 - (floor.position.y - 12.5));
  const vel = Math.abs(player.velocity.y);
  console.log('isOnGround:', dist, vel);
  return dist < 30 && vel < 1;
}

export default Physics;

