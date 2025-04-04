import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/axiosInstance';

interface Tourist {
  firstName: string;
  lastName: string;
  email: string;
  lastActive: number;
  loggedIn: boolean;
  purchases: number;
}

interface AddTourist {
  firstName: string;
  lastName: string;
  email: string;
}

interface TouristState {
  tourists: Tourist[];
  loading: boolean;
  error: string | null;
}

const initialState: TouristState = {
  tourists: [],
  loading: false,
  error: null,
};

export const fetchTourists = createAsyncThunk(
  'tourists/fetchTourists',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/agencies/users');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tourists');
    }
  }
);

export const createTourist = createAsyncThunk(
  'tourists/createTourist',
  async (touristData: AddTourist, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/agencies/users', touristData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create tourist');
    }
  }
);

const touristSlice = createSlice({
  name: 'tourists',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTourists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTourists.fulfilled, (state, action) => {
        state.loading = false;
        state.tourists = action.payload.map((user: any) => ({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          lastActive: user.lastActive,
          loggedIn: user.loggedIn,
          purchases: user.purchases || 0,
        }));
      })
      .addCase(fetchTourists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createTourist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTourist.fulfilled, (state, action) => {
        state.loading = false;
        state.tourists.push({
          firstName: action.payload.firstName,
          lastName: action.payload.lastName,
          email: action.payload.email,
          lastActive: action.payload.lastActive,
          loggedIn: action.payload.loggedIn,
          purchases: action.payload.purchases || 0,
        });
      })
      .addCase(createTourist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default touristSlice.reducer; 