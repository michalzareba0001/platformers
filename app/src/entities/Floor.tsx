import React from 'react';
import { View } from 'react-native';
import { Dimensions } from 'react-native';

export default function Floor({ body }: any) {
  const width = Dimensions.get('window').width;
  const height = 50;
  const x = 10;
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
