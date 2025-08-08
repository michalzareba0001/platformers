import Matter from 'matter-js';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import Floor from './entities/Floor';
import Player from './entities/Player';
import Physics from './Physics';

const { width, height } = Dimensions.get('window');

export default function GameEngineComponent() {
  const engine = useRef(Matter.Engine.create());
  const world = engine.current.world;

  const [playerBody] = useState(() => Matter.Bodies.rectangle(100, 100, 50, 50));
  const [floorBody] = useState(() =>
    Matter.Bodies.rectangle(width / 2, height - 25, width, 25, { isStatic: true })
  );

  useEffect(() => {
    Matter.World.add(world, [playerBody, floorBody]);
    Matter.Runner.run(Matter.Runner.create(), engine.current);
  }, [world, playerBody, floorBody]);

  // Encje w useRef, controls jako obiekt w encji gracza
  const entities = useRef({
    physics: { engine: engine.current, world },
    player: { body: playerBody, renderer: Player, controls: { left: false, right: false, jump: false } },
    floor: { body: floorBody, renderer: Floor },
  });

  // Aktualizuj controls bezpośrednio w encji
  const handleTouch = (type: 'left' | 'right' | 'jump', active: boolean) => {
    entities.current.player.controls[type] = active;
  };



  return (
    <View style={{ flex: 1 }}>
      <GameEngine
        systems={[Physics]}
        entities={entities.current}
        style={{ flex: 1, backgroundColor: '#add8e6' }}
      />
      <View style={styles.controls}>
        <View style={styles.directionButtons}>
          <Pressable
            onPressIn={() => handleTouch('left', true)}
            onPressOut={() => handleTouch('left', false)}
            style={styles.button}
          >
            <Text style={styles.text}>←</Text>
          </Pressable>
          <Pressable
            onPressIn={() => handleTouch('right', true)}
            onPressOut={() => handleTouch('right', false)}
            style={styles.button}
          >
            <Text style={styles.text}>→</Text>
          </Pressable>

        </View>
        <View style={styles.actionButtons}>
          <Pressable
            onPressIn={() => handleTouch('jump', true)}
            onPressOut={() => handleTouch('jump', false)}
            style={styles.button}
          >
            <Text style={styles.text}>↑</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  controls: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    columnGap: 20,
    paddingHorizontal: 30,
  },
  button: {
    backgroundColor: '#fff6',
    width: 70,
    height: 70,
    borderRadius: 35,
    
    alignItems: 'center',
    justifyContent: 'center',
  },
  directionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    columnGap: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 28,
    fontWeight: 'bold',
  },
});
