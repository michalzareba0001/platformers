import Matter from 'matter-js';
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

interface LavaProps {
  body: Matter.Body;
  camera: { x: number; y: number };
}

const TILE = 40; // rozmiar kafelka w px

const Lava: React.FC<LavaProps> = ({ body, camera }) => {
  const width = body.bounds.max.x - body.bounds.min.x;
  const height = body.bounds.max.y - body.bounds.min.y;

  const tilesX = Math.ceil(width / TILE);
  const tilesY = Math.ceil(height / TILE);

  return (
    <View
      style={{
        position: 'absolute',
        left: body.position.x - width / 2 - camera.x,
        top: body.position.y - height / 2 - camera.y,
        width,
        height,
        borderRadius: 5,
        overflow: 'hidden',
      }}
    >
      {Array.from({ length: tilesY }).map((_, row) => (
        <View key={`row-${row}`} style={styles.row}>
          {Array.from({ length: tilesX }).map((_, col) => (
            <Image
              key={`tile-${row}-${col}`}
              source={require('../assets/Lava.webp')}
              style={{ width: TILE, height: TILE }}
              resizeMode="cover"
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
});

export default Lava;
