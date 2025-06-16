import { View, Text, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from 'react-native';
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
    <DrawerContentScrollView {...props} style={styles.bar} contentContainerStyle={{ flexGrow: 1 }}>
      <DrawerItemList {...props} />
      <SafeAreaView style={styles.logoutContainer}>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: 'rgb(19, 19, 24)',
  },
  logoutContainer: {
    marginTop: 'auto', 
    paddingHorizontal: 20,
    paddingBottom: 20, 
  },
  logoutButton: {
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
