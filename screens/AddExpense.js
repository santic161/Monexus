import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CurrencyInput, { FakeCurrencyInput } from 'react-native-currency-input';

export default function AddExpenseScreen({ navigation }) {
  const [amount, setAmount] = useState(2310.255);
  const [description, setDescription] = useState('');
  const [splitMethod, setSplitMethod] = useState('Equally');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Expense</Text>
        <TouchableOpacity>
          <Ionicons name="checkmark" size={24} color="#00D09C" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <TouchableOpacity style={styles.groupSelector}>
          <View style={styles.groupInfo}>
            <Image source={{ uri: 'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/ae/aea4afc8c79da7a7fbea94b8cc94db68bdf18325_full.jpg' }} style={styles.groupImage} />
            <Text style={styles.groupName}>Tokyo 2025</Text>
            <Ionicons name="chevron-down" size={20} color="#AAAAAA" style={{ justifyContent: 'flex-end', marginRight: 5 }} />
          </View>
        </TouchableOpacity>
        <View style={styles.groupMembers}>
          <Image source={{ uri: 'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/3b/3b23dd976e82d378525de25b91b6329d45fbb43b_full.jpg' }} style={styles.memberAvatar} />
          <Image source={{ uri: 'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/3b/3b33468b13d569d115006690f7b61b31d782346b_full.jpg' }} style={styles.memberAvatar} />
          <Image source={{ uri: 'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/11/11559971d0a2324d33a9c8718351f089f7e9733d_full.jpg' }} style={styles.memberAvatar} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>For</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter a Description"
            placeholderTextColor="#AAAAAA"
            autoCapitalize='true'
            cursorColor={"#EFEFEF"}
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Amount</Text>
          {/* <TextInput
            value={`$${amount}`}
            onChangeText={(text) => setAmount(text.replace('$', ''))}
            keyboardType="numeric"
            /> */}
          <FakeCurrencyInput
            value={amount}
            onChangeValue={val => setAmount(val)}
            style={styles.amountInput}
            caretHidden={true}
            // renderTextInput={textInputProps => <FakeCurrencyInput  {...textInputProps} variant='filled' />}
            renderText
            prefix="$"
            delimiter="."
            separator=","
            cursorColor={"#FFF"}
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

        <TouchableOpacity style={styles.paidByContainer}>
          <Text style={styles.paidByLabel}>Paid by</Text>
          <View style={styles.paidBySelector}>
            <Image source={{ uri: '/placeholder.svg?height=30&width=30' }} style={styles.paidByAvatar} />
            <Text style={styles.paidByText}>you</Text>
            <Ionicons name="chevron-down" size={20} color="#AAAAAA" />
          </View>
        </TouchableOpacity>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="calendar-outline" size={24} color="#00D09C" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="camera-outline" size={24} color="#00D09C" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="create-outline" size={24} color="#00D09C" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.doneButton}>
        <Text style={styles.doneButtonText}>Done</Text>
      </TouchableOpacity>
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
    // borderBottomWidth: 1,
    // borderBottomColor: '#2C2C2E',
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
  groupSelector: {
    backgroundColor: '#2C2C2E',
    borderRadius: 100,
    padding: 12,
    marginBottom: 24,
    alignSelf: 'center',
    width: '70%',
    height: '11%',
  },
  groupInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  groupImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    // marginRight: 12,
  },
  groupName: {
    color: '#FFFFFF',
    justifyContent: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    // flex: 1
  },
  groupMembers: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginBottom: 20,
  },
  memberAvatar: {
    width: 45,
    height: 45,
    borderRadius: 50,
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
    // marginTop: 20,
    alignSelf: "center"
  },
  input: {
    color: '#FFFFFF',
    fontSize: 18,
    // borderBottomWidth: 1,
    // borderBottomColor: '#3A3A3C',
    textAlign: 'center',
    paddingVertical: 8,
  },
  amountInput: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    borderBottomWidth: 0,
    textAlign: 'center',
    borderBottomColor: '#3A3A3C',
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
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    // borderColor: '#3A3A3C',
  },
  splitMethodButtonActive: {
    backgroundColor: '#00D09C',
    borderColor: '#00D09C',
  },
  splitMethodText: {
    color: '#AAAAAA',
    fontSize: 14,
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
  },
  paidByLabel: {
    color: '#AAAAAA',
    fontSize: 16,
  },
  paidBySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
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
    backgroundColor: "#2C2C2E"
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2C2C2E',
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
});