import Matter from 'matter-js';
import React from 'react';
import { ImageBackground } from 'react-native';

interface PlatformProps {
  body: Matter.Body;
  camera: { x: number; y: number };
}

const Platform: React.FC<PlatformProps> = ({ body, camera }) => {
  const width = body.bounds.max.x - body.bounds.min.x;
  const height = body.bounds.max.y - body.bounds.min.y;

  return (
    <ImageBackground
      source={require('../assets/platform01.webp')} // ścieżka do obrazka
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
    />
  );
};

export default Platform;
