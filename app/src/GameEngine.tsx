import Matter from 'matter-js';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import Floor from './entities/Floor';
import Player from './entities/Player';
import Physics from './Physics';

const { width, height } = Dimensions.get('window');

export default function GameEngineComponent() {
  const engine = useRef(Matter.Engine.create());
  const world = engine.current.world;

  const [playerBody] = useState(() =>
    Matter.Bodies.rectangle(100, 100, 50, 50)
  );
  const [floorBody] = useState(() =>
    Matter.Bodies.rectangle(width / 2, height - 25, width, 25, { isStatic: true })
  );

  useEffect(() => {
    Matter.World.add(world, [playerBody, floorBody]);
    Matter.Runner.run(Matter.Runner.create(), engine.current);
  }, [world, playerBody, floorBody]);

  const entities = useRef({
    physics: { engine: engine.current, world },
    player: {
      body: playerBody,
      renderer: Player,
      controls: { left: false, right: false, jump: false }
    },
    floor: { body: floorBody, renderer: Floor },
  });

  // Rozmiar przycisków
  const buttonSize = 70;
  const btnLeft = { x: 30, y: height - 30 - buttonSize };
  const btnRight = { x: 30 + buttonSize + 20, y: height - 30 - buttonSize };
  const btnJump = { x: width - 30 - buttonSize, y: height - 30 - buttonSize };

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
      const x = t.pageX; // globalne X
      const y = t.pageY; // globalne Y

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

      {/* Overlay multitouch */}
      <View
        style={StyleSheet.absoluteFill}
        onTouchStart={updateControls}
        onTouchMove={updateControls}
        onTouchEnd={updateControls}
      >
        {/* Przyciski jako wizualizacja */}
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
