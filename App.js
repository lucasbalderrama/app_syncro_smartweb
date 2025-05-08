// Ana Lívia dos Santos Lopes nº1 DS
// Isadora Gomes da Silva nº 9

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons';

import Chat from './src/screens/Chat';
import Perfil from './src/screens/Perfil';
import Login from './src/screens/Login';
import Cadastro from './src/screens/Cadastro';

const Tab = createBottomTabNavigator();

const App = () => (
<NavigationContainer>
    <Tab.Navigator initialRgiouteName='Cadastro' screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Login" component={Login}  />
      <Tab.Screen name="Chat" component={Chat} options={{tabBarIcon: ({ color, size }) => (<FontAwesome5 name="map-marker-alt" size={size} color={color} />
    ),
  }}
  />
      <Tab.Screen name="Perfil" component={Perfil} options={{tabBarIcon: ({ color, size }) => (
      <FontAwesome5 name="user" size={size} color={color} />
    ),
  }}
       />
      <Tab.Screen name="Cadastro" component={Cadastro} options={{tabBarIcon: ({ color, size }) => (
      <FontAwesome5 name="route" size={size} color={color} />
    ),
  }}
      />
    </Tab.Navigator>
  </NavigationContainer>
);

export default App;
