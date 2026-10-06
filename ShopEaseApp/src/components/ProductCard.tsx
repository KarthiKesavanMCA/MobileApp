import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const isWishlisted = isInWishlist(product.id);

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.image }} style={styles.productImage} resizeMode="cover" />
        <TouchableOpacity
          style={styles.wishlistButton}
          onPress={() => toggleWishlist(product)}
        >
          <Ionicons
            name={isWishlisted ? 'heart' : 'heart-outline'}
            size={18}
            color={isWishlisted ? '#FF4757' : '#FF4757'}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.productName} numberOfLines={1}>
          {product.name}
        </Text>

        <View style={styles.ratingRow}>
          <Ionicons name="star" size={14} color="#FFA502" />
          <Text style={styles.ratingText}>{product.rating}</Text>
          {product.availability && (
            <Text style={styles.stockBadge}>{product.availability}</Text>
          )}
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.priceText}>₹{product.price.toLocaleString('en-IN')}</Text>
          {product.originalPrice && (
            <Text style={styles.originalPrice}>₹{product.originalPrice.toLocaleString('en-IN')}</Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.addCartBtn}
          onPress={() => addToCart(product, 1)}
        >
          <Ionicons name="cart-outline" size={16} color="#FFFFFF" style={{ marginRight: 4 }} />
          <Text style={styles.addCartText}>Add</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    margin: 6,
    padding: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    height: 130,
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F8F9FA',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  wishlistButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 15,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  detailsContainer: {
    marginTop: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#636E72',
    marginLeft: 3,
  },
  stockBadge: {
    fontSize: 10,
    color: '#2ED573',
    fontWeight: 'bold',
    marginLeft: 'auto',
    backgroundColor: '#E8FAEF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 6,
  },
  priceText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  originalPrice: {
    fontSize: 11,
    color: '#B2BEC3',
    textDecorationLine: 'line-through',
    marginLeft: 6,
  },
  addCartBtn: {
    marginTop: 8,
    backgroundColor: '#6C5CE7',
    borderRadius: 8,
    paddingVertical: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addCartText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
