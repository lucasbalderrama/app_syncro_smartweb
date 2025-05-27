import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { supabase } from '../../supabaseConfig';


const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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

    const redirecionarCadastro = () => {
        navigation.navigate("Cadastro")
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

export default Login;

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
        marginTop: 50,
    },
    input: {
        height: 40,
        borderColor:'rgba(83, 72, 207, 0.73)',
        borderWidth: 1,
        backgroundColor: '#fff',
        marginBottom: 20,
        width: 300,
        paddingLeft: 10,
        borderRadius: 8,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 7,
        marginBottom: 50,
        marginTop: 20,
        backgroundColor: 'rgb(83, 72, 207)',
    },
    buttonText: {
        fontFamily: 'Gotham',
        color: 'white',
        fontSize: 18,
        fontWeight:450,
    },
    textCadastro: {
        marginTop: 40,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: 60,
    },

    linkCadastro: {
        fontFamily: 'Gotham',
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