import Matter from 'matter-js';
import React from 'react';
import { ImageBackground, View, StyleSheet } from 'react-native';

interface EndGameProps {
  body: Matter.Body;
  camera: { x: number; y: number };
}

const EndGame: React.FC<EndGameProps> = ({ body, camera }) => {
  const width = body.bounds.max.x - body.bounds.min.x;
  const height = body.bounds.max.y - body.bounds.min.y;

  return (
    <ImageBackground
      source={require('../assets/endgame.webp')} // identyczny wygląd bazowy
      style={{
        position: 'absolute',
        left: body.position.x - width / 2 - camera.x,
        top: body.position.y - height / 2 - camera.y,
        width,
        height,
        borderRadius: 5,
        overflow: 'hidden',
      }}
      resizeMode="stretch"
    >
      {/* subtelny zielony tint dla „końca poziomu” */}
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0, 200, 120, 0.28)' }]} />
    </ImageBackground>
  );
};

export default EndGame;
