import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Animated, StatusBar, Easing } from 'react-native';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

import SplashScreen from '../components/SplashScreen';
import LoginScreen from '../screens/SignIn';
import SignUpScreen from '../screens/SignUp'
import HomeScreen from '../screens/Home';
import AddExpenseScreen from '../screens/AddExpense';
import OnboardingScreen from '../screens/OnBoarding';
import { UserProvider, useUser } from '../context/UserContext';
import FriendsScreen from '../screens/Friends';
import ActivityScreen from '../screens/Activity';
import AccountScreen from '../screens/Account';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CreateGroup from '../screens/CreateGroup';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const cacheImages = (images) => {
    return images.map(image => {
        if (typeof image === 'string') {
            return Image.prefetch(image);
        } else {
            return Asset.fromModule(image).downloadAsync();
        }
    });
};

const cacheFonts = (fonts) => {
    return fonts.map(font => Font.loadAsync(font));
};

function MainTabs() {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }, []);

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

export default function Routes() {
    const [isReady, setIsReady] = useState(false);
    const { isLoggedIn, loading } = useUser();
    const fadeAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        async function loadResourcesAndDataAsync() {
            try {
                const fontAssets = cacheFonts([Ionicons.font]);
                await Promise.all([...fontAssets]);
            } catch (e) {
                console.warn(e);
            } finally {
                setIsReady(true);
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }).start();
            }
        }

        loadResourcesAndDataAsync();
    }, []);

    if (!isReady || loading) {
        return <SplashScreen fadeAnim={fadeAnim} />;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    animation: 'fade',
                    animationDuration: 2000,
                }}
                detachInactiveScreens={true}
            >
                {isLoggedIn ? (
                    <Stack.Group>

                        <Stack.Screen
                            name="Main"
                            component={MainTabs}
                            options={{
                                cardStyleInterpolator: ({ current }) => ({
                                    cardStyle: {
                                        opacity: current.progress,
                                    },
                                }),
                            }}
                        />
                        <Stack.Screen
                            name="CreateGroup"
                            component={CreateGroup}
                        />
                    </Stack.Group>
                ) : (
                    <Stack.Group>
                        <Stack.Screen
                            name="Onboarding"
                            component={OnboardingScreen}
                            options={{
                                cardStyleInterpolator: ({ current }) => ({
                                    cardStyle: {
                                        opacity: current.progress,
                                    },
                                }),
                            }}
                        />
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="SignUp" component={SignUpScreen} />
                    </Stack.Group>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}