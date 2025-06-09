import "react-native-gesture-handler";
import { View } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from '@react-navigation/drawer';

import Cadastro from './src/screens/Cadastro';
import Perfil from './src/screens/Perfil';
import Login from './src/screens/Login';
import Chat from './src/screens/Chat';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Chat">
          <Drawer.Screen name="Cadastro" component={Cadastro} />
          <Drawer.Screen name="Perfil" component={Perfil} />
          <Drawer.Screen name="Login" component={Login} />
          <Drawer.Screen name="Chat" component={Chat} />
        </Drawer.Navigator>
      </NavigationContainer>
    </View>
  );
}
