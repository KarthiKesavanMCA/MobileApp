import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../components/Header';
import { ProductCard } from '../components/ProductCard';
import { CategoryCard } from '../components/CategoryCard';
import { Ionicons } from '@expo/vector-icons';
import { Product, Category } from '../types';
import { fetchProductsFromApi, fetchCategoriesFromApi } from '../services/api';
import { useNavigation, useRoute, DrawerActions } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../types';

type CategoryNavProp = BottomTabNavigationProp<MainTabParamList, 'CategoriesTab'>;

export const CategoryExplorerScreen: React.FC = () => {
  const navigation = useNavigation<CategoryNavProp>();
  const route = useRoute<any>();

  const initialCat = route.params?.categoryName || 'All';
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCat);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (route.params?.categoryName) {
      setSelectedCategory(route.params.categoryName);
    }
  }, [route.params?.categoryName]);

  useEffect(() => {
    const loadCategories = async () => {
      const data = await fetchCategoriesFromApi();
      setCategories(data);
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const catParam = selectedCategory === 'All' ? undefined : selectedCategory;
      const data = await fetchProductsFromApi(searchText, catParam);
      setProducts(data);
      setLoading(false);
    };
    loadProducts();
  }, [selectedCategory, searchText]);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Categories"
        onOpenDrawer={() => navigation.dispatch(DrawerActions.openDrawer())}
        onCartPress={() => navigation.navigate('CartTab')}
      />

      {/* Search Input */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={20} color="#8E8E93" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search categories or products..."
          placeholderTextColor="#A4B0BE"
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText !== '' && (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <Ionicons name="close-circle" size={18} color="#8E8E93" />
          </TouchableOpacity>
        )}
      </View>

      {/* Horizontal Category Selector Filter */}
      <View style={styles.categoryPillList}>
        <ScrollViewHorizontal
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </View>

      {/* Grid of Categories or Products using FlatList (EXP 2 requirement) */}
      <FlatList
        data={products}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() =>
              (navigation.getParent() as any)?.navigate('ProductDetail', {
                productId: item.id,
                product: item,
              })
            }
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Ionicons name="bag-handle-outline" size={48} color="#CBD5E1" />
            <Text style={styles.emptyText}>No products found in this category.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const ScrollViewHorizontal: React.FC<{
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (name: string) => void;
}> = ({ categories, selectedCategory, onSelectCategory }) => {
  const allCategories = [{ id: 'all', name: 'All', icon: 'apps-outline', bg: '', image: '' }, ...categories];

  return (
    <FlatList
      horizontal
      data={allCategories}
      showsHorizontalScrollIndicator={false}
      keyExtractor={item => item.id}
      contentContainerStyle={{ paddingHorizontal: 16 }}
      renderItem={({ item }) => {
        const isSelected = selectedCategory === item.name;
        return (
          <TouchableOpacity
            style={[styles.pill, isSelected && styles.pillSelected]}
            onPress={() => onSelectCategory(item.name)}
          >
            <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 48,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#2D3436',
  },
  categoryPillList: {
    marginVertical: 12,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    marginRight: 10,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  pillSelected: {
    backgroundColor: '#6C5CE7',
    borderColor: '#6C5CE7',
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#636E72',
  },
  pillTextSelected: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  emptyBox: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 12,
    color: '#636E72',
    fontSize: 14,
  },
});
