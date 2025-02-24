import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../Screen/LoginScreen';
import HomeScreen from '../Screen/HomeScreen';
import AnomalyFormScreen from '../components/AnomalyFormScreen';
import AccountScreen from '../Screen/AccountScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="AnomalyForm" component={AnomalyFormScreen} />
      <Stack.Screen name="Account" component={AccountScreen} />
      
    </Stack.Navigator>
  );
};

export default AppNavigator;