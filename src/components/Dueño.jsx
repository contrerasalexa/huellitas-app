import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import RegisScreen from './RegisScreen';
import ModifScreen from './ModifScreen';
import AgenScreen from './AgenScreen';
import CitasAsignadasScreen from './CitasAsignadasScreen';
import MisMascotasScreen from './MisMascotasScreen';
import ProfileScreen from './ProfileScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import { auth } from '../utils/firebase';

const BottomTab = createBottomTabNavigator();

const Dueño = () => {
  const userId = auth.currentUser?.uid; 

  return (
    <BottomTab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarStyle: { backgroundColor: '#eee' },
        tabBarActiveTintColor: '#0056D2',
        tabBarInactiveTintColor: '#555',
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
        name="CitasAsignadas"
        component={CitasAsignadasScreen}
        initialParams={{ duenioId: userId }} 
        options={{
          tabBarLabel: 'Citas Asignadas',
          tabBarIcon: ({ color, size }) => (
            <Icon name="list-outline" size={size} color={color} />
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
