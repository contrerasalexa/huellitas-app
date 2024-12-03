import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Agenda from '../screens/Agenda'; 
import Citas from '../screens/Citas'; 
import Historial from '../screens/Historial'; 
import Icon from 'react-native-vector-icons/Ionicons'; 

const BottomTab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <BottomTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true, 
        tabBarStyle: { backgroundColor: '#eee' }, 
        tabBarActiveTintColor: '#0056D2',
        tabBarInactiveTintColor: '#555', 
        tabBarIcon: ({ color, size }) => {
          
          let iconName;
          if (route.name === 'Agenda') iconName = 'calendar-outline';
          else if (route.name === 'Citas') iconName = 'list-outline';
          else if (route.name === 'Historial') iconName = 'time-outline';
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <BottomTab.Screen name="Agenda" component={Agenda} />
      <BottomTab.Screen name="Citas" component={Citas} />
      <BottomTab.Screen name="Historial" component={Historial} />
    </BottomTab.Navigator>
  );
}
