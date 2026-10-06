import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../components/Header';
import { Ionicons } from '@expo/vector-icons';
import { Order } from '../types';
import { fetchOrdersFromApi } from '../services/api';
import { useNavigation, DrawerActions } from '@react-navigation/native';

export const OrdersScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<'Current' | 'Past'>('Current');
  const [orders, setOrders] = useState<Order[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadOrders = async () => {
    const data = await fetchOrdersFromApi();
    setOrders(data);
    setRefreshing(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = orders.filter(o => {
    if (activeTab === 'Current') return o.status === 'Processing' || o.status === 'Shipped';
    return o.status === 'Delivered' || o.status === 'Cancelled';
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <Ionicons name="checkmark-circle" size={16} color="#2ED573" />;
      case 'Shipped':
        return <Ionicons name="checkmark-circle" size={16} color="#1E90FF" />;
      case 'Processing':
        return <Ionicons name="time" size={16} color="#FFA502" />;
      default:
        return <Ionicons name="close-circle" size={16} color="#FF4757" />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="My Orders"
        onOpenDrawer={() => navigation.dispatch(DrawerActions.openDrawer())}
      />

      {/* Tabs matching reference image 76138 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Current' && styles.tabButtonActive]}
          onPress={() => setActiveTab('Current')}
        >
          <Text style={[styles.tabText, activeTab === 'Current' && styles.tabTextActive]}>
            Current
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Past' && styles.tabButtonActive]}
          onPress={() => setActiveTab('Past')}
        >
          <Text style={[styles.tabText, activeTab === 'Past' && styles.tabTextActive]}>
            Past
          </Text>
        </TouchableOpacity>
      </View>

      {/* Orders List matching reference 76138 layout */}
      <FlatList
        data={filteredOrders}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadOrders(); }} />}
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderId}>Order #{item.id}</Text>
              <Text style={styles.orderDate}>{item.date}</Text>
            </View>

            <View style={styles.orderBody}>
              <Image source={{ uri: item.image }} style={styles.productImage} resizeMode="cover" />

              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.productName}</Text>
                <Text style={styles.productPrice}>₹{item.price.toLocaleString('en-IN')}</Text>
              </View>

              <View style={styles.statusBadge}>
                {getStatusIcon(item.status)}
                <Text style={[styles.statusText, { color: item.statusColor }]}>
                  {item.status}
                </Text>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="cube-outline" size={50} color="#CBD5E1" />
            <Text style={styles.emptyText}>No {activeTab.toLowerCase()} orders found.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: '#6C5CE7',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#8E8E93',
  },
  tabTextActive: {
    color: '#6C5CE7',
    fontWeight: 'bold',
  },
  listContent: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#F1F2F6',
  },
  orderId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  orderDate: {
    fontSize: 12,
    color: '#8E8E93',
  },
  orderBody: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
  },
  productInfo: {
    flex: 1,
    marginLeft: 14,
  },
  productName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  productPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2D3436',
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  statusText: {
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 12,
    color: '#636E72',
    fontSize: 14,
  },
});
