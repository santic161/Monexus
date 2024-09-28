import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';

export default function GroupSelector({ selectedGroup, groups, onSelectGroup }) {
  const [showGroupPicker, setShowGroupPicker] = useState(false);
  const navigation = useNavigation();

  const renderGroupItem = ({ item }) => (
    <TouchableOpacity
      style={styles.groupItem}
      onPress={() => {
        onSelectGroup(item);
        setShowGroupPicker(false);
      }}
    >
      <Image source={{ uri: item.image }} style={styles.groupItemImage} />
      <Text style={styles.groupItemName}>{item.name}</Text>
      {selectedGroup && selectedGroup.id === item.id && (
        <Ionicons name="checkmark-circle" size={24} color="#00D09C" style={styles.groupItemCheck} />
      )}
    </TouchableOpacity>
  );

  const handleCreateNewGroup = () => {
    setShowGroupPicker(false);
    navigation.navigate('CreateGroup');
  };

  return (
    <View>
      <TouchableOpacity style={styles.groupSelector} onPress={() => setShowGroupPicker(true)}>
        <View style={styles.groupInfo}>
          <Image source={{ uri: selectedGroup ? selectedGroup.image : 'https://via.placeholder.com/40' }} style={styles.groupImage} />
          <Text style={styles.groupName}>{selectedGroup ? selectedGroup.name : 'Select Group'}</Text>
          <Ionicons name="chevron-down" size={20} color="#AAAAAA" style={styles.groupChevron} />
        </View>
      </TouchableOpacity>

      <Modal
        visible={showGroupPicker}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Group</Text>
            <TouchableOpacity
              style={styles.createNewGroupButton}
              onPress={handleCreateNewGroup}
            >
              <Ionicons name="add-circle-outline" size={24} color="#00D09C" />
              <Text style={styles.createNewGroupText}>Create New Group</Text>
            </TouchableOpacity>
            <FlatList
              data={groups}
              renderItem={renderGroupItem}
              keyExtractor={(item) => item.id}
              style={styles.groupList}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowGroupPicker(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  groupSelector: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 12,
    marginBottom: 24,
  },
  groupInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  groupImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  groupName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 12,
  },
  groupChevron: {
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#2C2C2E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '80%',
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  createNewGroupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3C',
  },
  createNewGroupText: {
    color: '#00D09C',
    fontSize: 16,
    marginLeft: 12,
  },
  groupList: {
    marginBottom: 16,
  },
  groupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3C',
  },
  groupItemImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  groupItemName: {
    color: '#FFFFFF',
    fontSize: 16,
    flex: 1,
  },
  groupItemCheck: {
    marginLeft: 8,
  },
  closeButton: {
    backgroundColor: '#00D09C',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  }
});