import React from 'react';
import { View } from 'react-native';
import Matter from 'matter-js';

interface FloorProps {
  body: Matter.Body;
  camera: { x: number; y: number };
}

const Floor: React.FC<FloorProps> = ({ body, camera }) => {
  const width = body.bounds.max.x - body.bounds.min.x;
  const height = body.bounds.max.y - body.bounds.min.y;

  return (
    <View
      style={{
        position: 'absolute',
        left: body.position.x - width / 2 - camera.x,
        top: body.position.y - height / 2 - camera.y,
        width,
        height,
        backgroundColor: '#654321',
      }}
    />
  );
};

export default Floor;
