import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import OnboardingScreen from './screens/OnBoarding';
import LoginScreen from './screens/SignIn';
import SignUpScreen from './screens/SignUp';
import HomeScreen from './screens/Home';
import FriendsScreen from './screens/Friends';
import ActivityScreen from './screens/Activity';
import AccountScreen from './screens/Account';
import AddExpenseScreen from './screens/AddExpense';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar, TouchableOpacity, View } from 'react-native';
import { UserProvider } from './context/UserContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <View style={{ backgroundColor: "#101010", flex: 1 }}>

      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Friends') {
              iconName = focused ? 'people' : 'people-outline';
            } else if (route.name === 'Add') {
              iconName = 'add-circle';
            } else if (route.name === 'Activity') {
              iconName = focused ? 'list' : 'list-outline';
            } else if (route.name === 'Account') {
              iconName = focused ? 'person' : 'person-outline';
            }

            return <Ionicons name={iconName} size={size + 5} color={color} />;
          },
          tabBarActiveTintColor: '#00D09C',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            height: '7%',
            width: '100%',
            backgroundColor: '#2B2C2D',
            borderTopColor: '#2C2C2E',
            borderTopRightRadius: 15,
            borderTopLeftRadius: 15
          },
          lazy: true,
          headerShown: false,
          // headerTintColor: '#FFFFFF',
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Friends" component={FriendsScreen} />
        <Tab.Screen
          name="Add"
          component={AddExpenseScreen}
          options={{
            tabBarButton: (props) => (
              <TouchableOpacity
                {...props}
                style={{
                  top: -20,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <View style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: '#00D09C',
                }}>
                  <Ionicons name="add" size={30} color="#FFFFFF" style={{ textAlign: 'center', lineHeight: 60 }} />
                </View>
              </TouchableOpacity>
            ),
          }}
        />
        <Tab.Screen name="Activity" component={ActivityScreen} />
        <Tab.Screen name="Account" component={AccountScreen} />
      </Tab.Navigator >
    </View>
  );
}

export default function App() {
  //Change me!
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const value = await AsyncStorage.getItem('isLoggedIn');
      if (value !== null) {
        setIsLoggedIn(JSON.parse(value));
      }
    } catch (error) {
      console.log('Error checking login status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return null; // or a loading screen
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar translucent={true} backgroundColor="#101010" />
      <UserProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Group>
              <Stack.Screen name="Onboarding" component={OnboardingScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="SignUp" component={SignUpScreen} />
              <Stack.Screen name="Main" component={MainTabs} />
            </Stack.Group>
          </Stack.Navigator>
        </NavigationContainer>
      </UserProvider>
    </SafeAreaView>
  );
}