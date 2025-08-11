import React from 'react';
import { Image } from 'react-native';

interface BackgroundProps {
  camera: { x: number; y: number };
  worldWidth: number;
  worldHeight: number;
}

const Background: React.FC<BackgroundProps> = ({ camera, worldWidth, worldHeight }) => {
  const PARALLAX = 0.5;

  return (
    <Image
      source={require('../assets/level01_bg.webp')} 
      style={{
        position: 'absolute',
        left: -camera.x * PARALLAX,
        top: -camera.y * PARALLAX,
        width: worldWidth,   
        height: worldHeight, 
        resizeMode: 'cover',
      }}
    />
  );
};

export default Background;
