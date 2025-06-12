import "react-native-gesture-handler";
import { View, StatusBar } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from '@react-navigation/drawer';

import Cadastro from './src/screens/Cadastro';
import Perfil from './src/screens/Perfil';
import Login from './src/screens/Login';
import Chat from './src/screens/Chat';
import Grupos from './src/screens/Grupos';
import CriarGrupo from './src/screens/CriarGrupo';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="rgb(19, 19, 24)" />
      <NavigationContainer>
        <Drawer.Navigator 
        initialRouteName="Login" 
        screenOptions={{
          drawerContentStyle: { backgroundColor: 'rgb(30,30,36)' },
          drawerInactiveTintColor: '#aaa',
          drawerActiveTintColor: 'rgb(76, 0, 216)',
          headerStyle: { backgroundColor: 'rgb(19, 19, 24)' },
          headerTintColor: '#fff',
        }}>
          <Drawer.Screen name="Perfil" component={Perfil} />
          <Drawer.Screen name="Cadastro" component={Cadastro} />
          <Drawer.Screen name="Login" component={Login} options={{ headerShown: false, drawerItemStyle: { display: 'none' } }}/>
          <Drawer.Screen name="Criar grupo" component={CriarGrupo} />
          <Drawer.Screen name="Chat" component={Chat} />
          <Drawer.Screen name="Grupos" component={Grupos} />
        </Drawer.Navigator>
      </NavigationContainer>
    </View>
  );
}
