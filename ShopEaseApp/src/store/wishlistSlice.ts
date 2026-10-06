import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../types';

interface WishlistState {
  items: Product[];
}

const initialState: WishlistState = {
  items: [],
};

export const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlistItem: (state, action: PayloadAction<Product>) => {
      const exists = state.items.some(p => p.id === action.payload.id);
      if (exists) {
        state.items = state.items.filter(p => p.id !== action.payload.id);
      } else {
        state.items.push(action.payload);
      }
    },
    clearWishlist: (state) => {
      state.items = [];
    },
  },
});

export const { toggleWishlistItem, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
