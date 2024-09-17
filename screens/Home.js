import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const GroupCard = () => (
  <View style={styles.groupCard}>
    <View style={styles.groupHeader}>
      <Image
        source={{ uri: 'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/ae/aea4afc8c79da7a7fbea94b8cc94db68bdf18325_full.jpg' }}
        style={styles.groupIcon}
      />
      <View style={{ flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
        <View style={styles.totalContainer}>
          <View style={styles.totalItem}>
            <Text style={styles.totalLabel}>Total Owed</Text>
            <Text style={[styles.totalAmount, styles.totalOwed]}>+$102.28</Text>
          </View>
          <View style={styles.totalItem}>
            <Text style={styles.totalLabel}>Total Owe</Text>
            <Text style={[styles.totalAmount, styles.totalOwe]}>-$76.84</Text>
          </View>
        </View>
        <View style={styles.progressBar}>
          <View style={styles.progressOwed} />
          <View style={styles.progressOwe} />
        </View>
      </View>
    </View>


    <View style={{ flexDirection: 'column' }}>
      <View style={styles.balances}>
        <Text style={styles.groupName}>Tokyo 2025</Text>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.balanceText}>Sumit owes you <Text style={[styles.balanceAmount, { color: "#A3D6CA" }]}>$86.92</Text></Text>
          <Text style={styles.balanceText}>you owe yash <Text style={[styles.balanceAmount, { color: "#F69C66" }]}>$34.62</Text></Text>
        </View>
      </View>
      <View style={styles.groupInfo}>
        <View style={styles.groupMembers}>
          <Image source={{ uri: 'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/3b/3b23dd976e82d378525de25b91b6329d45fbb43b_full.jpg' }} style={styles.memberAvatar} />
          <Image source={{ uri: 'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/3b/3b33468b13d569d115006690f7b61b31d782346b_full.jpg' }} style={styles.memberAvatar} />
          <Image source={{ uri: 'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/11/11559971d0a2324d33a9c8718351f089f7e9733d_full.jpg' }} style={styles.memberAvatar} />
        </View>
        <TouchableOpacity>
          <Text style={styles.moreText}>+more</Text>
        </TouchableOpacity>
      </View>
    </View>

    <View style={styles.groupActions}>
      <TouchableOpacity style={[styles.actionButton, styles.settleUpButton]}>
        <Text style={[styles.actionButtonText, {
          color: '#FFF',
        }]}>Settle Up</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton}>
        <Text style={[styles.actionButtonText, {
          color: '#EC5601',
        }]}>View Details</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton}>
        <Text style={[styles.actionButtonText, {
          color: '#EC5601',
        }]}>Balance</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const ExpenseItem = ({ icon, name, date, amount, type }) => (
  <View style={styles.expenseItem}>
    <View style={styles.expenseIcon}>
      <Ionicons name={icon} size={24} color="#FFFFFF" />
    </View>
    <View style={styles.expenseInfo}>
      <Text style={styles.expenseName}>{name}</Text>
      <Text style={styles.expenseDate}>{date}</Text>
    </View>
    <View style={styles.expenseAmount}>
      <Text style={styles.expenseAmountText}>{amount}</Text>
      <View style={[styles.expenseType, { backgroundColor: type === 'Lent' ? '#00D09C' : '#EC5601' }]}>
        <Text style={styles.expenseTypeText}>{type}</Text>
      </View>
    </View>
  </View>
);

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="menu" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Home</Text>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <GroupCard />
        <View style={styles.expenseList}>
          <Text style={styles.monthHeader}>May, 2024</Text>
          <ExpenseItem icon="print" name="PDC Printout" date="May, 06" amount="$20.00" type="Lent" />
          <ExpenseItem icon="fast-food" name="Haldiram's" date="May, 06" amount="$13.16" type="Borrowed" />
          <ExpenseItem icon="airplane" name="Plane Tickets" date="May, 06" amount="$418.42" type="Borrowed" />
          <ExpenseItem icon="bed" name="Hotel trip" date="May, 05" amount="$573.32" type="Lent" />
          <Text style={styles.monthHeader}>April, 2024</Text>
          <ExpenseItem icon="fast-food" name="KFC Lunch" date="April, 28" amount="$18.00" type="Borrowed" />
        </View>
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
    // borderBottomWidth: 1,
    // borderBottomColor: '#2C2C2E',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  groupCard: {
    backgroundColor: '#2B2C2D',
    borderRadius: 20,
    margin: 16,
    padding: 16,
  },
  groupHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  groupIcon: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  totalContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalItem: {
    alignItems: 'flex-end',
  },
  totalLabel: {
    color: '#AAAAAA',
    fontSize: 12,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalOwed: {
    color: '#00D09C',
  },
  totalOwe: {
    color: '#F69C66',
  },
  progressBar: {
    height: 13,
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 2,
  },
  progressOwed: {
    flex: 100,
    backgroundColor: '#00D09C',
  },
  progressOwe: {
    flex: 76.84,
    backgroundColor: '#101010',
  },
  groupInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: -10
  },
  groupName: {
    color: '#FFFFFF',
    // paddingRight: 50,
    fontSize: 18,
    fontWeight: 'bold',
  },
  groupMembers: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: -10,
    borderWidth: 2,
    borderColor: '#2C2C2E',
  },
  balances: {
    // marginBottom: 8,
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  balanceText: {
    color: '#AAAAAA',
    fontSize: 14,
  },
  balanceAmount: {
    fontWeight: 'bold',
  },
  moreText: {
    color: '#FFF',
    fontSize: 14,
    // marginTop: 4,
  },
  groupActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#2B2C2D',
    borderColor: "#EC5601",
    borderWidth: 1.5,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 16,
  },
  settleUpButton: {
    backgroundColor: '#EC5601',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  expenseList: {
    paddingHorizontal: 16,
  },
  monthHeader: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  expenseIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3A3A3C',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  expenseDate: {
    color: '#AAAAAA',
    fontSize: 14,
  },
  expenseAmount: {
    alignItems: 'flex-end',
  },
  expenseAmountText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  expenseType: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginTop: 4,
  },
  expenseTypeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});