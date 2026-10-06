import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import { useNavigation } from '@react-navigation/native';

export const AddressScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user, updateProfile } = useUser();

  const [flatNo, setFlatNo] = useState('123 Green Avenue, Flat 4B');
  const [street, setStreet] = useState('Anna Nagar');
  const [city, setCity] = useState(user.city || 'Chennai');
  const [state, setState] = useState('Tamil Nadu');
  const [pincode, setPincode] = useState(user.pincode || '600040');
  const [addressType, setAddressType] = useState('Home');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    const pinRegex = /^\d{6}$/;

    if (!flatNo.trim()) errs.flatNo = 'Flat/House No. is mandatory';
    if (!street.trim()) errs.street = 'Street/Area is mandatory';
    if (!city.trim()) errs.city = 'City is mandatory';
    if (!state.trim()) errs.state = 'State is mandatory';

    if (!pincode.trim()) {
      errs.pincode = 'Pincode is mandatory';
    } else if (!pinRegex.test(pincode.trim())) {
      errs.pincode = 'Pincode must contain a valid 6-digit numeric value';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveAddress = async () => {
    if (!validate()) return;
    const fullAddress = `${flatNo}, ${street}, ${city}, ${state} - ${pincode}`;
    await updateProfile({ address: fullAddress, pincode, city });
    Alert.alert('Address Saved', 'Your delivery address has been saved successfully.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#2D3436" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Saved Addresses</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Add / Edit Address</Text>
          <CustomInput
            label="House / Flat Number *"
            value={flatNo}
            onChangeText={setFlatNo}
            iconName="home-outline"
            error={errors.flatNo}
          />
          <CustomInput
            label="Street / Area *"
            value={street}
            onChangeText={setStreet}
            iconName="navigate-outline"
            error={errors.street}
          />
          <CustomInput
            label="City *"
            value={city}
            onChangeText={setCity}
            iconName="location-outline"
            error={errors.city}
          />
          <CustomInput
            label="State *"
            value={state}
            onChangeText={setState}
            iconName="map-outline"
            error={errors.state}
          />
          <CustomInput
            label="Pincode *"
            value={pincode}
            onChangeText={setPincode}
            iconName="pin-outline"
            keyboardType="numeric"
            error={errors.pincode}
          />

          <Text style={styles.label}>Address Type</Text>
          <View style={styles.typeRow}>
            {['Home', 'Work', 'Other'].map(type => (
              <TouchableOpacity
                key={type}
                style={[styles.typeChip, addressType === type && styles.typeChipActive]}
                onPress={() => setAddressType(type)}
              >
                <Text style={[styles.typeText, addressType === type && styles.typeTextActive]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <CustomButton
            title="Save Address"
            onPress={handleSaveAddress}
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
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#2D3436', marginBottom: 12 },
  label: { fontSize: 13, fontWeight: '600', color: '#2D3436', marginBottom: 8 },
  typeRow: { flexDirection: 'row', marginBottom: 16 },
  typeChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 10,
  },
  typeChipActive: { backgroundColor: '#6C5CE7', borderColor: '#6C5CE7' },
  typeText: { color: '#636E72', fontWeight: '600' },
  typeTextActive: { color: '#FFFFFF' },
  saveBtn: { marginTop: 10, borderRadius: 26 },
});
