import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../types';
import { INITIAL_PRODUCTS } from '../data/sampleData';
import { useCart } from '../context/CartContext';
import { CustomButton } from '../components/CustomButton';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

type ProductDetailNavProp = StackNavigationProp<RootStackParamList, 'ProductDetail'>;

export const ProductDetailScreen: React.FC = () => {
  const navigation = useNavigation<ProductDetailNavProp>();
  const route = useRoute<any>();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  const productId = route.params?.productId;
  const passedProduct = route.params?.product;

  const [product, setProduct] = useState<Product | null>(passedProduct || null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!product && productId) {
      const found = INITIAL_PRODUCTS.find(p => p.id === productId);
      if (found) setProduct(found);
    }
  }, [productId]);

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#2D3436" />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>Product Details</Text>
        </View>
        <View style={styles.notFound}>
          <Text>Product not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isWishlisted = isInWishlist(product.id);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#2D3436" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Product Details</Text>
        <TouchableOpacity onPress={() => toggleWishlist(product)} style={styles.backBtn}>
          <Ionicons
            name={isWishlisted ? 'heart' : 'heart-outline'}
            size={24}
            color={isWishlisted ? '#FF4757' : '#2D3436'}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Large Product Image */}
        <View style={styles.imageCard}>
          <Image source={{ uri: product.image }} style={styles.productImage} resizeMode="cover" />
        </View>

        {/* Product Details Card */}
        <View style={styles.detailsCard}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{product.category}</Text>
          </View>

          <Text style={styles.productName}>{product.name}</Text>

          <View style={styles.ratingRow}>
            <Ionicons name="star" size={18} color="#FFA502" />
            <Text style={styles.ratingText}>{product.rating} (128 reviews)</Text>
            <Text style={styles.stockBadge}>{product.availability || 'In Stock'}</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceText}>₹{product.price.toLocaleString('en-IN')}</Text>
            {product.originalPrice && (
              <Text style={styles.originalPrice}>₹{product.originalPrice.toLocaleString('en-IN')}</Text>
            )}
          </View>

          <Text style={styles.sectionHeader}>Description</Text>
          <Text style={styles.descriptionText}>{product.description}</Text>

          {/* Quantity Selector */}
          <Text style={[styles.sectionHeader, { marginTop: 20 }]}>Quantity</Text>
          <View style={styles.quantityRow}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => setQuantity(prev => Math.max(1, prev - 1))}
            >
              <Ionicons name="remove" size={20} color="#2D3436" />
            </TouchableOpacity>

            <Text style={styles.qtyText}>{quantity}</Text>

            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => setQuantity(prev => prev + 1)}
            >
              <Ionicons name="add" size={20} color="#2D3436" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Footer Bar */}
      <View style={styles.footerBar}>
        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>Total Price</Text>
          <Text style={styles.totalValue}>₹{(product.price * quantity).toLocaleString('en-IN')}</Text>
        </View>
        <CustomButton
          title="Add to Cart"
          onPress={() => {
            addToCart(product, quantity);
            Alert.alert('Cart Updated', `${quantity} x ${product.name} added to your cart!`);
          }}
          style={styles.addToCartBtn}
        />
      </View>
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
    paddingBottom: 90,
  },
  imageCard: {
    width: '100%',
    height: 280,
    backgroundColor: '#FFFFFF',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    padding: 20,
    elevation: 4,
  },
  categoryBadge: {
    backgroundColor: '#E8EAF6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  categoryBadgeText: {
    color: '#6C5CE7',
    fontSize: 12,
    fontWeight: 'bold',
  },
  productName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#636E72',
    marginLeft: 4,
  },
  stockBadge: {
    fontSize: 12,
    color: '#2ED573',
    fontWeight: 'bold',
    marginLeft: 'auto',
    backgroundColor: '#E8FAEF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 14,
    marginBottom: 16,
  },
  priceText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6C5CE7',
  },
  originalPrice: {
    fontSize: 15,
    color: '#B2BEC3',
    textDecorationLine: 'line-through',
    marginLeft: 10,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 6,
  },
  descriptionText: {
    fontSize: 14,
    color: '#636E72',
    lineHeight: 22,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  qtyBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginHorizontal: 20,
  },
  footerBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    elevation: 8,
  },
  totalBox: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 12,
    color: '#636E72',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  addToCartBtn: {
    flex: 1.2,
    height: 48,
    borderRadius: 24,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
