import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export const StateDocScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#2D3436" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>State Management Lab Record</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.title}>Experiment 4: State Management Comparison</Text>
          <Text style={styles.subtitle}>
            Observations on useState, Context API, and Redux Toolkit in ShopEase
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionHeader}>1. Local Hooks (useState & useEffect)</Text>
            <Text style={styles.bodyText}>
              • <Text style={{ fontWeight: 'bold' }}>useState</Text>: Used for component-level UI state such as input text field values, selected category filter pill, modal open/close states, and form fields.
            </Text>
            <Text style={styles.bodyText}>
              • <Text style={{ fontWeight: 'bold' }}>useEffect</Text>: Used for initial product dataset loading, search query debounce, and triggering Toast notifications when items are added to cart.
            </Text>
            <Text style={styles.benefitText}>
              ✓ Ideal for isolated screen logic without prop drilling overhead.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeader}>2. Context API (UserContext & CartContext)</Text>
            <Text style={styles.bodyText}>
              • <Text style={{ fontWeight: 'bold' }}>UserContext</Text>: Shares authenticated user profile, session token, and login status across navigation screens.
            </Text>
            <Text style={styles.bodyText}>
              • <Text style={{ fontWeight: 'bold' }}>CartContext</Text>: Shares cart items list, wishlist items, subtotal calculation, and live cart badge count across the Bottom Tab bar.
            </Text>
            <Text style={styles.benefitText}>
              ✓ Eliminates deep prop drilling across React Navigation stacks cleanly.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeader}>3. Redux Toolkit (userSlice, cartSlice, wishlistSlice)</Text>
            <Text style={styles.bodyText}>
              • <Text style={{ fontWeight: 'bold' }}>Store & Provider</Text>: Configured in <Text style={styles.codeText}>src/store/index.ts</Text> wrapping the application.
            </Text>
            <Text style={styles.bodyText}>
              • <Text style={{ fontWeight: 'bold' }}>useSelector & useDispatch</Text>: Used for scalable, immutable global state transitions with action dispatches.
            </Text>
            <Text style={styles.benefitText}>
              ✓ Best for large scale enterprise applications with time-travel debugging and predictable state flow.
            </Text>
          </View>

          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>Lab Conclusion</Text>
            <Text style={styles.summaryText}>
              In ShopEase, useState handles screen-specific transient data, Context API powers lightweight cross-screen cart/user data, while Redux Toolkit provides an enterprise-ready global state store.
            </Text>
          </View>
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
  title: { fontSize: 18, fontWeight: 'bold', color: '#6C5CE7' },
  subtitle: { fontSize: 13, color: '#636E72', marginTop: 4, marginBottom: 16 },
  section: { marginBottom: 16, borderBottomWidth: 1, borderColor: '#F1F2F6', paddingBottom: 12 },
  sectionHeader: { fontSize: 15, fontWeight: 'bold', color: '#2D3436', marginBottom: 6 },
  bodyText: { fontSize: 13, color: '#2D3436', lineHeight: 20, marginBottom: 4 },
  benefitText: { fontSize: 12, color: '#2ED573', fontWeight: 'bold', marginTop: 4 },
  codeText: { fontFamily: 'monospace', backgroundColor: '#F8F9FA', color: '#6C5CE7' },
  summaryBox: {
    backgroundColor: '#F3F0FF',
    padding: 16,
    borderRadius: 14,
    marginTop: 8,
  },
  summaryTitle: { fontSize: 14, fontWeight: 'bold', color: '#6C5CE7', marginBottom: 4 },
  summaryText: { fontSize: 13, color: '#2D3436', lineHeight: 18 },
});
