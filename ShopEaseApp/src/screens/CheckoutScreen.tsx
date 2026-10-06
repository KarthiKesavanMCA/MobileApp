import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { postOrderToApi } from '../services/api';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

type CheckoutNavProp = StackNavigationProp<RootStackParamList, 'Checkout'>;

export const CheckoutScreen: React.FC = () => {
  const navigation = useNavigation<CheckoutNavProp>();
  const { cart, subtotal, totalPrice, clearCart } = useCart();
  const { user } = useUser();

  const [customerName, setCustomerName] = useState(user.name || 'Karthi Kesavan');
  const [deliveryAddress, setDeliveryAddress] = useState(user.address || '123 Green Avenue, Flat 4B, Chennai');
  const [paymentMode, setPaymentMode] = useState<string>('Cash on Delivery');
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!customerName.trim()) errs.customerName = 'Customer Name is mandatory';
    if (!deliveryAddress.trim()) errs.deliveryAddress = 'Delivery Address is mandatory';
    if (!paymentMode) errs.paymentMode = 'Payment Mode must be selected';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      // Create order via API (EXP 10 requirement)
      const orderPayload = {
        items: cart.map(i => i.product),
        totalAmount: totalPrice,
        paymentMode,
        deliveryAddress,
      };

      const newOrder = await postOrderToApi(orderPayload);
      clearCart();

      Alert.alert(
        'Order Placed Successfully!',
        `Order ID #${newOrder.id} has been placed via ${paymentMode}.\nEstimated Delivery: 2-3 Days.`,
        [
          {
            text: 'View Orders',
            onPress: () => navigation.replace('MainDrawer'),
          },
        ]
      );
    } catch (err: any) {
      Alert.alert('Order Failed', err.message || 'Could not place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#2D3436" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Confirm Order</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Customer Information Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Shipping Details</Text>
          <CustomInput
            label="Customer Name *"
            value={customerName}
            onChangeText={setCustomerName}
            iconName="person-outline"
            error={errors.customerName}
          />
          <CustomInput
            label="Delivery Address *"
            value={deliveryAddress}
            onChangeText={setDeliveryAddress}
            iconName="location-outline"
            multiline={true}
            error={errors.deliveryAddress}
          />
        </View>

        {/* Payment Mode Selection Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment Method</Text>
          {['UPI / Google Pay', 'Credit / Debit Card', 'Net Banking', 'Cash on Delivery'].map(mode => (
            <TouchableOpacity
              key={mode}
              style={[styles.paymentOption, paymentMode === mode && styles.paymentOptionActive]}
              onPress={() => setPaymentMode(mode)}
            >
              <Ionicons
                name={paymentMode === mode ? 'radio-button-on' : 'radio-button-off'}
                size={20}
                color={paymentMode === mode ? '#6C5CE7' : '#8E8E93'}
              />
              <Text style={[styles.paymentText, paymentMode === mode && styles.paymentTextActive]}>
                {mode}
              </Text>
            </TouchableOpacity>
          ))}
          {errors.paymentMode && <Text style={styles.errorText}>{errors.paymentMode}</Text>}
        </View>

        {/* Order Summary Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order Items</Text>
          {cart.map(item => (
            <View key={item.product.id} style={styles.itemRow}>
              <Text style={styles.itemQty}>{item.quantity}x</Text>
              <Text style={styles.itemName} numberOfLines={1}>
                {item.product.name}
              </Text>
              <Text style={styles.itemPrice}>₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</Text>
            </View>
          ))}

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryVal}>₹{subtotal.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery</Text>
            <Text style={styles.summaryVal}>₹50</Text>
          </View>
          <View style={[styles.summaryRow, { marginTop: 6 }]}>
            <Text style={styles.totalLabel}>Total Payable</Text>
            <Text style={styles.totalVal}>₹{totalPrice.toLocaleString('en-IN')}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <CustomButton
          title="Place Order"
          onPress={handlePlaceOrder}
          loading={loading}
          style={styles.placeOrderBtn}
        />

        <CustomButton
          title="Cancel"
          onPress={() => navigation.goBack()}
          variant="outline"
          style={styles.cancelBtn}
        />
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
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 12,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
    backgroundColor: '#F8F9FA',
  },
  paymentOptionActive: {
    borderColor: '#6C5CE7',
    backgroundColor: '#F3F0FF',
  },
  paymentText: {
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3436',
  },
  paymentTextActive: {
    color: '#6C5CE7',
  },
  errorText: {
    color: '#FF4757',
    fontSize: 12,
    marginTop: 4,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemQty: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#6C5CE7',
    width: 30,
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    color: '#2D3436',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  summaryLabel: {
    color: '#636E72',
    fontSize: 14,
  },
  summaryVal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3436',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  totalVal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6C5CE7',
  },
  placeOrderBtn: {
    marginTop: 8,
    borderRadius: 26,
  },
  cancelBtn: {
    marginTop: 10,
    borderRadius: 26,
  },
});
