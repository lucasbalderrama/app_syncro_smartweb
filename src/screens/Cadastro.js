import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Image, Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { supabase } from '../../supabaseConfig';

const CadastroUsuario = ({ navigation }) => {
  const [user_email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user_name, setName] = useState('');
  const [profile_img, setProfileImg] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImg(result.assets[0].uri);
    }
  };

  const registerUser = async (user_email, password, user_name, profile_img) => {
  try {
    await supabase.auth.signOut();

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: user_email,
      password,
    });

    if (signUpError) throw signUpError;

    const userId = signUpData.user.id;
    const filename = profile_img.substring(profile_img.lastIndexOf('/') + 1);
    const fileType = 'image/jpeg';

    const base64 = await FileSystem.readAsStringAsync(profile_img, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const { error: uploadError } = await supabase.storage
      .from('profile-avatar')
      .upload(`${userId}/${filename}`, base64, {
        contentType: fileType,
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabase
      .storage
      .from('profile-avatar')
      .getPublicUrl(`${userId}/${filename}`);

    const photoURL = publicUrlData.publicUrl;

    const { error: dbError } = await supabase
      .from('users')
      .insert({ id: userId, user_name, user_email, profile_img: photoURL });

    if (dbError) throw dbError;

    console.log("Usuário registrado com sucesso!");
  } catch (error) {
    console.error("Erro ao registrar usuário:", error.message);
    throw error;
  }
};

  const handleRegister = async () => {
    if (user_email && password && user_name && profile_img) {
      try {
        await registerUser(user_email, password, user_name, profile_img);
        Alert.alert("Sucesso", "Usuário registrado com sucesso!");
        navigation.goBack();
      } catch (error) {
        Alert.alert("Erro", error.message || "Falha no cadastro.");
      }
    } else {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
    }


  };
  const redirecionarLogin = () => {
    navigation.navigate("Login")
  }

  return (
    <View style={styles.container}>
      <Image source={require("../assets/logo/logo-preta.png")} style={styles.imagem} />

      <Image
        source={
          profile_img
            ? { uri: profile_img }
            : require("../assets/perfil.png")
        }
        style={{ width: 150, height: 150, marginVertical: 10, borderRadius: 100 }}
      />

      <TouchableOpacity onPress={pickImage} style={styles.imgButton}>
        <Text style={styles.buttonText}>Selecionar Foto</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={user_name}
        onChangeText={setName}
        placeholderTextColor={'white'}
      />
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        keyboardType="email-address"
        autoCapitalize="none"
        value={user_email}
        onChangeText={setEmail}
        placeholderTextColor={'white'}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor={'white'}
      />+6

      <TouchableOpacity onPress={handleRegister} style={styles.registerButton}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
      <View style={styles.textLogin}>
        <TouchableOpacity onPress={redirecionarLogin}>
          <Text style={styles.linkLogin}>Já tem uma conta?<Text style={styles.linkDestacado}>Entre na sua conta</Text></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e24',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex'
  },
  imagem: {
    width: 250,
    height: 110,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: '40'
  },
  foto: {
    width: 110,
    height: 110,
    resizeMode: 'contain',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 100
  },
  input: {
    height: 42,
    borderColor: 'rgba(87, 74, 227, 0.91)',
    borderWidth: 2,
    marginBottom: 20,
    width: 300,
    paddingLeft: 10,
    borderRadius: 10,
    color: 'white',
  },
  imgButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
    width: 150,
    borderRadius: 7,
    marginBottom: 20,
    marginTop: 20,
    backgroundColor: 'rgb(83, 72, 207)',
  },
  registerButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
    width: 110,
    borderRadius: 7,
    marginBottom: 20,
    marginTop: 20,
    backgroundColor: 'rgb(83, 72, 207)',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 800,
    fontFamily: 'Gotham',
  },
  textLogin: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 60,
    backgroundColor: '#1e1e24',
    color: '#fff',
    marginTop: 70,
  },
  linkLogin: {
    color: '#fff',
    fontFamily: 'Gotham',
    fontSize: 16,
  },
  linkDestacado: {
    color: 'rgb(155, 100, 255)',
    fontFamily: 'Gotham',
    textDecorationLine: 'underline',
  }
});

export default CadastroUsuario;