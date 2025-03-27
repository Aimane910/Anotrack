import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  Alert,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const { width, height } = Dimensions.get('window');

const SignupScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    if (!username || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('http://192.168.1.X:3000/api/signup', {
        username,
        password,
        role
      });

      if (response.data.success) {
        Alert.alert('Success', 'Account created successfully', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login')
          }
        ]);
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>

        <View style={styles.headerSection}>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join ANOTRACK today</Text>
        </View>

        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Fill in your details to get started</Text>

        <View style={styles.inputContainer}>
          <View style={[
            styles.inputWrapper,
            errors.username && styles.inputError
          ]}>
            <Ionicons 
              name="person-outline" 
              size={20} 
              color="#94A3B8" 
              style={styles.inputIcon} 
            />
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>
          {errors.username && (
            <Text style={styles.errorText}>{errors.username}</Text>
          )}

          <View style={styles.inputWrapper}>
            <Ionicons 
              name="lock-closed-outline" 
              size={20} 
              color="#94A3B8" 
              style={styles.inputIcon} 
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons 
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={20}
                color="#94A3B8"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputWrapper}>
            <Ionicons 
              name="lock-closed-outline" 
              size={20} 
              color="#94A3B8" 
              style={styles.inputIcon} 
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
            />
          </View>

          <View style={styles.roleWrapper}>
            <Text style={styles.roleLabel}>Select Role:</Text>
            <View style={styles.roleButtons}>
              {['user', 'admin', 'manager'].map((roleOption) => (
                <TouchableOpacity
                  key={roleOption}
                  style={[
                    styles.roleButton,
                    role === roleOption && styles.roleButtonActive
                  ]}
                  onPress={() => setRole(roleOption)}
                >
                  <Text style={[
                    styles.roleButtonText,
                    role === roleOption && styles.roleButtonTextActive
                  ]}>
                    {roleOption.charAt(0).toUpperCase() + roleOption.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.signupButton, isLoading && styles.signupButtonDisabled]}
          onPress={handleSignup}
          disabled={isLoading}
        >
          <Text style={styles.signupButtonText}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  backButton: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    marginBottom: 25,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: width * 0.3,
    height: width * 0.3,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
    marginBottom: 32,
    textAlign: 'center',
  },
  inputContainer: {
    gap: 16,
    marginBottom: 24,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    height: 56,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
    width: 24,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
    paddingVertical: 12,
  },
  roleWrapper: {
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  roleLabel: {
    fontSize: 15,
    color: '#1E293B',
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  roleButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  roleButtonText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '600',
  },
  roleButtonTextActive: {
    color: '#FFFFFF',
  },
  signupButton: {
    height: 56,
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
    marginTop: 24,
    marginBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  signupButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  signupButtonDisabled: {
    backgroundColor: '#94A3B8',
    shadowOpacity: 0.1,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 13,
    marginTop: 4,
    marginLeft: 12,
  },
  eyeIcon: {
    padding: 8,
    marginLeft: 8,
  }
});

export default SignupScreen;