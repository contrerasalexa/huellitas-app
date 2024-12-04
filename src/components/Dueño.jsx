import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import RegisScreen from './RegisScreen';
import ModifScreen from './ModifScreen';
import AgenScreen from './AgenScreen';
import MisMascotasScreen from './MisMascotasScreen';
import ProfileScreen from './ProfileScreen';
import Icon from 'react-native-vector-icons/Ionicons';

// Configuración del BottomTabNavigator
const BottomTab = createBottomTabNavigator();

const Dueño = () => {
  return (
    <BottomTab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarStyle: { backgroundColor: '#eee' },
        tabBarActiveTintColor: '#0056D2', // Color para el ícono activo
        tabBarInactiveTintColor: '#555', // Color para íconos inactivos
      }}
    >
      <BottomTab.Screen 
        name="Registro" 
        component={RegisScreen} 
        options={{ 
          tabBarLabel: 'Registro', 
          tabBarIcon: ({ color, size }) => (
            <Icon name="add-circle-outline" size={size} color={color} />
          ),
        }} 
      />
      <BottomTab.Screen 
        name="Modificar" 
        component={ModifScreen} 
        options={{ 
          tabBarLabel: 'Modificar', 
          tabBarIcon: ({ color, size }) => (
            <Icon name="create-outline" size={size} color={color} />
          ),
        }} 
      />
      <BottomTab.Screen 
        name="Agendar" 
        component={AgenScreen} 
        options={{ 
          tabBarLabel: 'Agendar', 
          tabBarIcon: ({ color, size }) => (
            <Icon name="calendar-outline" size={size} color={color} />
          ),
        }} 
      />
      <BottomTab.Screen 
        name="Mis Mascotas" 
        component={MisMascotasScreen} 
        options={{ 
          tabBarLabel: 'Mascotas',
          tabBarIcon: ({ color, size }) => (
            <Icon name="paw-outline" size={size} color={color} />
          ),
        }} 
      />
      <BottomTab.Screen 
  name="Perfil" 
  component={ProfileScreen} 
  options={{ 
    tabBarLabel: 'Perfil',
    tabBarIcon: ({ color, size }) => (
      <Icon name="person-outline" size={size} color={color} />
    ),
  }} 
/>

    </BottomTab.Navigator>
  );
};

export default Dueño;
