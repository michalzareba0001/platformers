import React from 'react';
import { Dimensions, View } from 'react-native';

export default function Floor({ body }: any) {
  const { width } = Dimensions.get('window');
  const height = 25;
  const x = body.position.x - width / 2;
  const y = body.position.y - height / 2;

  return (
    <View
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height,
        backgroundColor: '#53a311ff',
      }}
    />
  );
}
