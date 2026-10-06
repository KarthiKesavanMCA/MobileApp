import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import { useNavigation, DrawerActions } from '@react-navigation/native';

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user, logout } = useUser();

  const handleLogout = () => {
    Alert.alert('Confirm Logout', 'Are you sure you want to log out of ShopEase?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        },
      },
    ]);
  };

  const menuItems = [
    {
      id: 'addr',
      icon: 'location-outline',
      label: 'Saved Addresses',
      onPress: () => (navigation.getParent() as any)?.navigate('AddressForm'),
    },
    {
      id: 'pay',
      icon: 'card-outline',
      label: 'Payment Methods',
      onPress: () => Alert.alert('Payment Methods', 'UPI, Cards, and Net Banking saved.'),
    },
    {
      id: 'wish',
      icon: 'heart-outline',
      label: 'Wishlist',
      onPress: () => navigation.navigate('CategoriesTab'),
    },
    {
      id: 'state',
      icon: 'layers-outline',
      label: 'State Mgmt Documentation (Exp 4)',
      onPress: () => (navigation.getParent() as any)?.navigate('StateDoc'),
    },
    {
      id: 'feed',
      icon: 'star-outline',
      label: 'Feedback Form (Exp 5 & 6)',
      onPress: () => (navigation.getParent() as any)?.navigate('Feedback'),
    },
    {
      id: 'help',
      icon: 'help-circle-outline',
      label: 'Help & Support',
      onPress: () => Alert.alert('Help & Support', 'Customer Care: support@shopease.com'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header bar matching reference image 76138 */}
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => (navigation.getParent() as any)?.navigate('ProfileEdit')}
        >
          <Ionicons name="create-outline" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* User Card */}
        <View style={styles.profileHeaderCard}>
          <View style={styles.avatarCircle}>
            {user.profilePicture ? (
              <Image source={{ uri: user.profilePicture }} style={styles.avatarImage} />
            ) : (
              <Ionicons name="person" size={50} color="#FFFFFF" />
            )}
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <Text style={styles.userPhone}>{user.phone}</Text>
        </View>

        {/* Menu Items Card */}
        <View style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuRow,
                index === menuItems.length - 1 ? { borderBottomWidth: 0 } : null,
              ]}
              onPress={item.onPress}
            >
              <Ionicons name={item.icon as any} size={22} color="#2D3436" style={styles.menuIcon} />
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color="#8E8E93" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Card */}
        <TouchableOpacity style={styles.logoutCard} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#FF4757" style={{ marginRight: 10 }} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  headerBar: {
    height: 60,
    backgroundColor: '#6C5CE7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    position: 'relative',
    elevation: 4,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  editBtn: {
    position: 'absolute',
    right: 16,
    padding: 6,
  },
  scrollContent: {
    padding: 16,
    alignItems: 'center',
  },
  profileHeaderCard: {
    alignItems: 'center',
    marginVertical: 16,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#9C88FF',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 12,
    elevation: 4,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  userEmail: {
    fontSize: 14,
    color: '#636E72',
    marginTop: 2,
  },
  userPhone: {
    fontSize: 14,
    color: '#636E72',
    marginTop: 2,
  },
  menuCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 6,
    marginVertical: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderColor: '#F1F2F6',
  },
  menuIcon: {
    marginRight: 14,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#2D3436',
  },
  logoutCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    elevation: 2,
  },
  logoutText: {
    color: '#FF4757',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
