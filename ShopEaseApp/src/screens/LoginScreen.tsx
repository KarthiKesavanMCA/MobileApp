import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useUser } from '../context/UserContext';
import { simulatedJwtLogin } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

type LoginNavProp = StackNavigationProp<RootStackParamList, 'Login'>;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginNavProp>();
  const { setToken, setUser } = useUser();

  const [email, setEmail] = useState('karthi@example.com');
  const [password, setPassword] = useState('Password123');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  // Validation function (EXP 6 requirement)
  const validateForm = (): boolean => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      setEmailError('Email Address is mandatory');
      isValid = false;
    } else if (!emailRegex.test(email.trim())) {
      setEmailError('Please enter a valid email address format');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is mandatory');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Simulated JWT Authentication (EXP 6 requirement)
      const res = await simulatedJwtLogin(email, password);
      
      // Store token in AsyncStorage (EXP 6 requirement)
      await AsyncStorage.setItem('userToken', res.token);
      await AsyncStorage.setItem('userProfile', JSON.stringify(res.user));

      setToken(res.token);
      setUser(res.user);

      Alert.alert('Login Successful', 'Welcome back to ShopEase!', [
        {
          text: 'OK',
          onPress: () => navigation.replace('MainDrawer'),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Authentication Error', error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.headerArea}>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Login to continue</Text>

          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={48} color="#FFFFFF" />
          </View>
        </View>

        <View style={styles.formCard}>
          <CustomInput
            label=""
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            iconName="person-outline"
            keyboardType="email-address"
            error={emailError}
          />

          <CustomInput
            label=""
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            iconName="lock-closed-outline"
            isPassword={true}
            error={passwordError}
          />

          <TouchableOpacity
            style={styles.forgotPassBtn}
            onPress={() => Alert.alert('Forgot Password', 'Password reset link sent to your registered email.')}
          >
            <Text style={styles.forgotPassText}>Forgot Password?</Text>
          </TouchableOpacity>

          <CustomButton
            title="Login"
            onPress={handleLogin}
            loading={loading}
            style={styles.loginBtn}
          />

          <View style={styles.signUpRow}>
            <Text style={styles.noAccountText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.signUpText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 36,
    alignItems: 'center',
  },
  headerArea: {
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  subtitle: {
    fontSize: 14,
    color: '#636E72',
    marginTop: 4,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#9C88FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    elevation: 4,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  formCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  forgotPassBtn: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPassText: {
    color: '#6C5CE7',
    fontSize: 13,
    fontWeight: '600',
  },
  loginBtn: {
    borderRadius: 26,
  },
  signUpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  noAccountText: {
    fontSize: 14,
    color: '#636E72',
  },
  signUpText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6C5CE7',
  },
});
