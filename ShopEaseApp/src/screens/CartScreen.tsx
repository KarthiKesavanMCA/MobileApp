import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../components/Header';
import { CustomButton } from '../components/CustomButton';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../types';

type CartNavProp = BottomTabNavigationProp<MainTabParamList, 'CartTab'>;

export const CartScreen: React.FC = () => {
  const navigation = useNavigation<CartNavProp>();
  const { cart, removeFromCart, updateQuantity, subtotal, totalPrice, cartCount } = useCart();

  const deliveryFee = subtotal > 0 ? 50 : 0;

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Shopping Cart"
        onOpenDrawer={() => navigation.dispatch(DrawerActions.openDrawer())}
      />

      {cart.length === 0 ? (
        <View style={styles.emptyCart}>
          <Ionicons name="cart-outline" size={80} color="#CBD5E1" />
          <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
          <Text style={styles.emptySubtitle}>Explore our catalog and add your favorite products!</Text>
          <CustomButton
            title="Browse Products"
            onPress={() => navigation.navigate('HomeTab')}
            style={styles.browseBtn}
          />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <FlatList
            data={cart}
            keyExtractor={item => item.product.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <View style={styles.cartCard}>
                <Image source={{ uri: item.product.image }} style={styles.itemImage} resizeMode="cover" />

                <View style={styles.itemDetails}>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {item.product.name}
                  </Text>
                  <Text style={styles.itemCategory}>{item.product.category}</Text>
                  <Text style={styles.itemPrice}>₹{item.product.price.toLocaleString('en-IN')}</Text>

                  {/* Quantity controls */}
                  <View style={styles.quantityControls}>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => updateQuantity(item.product.id, item.quantity - 1)}
                    >
                      <Ionicons name="remove" size={16} color="#2D3436" />
                    </TouchableOpacity>

                    <Text style={styles.qtyText}>{item.quantity}</Text>

                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => updateQuantity(item.product.id, item.quantity + 1)}
                    >
                      <Ionicons name="add" size={16} color="#2D3436" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.removeBtn}
                      onPress={() => removeFromCart(item.product.id)}
                    >
                      <Ionicons name="trash-outline" size={20} color="#FF4757" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          />

          {/* Order Summary & Checkout Footer */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Order Summary ({cartCount} items)</Text>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>₹{subtotal.toLocaleString('en-IN')}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>₹{deliveryFee.toLocaleString('en-IN')}</Text>
            </View>

            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>₹{totalPrice.toLocaleString('en-IN')}</Text>
            </View>

            <CustomButton
              title="Proceed to Checkout"
              onPress={() => (navigation.getParent() as any)?.navigate('Checkout')}
              style={styles.checkoutBtn}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  listContent: {
    padding: 16,
    paddingBottom: 220,
  },
  cartCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  itemCategory: {
    fontSize: 12,
    color: '#636E72',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6C5CE7',
    marginVertical: 4,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginHorizontal: 12,
    color: '#2D3436',
  },
  removeBtn: {
    marginLeft: 'auto',
    padding: 4,
  },
  summaryCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#636E72',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3436',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6C5CE7',
  },
  checkoutBtn: {
    borderRadius: 26,
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3436',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#636E72',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 24,
  },
  browseBtn: {
    width: 200,
    borderRadius: 24,
  },
});
