import { View, Text, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomButton } from '../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

type WelcomeNavProp = StackNavigationProp<RootStackParamList, 'Welcome'>;

export const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<WelcomeNavProp>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.illustrationCard}>
          {/* Shopping bag visual illustration using clean vector style / image */}
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80' }}
            style={styles.heroImage}
            resizeMode="cover"
          />
        </View>

        <Text style={styles.brandTitle}>ShopEase</Text>
        <Text style={styles.taglineMain}>Shop More. Save More.</Text>
        <Text style={styles.taglineSub}>
          Your one-stop destination for all your needs.
        </Text>
      </View>

      <View style={styles.bottomSection}>
        <CustomButton
          title="Get Started"
          onPress={() => navigation.navigate('Login')}
          style={styles.getStartedBtn}
        />

        <View style={styles.paginationDots}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 36,
  },
  topSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  illustrationCard: {
    width: 240,
    height: 240,
    borderRadius: 120,
    overflow: 'hidden',
    backgroundColor: '#E8EAF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    elevation: 5,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  brandTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: '#6C5CE7',
    letterSpacing: 1,
  },
  taglineMain: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3436',
    marginTop: 12,
  },
  taglineSub: {
    fontSize: 14,
    color: '#636E72',
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 20,
  },
  bottomSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  getStartedBtn: {
    borderRadius: 28,
  },
  paginationDots: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DCDDE1',
    marginHorizontal: 4,
  },
  activeDot: {
    width: 20,
    backgroundColor: '#6C5CE7',
  },
});
