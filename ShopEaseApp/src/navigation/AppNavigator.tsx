import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList, MainTabParamList } from '../types';

// Import Screens
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { CategoryExplorerScreen } from '../screens/CategoryExplorerScreen';
import { ProductDetailScreen } from '../screens/ProductDetailScreen';
import { CartScreen } from '../screens/CartScreen';
import { CheckoutScreen } from '../screens/CheckoutScreen';
import { OrdersScreen } from '../screens/OrdersScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { ProfileEditScreen } from '../screens/ProfileEditScreen';
import { AddressScreen } from '../screens/AddressScreen';
import { FeedbackScreen } from '../screens/FeedbackScreen';
import { StateDocScreen } from '../screens/StateDocScreen';

import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const Drawer = createDrawerNavigator();

// 1. Bottom Tab Navigator (5 equally spaced tabs matching reference images)
const BottomTabNavigator: React.FC = () => {
  const { cartCount } = useCart();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6C5CE7',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
          backgroundColor: '#FFFFFF',
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="CategoriesTab"
        component={CategoryExplorerScreen}
        options={{
          tabBarLabel: 'Categories',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="CartTab"
        component={CartScreen}
        options={{
          tabBarLabel: 'Cart',
          tabBarBadge: cartCount > 0 ? cartCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: '#FF4757',
            color: '#FFFFFF',
            fontSize: 10,
            fontWeight: 'bold',
          },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="OrdersTab"
        component={OrdersScreen}
        options={{
          tabBarLabel: 'Orders',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="clipboard-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Custom Drawer Content
const CustomDrawerContent = (props: any) => {
  const { user, logout } = useUser();

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <View style={drawerStyles.headerCard}>
        <View style={drawerStyles.avatarCircle}>
          {user.profilePicture ? (
            <Image source={{ uri: user.profilePicture }} style={drawerStyles.avatarImg} />
          ) : (
            <Ionicons name="person" size={36} color="#FFFFFF" />
          )}
        </View>
        <Text style={drawerStyles.userName}>{user.name}</Text>
        <Text style={drawerStyles.userEmail}>{user.email}</Text>
      </View>

      <View style={{ flex: 1, paddingTop: 10 }}>
        <DrawerItemList {...props} />
      </View>

      <View style={drawerStyles.footer}>
        <DrawerItem
          label="Logout"
          icon={({ color, size }) => <Ionicons name="log-out-outline" size={size} color="#FF4757" />}
          labelStyle={{ color: '#FF4757', fontWeight: 'bold' }}
          onPress={async () => {
            await logout();
            props.navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }}
        />
      </View>
    </DrawerContentScrollView>
  );
};

const drawerStyles = StyleSheet.create({
  headerCard: {
    backgroundColor: '#6C5CE7',
    padding: 20,
    paddingTop: 40,
    alignItems: 'flex-start',
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#9C88FF',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 10,
  },
  avatarImg: { width: '100%', height: '100%' },
  userName: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  userEmail: { color: '#E8EAF6', fontSize: 13, marginTop: 2 },
  footer: {
    borderTopWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 10,
  },
});

// 2. Drawer Navigator (EXP 3 requirement)
const DrawerNavigator: React.FC = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: '#6C5CE7',
        drawerLabelStyle: { fontWeight: '600', marginLeft: -10 },
      }}
    >
      <Drawer.Screen
        name="ShopEaseHome"
        component={BottomTabNavigator}
        options={{
          drawerLabel: 'Home',
          drawerIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="OrderHistoryDrawer"
        component={OrdersScreen}
        options={{
          drawerLabel: 'Order History',
          drawerIcon: ({ color, size }) => <Ionicons name="receipt-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="AddressesDrawer"
        component={AddressScreen}
        options={{
          drawerLabel: 'Saved Addresses',
          drawerIcon: ({ color, size }) => <Ionicons name="location-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="FeedbackDrawer"
        component={FeedbackScreen}
        options={{
          drawerLabel: 'Feedback & Ratings',
          drawerIcon: ({ color, size }) => <Ionicons name="chatbox-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="StateDocDrawer"
        component={StateDocScreen}
        options={{
          drawerLabel: 'State Mgmt Documentation',
          drawerIcon: ({ color, size }) => <Ionicons name="layers-outline" size={size} color={color} />,
        }}
      />
    </Drawer.Navigator>
  );
};

// 3. Main Stack Navigator
export const AppNavigator: React.FC = () => {
  const { isLoggedIn } = useUser();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isLoggedIn ? 'MainDrawer' : 'Welcome'}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="MainDrawer" component={DrawerNavigator} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
        <Stack.Screen name="AddressForm" component={AddressScreen} />
        <Stack.Screen name="Feedback" component={FeedbackScreen} />
        <Stack.Screen name="StateDoc" component={StateDocScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
