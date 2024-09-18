import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { getAuth } from 'firebase/auth';
import { useUser } from '../context/UserContext';

const SettingItem = ({ icon, title, hasToggle = false, isToggled = false, onToggle, hasChevron = true }) => (
  <TouchableOpacity style={styles.settingItem}>
    <Ionicons name={icon} size={24} color="#00D09C" style={styles.settingIcon} />
    <Text style={styles.settingTitle}>{title}</Text>
    {hasToggle ? (
      <Switch
        value={isToggled}
        onValueChange={onToggle}
        trackColor={{ false: '#3A3A3C', true: '#00D09C' }}
        thumbColor={isToggled ? '#FFFFFF' : '#FFFFFF'}
      />
    ) : hasChevron ? (
      <Ionicons name="chevron-forward" size={24} color="#AAAAAA" />
    ) : null}
  </TouchableOpacity>
);

export default function AccountScreen({ navigation }) {
  const { user, updateUser } = useUser();

  const handleSignOut = async () => {
    GoogleSignin.revokeAccess();
    GoogleSignin.signOut()
    updateUser(null);
    navigation.navigate("Onboarding");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="menu" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account</Text>
        <TouchableOpacity>
          <Ionicons name="search" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <Image
            source={{ uri: 'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/b3/b3a33bba1b3c934fbd9fdebcb1551fa68115d314_full.jpg' }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.displayName}</Text>
            <Text style={styles.profileEmail}>lakshaymahur***@gmail.com</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="pencil" size={24} color="#00D09C" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additions</Text>
          <SettingItem icon="qr-code" title="Scan Code" />
          <SettingItem icon="diamond" title="Get Premium" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <SettingItem
            icon="notifications"
            title="Notification"
            hasToggle={true}
            isToggled={true}
            onToggle={() => { }}
          />
          <SettingItem
            icon="lock-closed"
            title="Create/Change Passcode"
            hasToggle={true}
            isToggled={false}
            onToggle={() => { }}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Feedback & Help</Text>
          <SettingItem icon="star" title="Rate Splitwise" />
          <SettingItem icon="help-circle" title="Help & Support" />
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={() => handleSignOut()}>
          <Ionicons name="log-out" size={24} color="#00D09C" style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
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
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileEmail: {
    color: '#AAAAAA',
    fontSize: 14,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  settingIcon: {
    marginRight: 16,
  },
  settingTitle: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 32,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00D09C',
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    color: '#00D09C',
    fontSize: 16,
    fontWeight: 'bold',
  },
});