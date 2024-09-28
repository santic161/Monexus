import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, FlatList, TextInput, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchContacts, checkUserExists } from '../../utils/firebaseUtils';
import { useUser } from '../../context/UserContext';

export default function ContactList({ selectedContacts, onSelectContact }) {
  const { user } = useUser()
  const [contacts, setContacts] = useState([]);

  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setFilteredContacts(contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase())
      ));
    } else {
      setFilteredContacts(contacts);
    }
  }, [searchQuery, contacts]);

  const loadContacts = async () => {
    const fetchedContacts = await fetchContacts(user);
    setContacts(fetchedContacts);
    setFilteredContacts(fetchedContacts);
  };

  const handleInvite = async (contact) => {
    try {
      const result = await Share.share({
        message: `Hey ${contact.name}, join me on Splitwise! Download the app: https://splitwise.com/app`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const renderContactItem = ({ item }) => (
    <View style={styles.contactItem}>
      <TouchableOpacity
        style={styles.contactInfo}
        onPress={() => onSelectContact(item)}
      >
        <Image source={{ uri: item.image }} style={styles.contactImage} />
        <Text style={styles.contactName}>{item.name}</Text>
      </TouchableOpacity>
      {item.registered ? (
        selectedContacts.find(c => c.id === item.id) ? (
          <Ionicons name="checkmark-circle" size={24} color="#00D09C" />
        ) : null
      ) : (
        <TouchableOpacity
          style={styles.inviteButton}
          onPress={() => handleInvite(item)}
        >
          <Text style={styles.inviteButtonText}>Invite</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search contacts"
        placeholderTextColor="#AAAAAA"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredContacts}
        renderItem={renderContactItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchInput: {
    backgroundColor: '#3A3A3C',
    color: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3C',
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  contactImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  contactName: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  inviteButton: {
    backgroundColor: '#00D09C',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  inviteButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});