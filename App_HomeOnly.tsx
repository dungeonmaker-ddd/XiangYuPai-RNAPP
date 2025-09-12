/**
 * AwesomeProject - 临时测试：直接使用HomeScreen
 * 用于对比显示效果
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#8B5CF6" translucent />
      <HomeScreen />
    </SafeAreaProvider>
  );
}

export default App;
