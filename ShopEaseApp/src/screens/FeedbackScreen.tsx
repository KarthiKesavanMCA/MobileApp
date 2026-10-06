import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import { useNavigation } from '@react-navigation/native';

export const FeedbackScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user } = useUser();

  const [name, setName] = useState(user.name || '');
  const [rating, setRating] = useState(0);
  const [suggestions, setSuggestions] = useState('');
  const [recommend, setRecommend] = useState(true);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Name is mandatory';
    if (rating === 0) errs.rating = 'Please select a star rating (1–5) before submitting';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    Alert.alert(
      'Feedback Submitted',
      `Thank you ${name} for your ${rating}-star feedback! We appreciate your suggestions.`,
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#2D3436" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>App Feedback</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Share Your Experience</Text>

          <CustomInput
            label="Your Name *"
            value={name}
            onChangeText={setName}
            iconName="person-outline"
            error={errors.name}
          />

          <Text style={styles.label}>Rating (1–5 Stars) *</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map(star => (
              <TouchableOpacity key={star} onPress={() => setRating(star)} style={styles.starBtn}>
                <Ionicons
                  name={star <= rating ? 'star' : 'star-outline'}
                  size={32}
                  color={star <= rating ? '#FFA502' : '#8E8E93'}
                />
              </TouchableOpacity>
            ))}
          </View>
          {errors.rating && <Text style={styles.errorText}>{errors.rating}</Text>}

          <CustomInput
            label="Suggestions & Comments"
            value={suggestions}
            onChangeText={setSuggestions}
            placeholder="Tell us what you liked or how we can improve..."
            iconName="chatbox-outline"
            multiline={true}
          />

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Would you recommend ShopEase to friends?</Text>
            <Switch
              value={recommend}
              onValueChange={setRecommend}
              trackColor={{ false: '#DCDDE1', true: '#9C88FF' }}
              thumbColor={recommend ? '#6C5CE7' : '#F5F6FA'}
            />
          </View>

          <CustomButton
            title="Submit Feedback"
            onPress={handleSubmit}
            style={styles.submitBtn}
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
  starsRow: { flexDirection: 'row', justifyContent: 'center', marginVertical: 10 },
  starBtn: { padding: 6 },
  errorText: { color: '#FF4757', fontSize: 12, textAlign: 'center', marginBottom: 10 },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 14,
  },
  switchLabel: { flex: 1, fontSize: 14, color: '#2D3436', marginRight: 10 },
  submitBtn: { marginTop: 10, borderRadius: 26 },
});
