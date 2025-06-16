import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MessageBubble({ username, text, isFromUser, id }) {
    return (
            <View
                key={id}
                style={[
                    styles.messageBubble,
                    {
                        alignSelf: isFromUser ? 'flex-end' : 'flex-start',
                        backgroundColor: isFromUser ? 'rgb(96, 102, 211)' : 'rgb(80, 77, 94)', 
                    },
                ]}
            >
                <Text style={styles.userName}>{username}</Text>
                <Text style={styles.messageText}>{text}</Text>
            </View>
        );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    messageBubble: {
        padding: 10,
        borderRadius: 8,
        marginVertical: 5,
        maxWidth: '80%',
    },
    userName: {
        fontSize: 12,
        marginBottom: 2,
        fontWeight: 'bold',
        color: '#fff',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        padding: 2,
        paddingHorizontal: 6,
        borderRadius: 4,
        alignSelf: 'flex-start',
    },
    messageText: {
        fontSize: 16,
        color: '#fff',
    },
});