import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../components/Header';
import { ProductCard } from '../components/ProductCard';
import { CategoryCard } from '../components/CategoryCard';
import { Banner } from '../components/Banner';
import { Ionicons } from '@expo/vector-icons';
import { Product, Category, Banner as BannerType } from '../types';
import { fetchProductsFromApi, fetchCategoriesFromApi, fetchBannersFromApi } from '../services/api';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../types';

type HomeNavProp = BottomTabNavigationProp<MainTabParamList, 'HomeTab'>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeNavProp>();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<BannerType[]>([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load sample / API products using useEffect (EXP 4 & 7 requirement)
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [prodData, catData, bannerData] = await Promise.all([
        fetchProductsFromApi(searchText),
        fetchCategoriesFromApi(),
        fetchBannersFromApi(),
      ]);
      setProducts(prodData);
      setCategories(catData);
      setBanners(bannerData);
    } catch (err: any) {
      setError('Failed to fetch store data. Please check your internet connection.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchText]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header component */}
      <Header
        title="ShopEase"
        onOpenDrawer={() => navigation.dispatch(DrawerActions.openDrawer())}
        onCartPress={() => navigation.navigate('CartTab')}
        onNotificationPress={() => Alert.alert('Notifications', 'No new notifications')}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#6C5CE7']} />}
      >
        {/* Search Bar (EXP 4 live search requirement) */}
        <View style={styles.searchBarContainer}>
          <Ionicons name="search-outline" size={20} color="#8E8E93" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor="#A4B0BE"
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText ? (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Ionicons name="close-circle" size={18} color="#8E8E93" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity>
              <Ionicons name="options-outline" size={20} color="#6C5CE7" />
            </TouchableOpacity>
          )}
        </View>

        {/* Loading Indicator (EXP 7 requirement) */}
        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6C5CE7" />
            <Text style={styles.loadingText}>Loading catalog...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={40} color="#FF4757" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={loadData}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Mega Sale Promotional Banner (reference 76135) */}
            {banners.length > 0 && (
              <Banner
                banner={banners[0]}
                onPress={() => navigation.navigate('CategoriesTab')}
              />
            )}

            {/* Categories Section */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Categories</Text>
              <TouchableOpacity onPress={() => navigation.navigate('CategoriesTab')}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={categories}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.id}
              contentContainerStyle={{ paddingHorizontal: 16 }}
              renderItem={({ item }) => (
                <CategoryCard
                  category={item}
                  variant="circle"
                  onPress={() => navigation.navigate('CategoriesTab', { categoryName: item.name })}
                />
              )}
            />

            {/* Featured Products Section */}
            <View style={[styles.sectionHeader, { marginTop: 24 }]}>
              <Text style={styles.sectionTitle}>
                {searchText ? `Search Results (${products.length})` : 'Featured Products'}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('CategoriesTab')}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            {products.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="search-outline" size={48} color="#CBD5E1" />
                <Text style={styles.emptyText}>No products found for "{searchText}"</Text>
              </View>
            ) : (
              <View style={styles.gridContainer}>
                {products.map(item => (
                  <View key={item.id} style={styles.gridColumn}>
                    <ProductCard
                      product={item}
                      onPress={() =>
                        (navigation.getParent() as any)?.navigate('ProductDetail', {
                          productId: item.id,
                          product: item,
                        })
                      }
                    />
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 48,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#2D3436',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#6C5CE7',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
  },
  gridColumn: {
    width: '50%',
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#636E72',
  },
  errorContainer: {
    padding: 30,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#FF4757',
    textAlign: 'center',
    marginVertical: 12,
  },
  retryBtn: {
    backgroundColor: '#6C5CE7',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    color: '#636E72',
    fontSize: 14,
    marginTop: 8,
  },
});
