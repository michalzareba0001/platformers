import React from 'react';
import { View } from 'react-native';
import GameEngineComponent from './src/GameEngine';

export default function Index() {
  return (
    <View style={{ flex: 1 }}>
      <GameEngineComponent />
    </View>
  );
}