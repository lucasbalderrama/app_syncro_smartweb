import React from 'react';
import { View, Text, StyleSheet, ScrollView} from 'react-native';

export default function Grupos({ }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Seus grupos</Text>
            <ScrollView>

            </ScrollView>
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
    },
    title: {
        fontSize: 24,
        color: '#fff',
        marginTop: 10,
        marginBottom: 10,
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        marginLeft: '5%',
    },
});