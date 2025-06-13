// DrawerContent.js
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { supabase } from '../../supabaseConfig';

export default function CustomDrawerContent(props) {
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      props.navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      Alert.alert("Erro ao sair", error.message);
    }
  };

  return (
    <DrawerContentScrollView {...props} style={styles.bar}>
      <DrawerItemList {...props} />
      <View style={styles.logoutContainer}>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: 'rgb(19, 19, 24)'
  },
  logoutContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  logoutButton: {
    marginTop: 480,
    backgroundColor: 'rgb(83, 72, 207)',
    padding: 10,
    borderRadius: 8,
  },
  logoutText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
