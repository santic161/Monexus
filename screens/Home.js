import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { formatNumber } from 'react-native-currency-input';
import { getLocales } from 'expo-localization';
import { LinearGradient } from 'expo-linear-gradient';
import { GestureHandlerRootView, Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolate,
  withTiming,
} from 'react-native-reanimated';
import { useUser } from '../context/UserContext';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const locale = getLocales()[0];

const FriendItem = ({ name, amount, description, date, image, type }) => (
  <View style={styles.friendItem}>
    <Image source={{ uri: image }} style={styles.avatar} />
    <View style={styles.friendInfo}>
      <Text style={styles.friendName}>{name}</Text>
      <Text style={styles.friendDescription}>{description}</Text>
    </View>
    <View style={styles.amountContainer}>
      <Text style={[styles.amount, { color: type === 'owe' ? '#F97316' : type === 'owed' ? '#00D09C' : '#9CA3AF' }]}>
        {type === 'settled' ? 'Settled' : `₹ ${formatNumber(amount, { separator: "." })}`}
      </Text>
      <Ionicons name="chevron-forward" size={20} color="#4B5563" />
    </View>
  </View>
);

const tabs = ['youOwe', 'owesYou', 'settledUp'];

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState('owesYou');
  const [userGroups, setUserGroups] = useState([]);
  const navigation = useNavigation();
  const swipeAnim = useSharedValue(0);
  const tabIndicatorPosition = useSharedValue(1);
  const { user } = useUser();

  const payAmount = 150.5;
  const receiveAmount = 250.21;
  const totalAmount = payAmount + receiveAmount;
  const payPercentage = (payAmount / totalAmount) * 100;
  const receivePercentage = (receiveAmount / totalAmount) * 100;

  const screenWidth = Dimensions.get('window').width;
  const tabWidth = screenWidth / 3;

  useEffect(() => {
    if (user) {
      const q = query(collection(db, 'groups'), where('members', 'array-contains', user.uid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const groups = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log(groups);
        setUserGroups(groups);
      });

      return () => unsubscribe();
    }
  }, [user]);

  useEffect(() => {
    tabIndicatorPosition.value = withTiming(tabs.indexOf(activeTab), {
      duration: 300,
    });
  }, [activeTab]);

  const updateActiveTab = useCallback((newTab) => {
    setActiveTab(newTab);
  }, []);

  const swipeGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((event) => {
      swipeAnim.value = event.translationX;
    })
    .onEnd((event) => {
      const currentIndex = tabs.indexOf(activeTab);
      if (event.velocityX > 500 && currentIndex > 0) {
        // Fast swipe right
        runOnJS(updateActiveTab)(tabs[currentIndex - 1]);
      } else if (event.velocityX < -500 && currentIndex < tabs.length - 1) {
        // Fast swipe left
        runOnJS(updateActiveTab)(tabs[currentIndex + 1]);
      } else if (event.translationX > screenWidth * 0.3 && currentIndex > 0) {
        // Swipe right
        runOnJS(updateActiveTab)(tabs[currentIndex - 1]);
      } else if (event.translationX < -screenWidth * 0.3 && currentIndex < tabs.length - 1) {
        // Swipe left
        runOnJS(updateActiveTab)(tabs[currentIndex + 1]);
      }
      swipeAnim.value = withSpring(0, {
        stiffness: 1000,
        damping: 500,
        mass: 1,
        overshootClamping: true,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
      });
    });

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      swipeAnim.value,
      [-screenWidth, 0, screenWidth],
      [-screenWidth * 0.3, 0, screenWidth * 0.3],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateX }],
    };
  });

  const tabIndicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: tabWidth * tabIndicatorPosition.value }],
    };
  });

  const renderFriendItems = useCallback(() => {
    return userGroups.map((group) => (
      <FriendItem
        key={group.id}
        name={group.name}
        amount={0}
        description={`${group.members.length} members`}
        date=""
        image={group.image}
        type="owed"
      />
    ));
  }, [userGroups]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
            <Ionicons name="menu" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Home</Text>
          <TouchableOpacity>
            <Ionicons name="search" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.balanceContainerGlobal}>
          <View style={styles.balanceContainer}>
            <LinearGradient
              colors={['#991B1B', '#065F46']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              locations={[payPercentage / 100, payPercentage / 100]}
              style={styles.balanceBackground}
            />
            <View style={styles.balanceContent}>
              <View style={[styles.balanceBox, { alignItems: "flex-start" }]}>
                <Text style={styles.balanceLabel}>Pay</Text>
                <Text style={styles.balanceAmount}>{formatNumber(payAmount, { prefix: locale.currencySymbol, precision: 2 })}</Text>
              </View>
              <View style={[styles.balanceBox, { alignItems: "flex-end" }]}>
                <Text style={styles.balanceLabel}>Receive</Text>
                <Text style={styles.balanceAmount}>{formatNumber(receiveAmount, { prefix: locale.currencySymbol, precision: 2 })}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.tabContainer}>
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={tab}
              style={styles.tab}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab === 'youOwe' ? 'YOU OWE' : tab === 'owesYou' ? 'OWES YOU' : 'SETTLED UP'}
              </Text>
            </TouchableOpacity>
          ))}
          <Animated.View style={[styles.tabIndicator, tabIndicatorStyle]} />
        </View>

        <GestureDetector gesture={swipeGesture}>
          <Animated.View style={[styles.scrollView, animatedStyle]}>
            <ScrollView>
              {renderFriendItems()}
            </ScrollView>
          </Animated.View>
        </GestureDetector>
      </SafeAreaView>
    </GestureHandlerRootView>
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
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 16,
  },
  balanceContainerGlobal: {
    padding: 16,
  },
  balanceContainer: {
    borderRadius: 15,
    overflow: 'hidden',
    height: 80,
    position: 'relative',
  },
  balanceBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  balanceContent: {
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  balanceBox: {
    flex: 1,
    padding: 16,
    paddingHorizontal: 25,
    justifyContent: 'center',
  },
  balanceLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    opacity: 0.8,
  },
  balanceAmount: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#101010',
    paddingTop: 8,
    position: 'relative',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  tabText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#9CA3AF',
  },
  activeTabText: {
    color: '#00D09C',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: Dimensions.get('window').width / 3,
    height: 2,
    backgroundColor: '#00D09C',
  },
  scrollView: {
    flex: 1,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  friendDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 4,
  },
});