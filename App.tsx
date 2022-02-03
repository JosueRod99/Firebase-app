import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import 'react-native-gesture-handler';
import { Navigator } from './src/navigation/Navigator';

export const App = () => {
  return(
    <NavigationContainer>
      <Navigator/>
    </NavigationContainer>
        
  )
};
export default App;