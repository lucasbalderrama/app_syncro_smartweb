import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Image, Alert
} from 'react-native';
import { supabase } from '../../supabaseConfig';

const CadastroUsuario = ({ navigation }) => {
  const [user_email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user_name, setName] = useState('');

  const registerUser = async (user_email, password, user_name) => {
    try {
      await supabase.auth.signOut();

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: user_email,
        password,
      });

      if (signUpError) throw signUpError;

      const userId = signUpData.user.id;

      const { error: dbError } = await supabase
        .from('users')
        .insert({ id: userId, user_name, user_email });

      if (dbError) throw dbError;

      console.log("Usuário registrado com sucesso!");
    } catch (error) {
      console.error("Erro ao registrar usuário:", error.message);
      throw error;
    }
  };

  const handleRegister = async () => {
    if (user_email && password && user_name) {
      try {
        await registerUser(user_email, password, user_name);
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
      <View style={styles.formulario}>
        <Image source={require("../assets/logo/logo-preta.png")} style={styles.imagem} />

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
        />
        <Text style={styles.Text}>Sua senha deve conter uma letra maiúscula, uma minúscula e um caractere especial</Text>

        <TouchableOpacity onPress={handleRegister} style={styles.registerButton}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.textLogin}>
        <TouchableOpacity onPress={redirecionarLogin}>
          <Text style={styles.linkLogin}>
            Já tem uma conta? <Text style={styles.linkDestacado}>Entre na sua conta</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e24',
  },
  formulario: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagem: {
    width: 340,
    height: 200,
    resizeMode: 'contain',
    marginTop: 100
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
  registerButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
    width: 110,
    borderRadius: 7,

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
    marginTop: 148,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 20,
  },
  linkLogin: {
    color: '#fff',
    fontFamily: 'Gotham',
    fontSize: 16,
    marginRight: 10,
  },
  linkDestacado: {
    color: 'rgb(155, 100, 255)',
    fontFamily: 'Gotham',
    textDecorationLine: 'underline',
  },
  Text:{
    color: "#fff",
    margin: 12,
    textAlign: "center",
    fontFamily: "Gotham",
  }
});

export default CadastroUsuario;