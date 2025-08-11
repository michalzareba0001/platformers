import React from 'react';
import { View } from 'react-native';
import Matter from 'matter-js';

interface PlayerProps {
  body: Matter.Body;
  camera: { x: number; y: number };
}

const Player: React.FC<PlayerProps> = ({ body, camera }) => {
  const width = 50;
  const height = 50;

  return (
    <View
      style={{
        position: 'absolute',
        left: body.position.x - width / 2 - camera.x,
        top: body.position.y - height / 2 - camera.y,
        width,
        height,
        backgroundColor: '#ff0000', // czerwony gracz
        borderRadius: 50, // zaokrąglone rogi
      }}
    />
  );
};

export default Player;
