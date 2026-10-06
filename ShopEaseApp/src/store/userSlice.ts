import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile } from '../types';
import { INITIAL_USER } from '../data/sampleData';

interface UserState {
  profile: UserProfile;
  isAuthenticated: boolean;
  token: string | null;
}

const initialState: UserState = {
  profile: INITIAL_USER,
  isAuthenticated: false,
  token: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    logoutUser: (state) => {
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setProfile, setToken, logoutUser } = userSlice.actions;
export default userSlice.reducer;
