    import React, { useState } from 'react';
    import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
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
                Alert.alert('Erro ao fazer login: ' + error.message);
                return;
            }
            Alert.alert('Login bem-sucedido!', 'Bem-vindo de volta, ' + data.user.email);
            console.log('Usuário logado:', data.user);

            navigation.navigate("Criar grupo");
        };

        const redirecionarCadastro = () => {
            navigation.navigate("Cadastro")
        }
        return (
            <View style={styles.container}>
                <View style={styles.forms}>
                    <Image
                        style={styles.logo}
                        source={require('../assets/logo/logo-preta.png')}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        onChangeText={setEmail}
                        value={email}
                        placeholderTextColor={'white'}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Senha"
                        secureTextEntry={true}
                        onChangeText={setPassword}
                        value={password}
                        placeholderTextColor={'white'}
                    />

                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.textoBotao}>Entrar</Text>
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
        container: {
            flex: 1,
            backgroundColor: '#1e1e24',
        },
        forms: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        logo: {
            width: 340,
            height: 200,
            resizeMode: 'contain',
            marginTop:600,
        },
        input: {
            height: 42,
            borderColor:'rgba(87, 74, 227, 0.91)',
            borderWidth: 2,
            marginBottom: 20,
            width: 300,
            paddingLeft: 10,
            borderRadius: 10,
            color: 'white',
        },
        button: {
            alignItems: 'center',
            justifyContent: 'center',
            height: 38,
            width: 110,
            borderRadius: 7,
            marginBottom: 20,
            marginTop: 20,
            backgroundColor: 'rgb(83, 72, 207)',
        },
        textoBotao: {
            color: 'white',
            fontSize: 18,
            fontWeight: 800,
            fontFamily: 'Gotham',
        },
        textCadastro: {
            marginTop: 600,
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: 60,
        },
        linkCadastro: {
            color: '#fff',
            fontFamily: 'Gotham',
            fontSize: 16,
            marginRight: 10,
        },
        linkDestacado: {
            color: 'rgb(155, 100, 255)',
            fontFamily: 'Gotham',
            textDecorationLine: 'underline',
        }
    });