import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, ToastAndroid, Platform } from 'react-native';

interface CartContextType {
  cart: CartItem[];
  wishlist: Product[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  cartCount: number;
  subtotal: number;
  totalPrice: number;
  notificationMessage: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotificationMessage(msg);
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    }
    setTimeout(() => {
      setNotificationMessage(null);
    }, 3000);
  };

  // Hydrate Cart & Wishlist from AsyncStorage on start (EXP 8)
  useEffect(() => {
    const loadStoredCartAndWishlist = async () => {
      try {
        const savedCart = await AsyncStorage.getItem('shoppingCart');
        const savedWishlist = await AsyncStorage.getItem('wishlistProducts');
        if (savedCart) setCart(JSON.parse(savedCart));
        if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        console.error('Failed to load cart/wishlist from AsyncStorage', e);
      }
    };
    loadStoredCartAndWishlist();
  }, []);

  // Write-through sync to AsyncStorage on cart change (EXP 4 & 8 requirement)
  useEffect(() => {
    AsyncStorage.setItem('shoppingCart', JSON.stringify(cart)).catch(err =>
      console.error('Error saving cart', err)
    );
  }, [cart]);

  // Write-through sync to AsyncStorage on wishlist change (EXP 8 requirement)
  useEffect(() => {
    AsyncStorage.setItem('wishlistProducts', JSON.stringify(wishlist)).catch(err =>
      console.error('Error saving wishlist', err)
    );
  }, [wishlist]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { product, quantity }];
    });
    showNotification(`Added "${product.name}" to cart`);
  };

  const removeFromCart = (productId: string) => {
    const itemToRemove = cart.find(i => i.product.id === productId);
    setCart(prev => prev.filter(item => item.product.id !== productId));
    if (itemToRemove) {
      showNotification(`Removed "${itemToRemove.product.name}" from cart`);
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (product: Product) => {
    const exists = wishlist.some(p => p.id === product.id);
    if (exists) {
      setWishlist(prev => prev.filter(p => p.id !== product.id));
      showNotification(`Removed "${product.name}" from wishlist`);
    } else {
      setWishlist(prev => [...prev, product]);
      showNotification(`Added "${product.name}" to wishlist`);
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(p => p.id === productId);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const subtotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const totalPrice = subtotal > 0 ? subtotal + 50 : 0; // ₹50 delivery charge

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        cartCount,
        subtotal,
        totalPrice,
        notificationMessage,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
