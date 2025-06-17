import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    Modal,
    TextInput,
    SafeAreaView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../../supabaseConfig';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import User from '../features/users.js';
import Chat from '../features/chats.js';

export default function AdicionarContato({ navigation }) {
    const [usuarios, setUsuarios] = useState([]);
    const [meuId, setMeuId] = useState(null);
    const [userRepo, setUserRepo] = useState(null);

    const [modalVisivel, setModalVisivel] = useState(false);
    const [novoNome, setNovoNome] = useState('');
    const [novoEmail, setNovoEmail] = useState('');

    const insets = useSafeAreaInsets(); // pega as áreas seguras

    useEffect(() => {
        // async function carregarDados() {
        //     const { data: userData } = await supabase.auth.getUser();
        //     if (userData?.user) {
        //         setMeuId(userData.user.id);
        //     }

        //     const { data, error } = await supabase.from('users').select('*');
        //     if (!error) setUsuarios(data);
        // }

        // carregarDados();
        
        (async () => {
            const userRepo = User.Repository.create();
            setUserRepo(userRepo);
            await userRepo.auth();
            const chats = await userRepo.getRelateds();
            const usersParsed = await Promise.all(chats.map(async user => {
                const chat = await Chat.Service.get(user.id);
                const userInfo = await userRepo.get(
                    chat.user1Id === userRepo._authUser.id ? chat.user2Id : chat.user1Id
                );
                return {
                    id: userInfo.id,
                    name: userInfo.name,
                    email: userInfo.email,
                    chat,
                };
            }));
            setUsuarios(usersParsed);
        })();
    }, []);

    const abrirModal = () => {
        setNovoNome('');
        setNovoEmail('');
        setModalVisivel(true);
    };

    // const confirmarContato = () => {
    //     if (!novoNome.trim() || !novoEmail.trim()) {
    //         Alert.alert('Erro', 'Preencha todos os campos.');
    //         return;
    //     }

    //     setModalVisivel(false);

    //     setTimeout(() => {
    //         Alert.alert('Contato adicionado', `Nome: ${novoNome}\nEmail: ${novoEmail}`);
    //     }, 300);
    // };

    const usuariosFiltrados = usuarios.filter((u) => u.id !== meuId);

    return (
        <SafeAreaView style={[styles.container, { paddingBottom: insets.bottom || 20 }]}>
            <Text style={styles.title}>Meus contatos</Text>

            <ScrollView style={styles.scrollView}>
                {usuariosFiltrados.map((usuario) => (
                    <TouchableOpacity onPress={async () => {
                        navigation.navigate('Chat', { chat: usuario.chat });
                    }} key={usuario.id}>
                        <View key={usuario.id} style={styles.usuario}>
                            <View>
                                <Text style={styles.nome}>{usuario.name}</Text>
                                <Text style={styles.email}>{usuario.email}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <TouchableOpacity onPress={abrirModal} style={styles.botao}>
                <MaterialIcons name="person-add" size={20} color="#fff" />
                <Text style={styles.botaoTexto}>Adicionar contato</Text>
            </TouchableOpacity>

            <Modal
                visible={modalVisivel}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisivel(false)}
            >
                <View style={styles.modalFundo}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitulo}>Novo contato</Text>

                        {/* <TextInput
                            placeholder="Nome"
                            placeholderTextColor="#aaa"
                            style={styles.input}
                            value={novoNome}
                            onChangeText={setNovoNome}
                        /> */}
                        <TextInput
                            placeholder="E-mail"
                            placeholderTextColor="#aaa"
                            style={styles.input}
                            value={novoEmail}
                            onChangeText={setNovoEmail}
                            keyboardType="email-address"
                        />

                        <View style={styles.modalBotoes}>
                            <TouchableOpacity onPress={() => setModalVisivel(false)} style={styles.botaoCancelar}>
                                <Text style={styles.botaoTexto}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={async () => {
                                let user;
                                try {
                                    user = await userRepo.getByEmail(novoEmail);
                                } catch (err) {
                                    Alert.alert('Erro', 'Usuário não encontrado.');
                                    return;
                                }
                                
                                const myUser = userRepo._authUser;
                                const { data, error } = await supabase.from("chats").insert({
                                    user1_id: myUser.id,
                                    user2_id: user.id,
                                });
                                if (error) {
                                    console.log(error);
                                    Alert.alert('Erro', 'Não foi possível adicionar o contato.');
                                    return;
                                } else {
                                    const chat = await Chat.Service.get(data[0].id);
                                    const chatUser = {
                                        id: user.id,
                                        name: user.name,
                                        email: user.email,
                                        chat,
                                    };
                                    setUsuarios(prev => [
                                        ...prev,
                                        chatUser
                                    ]);
                                    navigation.navigate('Chat', { chat });
                                    setModalVisivel(false);
                                    Alert.alert('Sucesso', 'Contato adicionado com sucesso.');
                                }
                            }} style={styles.botaoConfirmar}>
                                <Text style={styles.botaoTexto}>Adicionar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1e1e24',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    title: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 15,
    },
    scrollView: {
        backgroundColor: '#2e2e34',
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
    },
    usuario: {
        borderBottomWidth: 1,
        borderBottomColor: '#444',
        paddingVertical: 10,
    },
    nome: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    email: {
        color: '#aaa',
        fontSize: 14,
    },
    botao: {
        backgroundColor: '#5e00d8',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 6,
        gap: 6,
    },
    botaoTexto: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    modalFundo: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: '#2e2e34',
        padding: 20,
        borderRadius: 8,
        width: '80%',
    },
    modalTitulo: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    input: {
        backgroundColor: '#1e1e24',
        color: '#fff',
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginBottom: 10,
    },
    modalBotoes: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    botaoCancelar: {
        backgroundColor: '#444',
        borderRadius: 6,
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    botaoConfirmar: {
        backgroundColor: '#5e00d8',
        borderRadius: 6,
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
});
