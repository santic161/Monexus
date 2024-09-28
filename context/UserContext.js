import React, { createContext, useState, useContext, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '../firebase/firebaseConfig';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    try {
      GoogleSignin.configure({
        webClientId: '466482242726-o55tavogdbi0tbp5e1r6fb5rqvt1h6ij.apps.googleusercontent.com',
        offlineAccess: true,
      });
    } catch (e) {
      console.warn("Wrong Google Credentials on OnBoarding.js")
    }

    const checkPreviousLogin = async () => {
      try {
        const value = await AsyncStorage.getItem('@isLoggedIn');
        if (value !== null) {
          const userInfo = await AsyncStorage.getItem('userInfo');
          const parsedUserInfo = JSON.parse(userInfo);
          // console.log("🚀 ~ checkPreviousLogin ~ parsedUserInfo:", parsedUserInfo)
          
          setUser(parsedUserInfo);
          setIsLoggedIn(true);
          // Sync with Firestore
          await syncUserWithFirestore(parsedUserInfo);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error checking previous login:', error);
        setLoading(false);
      }
    };

    checkPreviousLogin();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser({ ...firebaseUser, ...userDoc.data() });
        } else {
          setUser(firebaseUser);
          // Create user document in Firestore if it doesn't exist
          await setDoc(doc(db, 'users', firebaseUser.uid), {
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
          });
        }
        await AsyncStorage.setItem('@isLoggedIn', 'true');
        await AsyncStorage.setItem('userInfo', JSON.stringify(firebaseUser));
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const syncUserWithFirestore = async (userInfo) => {
    if (!userInfo || !userInfo.uid) return;

    const userDoc = await getDoc(doc(db, 'users', userInfo.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', userInfo.uid), {
        email: userInfo.email,
        displayName: userInfo.displayName,
        photoURL: userInfo.photoURL,
      });
    }
  };

  const getUserInfo = async () => {
    if (!user) return null;

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        return { ...user, ...userDoc.data() };
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }

    return user;
  };

  const logIn = async (newUserData) => {
    try {
      await AsyncStorage.setItem('userInfo', JSON.stringify(newUserData));
      await AsyncStorage.setItem('@isLoggedIn', 'true');
      setUser(newUserData);
      setIsLoggedIn(true);
      await syncUserWithFirestore(newUserData);
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const logOut = async () => {
    try {
      await AsyncStorage.removeItem('userInfo');
      await AsyncStorage.setItem('@isLoggedIn', 'false');
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      await auth.signOut();
      setUser(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.warn(error);
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, isLoggedIn, getUserInfo, logIn, logOut }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};