import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { supabase } from '../../supabaseConfig';

const Login = ({ navigation }) => {
    const handleLogin = async () => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
    
        if (error) {
            console.log('Erro ao fazer login:', error.message);
            return;
        }
    
        console.log('Usuário logado:', data.user);
    
        navigation.navigate("Chat");
    };
    

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const redirecionarCadastro = () => {
        navigation.navigate("Cadastro")
    }
    const redirecionarChat = () => {
        navigation.navigate("Chat")
    }
    return (
        <View style={styles.container}>
            <View style={styles.forms}>
                <Image
                    style={styles.logo}
                    source={require('../assets/logo/logo.png')}
                />
                <TextInput
                    style={styles.input}
                    placeholder="E-mail"
                    onChangeText={setEmail}
                    value={email}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    secureTextEntry={true}
                    onChangeText={setPassword}
                    value={password}
                />
                <TouchableOpacity>
                    <Text style={styles.esqueceuSenha}>Esqueceu a senha?</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Entrar</Text>
                </TouchableOpacity>

            </View>
            <View style={styles.textCadastro}>
                <TouchableOpacity onPress={redirecionarCadastro}>
                    <Text style={styles.linkCadastro}>
                        Não tem uma conta? <Text style={styles.linkDestacado}>Cadastre-se</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    forms: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 300,
        height: 300,
        resizeMode: 'contain',
        marginBottom: -50,
        marginTop: 50,
    },
    input: {
        height: 100,
        borderColor: 'gray',
        borderWidth: 1,
        backgroundColor: 'white',
        marginBottom: 20,
        width: 300,
        paddingLeft: 10,
        borderRadius: 8,
    },
    button: {
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 40,
        borderRadius: 5,
        marginBottom: 50,
        marginTop: 20,
        borderColor: '#2c2dd7',
        borderWidth: 2,
    },
    buttonText: {
        color: '#2c2dd7',
        fontSize: 16,
        fontWeight: 'bold',
    },
    textCadastro: {
        marginTop: 30,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: 60,
        borderTopColor: '#c1c1c1',
        borderTopWidth: 1,
    },

    linkCadastro: {
        fontSize: 16,
        color: '#000',
    },

    linkDestacado: {
        color: '#2c2dd7',
        textDecorationLine: 'underline',
    },
    esqueceuSenha: {
        color: '#2c2dd7',
        textDecorationLine: 'underline',
    }
});

export default Login;