// src/features/links/linksSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  links: [], // Array of link objects from API
  selectedLinkStats: null, // For chart data { clicksOverTime: [], deviceBrowserStats: {} }
  selectedLinkQRCode: null, // Data URL for QR code
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalLinks: 0,
  },
  statsStatus: 'idle', // Separate status for loading stats/QR
  statsError: null,
};

// Thunk to Fetch Links (with pagination/search)
export const fetchLinks = createAsyncThunk(
  'links/fetchLinks',
  async ({ page = 1, limit = 10, search = '' } = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/links', { params: { page, limit, search } });
      return data; // Expects { links: [], currentPage: 1, totalPages: 1, totalLinks: 0 }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch links';
      return rejectWithValue(message);
    }
  }
);

// Thunk to Create Link
export const createLink = createAsyncThunk(
  'links/createLink',
  async (linkData, { rejectWithValue, dispatch }) => { // { originalUrl, customAlias?, expiresAt? }
    try {
      const { data } = await api.post('/links', linkData);
      // Option 1: Re-fetch the first page after creation to ensure list is updated
      dispatch(fetchLinks({ page: 1 }));
      // Option 2: Manually add the link (less robust if sorting/filtering applied)
      // return data; // The newly created link object from API
      return { success: true, message: 'Link created successfully!' }; // Return success feedback
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to create link';
      return rejectWithValue(message);
    }
  }
);

// Thunk to Fetch Stats for a specific link
export const fetchLinkStats = createAsyncThunk(
  'links/fetchLinkStats',
  async (linkId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/links/${linkId}/stats`);
      return data; // Expects { clicksOverTime: [], deviceBrowserStats: {} }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch stats';
      return rejectWithValue(message);
    }
  }
);

// Thunk to Fetch QR Code for a specific link (Bonus)
export const fetchQRCode = createAsyncThunk(
  'links/fetchQRCode',
  async (linkId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/links/${linkId}/qr`);
      return data.qrCodeDataURL; // Expects { qrCodeDataURL: "data:image/png;base64,..." }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch QR code';
      return rejectWithValue(message);
    }
  }
);

const linksSlice = createSlice({
  name: 'links',
  initialState,
  reducers: {
    // Reducer to clear stats/QR when modal closes or selection changes
    clearSelectedLinkData: (state) => {
        state.selectedLinkStats = null;
        state.selectedLinkQRCode = null;
        state.statsStatus = 'idle';
        state.statsError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Links Cases
      .addCase(fetchLinks.pending, (state) => {
        state.status = 'loading';
        state.error = null; // Clear previous errors
      })
      .addCase(fetchLinks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.links = action.payload.links;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalLinks: action.payload.totalLinks,
        };
      })
      .addCase(fetchLinks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Create Link Cases (only handle status/error, data handled by re-fetch)
      .addCase(createLink.pending, (state) => {
        state.status = 'loading'; // Or a different status like 'creating'
        state.error = null;
      })
      .addCase(createLink.fulfilled, (state) => {
        // Status might be reset by the subsequent fetchLinks call, or set it back to 'idle'/'succeeded' here if needed.
        // state.status = 'succeeded'; // If not re-fetching immediately
        // Optional: If not re-fetching, manually add link: state.links.unshift(action.payload);
      })
      .addCase(createLink.rejected, (state, action) => {
        state.status = 'failed'; // Or back to 'idle'/'succeeded' depending on UX
        state.error = action.payload;
      })
      // Fetch Link Stats Cases
       .addCase(fetchLinkStats.pending, (state) => {
         state.statsStatus = 'loading';
         state.statsError = null;
         state.selectedLinkStats = null; // Clear old stats
       })
       .addCase(fetchLinkStats.fulfilled, (state, action) => {
         state.statsStatus = 'succeeded';
         state.selectedLinkStats = action.payload;
       })
       .addCase(fetchLinkStats.rejected, (state, action) => {
         state.statsStatus = 'failed';
         state.statsError = action.payload;
       })
      // Fetch QR Code Cases
       .addCase(fetchQRCode.pending, (state) => {
         state.statsStatus = 'loading'; // Use same status or a dedicated one
         state.statsError = null;
         state.selectedLinkQRCode = null; // Clear old QR
       })
       .addCase(fetchQRCode.fulfilled, (state, action) => {
         state.statsStatus = 'succeeded';
         state.selectedLinkQRCode = action.payload;
       })
       .addCase(fetchQRCode.rejected, (state, action) => {
         state.statsStatus = 'failed';
         state.statsError = action.payload;
       });
  },
});

export const { clearSelectedLinkData } = linksSlice.actions;
export default linksSlice.reducer;