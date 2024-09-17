import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SignUpScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Sign Up</Text>
      <Text style={styles.subtitle}>Join Splitwise and Simplify Your Shared Expenses</Text>
      
      <Image
        source={{ uri: '/placeholder.svg?height=120&width=120' }}
        style={styles.mascot}
      />
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor="#AAAAAA"
          value={name}
          onChangeText={setName}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Your email Address"
          placeholderTextColor="#AAAAAA"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Password"
          placeholderTextColor="#AAAAAA"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Ionicons
            name={showPassword ? 'eye-off' : 'eye'}
            size={24}
            color="#00D09C"
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.inputContainer}>
        <View style={styles.phoneInputContainer}>
          <View style={styles.countryCode}>
            <Image
              source={{ uri: 'https://flagcdn.com/w40/in.png' }}
              style={styles.flag}
            />
            <Text style={styles.countryCodeText}>+91</Text>
            <Ionicons name="chevron-down" size={16} color="#AAAAAA" />
          </View>
          <TextInput
            style={styles.phoneInput}
            placeholder="Enter your number"
            placeholderTextColor="#AAAAAA"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
        </View>
      </View>
      
      <TouchableOpacity style={styles.signUpButton}>
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
        <Text style={styles.googleButtonText}>Sign Up with Google</Text>
      </TouchableOpacity>
      
      <Text style={styles.termsText}>
        By clicking Sign up, I agree to Splitwise's{'\n'}
        <Text style={styles.linkText}>Terms of Service</Text> and <Text style={styles.linkText}>Privacy Policy</Text>.
      </Text>
      
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00D09C',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#AAAAAA',
    textAlign: 'center',
    marginBottom: 20,
  },
  mascot: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
    overflow: 'hidden',
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3A3A3C',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  flag: {
    width: 24,
    height: 16,
    marginRight: 8,
  },
  countryCodeText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginRight: 8,
  },
  phoneInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    padding: 12,
  },
  signUpButton: {
    backgroundColor: '#00D09C',
    borderRadius: 8,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#3A3A3C',
  },
  orText: {
    color: '#AAAAAA',
    marginHorizontal: 10,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    width: '100%',
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  termsText: {
    color: '#AAAAAA',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 20,
  },
  linkText: {
    color: '#00D09C',
  },
  loginContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  loginText: {
    color: '#AAAAAA',
    fontSize: 14,
  },
  loginLink: {
    color: '#00D09C',
    fontSize: 14,
    fontWeight: 'bold',
  },
});