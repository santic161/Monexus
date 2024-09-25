import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { useUser } from '../context/UserContext';

import GoogleIcon from "../assets/GoogleLogo.png"



export default function OnboardingScreen({ navigation }) {
  const { logIn } = useUser();
  const [loading, setLoading] = useState(false);

  async function handleSignInWithGoogle() {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = (await GoogleSignin.signIn()).data;
      console.log(userInfo)
      // Create a Google credential with the token
      const { idToken } = userInfo;
      if (!idToken) {
        throw new Error('No ID token present in Google Sign-In response');
      }
      const credential = GoogleAuthProvider.credential(idToken);
      // Sign in to Firebase with the Google credential
      const result = await signInWithCredential(auth, credential);
      logIn(result.user);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('Sign in cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Sign in is in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play services not available');
      } else {
        console.log('Error signing in with Google:', error);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      {/* <View style={styles.logoBackground}> */}
      <Image source={require("../assets/icon transparent.png")} style={styles.logoBackground} />
      <Text style={styles.logoTitle}>Monexus</Text>
      {/* </View>s */}

      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.loginButtonText}>Log in</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.signUpButton}
        onPress={() => navigation.navigate('SignUp')}
      >
        <Text style={styles.signUpButtonText}>Sign Up</Text>
      </TouchableOpacity>

      <View style={styles.orContainer}>
        <View style={styles.orLine} />
        <Text style={styles.orText}>Or</Text>
        <View style={styles.orLine} />
      </View>

      <TouchableOpacity style={styles.googleButton} onPress={handleSignInWithGoogle}
        disabled={loading}>
        <Image
          source={GoogleIcon}
          style={styles.googleIcon}
        />
        <Text style={styles.googleButtonText}>Continue with Google</Text>
      </TouchableOpacity>

      <Text style={styles.termsText}>
        By clicking Sign Up or Log In, I agree to Splitwise's{'\n'}
        <Text style={styles.linkText}>Terms of Service</Text> and <Text style={styles.linkText}>Privacy Policy</Text>.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logoBackground: {
    width: 80,
    height: 80,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  logoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 40,
  },
  loginButton: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00D09C',
    marginBottom: 10,
  },
  loginButtonText: {
    color: '#00D09C',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  signUpButton: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#00D09C',
    marginBottom: 20,
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#3A3A3C',
  },
  orText: {
    color: '#757575',
    fontSize: 14,
    marginHorizontal: 10,
  },
  googleButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleButtonText: {
    color: '#757575',
    fontSize: 16,
    fontWeight: 'bold',
  },
  termsText: {
    color: '#757575',
    fontSize: 12,
    textAlign: 'center',
  },
  linkText: {
    color: '#00D09C',
  },
});