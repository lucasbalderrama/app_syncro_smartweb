import React, { useEffect, useState } from 'react';
import {
    View, TextInput, FlatList, Text,
    StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity,
    SafeAreaView, Keyboard, TouchableWithoutFeedback
} from 'react-native';

import Mensagens from '../component/mensagens';
import { supabase } from '../../supabaseConfig.js';

export default function ChatScreen() {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const [user, setUser] = useState(null);
    const [chatMembers, setChatMembers] = useState(null);

    useEffect(() => {
        (async () => {
            const { data: { user }, userError } = await supabase.auth.getUser();
            if (userError) {
                console.error('Erro ao obter usuário:', userError);
            } else {
                setUser(user);
            }
        })();
    }, []);

    const userId = '00000000-0000-0000-0000-000000000001';
    const chatId = 1; 

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        const { data, error } = await supabase
            .from('chat_messages')
            .select('id, content, user_id, created_at')
            .eq('chat_id', chatId)
            .order('created_at', { ascending: true });

        if (!error) {
            const formatted = data.map(msg => ({
                id: msg.id.toString(),
                text: msg.content,
                userId: msg.user_id
            }));
            setMessages(formatted);
        } else {
            console.error('Erro ao buscar mensagens:', error);
        }
    };

    const sendMessage = async () => {
        if (message.trim()) {
            const { data, error } = await supabase
                .from('chat_messages')
                .insert([
                    {
                        content: message,
                        user_id: userId,
                        chat_id: chatId
                    }
                ]);

            if (!error) {
                setMessage('');
                fetchMessages(); 
            } else {
                console.error('Erro ao enviar:', error);
            }
        }
    };

    const renderItem = ({ item }) => {
        const isMyMessage = item.userId === userId;
        return (
            <View style={[
                styles.Mensagens,
                {
                    alignSelf: isMyMessage ? 'flex-end' : 'flex-start',
                    backgroundColor: isMyMessage ? '#add8e6' : '#d3d3d3'
                }
            ]}>
                <Text style={styles.messageText}>{item.text}</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 50}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.container}>
                        {/* Mensagens fixas demonstrativas */}
                        <Mensagens />

                        {/* Mensagens do banco */}
                        <FlatList
                            data={messages}
                            renderItem={renderItem}
                            keyExtractor={item => item.id}
                            contentContainerStyle={styles.messagesContainer}
                        />

                        {/* Input e botão */}
                        <View style={styles.inputContainer}>
                            <TextInput
                                value={message}
                                onChangeText={setMessage}
                                placeholder="Digite sua mensagem"
                                style={styles.input}
                                placeholderTextColor="#aaaa"
                            />
                            <TouchableOpacity onPress={sendMessage} style={styles.registerButton}>
                                <Text style={styles.botao}>Enviar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2e2e34',
    },
    messagesContainer: {
        padding: 10,
        flexGrow: 1,
        backgroundColor: '#2e2e34',
    },
    Mensagens: {
        padding: 10,
        borderRadius: 8,
        marginVertical: 5,
        maxWidth: '80%',
    },
    messageText: {
        fontSize: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#1e1e24',
        backgroundColor: '#1e1e24',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.23)',
        padding: 10,
        borderRadius: 8,
        marginRight: 10,
        color: '#fff',
    },
    registerButton: {
        backgroundColor: '#5e00d8',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    botao: {
        color: 'white',
        fontWeight: 'bold',
    }
});
