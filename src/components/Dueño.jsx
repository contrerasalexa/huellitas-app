import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import RegisScreen from './RegisScreen'; 
import ReporScreen from './ReporScreen';
import ModifScreen from './ModifScreen';
import AgenScreen from './AgenScreen';

// Configuración del BottomTabNavigator
const BottomTab = createBottomTabNavigator();

const Dueño = () => {
  return (
    <NavigationContainer>
      <BottomTab.Navigator
        screenOptions={{
          headerShown: true,
          tabBarStyle: { backgroundColor: '#eee' },
        }}
      >
        <BottomTab.Screen name="Registro" component={RegisScreen} />
        <BottomTab.Screen name="Reportes" component={ReporScreen} />
        <BottomTab.Screen name="Modificar" component={ModifScreen} />
        <BottomTab.Screen name="Agendar" component={AgenScreen} />
      </BottomTab.Navigator>
    </NavigationContainer>
  );
};

export default Dueño;
