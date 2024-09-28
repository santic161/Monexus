// ActivityScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { fetchUserActivities } from '../utils/firebaseUtils';
import { useUser } from '../context/UserContext';

export default function Activity() {
  const { user } = useUser();
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    const fetchedActivities = await fetchUserActivities(user.uid);
    setActivities(fetchedActivities);
  };

  const renderActivityItem = ({ item }) => (
    <View style={styles.activityItem}>
      <Text style={styles.activityDescription}>{item.description}</Text>
      <Text style={styles.activityAmount}>
        ${item.amount.toFixed(2)}
      </Text>
      <Text style={styles.activityDate}>
        {new Date(item.date.toDate()).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Activity</Text>
      {activities.length > 0 ? (
        <FlatList
          data={activities}
          renderItem={renderActivityItem}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text style={styles.noActivitiesText}>No recent activities</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#101010',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  activityItem: {
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  activityDescription: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  activityAmount: {
    fontSize: 16,
    color: '#00D09C',
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  noActivitiesText: {
    color: '#AAAAAA',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 24,
  },
});