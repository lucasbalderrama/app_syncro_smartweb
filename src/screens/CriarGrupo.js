import React, { use, useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { supabase } from '../../supabaseConfig.js'; // Adjust the path as necessary
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function CriarGrupo({ }) {
    const [users, setUsers] = useState([]);
    const [selected, setSelected] = useState([]);
    const [groupName, setGroupName] = useState('');
    const [currentUserId, setCurrentUserId] = useState(null);

    const filteredUsers = users.filter(user => user.id !== currentUserId);

    useEffect(() => {
        async function fetchData() {
            const { data: userData, error: userError } = await supabase.auth.getUser();
            if (userData && userData.user) {
                setCurrentUserId(userData.user.id);
            }
            const { data, error } = await supabase
                .from('users')
                .select('*');
            if (!error) setUsers(data);
        }
        fetchData();
    }, []);

    const toggleSelect = (user_id) => {
        setSelected(prev =>
            prev.includes(user_id)
                ? prev.filter(id => id !== user_id)
                : [...prev, user_id]
        );
    };

    const criarGrupo = async () => {
        if (!groupName.trim()) {
            alert('Digite o nome do grupo!');
            return;
        }
        if (selected.length === 0) {
            alert('Selecione pelo menos um membro!');
            return;
        }

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            alert('Usuário não autenticado!');
            return;
        }

        const { data: grupo, error: grupoError } = await supabase
            .from('groups')
            .insert([{
                name: groupName,
                created_at: new Date().toISOString(),
                created_by: user.id
            }])
            .select()
            .single();

        if (grupoError) {
            alert('Erro ao criar grupo: ' + grupoError.message);
            return;
        }

        const membrosInserir = [
            {
                group_id: grupo.id,
                user_id: user.id,
                is_admin: true,
                join_at: new Date().toISOString()
            },
            ...selected.map(user_id => ({
                group_id: grupo.id,
                user_id,
                is_admin: false,
                join_at: new Date().toISOString()
            }))
        ];

        const { error: membrosError } = await supabase
            .from('group_members')
            .insert(membrosInserir);

        if (membrosError) {
            alert('Erro ao adicionar membros: ' + membrosError.message);
        } else {
            alert('Grupo criado com sucesso!');
            setGroupName('');
            setSelected([]);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Selecionar membros</Text>
            <ScrollView style={styles.scrollView}>
                {users
                    .filter(user => user.id !== currentUserId)
                    .map((user, idx) => (
                        <TouchableOpacity
                            key={user.id}
                            onPress={() => toggleSelect(user.id)}
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                padding: 8,
                                borderBottomWidth: 1,
                                borderBottomColor: '#444',
                                backgroundColor: selected.includes(user.id) ? 'rgba(91, 75, 236, 0.1)' : 'transparent',
                                borderTopLeftRadius: idx === 0 ? 8 : 0,
                                borderTopRightRadius: idx === 0 ? 8 : 0,
                                borderBottomLeftRadius: idx === filteredUsers.length - 1 ? 8 : 0,
                                borderBottomRightRadius: idx === filteredUsers.length - 1 ? 8 : 0,
                            }}
                        >
                            <View>
                                <Text style={styles.userName}>{user.name}</Text>
                                <Text style={styles.userEmail}>{user.email}</Text>
                            </View>
                            <RadioButton
                                value={user.id}
                                status={selected.includes(user.id) ? 'checked' : 'unchecked'}
                                onPress={() => toggleSelect(user.id)}
                                color="#5e00d8"
                            />
                        </TouchableOpacity>
                    ))}
            </ScrollView>

            <View style={styles.buttonContainer}>
                <Text style={styles.groupName}>Nome do grupo</Text>
                <TextInput
                    placeholder="Insira o nome do grupo"
                    value={groupName}
                    onChangeText={setGroupName}
                    style={{
                        backgroundColor: '#2e2e34',
                        color: '#fff',
                        padding: 10,
                        borderRadius: 6,
                        marginBottom: 10,
                    }}
                    placeholderTextColor="#aaaa"
                />
                <Pressable
                    onPress={criarGrupo}
                    style={styles.button}
                >
                    <MaterialIcons name="group-add" size={20} color="#fff" />
                    <Text style={styles.buttonText}>
                        Criar grupo
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1e1e24',
        height: '100%',
        paddingBottom: 20,
    },
    title: {
        fontSize: 24,
        color: '#fff',
        marginBottom: 10,
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        marginLeft: '5%',
    },
    scrollView: {
        width: '90%',
        maxHeight: '70%',
        backgroundColor: '#2e2e34',
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
    },
    userName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 500,
    },
    userEmail: {
        color: '#aaa',
        fontSize: 14,
    },
    buttonContainer: {
        width: '90%',
        maxHeight: '20%',
        borderRadius: 8,
    },
    groupName: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 10,
        fontWeight: 500,
    },
    button: {
        borderRadius: 6,
        backgroundColor: '#5e00d8',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 5,
    },
    buttonText: {
        color: '#fff',
        paddingVertical: 10,
        textAlign: 'center',
        fontWeight: 500,
        fontSize: 16,
    },
});