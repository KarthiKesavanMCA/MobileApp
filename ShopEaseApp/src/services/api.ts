import axios from 'axios';
import { Product, Category, Banner, UserProfile, Order } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_BANNERS, INITIAL_USER, INITIAL_ORDERS } from '../data/sampleData';
import { Platform } from 'react-native';

// Base URL configured for Android Emulator (10.0.2.2 points to host localhost:5000)
const API_BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';

// Configurable Axios instance (EXP 7 requirement)
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fetch products using Fetch API (EXP 7 requirement)
export const fetchProductsFromApi = async (searchQuery?: string, categoryFilter?: string): Promise<Product[]> => {
  try {
    let url = `${API_BASE_URL}/api/products`;
    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    if (categoryFilter) params.append('category', categoryFilter);
    if (params.toString()) url += `?${params.toString()}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.warn('Fetch API product request failed, using local sample dataset:', error);
    // Fallback to local sample dataset if backend is loading or unreachable
    let filtered = [...INITIAL_PRODUCTS];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    if (categoryFilter) {
      filtered = filtered.filter(p => p.category.toLowerCase() === categoryFilter.toLowerCase());
    }
    return filtered;
  }
};

// Fetch categories using Fetch API (EXP 7 requirement)
export const fetchCategoriesFromApi = async (): Promise<Category[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/categories`);
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn('Fetch API categories request failed, using fallback sample categories:', error);
    return INITIAL_CATEGORIES;
  }
};

// Fetch customer profile using Axios (EXP 7 requirement)
export const fetchProfileFromApi = async (): Promise<UserProfile> => {
  try {
    const res = await apiClient.get('/api/profile');
    return res.data;
  } catch (error) {
    console.warn('Axios profile request failed, using fallback user profile:', error);
    return INITIAL_USER;
  }
};

// Fetch promotional banners using Axios (EXP 7 requirement)
export const fetchBannersFromApi = async (): Promise<Banner[]> => {
  try {
    const res = await apiClient.get('/api/banners');
    return res.data;
  } catch (error) {
    console.warn('Axios banner request failed, using fallback banners:', error);
    return INITIAL_BANNERS;
  }
};

// Simulated JWT Login API request (EXP 6 requirement)
export const simulatedJwtLogin = async (email: string, password: string): Promise<{ token: string; user: UserProfile }> => {
  try {
    const res = await apiClient.post('/api/auth/login', { email, password });
    return res.data;
  } catch (error) {
    // If server unreachable, generate client simulated JWT token
    const token = `header.${btoa(JSON.stringify({ email, role: 'customer' }))}.signature`;
    return {
      token,
      user: {
        ...INITIAL_USER,
        email,
      },
    };
  }
};

// Post Order to API (EXP 10 requirement)
export const postOrderToApi = async (orderData: any): Promise<Order> => {
  try {
    const res = await apiClient.post('/api/orders', orderData);
    return res.data;
  } catch (error) {
    console.warn('Post order API failed, creating local order:', error);
    return {
      id: `SE${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      productName: orderData.items?.[0]?.name || 'ShopEase Order',
      price: orderData.totalAmount || 1599,
      status: 'Processing',
      statusColor: '#ffa502',
      image: orderData.items?.[0]?.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
    };
  }
};

// Fetch Orders from API (EXP 10 requirement)
export const fetchOrdersFromApi = async (): Promise<Order[]> => {
  try {
    const res = await apiClient.get('/api/orders');
    return res.data;
  } catch (error) {
    console.warn('Fetch orders failed, using initial orders:', error);
    return INITIAL_ORDERS;
  }
};
