import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Agenda from '../screens/Agenda';
import Citas from '../screens/Citas';
import Historial from '../screens/Historial';
import ProfileScreen from './ProfileScreen'; // Nueva pantalla para perfil
import Icon from 'react-native-vector-icons/Ionicons';

const BottomTab = createBottomTabNavigator();

export default function BottomTabs({ route }) {
  const { userName } = route.params || { userName: 'Paseador' }; // Toma el nombre del paseador desde los parámetros

  return (
    <BottomTab.Navigator
      screenOptions={({ route }) => ({
        headerLeft: () => null, // Esto elimina la flecha de "volver"
        headerTitleAlign: 'center',
        headerShown: false,
        tabBarStyle: { backgroundColor: '#eee' },
        tabBarActiveTintColor: '#0056D2',
        tabBarInactiveTintColor: '#555',
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Agenda') iconName = 'calendar-outline';
          else if (route.name === 'Citas') iconName = 'list-outline';
          else if (route.name === 'Historial') iconName = 'time-outline';
          else if (route.name === 'Profile') iconName = 'person-outline';
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <BottomTab.Screen name="Agenda" component={Agenda} />
      <BottomTab.Screen name="Citas" component={Citas} />
      <BottomTab.Screen name="Historial" component={Historial} />
      <BottomTab.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={{ role: 'PASEADOR' }} // Pasa el rol aquí; ajusta dinámicamente en el login
      />
    </BottomTab.Navigator>

  );
}
