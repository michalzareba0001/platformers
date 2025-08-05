import Matter from 'matter-js';
import React, { useEffect, useRef } from 'react';
import { Dimensions } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import Floor from './entities/Floor';
import Player from './entities/Player';
import Physics from './physics';

export default function GameEngineComponent() {
  const { width, height } = Dimensions.get('window');
  const engine = useRef(Matter.Engine.create());
  const world = engine.current.world;

  useEffect(() => {
    Matter.Engine.run(engine.current);
  }, []);

  const player = Matter.Bodies.rectangle(width / 4, height / 4, 50, 50);
  const floor = Matter.Bodies.rectangle(width / 2, height - 25, width, 50, { isStatic: true });

  Matter.World.add(world, [player, floor]);

  const entities = {
    physics: { engine: engine.current, world },
    player: { body: player, renderer: Player },
    floor: { body: floor, renderer: Floor },
  };

  return (
    <GameEngine
      systems={[Physics]}
      entities={entities}
      style={{ flex: 1, backgroundColor: '#add8e6' }}
    />
  );
}
