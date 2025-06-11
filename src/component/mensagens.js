import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MessageBubble({ currentUser, message }) {
    const isLiliv = currentUser.id === message.user_id;
    const renderMessage = (message, index) => {
        return (
            <View
                key={index}
                style={[
                    styles.messageBubble,
                    {
                        alignSelf: isLiliv ? 'flex-end' : 'flex-start',
                        backgroundColor: isLiliv ? '#ADD8E6' : '#d3d3d3', 
                    },
                ]}
            >
                <Text style={styles.userName}>{username}</Text>
                <Text style={styles.messageText}>{text}</Text>
            </View>
        );
    };

    // return <View style={styles.container}>{messages.map(renderMessage)}</View>;

    return (
        <View
            key={index}
            style={[
                styles.messageBubble,
                {
                    alignSelf: isLiliv ? 'flex-end' : 'flex-start',
                    backgroundColor: isLiliv ? '#ADD8E6' : '#d3d3d3', 
                },
            ]}
        >
            <Text style={styles.userName}>{message.user_id}</Text>
            <Text style={styles.messageText}>{message.content}</Text>
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
    },
    messageText: {
        fontSize: 16,
    },
});
