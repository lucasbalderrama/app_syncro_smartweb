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
} from 'react-native';
import { supabase } from '../../supabaseConfig';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function AdicionarContato() {
    const [usuarios, setUsuarios] = useState([]);
    const [meuId, setMeuId] = useState(null);

    const [modalVisivel, setModalVisivel] = useState(false);
    const [novoNome, setNovoNome] = useState('');
    const [novoEmail, setNovoEmail] = useState('');

    useEffect(() => {
        async function carregarDados() {
            const { data: userData } = await supabase.auth.getUser();
            if (userData?.user) {
                setMeuId(userData.user.id);
            }

            const { data, error } = await supabase.from('users').select('*');
            if (!error) setUsuarios(data);
        }

        carregarDados();
    }, []);

    const abrirModal = () => {
        setNovoNome('');
        setNovoEmail('');
        setModalVisivel(true);
    };

    const confirmarContato = () => {
    if (!novoNome.trim() || !novoEmail.trim()) {
        Alert.alert('Erro', 'Preencha todos os campos.');
        return;
    }

    setModalVisivel(false); 

    setTimeout(() => {
        Alert.alert('Contato adicionado', `Nome: ${novoNome}\nEmail: ${novoEmail}`);
    }, 300); 
};

    const usuariosFiltrados = usuarios.filter((u) => u.id !== meuId);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Meus contatos</Text>

            <ScrollView style={styles.scrollView}>
                {usuariosFiltrados.map((usuario) => (
                    <View key={usuario.id} style={styles.usuario}>
                        <View>
                            <Text style={styles.nome}>{usuario.user_name}</Text>
                            <Text style={styles.email}>{usuario.user_email}</Text>
                        </View>
                    </View>
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

                        <TextInput
                            placeholder="Nome"
                            placeholderTextColor="#aaa"
                            style={styles.input}
                            value={novoNome}
                            onChangeText={setNovoNome}
                        />
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
                            <TouchableOpacity onPress={confirmarContato} style={styles.botaoConfirmar}>
                                <Text style={styles.botaoTexto}>Adicionar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1e1e24',
        padding: 20,
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
