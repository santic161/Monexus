import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Image, ScrollView, Modal, Animated, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FakeCurrencyInput } from 'react-native-currency-input';
import DateTimePicker from '@react-native-community/datetimepicker';
import { BlurView } from 'expo-blur';
import { addExpense, fetchGroups, fetchGroupMembers } from '../utils/firebaseUtils';
import { useUser } from '../context/UserContext';
import GroupSelector from '../components/Add Expense/GroupSelector';

export default function AddExpenseScreen({ navigation }) {
  const { user } = useUser();
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState('');
  const [splitMethod, setSplitMethod] = useState('Equally');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [paidBy, setPaidBy] = useState(user.uid);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [note, setNote] = useState('');
  const [showGroupPicker, setShowGroupPicker] = useState(false);
  const [showPaidByPicker, setShowPaidByPicker] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [groups, setGroups] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);

  const descriptionInputRef = useRef(null);
  const scrollViewRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    loadGroups();
  }, []);

  const loadGroups = async () => {
    setIsLoading(true);
    try {
      const fetchedGroups = await fetchGroups(user.uid);
      setGroups(fetchedGroups);
      if (fetchedGroups.length === 0) {
        navigation.navigate('CreateGroup');
      } else {
        setSelectedGroup(fetchedGroups[0]);
        loadGroupMembers(fetchedGroups[0].id);
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
      setError('Failed to fetch groups. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadGroupMembers = async (groupId) => {
    try {
      const members = await fetchGroupMembers(groupId);
      setGroupMembers(members);
    } catch (error) {
      console.error('Error fetching group members:', error);
    }
  };

  const handleAddExpense = async () => {
    if (!selectedGroup || !description || !amount) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const expenseData = {
        groupId: selectedGroup.id,
        title: description,
        amount: parseFloat(amount),
        splitMethod,
        paidBy,
        date: date.toISOString(),
        note,
        createdBy: user.uid,
      };

      await addExpense(expenseData);
      navigation.goBack();
    } catch (error) {
      console.error('Error adding expense: ', error);
      setError('Failed to add expense. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Ionicons name="close" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Expense</Text>
        <TouchableOpacity onPress={handleAddExpense} style={styles.headerButton} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#00D09C" />
          ) : (
            <Text style={styles.saveButtonText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        ref={scrollViewRef}
        keyboardShouldPersistTaps="handled"
      >
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        <GroupSelector
          selectedGroup={selectedGroup}
          groups={groups}
          onSelectGroup={(group) => {
            setSelectedGroup(group);
            loadGroupMembers(group.id);
          }}
        />

        <View style={styles.inputContainer}>
          <TextInput
            ref={descriptionInputRef}
            style={styles.input}
            placeholder="Enter a description"
            placeholderTextColor="#AAAAAA"
            autoCapitalize='sentences'
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <View style={styles.inputContainer}>
          <FakeCurrencyInput
            value={amount}
            onChangeValue={setAmount}
            style={styles.amountInput}
            prefix="$"
            delimiter=","
            separator="."
            precision={2}
          />
        </View>

        <View style={styles.splitMethodContainer}>
          {['Equally', 'Unequally', 'Percentage'].map((method) => (
            <TouchableOpacity
              key={method}
              style={[
                styles.splitMethodButton,
                splitMethod === method && styles.splitMethodButtonActive,
              ]}
              onPress={() => setSplitMethod(method)}
            >
              <Text
                style={[
                  styles.splitMethodText,
                  splitMethod === method && styles.splitMethodTextActive,
                ]}
              >
                {method}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.paidByContainer} onPress={() => setShowPaidByPicker(true)}>
          <Text style={styles.paidByLabel}>Paid by</Text>
          <View style={styles.paidBySelector}>
            <Image source={{ uri: groupMembers.find(m => m.id === paidBy)?.image }} style={styles.paidByAvatar} />
            <Text style={styles.paidByText}>{groupMembers.find(m => m.id === paidBy)?.name}</Text>
            <Ionicons name="chevron-down" size={20} color="#AAAAAA" />
          </View>
        </TouchableOpacity>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={() => setShowDatePicker(true)}>
            <Ionicons name="calendar-outline" size={24} color="#00D09C" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => setShowNoteInput(true)}>
            <Ionicons name="create-outline" size={24} color="#00D09C" />
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="spinner"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
            style={styles.datePicker}
          />
        )}
      </ScrollView>

      <Modal
        visible={showPaidByPicker}
        transparent={true}
        animationType="slide"
      >
        <BlurView intensity={100} style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Paid By</Text>
            <ScrollView>
              {groupMembers.map((member) => (
                <TouchableOpacity
                  key={member.id}
                  style={styles.memberItem}
                  onPress={() => {
                    setPaidBy(member.id);
                    setShowPaidByPicker(false);
                  }}
                >
                  <Image source={{ uri: member.image }} style={styles.memberItemImage} />
                  <Text style={styles.memberItemName}>{member.name}</Text>
                  {paidBy === member.id && (
                    <Ionicons name="checkmark-circle" size={24} color="#00D09C" style={styles.memberItemCheck} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowPaidByPicker(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Modal>

      <Modal
        visible={showNoteInput}
        transparent={true}
        animationType="slide"
      >
        <BlurView intensity={100} style={styles.modalContainer}>
          <View style={styles.noteInputContainer}>
            <Text style={styles.modalTitle}>Add a note</Text>
            <TextInput
              style={styles.noteInput}
              multiline
              numberOfLines={4}
              value={note}
              onChangeText={setNote}
              placeholder="Enter your note here"
              placeholderTextColor="#AAAAAA"
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowNoteInput(false)}
            >
              <Text style={styles.closeButtonText}>Save Note</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Modal>
    </Animated.View>
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
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    color: '#FFFFFF',
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3C',
    paddingVertical: 8,
  },
  amountInput: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 8,
  },
  splitMethodContainer: {
    flexDirection: 'row',
    backgroundColor: "#2C2C2E",
    borderRadius: 12,
    marginBottom: 24,
    padding: 4,
  },
  splitMethodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  splitMethodButtonActive: {
    backgroundColor: '#00D09C',
  },
  splitMethodText: {
    color: '#AAAAAA',
    fontSize: 14,
    textAlign: 'center',
  },
  splitMethodTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  paidByContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 12,
  },
  paidByLabel: {
    color: '#AAAAAA',
    fontSize: 16,
  },
  paidBySelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paidByAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  paidByText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginRight: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
    backgroundColor: "#2C2C2E",
    borderRadius: 12,
    padding: 8,
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
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
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3C',
  },
  memberItemImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  memberItemName: {
    color: '#FFFFFF',
    fontSize: 16,
    flex: 1,
  },
  memberItemCheck: {
    marginLeft: 8,
  },
  closeButton: {
    backgroundColor: '#00D09C',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noteInputContainer: {
    backgroundColor: '#2C2C2E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  noteInput: {
    backgroundColor: '#3A3A3C',
    color: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    height: 120,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  datePicker: {
    backgroundColor: '#2C2C2E',
  },
});