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
                    backgroundColor: isMyMessage ? '#add8e6' : '#DCF8C6'
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
                keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 20}
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
        marginBottom: 50,
    },
    messagesContainer: {
        padding: 10,
        flexGrow: 1,
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
        borderColor: '#ccc',
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        backgroundColor: '#eee',
        padding: 10,
        borderRadius: 20,
        marginRight: 10,
    },
    registerButton: {
        backgroundColor: '#924DBF',
        padding: 10,
        borderRadius: 15,
        alignItems: 'center',
    },
    botao: {
        color: 'white',
        fontWeight: 'bold',
    }
});
