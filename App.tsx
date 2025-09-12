/**
 * AwesomeProject - 模块展示应用
 * 展示所有已完成的页面模块
 *
 * @format
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MainScreen from './src/screens/MainScreen';

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#8B5CF6" translucent />
      <MainScreen />
    </SafeAreaProvider>
  );
}

export default App;