import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { fetchContacts } from '../../utils/firebaseUtils';

export default function PaidBy({ selectedPayer, onSelectPayer }) {
  const [showPayerPicker, setShowPayerPicker] = useState(false);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    const fetchedContacts = await fetchContacts();
    setContacts(fetchedContacts);
  };

  const renderPayerItem = ({ item }) => (
    <TouchableOpacity
      style={styles.payerItem}
      onPress={() => {
        onSelectPayer(item);
        setShowPayerPicker(false);
      }}
    >
      <Image source={{ uri: item.image }} style={styles.payerItemImage} />
      <Text style={styles.payerItemName}>{item.name}</Text>
      {selectedPayer && selectedPayer.id === item.id && (
        <Ionicons name="checkmark-circle" size={24} color="#00D09C" style={styles.payerItemCheck} />
      )}
    </TouchableOpacity>
  );

  return (
    <View>
      <TouchableOpacity style={styles.payerSelector} onPress={() => setShowPayerPicker(true)}>
        <View style={styles.payerInfo}>
          <Image source={{ uri: selectedPayer ? selectedPayer.image : 'https://via.placeholder.com/40' }} style={styles.payerImage} />
          <Text style={styles.payerName}>{selectedPayer ? selectedPayer.name : 'Select Payer'}</Text>
          <Ionicons name="chevron-down" size={20} color="#AAAAAA" style={styles.payerChevron} />
        </View>
      </TouchableOpacity>

      <Modal
        visible={showPayerPicker}
        transparent={true}
        animationType="slide"
      >
        <BlurView intensity={100} style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Payer</Text>
            <FlatList
              data={contacts}
              renderItem={renderPayerItem}
              keyExtractor={(item) => item.id}
              style={styles.payerList}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowPayerPicker(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  payerSelector: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 12,
    marginBottom: 24,
  },
  payerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  payerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  payerName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 12,
  },
  payerChevron: {
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
  payerList: {
    marginBottom: 16,
  },
  payerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3C',
  },
  payerItemImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  payerItemName: {
    color: '#FFFFFF',
    fontSize: 16,
    flex: 1,
  },
  payerItemCheck: {
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
  },
});