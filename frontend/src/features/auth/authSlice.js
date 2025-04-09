import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api'; // Import configured Axios instance

// Attempt to load user info from local storage on initial load
const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const initialState = {
  userInfo: userInfoFromStorage,
  loading: false,
  error: null,
};

// Async thunk for login action
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('userInfo', JSON.stringify(data)); // Save user info + token
      return data;
    } catch (error) {
       const message = error.response?.data?.message || error.message || 'Login failed';
       return rejectWithValue(message);
    }
  }
);

// Simple logout action (sync)
export const logout = createAsyncThunk('auth/logout', async () => {
    localStorage.removeItem('userInfo');
    // Optional: Could add an API call here if the backend needs to invalidate the token server-side
});


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
     // Potential sync reducers if needed
     // logout: (state) => {
     //  localStorage.removeItem('userInfo');
     //  state.userInfo = null;
     //  state.error = null;
     // },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Error message from rejectWithValue
        state.userInfo = null;
      })
      // Logout case (from createAsyncThunk)
      .addCase(logout.fulfilled, (state) => {
          state.userInfo = null;
          state.error = null;
          state.loading = false; // Reset loading just in case
      });
  },
});

// Export reducer and actions
// export const { logout } = authSlice.actions; // If using sync reducer for logout
export default authSlice.reducer;