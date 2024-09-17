import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ActivityItem = ({ icon, title, amount, status, time, date, users, addedBy }) => (
  <View style={styles.activityItem}>
    <View style={styles.activityContent}>
      <View style={styles.activityIcon}>
        <Ionicons name={icon} size={24} color="#FFFFFF" />
      </View>

      <View style={styles.activityDetails}>
        <View style={styles.activityHeader}>
          <Text style={styles.activityTitle}>{title}</Text>
          <View style={[styles.activityStatus, { backgroundColor: status === 'Owe' ? '#00D09C' : status === 'Owed' ? '#FF9500' : '#8E8E93' }]}>
            <Text style={styles.activityStatusText}>{status}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
          <Text style={styles.addedByText}>{addedBy}</Text>
          <Text style={styles.activityAmount}>${amount}</Text>
        </View>
      </View>
    </View>

    <View style={[styles.separator, { backgroundColor: status == 'Owe' ? '#00D09C' : status == 'Owed' ? "#EC5601" : '#8E8E93' }]} />
    <View style={styles.activityFooter}>
      <Text style={styles.activityTime}>{time}</Text>
      <View style={styles.activityUsers}>
        {users.map((user, index) => (
          <Image key={index} source={{ uri: user }} style={styles.userAvatar} />
        ))}
      </View>
    </View>
  </View>
);

export default function ActivityScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="menu" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Activity</Text>
        <TouchableOpacity>
          <Ionicons name="search" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.dateHeader}>Today, 04/06/2024</Text>

        <ActivityItem
          icon="print"
          title="PDC printout"
          amount="30.00"
          status="Owe"
          time="6:48pm May 06, 2024"
          addedBy="You Added"
          users={['https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/52/526bf1260f10ae661408326bdf9acd4f117ebbd5_full.jpg', 'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/c6/c65dcc083528313dc6cd70eda156104f9f6cee8c_full.jpg', 'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/00/00673d79446ab83150bce2cffc3714abbf97ef02_full.jpg']}
        />

        <ActivityItem
          icon="fast-food"
          title="Haldiram's Snacks"
          amount="26.32"
          status="Owed"
          time="4:48pm May 06, 2024"
          addedBy="Sumit Added"
          users={['https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/52/526bf1260f10ae661408326bdf9acd4f117ebbd5_full.jpg', 'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/c6/c65dcc083528313dc6cd70eda156104f9f6cee8c_full.jpg', 'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/00/00673d79446ab83150bce2cffc3714abbf97ef02_full.jpg']}
        />

        <ActivityItem
          icon="train"
          title="Train Tickets"
          amount="1254.84"
          status="Settled"
          time="12:48pm May 06, 2024"
          addedBy="Yash Added"
          users={['https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/52/526bf1260f10ae661408326bdf9acd4f117ebbd5_full.jpg', 'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/c6/c65dcc083528313dc6cd70eda156104f9f6cee8c_full.jpg', 'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/00/00673d79446ab83150bce2cffc3714abbf97ef02_full.jpg']}
        />

        <Text style={styles.dateHeader}>Yesterday, 05/06/2024</Text>

        <ActivityItem
          icon="bed"
          title="Hotel Trip"
          amount="854.00"
          status="Owe"
          time="6:48pm May 05, 2024"
          addedBy="Mruthunjal Added"
          users={['https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/52/526bf1260f10ae661408326bdf9acd4f117ebbd5_full.jpg', 'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/c6/c65dcc083528313dc6cd70eda156104f9f6cee8c_full.jpg', 'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/00/00673d79446ab83150bce2cffc3714abbf97ef02_full.jpg']}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  dateHeader: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  activityItem: {
    backgroundColor: '#373B3F',
    borderRadius: 20,
    marginBottom: 8,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  activityContent: {
    flexDirection: 'row',
    padding: 16,
  },
  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#00D09C',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  activityDetails: {
    flex: 1,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  activityTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  activityStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activityStatusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  addedByText: {
    color: '#AAAAAA',
    fontSize: 14,
    marginBottom: 4,
  },
  activityAmount: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  separator: {
    height: 2,
    // backgroundColor: '#00D09C',
    marginHorizontal: 16,
  },
  activityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  activityTime: {
    color: '#BFC3C6',
    fontSize: 15,
  },
  activityUsers: {
    flexDirection: 'row',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 50,
    marginLeft: -8,
    borderWidth: 2,
    borderColor: '#2C2C2E',
  },
});