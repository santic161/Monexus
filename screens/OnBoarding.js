import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function OnboardingScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#00D09C', '#00B386']}
        style={styles.logoBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.logoText}>S</Text>
      </LinearGradient>
      <Text style={styles.logoTitle}>Splitwise</Text>
      
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
      
      <TouchableOpacity style={styles.googleButton}>
        <Image 
          source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }} 
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