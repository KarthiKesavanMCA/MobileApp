export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount?: number;
  availability: string;
  inStock: boolean;
  stockQuantity?: number;
  image: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  bg: string;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender?: string;
  dob?: string;
  city?: string;
  address: string;
  pincode: string;
  profilePicture?: string;
}

export interface Order {
  id: string;
  date: string;
  productName: string;
  price: number;
  status: 'Delivered' | 'Shipped' | 'Processing' | 'Cancelled';
  statusColor: string;
  image: string;
  paymentMode?: string;
  deliveryAddress?: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  buttonText: string;
  bgGradient: string[];
  image: string;
}

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  MainDrawer: undefined;
  ProductDetail: { productId: string; product?: Product };
  Checkout: undefined;
  ProfileEdit: undefined;
  AddressForm: undefined;
  Feedback: undefined;
  StateDoc: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  CategoriesTab: { categoryName?: string } | undefined;
  CartTab: undefined;
  OrdersTab: undefined;
  ProfileTab: undefined;
};
