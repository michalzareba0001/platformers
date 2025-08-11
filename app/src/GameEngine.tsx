import Matter from 'matter-js';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import Floor from './entities/Floor';
import Player from './entities/Player';
import Platform from './entities/Platform';
import Physics from './Physics';
import Background01 from './components/Background01';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export default function GameEngineComponent() {
  const engine = useRef(Matter.Engine.create());
  const world = engine.current.world;

  const WORLD_WIDTH = 4200;
  const WORLD_HEIGHT = 4000;
  const FLOOR_H = 25;
  const PLAYER_W = 50;
  const PLAYER_H = 50;

  const START_X = 500; // pozycja platformy 1
  const START_Y = WORLD_HEIGHT - 150 - PLAYER_H;

  const [playerBody] = useState(() =>
    Matter.Bodies.rectangle(START_X, START_Y, PLAYER_W, PLAYER_H)
  );

  const [floorBody] = useState(() =>
    Matter.Bodies.rectangle(
      WORLD_WIDTH / 2,
      WORLD_HEIGHT - FLOOR_H / 2,
      WORLD_WIDTH,
      FLOOR_H,
      { isStatic: true }
    )
  );

  const plat = (x: number, fromBottom: number, w: number, h: number = 20) =>
    Matter.Bodies.rectangle(x, WORLD_HEIGHT - fromBottom, w, h, { isStatic: true });

  const [platforms] = useState([
    plat(500, 150, 200), // platforma startowa
    plat(800, 250, 150),
    plat(1200, 200, 250),
    plat(1600, 300, 160),
    plat(2000, 300, 200),
    plat(2300, 200, 140),
    plat(2600, 300, 200),
    plat(2800, 150, 150),
    plat(3050, 250, 200),
    plat(3300, 400, 100),
    plat(3000, 500, 200),
    plat(2700, 600, 80),
    plat(3100, 750, 200),
  ]);

  useEffect(() => {
    Matter.World.add(world, [playerBody, floorBody, ...platforms]);
    Matter.Runner.run(Matter.Runner.create(), engine.current);
  }, []);

  const entities = useRef({
    background: {
      renderer: Background01,
      camera: { x: 0, y: 0 },
      worldWidth: WORLD_WIDTH,
      worldHeight: WORLD_HEIGHT,
    },
    physics: { engine: engine.current, world },
    player: {
      body: playerBody,
      renderer: Player,
      controls: { left: false, right: false, jump: false },
      jumps: 1,
      maxJumps: 2,
      camera: { x: 0, y: 0 }
    },
    floor: { body: floorBody, renderer: Floor, camera: { x: 0, y: 0 } },
    camera: { x: 0, y: 0 },
    screenWidth: SCREEN_W,
    screenHeight: SCREEN_H,
    ...platforms.reduce((acc, p, i) => {
      acc[`platform${i + 1}`] = { body: p, renderer: Platform, camera: { x: 0, y: 0 } };
      return acc;
    }, {} as any)
  });

  const buttonSize = 70;
  const btnLeft = { x: 30, y: SCREEN_H - 30 - buttonSize };
  const btnRight = { x: 30 + buttonSize + 20, y: SCREEN_H - 30 - buttonSize };
  const btnJump = { x: SCREEN_W - 30 - buttonSize, y: SCREEN_H - 30 - buttonSize };

  const isInsideButton = (touchX: number, touchY: number, btn: { x: number, y: number }) => {
    return (
      touchX >= btn.x &&
      touchX <= btn.x + buttonSize &&
      touchY >= btn.y &&
      touchY <= btn.y + buttonSize
    );
  };

  const updateControls = (evt: any) => {
    const touches = evt.nativeEvent.touches;
    let left = false, right = false, jump = false;

    for (let t of touches) {
      const x = t.pageX;
      const y = t.pageY;
      if (isInsideButton(x, y, btnLeft)) left = true;
      if (isInsideButton(x, y, btnRight)) right = true;
      if (isInsideButton(x, y, btnJump)) jump = true;
    }

    entities.current.player.controls.left = left;
    entities.current.player.controls.right = right;
    entities.current.player.controls.jump = jump;
  };

  return (
    <View style={{ flex: 1 }}>
      <GameEngine
        systems={[Physics]}
        entities={entities.current}
        style={{ flex: 1, backgroundColor: '#add8e6' }}
      />
      <View
        style={StyleSheet.absoluteFill}
        onTouchStart={updateControls}
        onTouchMove={updateControls}
        onTouchEnd={updateControls}
      >
        <View style={styles.controls}>
          <View style={[styles.button, { left: btnLeft.x, top: btnLeft.y }]}>
            <Text style={styles.text}>←</Text>
          </View>
          <View style={[styles.button, { left: btnRight.x, top: btnRight.y }]}>
            <Text style={styles.text}>→</Text>
          </View>
          <View style={[styles.button, { left: btnJump.x, top: btnJump.y }]}>
            <Text style={styles.text}>↑</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  controls: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  button: {
    position: 'absolute',
    backgroundColor: '#fff6',
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 28,
    fontWeight: 'bold',
  },
});
