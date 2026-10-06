import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import { useNavigation } from '@react-navigation/native';

export const ProfileEditScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user, updateProfile } = useUser();

  const [name, setName] = useState(user.name || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [email, setEmail] = useState(user.email || '');
  const [city, setCity] = useState(user.city || '');
  const [address, setAddress] = useState(user.address || '');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    const alphaRegex = /^[A-Za-z\s]+$/;
    const phoneRegex = /^\d{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name.trim()) errs.name = 'Full Name is mandatory';
    else if (!alphaRegex.test(name.trim())) errs.name = 'Full Name must contain only letters';

    if (!phone.trim()) errs.phone = 'Phone Number is mandatory';
    else if (!phoneRegex.test(phone.trim().replace(/\D/g, ''))) errs.phone = 'Must be a 10-digit number';

    if (!email.trim()) errs.email = 'Email Address is mandatory';
    else if (!emailRegex.test(email.trim())) errs.email = 'Invalid email format';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    await updateProfile({ name, phone, email, city, address });
    Alert.alert('Profile Updated', 'Your profile details have been saved successfully.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#2D3436" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Edit Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <CustomInput
            label="Full Name *"
            value={name}
            onChangeText={setName}
            iconName="person-outline"
            error={errors.name}
          />
          <CustomInput
            label="Phone Number *"
            value={phone}
            onChangeText={setPhone}
            iconName="call-outline"
            keyboardType="phone-pad"
            error={errors.phone}
          />
          <CustomInput
            label="Email Address *"
            value={email}
            onChangeText={setEmail}
            iconName="mail-outline"
            keyboardType="email-address"
            error={errors.email}
          />
          <CustomInput
            label="City"
            value={city}
            onChangeText={setCity}
            iconName="location-outline"
          />
          <CustomInput
            label="Saved Address"
            value={address}
            onChangeText={setAddress}
            iconName="home-outline"
            multiline={true}
          />

          <CustomButton
            title="Save Changes"
            onPress={handleSave}
            style={styles.saveBtn}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  topBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  backBtn: { padding: 6 },
  topBarTitle: { fontSize: 18, fontWeight: 'bold', color: '#2D3436' },
  scrollContent: { padding: 16 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    elevation: 3,
  },
  saveBtn: { marginTop: 10, borderRadius: 26 },
});
