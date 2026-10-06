import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

type RegisterNavProp = StackNavigationProp<RootStackParamList, 'Register'>;

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterNavProp>();

  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('Male');
  const [dob, setDob] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    const alphaRegex = /^[A-Za-z\s]+$/;
    const phoneRegex = /^\d{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!fullName.trim()) {
      errs.fullName = 'Full Name is required';
    } else if (!alphaRegex.test(fullName.trim())) {
      errs.fullName = 'Full Name should contain only alphabetic characters';
    }

    if (!mobile.trim()) {
      errs.mobile = 'Mobile Number is required';
    } else if (!phoneRegex.test(mobile.trim())) {
      errs.mobile = 'Mobile Number must contain exactly 10 digits';
    }

    if (!email.trim()) {
      errs.email = 'Email Address is required';
    } else if (!emailRegex.test(email.trim())) {
      errs.email = 'Please enter a valid email format';
    }

    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters long';
    }

    if (!confirmPassword) {
      errs.confirmPassword = 'Confirm Password is required';
    } else if (confirmPassword !== password) {
      errs.confirmPassword = 'Passwords do not match';
    }

    if (!city.trim()) errs.city = 'City is required';
    if (!address.trim()) errs.address = 'Address is required';

    if (!acceptedTerms) {
      errs.terms = 'You must accept the Terms and Conditions before registering';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = () => {
    if (!validate()) {
      Alert.alert('Validation Error', 'Please correct the highlighted errors in the form before submitting.');
      return;
    }

    Alert.alert(
      'Registration Successful',
      `Welcome to ShopEase, ${fullName}! Your account has been registered successfully.`,
      [
        {
          text: 'Login Now',
          onPress: () => navigation.navigate('Login'),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#2D3436" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Create Account</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <CustomInput
            label="Full Name *"
            placeholder="e.g. John Doe"
            value={fullName}
            onChangeText={setFullName}
            iconName="person-outline"
            error={errors.fullName}
          />

          <CustomInput
            label="Mobile Number *"
            placeholder="10-digit mobile number"
            value={mobile}
            onChangeText={setMobile}
            iconName="call-outline"
            keyboardType="phone-pad"
            error={errors.mobile}
          />

          <CustomInput
            label="Email Address *"
            placeholder="john@example.com"
            value={email}
            onChangeText={setEmail}
            iconName="mail-outline"
            keyboardType="email-address"
            error={errors.email}
          />

          <CustomInput
            label="Password *"
            placeholder="At least 6 characters"
            value={password}
            onChangeText={setPassword}
            iconName="lock-closed-outline"
            isPassword={true}
            error={errors.password}
          />

          <CustomInput
            label="Confirm Password *"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            iconName="lock-closed-outline"
            isPassword={true}
            error={errors.confirmPassword}
          />

          {/* Gender selection */}
          <Text style={styles.sectionLabel}>Gender</Text>
          <View style={styles.genderRow}>
            {['Male', 'Female', 'Other'].map(g => (
              <TouchableOpacity
                key={g}
                style={[styles.genderChip, gender === g && styles.genderChipActive]}
                onPress={() => setGender(g)}
              >
                <Text style={[styles.genderText, gender === g && styles.genderTextActive]}>
                  {g}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <CustomInput
            label="Date of Birth"
            placeholder="YYYY-MM-DD (e.g. 1998-05-15)"
            value={dob}
            onChangeText={setDob}
            iconName="calendar-outline"
          />

          <CustomInput
            label="City *"
            placeholder="e.g. Chennai"
            value={city}
            onChangeText={setCity}
            iconName="location-outline"
            error={errors.city}
          />

          <CustomInput
            label="Address *"
            placeholder="House/Flat No, Street, Area"
            value={address}
            onChangeText={setAddress}
            iconName="home-outline"
            multiline={true}
            error={errors.address}
          />

          {/* Terms & Conditions switch */}
          <View style={styles.termsRow}>
            <Switch
              value={acceptedTerms}
              onValueChange={setAcceptedTerms}
              trackColor={{ false: '#DCDDE1', true: '#9C88FF' }}
              thumbColor={acceptedTerms ? '#6C5CE7' : '#F5F6FA'}
            />
            <Text style={styles.termsText}>
              I accept the <Text style={styles.termsLink}>Terms and Conditions</Text> *
            </Text>
          </View>
          {errors.terms && <Text style={styles.errorMsg}>{errors.terms}</Text>}

          <CustomButton
            title="Register"
            onPress={handleRegister}
            style={styles.registerBtn}
          />
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
  topBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  backBtn: {
    padding: 6,
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 8,
  },
  genderRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  genderChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 10,
  },
  genderChipActive: {
    backgroundColor: '#6C5CE7',
    borderColor: '#6C5CE7',
  },
  genderText: {
    color: '#636E72',
    fontWeight: '600',
  },
  genderTextActive: {
    color: '#FFFFFF',
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  termsText: {
    marginLeft: 10,
    fontSize: 13,
    color: '#2D3436',
    flex: 1,
  },
  termsLink: {
    color: '#6C5CE7',
    fontWeight: 'bold',
  },
  errorMsg: {
    color: '#FF4757',
    fontSize: 12,
    marginBottom: 12,
  },
  registerBtn: {
    marginTop: 10,
  },
});
