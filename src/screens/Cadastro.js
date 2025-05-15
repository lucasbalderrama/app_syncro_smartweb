import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Image, Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const CadastroUsuario = () => {
  

  return (
    <LinearGradient
    colors={[
        'rgba(144, 0, 247, 1)',
        'rgba(144, 0, 247, 1)',
        'rgba(83, 72, 207, 1)',
        'rgb(53, 26, 254)',
        'rgb(98, 114, 255)',
    ]}
    start={{ x: 0.5, y: 1 }}
    end={{ x: 0.5, y: 0 }}
    style={styles.container}
  >
  
      <View style={styles.curvaTopo}>
        <Image source={require("../assets/logo/logo.png")} style={styles.imagem} />
      </View>

      <View style={styles.formulario}>
        <Text style={styles.title}>Cadastro de Usuário</Text>

        <Image source={require("../assets/perfil.png")} style={styles.foto} />

        <TouchableOpacity onPress={pickFile} style={styles.registerButton}>
          <Text style={styles.buttonText}>Selecionar Foto</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        {file && (
          <Image
            source={{ uri: file.uri }}
            style={{ width: 100, height: 100, marginVertical: 10, borderRadius: 50 }}
          />
        )}

        <TouchableOpacity onPress={handleRegister} style={styles.registerButton}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.curvaBaixo} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  curvaTopo: {
    width: '100%',
    height: 180,
    backgroundColor: 'white',
    borderBottomLeftRadius: 130,
    borderBottomRightRadius: 130,
  },

  formulario: {
    backgroundColor: 'transparent',
    width: '90%',
    borderRadius: 20,
    padding: 50,
    marginTop: -80,
    alignItems: 'center',
  },
  imagem: {
    width: 250,
    height: 110,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: '40'
  },
  foto:{
    width: 110,
    height: 110,
    resizeMode: 'contain',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 100
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
    marginTop: '60'
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 9,
    width: '100%',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: 'transparent',
    padding: 15,
    borderRadius: 26,
    width: '60%',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderBlockColor: "#fff",
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default CadastroUsuario;
