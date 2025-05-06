import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Perfil from '../screens/Perfil';
import Login from '../screens/Login';
import Cadastro from '../screens/Cadastro';
import Chat from '../screens//Chat';

const Stack = createNativeStackNavigator();

export default function NativeStack() {
    return (
        <Stack.Navigator initialRouteName="Login" screenOptions={{headerShown: false}}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Cadastro" component={Cadastro} />
            <Stack.Screen name="Chat" component={Chat} />
            <Stack.Screen name="Perfil" component={Perfil} />
        </Stack.Navigator>
    );
}