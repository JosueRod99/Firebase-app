import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../screens/HomeScreen';
import { FirebaseScreen } from '../screens/FirebaseScreen';

const Stack = createStackNavigator();

export const Navigator = () => {
  return (
    <Stack.Navigator screenOptions={{
        headerShown: false,
    }}>
      <Stack.Screen name="FirebaseScreen" component={FirebaseScreen} />

      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      </Stack.Navigator>
  );
}