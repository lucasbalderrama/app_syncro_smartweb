import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import { supabase } from '../../supabaseConfig.js';

export default function Grupos({ navigation }) {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUserGroups() {
            setLoading(true);
            const { data: userData, error: userError } = await supabase.auth.getUser();
            if (userError || !userData?.user) {
                setGroups([]);
                setLoading(false);
                return;
            }
            const userId = userData.user.id;

            const { data: memberships, error: memberError } = await supabase
                .from('group_members')
                .select('group_id')
                .eq('user_id', userId);

            if (memberError || !memberships || memberships.length === 0) {
                setGroups([]);
                setLoading(false);
                return;
            }

            const groupIds = memberships.map(m => m.group_id);

            const { data: groupsData, error: groupsError } = await supabase
                .from('groups')
                .select('*')
                .in('id', groupIds);

            if (groupsError) {
                setGroups([]);
            } else {
                setGroups(groupsData);
            }
            setLoading(false);
        }

        fetchUserGroups();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Seus grupos</Text>
            <ScrollView style={styles.scrollView}>
                {groups.map((group) => (
                    <TouchableOpacity key={group.id} style={styles.groupItem}>
                        <Text style={styles.groupName}>{group.name}</Text>
                    </TouchableOpacity>
                ))}
                {(!loading && groups.length === 0) && (
                    <View>
                        <Text style={styles.noGroup}>
                            Você ainda não participa de nenhum grupo, que tal criar um agora mesmo?
                        </Text>
                        <Pressable
                            style={({ pressed }) => [
                                { backgroundColor: pressed ? '#444' : '#555' },
                                styles.newGroupButton
                            ]}
                            onPress={() => navigation.navigate('Criar grupo')}
                        >
                            <Text style={styles.newGroupText}>Criar um grupo</Text>
                        </Pressable>
                    </View>
                )}
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
    scrollView: {
        width: '90%',
        backgroundColor: '#2e2e34',
        borderRadius: 8,
        padding: 10,
        marginBottom: 20,
    },
    groupItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#444',
    },
    groupName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    noGroup: {
        color: '#aaa',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 15,
        fontStyle: 'italic',
    },
    newGroupButton: {
        marginTop: 20,
        padding: 10,
        borderRadius: 6,
        backgroundColor: '#5e00d8',
        justifyContent: 'center',
        alignItems: 'center',
    },
    newGroupText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 500,
    },
});