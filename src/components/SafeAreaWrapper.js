import React from 'react';
import { Platform, View } from 'react-native';

// SafeAreaProvider wrapper that works on web
export default function SafeAreaWrapper({ children }) {
  if (Platform.OS === 'web') {
    return <View style={{ flex: 1 }}>{children}</View>;
  }
  
  // Only import for native platforms
  try {
    const { SafeAreaProvider } = require('react-native-safe-area-context');
    return <SafeAreaProvider>{children}</SafeAreaProvider>;
  } catch (e) {
    // Fallback if import fails
    return <View style={{ flex: 1 }}>{children}</View>;
  }
}

