import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Image, ScrollView, Modal, Animated, ActivityIndicator, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FakeCurrencyInput } from 'react-native-currency-input';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addExpense, fetchGroups, fetchGroupMembers } from '../utils/firebaseUtils';
import { useUser } from '../context/UserContext';
import { useIsFocused } from '@react-navigation/native';

export default function AddExpenseScreen({ navigation }) {
  const { user } = useUser();
  const isFocused = useIsFocused();
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
  }, []);

  useEffect(() => {
    if (isFocused) {
      loadGroups();
    }
  }, [isFocused]);

  const loadGroups = async () => {
    setIsLoading(true);
    try {
      const fetchedGroups = await fetchGroups(user.uid);
      setGroups(fetchedGroups);
      if (fetchedGroups.length > 0) {
        setSelectedGroup(fetchedGroups[0]);
        await loadGroupMembers(fetchedGroups[0].id);
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
      // Ensure the current user is in the group members list
      if (!members.some(member => member.id === user.uid)) {
        setGroupMembers([{ id: user.uid, name: 'You', image: user.image }, ...members]);
      }
    } catch (error) {
      console.error('Error fetching group members:', error);
      setError('Failed to fetch group members. Please try again.');
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

  const renderGroupItem = ({ item }) => (
    <TouchableOpacity
      style={styles.groupItem}
      onPress={() => {
        setSelectedGroup(item);
        loadGroupMembers(item.id);
        setShowGroupPicker(false);
      }}
    >
      <Image source={{ uri: item.image || 'https://via.placeholder.com/40' }} style={styles.groupItemImage} />
      <Text style={styles.groupItemName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderMemberItem = ({ item }) => (
    <TouchableOpacity
      style={styles.memberItem}
      onPress={() => {
        setPaidBy(item.id);
        setShowPaidByPicker(false);
      }}
    >
      <Image source={{ uri: item.image }} style={styles.memberItemImage} />
      <Text style={styles.memberItemName}>{item.id === user.uid ? 'You' : item.name}</Text>
      {paidBy === item.id && (
        <Ionicons name="checkmark-circle" size={24} color="#00D09C" style={styles.memberItemCheck} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Expense</Text>
        <TouchableOpacity onPress={handleAddExpense} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#00D09C" />
          ) : (
            <Ionicons name="checkmark" size={24} color="#00D09C" />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} ref={scrollViewRef} keyboardShouldPersistTaps="handled">
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        <TouchableOpacity style={styles.groupSelector} onPress={() => setShowGroupPicker(true)}>
          <View style={styles.groupInfo}>
            <Image source={{ uri: selectedGroup?.image || 'https://via.placeholder.com/40' }} style={styles.groupImage} />
            <Text style={styles.groupName}>{selectedGroup?.name || 'Select Group'}</Text>
            <Ionicons name="chevron-down" size={20} color="#AAAAAA" />
          </View>
        </TouchableOpacity>
        <View style={styles.groupMembers}>
          {groupMembers.slice(0, 3).map((member, index) => (
            <Image key={member.id} source={{ uri: member.image }} style={[styles.memberAvatar, { zIndex: 3 - index }]} />
          ))}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>For</Text>
          <TextInput
            ref={descriptionInputRef}
            style={styles.input}
            placeholder="Enter a Description"
            placeholderTextColor="#AAAAAA"
            autoCapitalize='sentences'
            cursorColor={"#EFEFEF"}
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Amount</Text>
          <FakeCurrencyInput
            value={amount}
            onChangeValue={setAmount}
            style={styles.amountInput}
            prefix="$"
            delimiter=","
            separator="."
            precision={2}
            cursorColor={"#FFF"}
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
            <Text style={styles.paidByText}>{paidBy === user.uid ? 'You' : groupMembers.find(m => m.id === paidBy)?.name}</Text>
            <Ionicons name="chevron-down" size={20} color="#AAAAAA" />
          </View>
        </TouchableOpacity>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={() => setShowDatePicker(true)}>
            <Ionicons name="calendar-outline" size={24} color="#00D09C" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="camera-outline" size={24} color="#00D09C" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => setShowNoteInput(true)}>
            <Ionicons name="create-outline" size={24} color="#00D09C" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.doneButton} onPress={handleAddExpense} disabled={isLoading}>
        <Text style={styles.doneButtonText}>Done</Text>
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
              style={styles.createGroupButton}
              onPress={() => {
                setShowGroupPicker(false);
                navigation.navigate('CreateGroup');
              }}
            >
              <Ionicons name="add-circle-outline" size={24} color="#00D09C" />
              <Text style={styles.createGroupButtonText}>Create New Group</Text>
            </TouchableOpacity>
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#AAAAAA" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search groups"
                placeholderTextColor="#AAAAAA"
              />
            </View>
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

      <Modal
        visible={showPaidByPicker}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Paid By</Text>
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#AAAAAA" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search members"
                placeholderTextColor="#AAAAAA"
              />
            </View>
            <FlatList
              data={groupMembers}
              renderItem={renderMemberItem}
              keyExtractor={(item) => item.id}
              style={styles.memberList}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowPaidByPicker(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showNoteInput}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
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
        </View>
      </Modal>

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
  groupSelector: {
    backgroundColor: '#2C2C2E',
    borderRadius: 100,
    padding: 12,
    marginBottom: 24,
    alignSelf: 'center',
    width: '70%',
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
  groupMembers: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginBottom: 20,
  },
  memberAvatar: {
    width: 45,
    height: 45,
    border: 50,
    marginRight: -10,
    borderWidth: 2,
    borderColor: '#2C2C2E',
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    color: '#FFFFFF',
    fontSize: 20,
    marginBottom: 8,
    alignSelf: "center"
  },
  input: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
    paddingVertical: 8,
  },
  amountInput: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 8,
  },
  splitMethodContainer: {
    flexDirection: 'row',
    backgroundColor: "#2C2C2E",
    justifyContent: 'space-between',
    marginBottom: 24,
    borderRadius: 20,
  },
  splitMethodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  splitMethodButtonActive: {
    backgroundColor: '#00D09C',
    borderColor: '#00D09C',
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
    borderRadius: 20,
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
  doneButton: {
    backgroundColor: '#00D09C',
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 12,
    margin: 16,
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
  createGroupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3A3A3C',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  createGroupButtonText: {
    color: '#00D09C',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3A3A3C',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    paddingVertical: 10,
  },
  groupList: {
    maxHeight: '60%',
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
  },
  memberList: {
    maxHeight: '60%',
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