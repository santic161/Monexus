import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Image, FlatList, ActivityIndicator, Share, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { createGroup, fetchContacts, inviteContact, uploadImage } from '../utils/firebaseUtils';
import { useUser } from '../context/UserContext';
import { debounce } from 'lodash';

const DEFAULT_GROUP_IMAGE = 'https://via.placeholder.com/100';
const DEFAULT_CONTACT_ICON = 'https://via.placeholder.com/40';

export default function CreateGroup({ navigation }) {
  const { user } = useUser();
  const [groupName, setGroupName] = useState('');
  const [groupImage, setGroupImage] = useState(DEFAULT_GROUP_IMAGE);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [allContacts, setAllContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    setIsLoading(true);
    try {
      const contacts = await fetchContacts(user.uid);
      setAllContacts(contacts.sort((a, b) => {
        if (a.hasApp === b.hasApp) {
          return a.name.localeCompare(b.name);
        }
        return a.hasApp ? -1 : 1;
      }));
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setError('Failed to load contacts. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setIsLoading(true);
      try {
        const path = "groupImages"; //Upload to groupImages/{filename || null}
        // const uploadedUrl = await uploadImage(result.assets[0].uri, path, null, (prog) => console.log(prog));
        const uploadedUrl = await uploadImage(result.assets[0].uri, path);
        setGroupImage(uploadedUrl.downloadUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
        Alert.alert('Error', 'Failed to upload image. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName) {
      setError('Please enter a group name');
      return;
    }

    if (selectedContacts.length === 0) {
      setError('Please select at least one contact');
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

      console.log(groupData)
      await createGroup(groupData);
      navigation.goBack();
    } catch (error) {
      console.error('Error creating group: ', error);
      setError('Failed to create group. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleContactSelection = debounce((contact) => {
    setSelectedContacts(prevSelected =>
      prevSelected.some(c => c.id === contact.id)
        ? prevSelected.filter(c => c.id !== contact.id)
        : [...prevSelected, contact]
    );
  }, 300);

  const handleInvite = async (contact) => {
    try {
      await Share.share({
        message: `Hey ${contact.name}, join me on Monexus! Download the app here: [Your App Store Link]`,
      });
    } catch (error) {
      console.error('Error sharing invite:', error);
    }
  };

  const handleAddByEmail = () => {
    if (!email) {
      setError('Please enter a valid email address');
      return;
    }

    const newContact = {
      id: email,
      name: email,
      image: DEFAULT_CONTACT_ICON,
      hasApp: false,
    };

    setSelectedContacts(prevSelected => [...prevSelected, newContact]);
    setEmail('');
    setShowEmailInput(false);
    Alert.alert('Email Added', `${email} has been added to the group.`);
  };

  const removeContact = (contactId) => {
    setSelectedContacts(prevSelected => prevSelected.filter(c => c.id !== contactId));
  };

  const renderContactItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.contactItem,
        selectedContacts.some(c => c.id === item.id) && styles.contactItemSelected
      ]}
      onPress={() => item.hasApp ? toggleContactSelection(item) : null}
    >
      <Image source={{ uri: item.image || DEFAULT_CONTACT_ICON }} style={styles.contactImage} />
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactPhone}>{item.phoneNumber}</Text>
      </View>
      {item.hasApp ? (
        selectedContacts.some(c => c.id === item.id) && (
          <Ionicons name="checkmark-circle" size={24} color="#00D09C" />
        )
      ) : (
        <TouchableOpacity style={styles.inviteButton} onPress={() => handleInvite(item)}>
          <Text style={styles.inviteText}>Invite</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  const renderSelectedContact = ({ item }) => (
    <View style={styles.selectedContactItem}>
      <Text style={styles.selectedContactName}>{item.name}</Text>
      <TouchableOpacity onPress={() => removeContact(item.id)}>
        <Ionicons name="close-circle" size={24} color="#FF6B6B" />
      </TouchableOpacity>
    </View>
  );

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

      <FlatList
        data={[{ key: 'content' }]}
        renderItem={() => (
          <>
            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}

            <TouchableOpacity style={styles.groupImagePicker} onPress={pickImage}>
              <Image source={{ uri: groupImage }} style={styles.groupImagePreview} />
              <View style={styles.editIconContainer}>
                <Ionicons name="pencil" size={20} color="#FFFFFF" />
              </View>
            </TouchableOpacity>

            <TextInput
              style={styles.groupNameInput}
              placeholder="Enter group name"
              placeholderTextColor="#AAAAAA"
              value={groupName}
              onChangeText={setGroupName}
            />

            <Text style={styles.sectionTitle}>
              Selected Contacts ({selectedContacts.length})
            </Text>

            <FlatList
              data={selectedContacts}
              renderItem={renderSelectedContact}
              keyExtractor={item => item.id}
              horizontal
              style={styles.selectedContactsList}
            />

            <TouchableOpacity
              style={styles.addByEmailButton}
              onPress={() => setShowEmailInput(!showEmailInput)}
            >
              <Ionicons name="mail" size={24} color="#00D09C" />
              <Text style={styles.addByEmailText}>Add by Email</Text>
            </TouchableOpacity>

            {showEmailInput && (
              <View style={styles.emailInputContainer}>
                <TextInput
                  style={styles.emailInput}
                  placeholder="Enter email address"
                  placeholderTextColor="#AAAAAA"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TouchableOpacity style={styles.addEmailButton} onPress={handleAddByEmail}>
                  <Text style={styles.addEmailButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
            )}

            <Text style={styles.sectionTitle}>All Contacts</Text>
          </>
        )}
        ListFooterComponent={() => (
          <FlatList
            data={allContacts}
            renderItem={renderContactItem}
            keyExtractor={item => item.id}
            extraData={selectedContacts}
          />
        )}
      />
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
    position: 'relative',
  },
  groupImagePreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#00D09C',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupNameInput: {
    backgroundColor: '#3A3A3C',
    color: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  contactItemSelected: {
    backgroundColor: 'rgba(0, 208, 156, 0.1)',
  },
  contactImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactPhone: {
    color: '#AAAAAA',
    fontSize: 14,
  },
  inviteButton: {
    backgroundColor: '#00D09C',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  inviteText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  addByEmailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3A3A3C',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  addByEmailText: {
    color: '#00D09C',
    fontSize: 16,
    marginLeft: 8,
  },
  emailInputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  emailInput: {
    flex: 1,
    backgroundColor: '#3A3A3C',
    color: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
  },
  addEmailButton: {
    backgroundColor: '#00D09C',
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addEmailButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedContactsList: {
    marginBottom: 16,
  },
  selectedContactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3A3A3C',
    borderRadius: 20,
    padding: 8,
    marginRight: 8,
  },
  selectedContactName: {
    color: '#FFFFFF',
    marginRight: 8,
  },
});