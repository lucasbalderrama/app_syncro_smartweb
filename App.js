import "react-native-gesture-handler";
import { View, StatusBar } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from '@react-navigation/drawer';

import CustomDrawerContent from './src/component/drawerContent';
import Cadastro from './src/screens/Cadastro';
import Perfil from './src/screens/Perfil';
import Login from './src/screens/Login';
import Chat from './src/screens/Chat';
import Conversas from './src/screens/Conversas';
import CriarGrupo from './src/screens/CriarGrupo';
import AddContato from './src/screens/AddContato';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="rgb(19, 19, 24)" />
      <NavigationContainer>
        <Drawer.Navigator
          initialRouteName="Login"
          drawerContent={(props) => <CustomDrawerContent {...props} />}
          screenOptions={{
            drawerContentStyle: { backgroundColor: 'rgb(30,30,36)' },
            drawerInactiveTintColor: '#aaa',
            drawerActiveTintColor: 'rgb(76, 0, 216)',
            headerStyle: { backgroundColor: 'rgb(19, 19, 24)' },
            headerTintColor: '#fff',
          }}>
          <Drawer.Screen name="Perfil" component={Perfil} />
          <Drawer.Screen name="Cadastro" component={Cadastro} options={{ headerShown: false, drawerItemStyle: { display: 'none' } }} />
          <Drawer.Screen name="Login" component={Login} options={{ headerShown: false, drawerItemStyle: { display: 'none' } }} />
          <Drawer.Screen name="Criar grupo" component={CriarGrupo} />
          <Drawer.Screen name="Chat" component={Chat} options={{ drawerItemStyle: { display: 'none' } }} />
          <Drawer.Screen name="Conversas" component={Conversas} />
          <Drawer.Screen name="AddContato" component={AddContato} />
        </Drawer.Navigator>
      </NavigationContainer>

    </View>
  );
}
