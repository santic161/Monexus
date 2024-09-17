import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FriendItem = ({ name, amount, imageUrl }) => (
    <View style={styles.friendItem}>
        <Image source={{ uri: imageUrl }} style={styles.friendImage} />
        <Text style={styles.friendName}>{name}</Text>
        <Text style={[styles.friendAmount, { color: amount >= 0 ? '#00D09C' : '#EC5601' }]}>
            {amount >= 0 ? '+' : ''}{amount.toFixed(2)}
        </Text>
    </View>
);

export default function FriendsScreen() {
    const [friendsData, setFriendsData] = useState();


    useEffect(() => {
        fetch("https://randomuser.me/api?nat=ES&results=15").then(res => res.json()).then((data) => {
            setFriendsData(data.results)
        }).catch((err) => { console.error(err) });


    }, [])
    if (!friendsData) return <Text></Text>
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity>
                    <Ionicons name="menu" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Friends</Text>
                <TouchableOpacity>
                    <Ionicons name="search" size={24} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            <View style={styles.totalCard}>
                <View style={styles.totalRow}>
                    <View>
                        <Text style={styles.totalLabel}>Total Owed</Text>
                        <Text style={[styles.totalAmount, styles.totalOwed]}>+$320.86</Text>
                    </View>
                    <View style={styles.totalDivider} />
                    <View>
                        <Text style={styles.totalLabel}>Total Owe</Text>
                        <Text style={[styles.totalAmount, styles.totalOwe]}>-$178.34</Text>
                    </View>
                </View>
                <View style={styles.actionButtons}>
                    <TouchableOpacity style={[styles.actionButton, styles.settleUpButton]}>
                        <Text style={styles.actionButtonText}>Settle Up</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionButton, styles.viewDetailsButton]}>
                        <Text style={styles.actionButtonText}>View Details</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionButton, styles.balanceButton]}>
                        <Text style={styles.actionButtonText}>Balance</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.friendsHeader}>
                <Text style={styles.friendsTitle}>Friends</Text>
                <TouchableOpacity>
                    <Text style={styles.allFriendsText}>All Friends ▼</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.friendsList}>
                {
                    friendsData.map((userData, i) => {
                        let random = Math.random() * (100 - 10) - 50;
                        return (
                            <FriendItem key={i} name={userData.name.first + " " + userData.name.last} amount={random} imageUrl={userData.picture.large} />
                        )
                    })}
                {/* <FriendItem name="Sumit Sinha" amount={28.95} imageUrl="/placeholder.svg?height=48&width=48" />
                <FriendItem name="Prasad Yash Raj" amount={91.55} imageUrl="/placeholder.svg?height=48&width=48" />
                <FriendItem name="Mruthunjal" amount={-45.88} imageUrl="/placeholder.svg?height=48&width=48" />
                <FriendItem name="Jagrit Pant" amount={28.95} imageUrl="/placeholder.svg?height=48&width=48" />
                <FriendItem name="Ritika Bhardwaj" amount={91.55} imageUrl="/placeholder.svg?height=48&width=48" /> */}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#101010',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    totalCard: {
        backgroundColor: '#2C2C2E',
        borderRadius: 12,
        margin: 16,
        padding: 16,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    totalLabel: {
        color: '#AAAAAA',
        fontSize: 14,
        marginBottom: 4,
    },
    totalAmount: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    totalOwed: {
        color: '#00D09C',
    },
    totalOwe: {
        color: '#EC5601',
    },
    totalDivider: {
        width: 1,
        backgroundColor: '#3A3A3C',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionButton: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 16,
    },
    settleUpButton: {
        backgroundColor: '#EC5601',
    },
    viewDetailsButton: {
        backgroundColor: '#3A3A3C',
    },
    balanceButton: {
        backgroundColor: '#3A3A3C',
    },
    actionButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    friendsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 8,
    },
    friendsTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    allFriendsText: {
        color: '#00D09C',
        fontSize: 14,
    },
    friendsList: {
        flex: 1,
    },
    friendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#2C2C2E',
    },
    friendImage: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 16,
    },
    friendName: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: 16,
    },
    friendAmount: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});