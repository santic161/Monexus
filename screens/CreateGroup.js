import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Image, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { createGroup } from '../utils/firebaseUtils';
import { useUser } from '../context/UserContext';
import ContactList from '../components/Add Expense/ContactSelector';

export default function CreateGroup({ navigation }) {
  const { user } = useUser();
  const [groupName, setGroupName] = useState('');
  const [groupImage, setGroupImage] = useState(null);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setGroupImage(result.uri);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName) {
      setError('Please enter a group name');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const groupData = {
        name: groupName,
        image: groupImage,
        members: [user.uid, ...selectedContacts.map(contact => contact.id)],
        createdBy: user.uid,
      };

      await createGroup(groupData);
      navigation.goBack();
    } catch (error) {
      console.error('Error creating group: ', error);
      setError('Failed to create group. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Ionicons name="close" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Group</Text>
        <TouchableOpacity onPress={handleCreateGroup} style={styles.headerButton} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#00D09C" />
          ) : (
            <Text style={styles.saveButtonText}>Create</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        <TouchableOpacity style={styles.groupImagePicker} onPress={pickImage}>
          {groupImage ? (
            <Image source={{ uri: groupImage }} style={styles.groupImagePreview} />
          ) : (
            <Ionicons name="camera" size={40} color="#AAAAAA" />
          )}
        </TouchableOpacity>

        <TextInput
          style={styles.groupNameInput}
          placeholder="Enter group name"
          placeholderTextColor="#AAAAAA"
          value={groupName}
          onChangeText={setGroupName}
        />

        <ContactList
          selectedContacts={selectedContacts}
          onSelectContact={(contact) => {
            if (selectedContacts.find(c => c.id === contact.id)) {
              setSelectedContacts(selectedContacts.filter(c => c.id !== contact.id));
            } else {
              setSelectedContacts([...selectedContacts, contact]);
            }
          }}
        />
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
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  saveButtonText: {
    color: '#00D09C',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  groupImagePicker: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#3A3A3C',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  groupImagePreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  groupNameInput: {
    backgroundColor: '#3A3A3C',
    color: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
});