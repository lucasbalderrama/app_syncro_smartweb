import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
    View, TextInput, FlatList, Text,
    StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity,
    SafeAreaView, Keyboard, TouchableWithoutFeedback,
    ActivityIndicator,
    Alert
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import MessageBubble from '../component/mensagens';
import { supabase } from '../../supabaseConfig.js';
import User from '../features/users.js';
import Chat from '../features/chats.js';
import Group from '../features/groups.js';
import { useFocusEffect } from '@react-navigation/native';

export default function ChatScreen({ route, navigation }) {
    console.log(route.params);

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const [user, setUser] = useState(null);

    const [ chatRepository, setChatRepository ] = useState(null);

    // useEffect(() => {
    //     (async () => {
    //         const routeParams = route.params || {};
    //         console.log(routeParams)
    //         if (routeParams.chat) {
    //             return 
    //         } else if (routeParams.group) {
    //             const user = await User.Service.auth();
    //             const groupRepo = Group.Repository.create(user, routeParams.group.id);
    //             setUser(user);
    //             setChatRepository(groupRepo);
    //             const msgs = await groupRepo.loadMessages();
    //             const msgsWithUser = await Promise.all(msgs.map(async msg => ({
    //                 ...msg,
    //                 username: (await groupRepo.getUser(msg.userId)).name
    //             })));
    //             setMessages(msgsWithUser);
    //             groupRepo.listenMessages(async (message) => {
    //                 const username = (await chatRepository.getUser(message.userId)).name
    //                 setMessages((messages) => [ ...messages, { ...message, username } ]);
    //             });
    //             setLoading(false);
    //         }
    //     })();
    // }, []);

    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;
            (async () => {
                setLoading(true);
                const routeParams = route.params || {};
                let chatName;
                if (routeParams.chat) {
                    const user = await User.Service.auth();
                    const chatRepo = Chat.Repository.create(user, routeParams.chat.id);
                    setUser(user);
                    setChatRepository(chatRepo);
                    const chat = await chatRepo._service.get(chatRepo.id);
                    const otherUserId = chat.user1Id === user.id ? chat.user2Id : chat.user1Id;
                    chatName = (await chatRepo.getUser(otherUserId)).name;
                    const msgs = await chatRepo.loadMessages();
                    const msgsWithUser = await Promise.all(msgs.map(async msg => ({
                        ...msg,
                        username: (await chatRepo.getUser(msg.userId)).name
                    })));
                    if (isActive) {
                        setMessages(msgsWithUser);
                        chatRepo.listenMessages(async (message) => {
                            const username = (await chatRepo.getUser(message.userId)).name
                            setMessages((messages) => [ ...messages, { ...message, username } ]);
                        });
                        setLoading(false);
                    }
                } else if (routeParams.group) {
                    const user = await User.Service.auth();
                    const groupRepo = Group.Repository.create(user, routeParams.group.id);
                    setUser(user);
                    setChatRepository(groupRepo);
                    chatName = (await groupRepo._service.get(groupRepo.id)).name;
                    const msgs = await groupRepo.loadMessages();
                    const msgsWithUser = await Promise.all(msgs.map(async msg => ({
                        ...msg,
                        username: (await groupRepo.getUser(msg.userId)).name
                    })));
                    if (isActive) {
                        setMessages(msgsWithUser);
                        groupRepo.listenMessages(async (message) => {
                            const username = (await groupRepo.getUser(message.userId)).name
                            setMessages((messages) => [ ...messages, { ...message, username } ]);
                        });
                        setLoading(false);
                    }
                }
                navigation.setOptions({
                    title: chatName || 'Chat',
                    // headerStyle: { backgroundColor: '#2e2e34' },
                    // headerTintColor: '#fff',
                    // headerTitleStyle: { fontWeight: 'bold' },
                });
            })();
            return () => { isActive = false; };
        }, [route.params])
    );

    useLayoutEffect(() => {
        
    }, [ navigation, route.params?.group, route.params?.chat ]);

    // useEffect(() => {
    //     (async () => {
    //         const { data: { user }, userError } = await supabase.auth.getUser();
    //         if (userError) {
    //             console.error('Erro ao obter usuário:', userError);
    //         } else {
    //             setUser(user);
    //         }
    //     })();
    // }, []);

    // const userId = '00000000-0000-0000-0000-000000000001';
    // const chatId = 1; 

    // useEffect(() => {
    //     fetchMessages();
    // }, []);

    const fetchMessages = async () => {
        // const messages = await chatRepository.loadMessages();
        // const { data, error } = await supabase
        //     .from('chat_messages')
        //     .select('id, content, user_id, created_at')
        //     .eq('chat_id', chatId)
        //     .order('created_at', { ascending: true });

        // if (!error) {
        //     const formatted = data.map(msg => ({
        //         id: msg.id.toString(),
        //         text: msg.content,
        //         userId: msg.user_id
        //     }));
        //     setMessages(formatted);
        // } else {
        //     console.error('Erro ao buscar mensagens:', error);
        // }
    };

    const sendMessage = async () => {
        // if (message.trim()) {
        //     const { data, error } = await supabase
        //         .from('chat_messages')
        //         .insert([
        //             {
        //                 content: message,
        //                 user_id: user.id,
        //                 chat_id: chatRepository.id
        //             }
        //         ]);

        //     if (!error) {
        //         setMessage('');
        //         fetchMessages(); 
        //     } else {
        //         console.error('Erro ao enviar:', error);
        //     }
        // }
        const fMessage = message.trim();
        if (fMessage) {
            try {
                await chatRepository.sendMessage(fMessage);
                setMessage('');
            } catch (err) {
                console.error(err);
                Alert.alert("Erro ao enviar mensagem...", err?.message ?? err)
            }
        }
    };

    const renderItem = ({ item }) => {
        const isMyMessage = item.userId === user.id;
        return (
            // <View style={[
            //     styles.Mensagens,
            //     {
            //         alignSelf: isMyMessage ? 'flex-end' : 'flex-start',
            //         backgroundColor: isMyMessage ? '#add8e6' : '#d3d3d3'
            //     }
            // ]} key={item.id} >
            //     <Text style={styles.messageText}>{item.content}</Text>
            // </View>
            <MessageBubble
                username={item.username}
                text={item.content}
                isFromUser={isMyMessage}
                id={item.userId}
            />
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#2e2e34' }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0} 
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.container}>

                        { loading ?
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#5e00d8" />
                            </View> :
                            <>
                                {/* <Mensagens /> */}
                                <FlatList
                                    data={messages}
                                    renderItem={renderItem}
                                    keyExtractor={item => item.id}
                                    contentContainerStyle={{ paddingBottom: 10 }}
                                    style={styles.flatList}

                                />

                                <View style={styles.inputContainer}>
                                    <TextInput
                                        value={message}
                                        onChangeText={setMessage}
                                        placeholder="Digite sua mensagem"
                                        style={styles.input}
                                        placeholderTextColor="#aaaa"
                                        multiline 
                                    />
                                    <TouchableOpacity onPress={sendMessage} style={styles.registerButton}>
                                        <Text style={styles.botao}><MaterialIcons name="arrow-forward" size={20} color="#fff" /></Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        }

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
        justifyContent: 'flex-end', 
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    flatList: {
        flex: 1,
        paddingHorizontal: 10,
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
        maxHeight: 100, 
    },
    registerButton: {
        backgroundColor: '#5e00d8',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    botao: {
        color: 'white',
        fontWeight: 'bold',
    }
});
