import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface Mosque {
  imam: string;
  location: string;
  name: any;
  id?: string;
  mosqueName: string;
  email: string;
  phone: string;
  imamName: string;
  locationDisplayName: string;
  password?: string;
  role?: string;
  content?: string;
  image: string | null;
  certificate: string;
  donations: any[]; 
  long: string;
  lat: string;
  favourite?: boolean; 
}



interface createMosquePayload {
  mosqueData: FormData;
  token: string | null;
}


interface Donation {
  amount: number;
  donorName: string;
}

interface MosqueState {
  error: string | null;
  mosques: Mosque[];
  donationStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  token: string | null;
  name: string;
  cardResponse: any;
  apimosque: any;
}

const initialState: MosqueState = {
  error: null,
  mosques: [],
  donationStatus: 'idle',
  token: null,
  name: 'no name',
  cardResponse: {},
  apimosque: {},
};

export const createMosque = createAsyncThunk(
  'mosque/createMosque',
  async ({ mosqueData, token }: createMosquePayload, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'http://13.244.112.116:8000/api/v1/create-mosque/',
        mosqueData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getAllMosqueData = createAsyncThunk<Mosque[], string>(
  'mosque/getMosque',
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://13.244.112.116:8000/api/v1/get-all-mosques/', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const nameEnquiry = createAsyncThunk(
  'mosque/nameEnquiry',
  async ({ token, donationDetails }: { token: string; donationDetails: any }) => {
    try {
      const response = await axios.post('https://peoplespay.com.gh/peoplepay/hub/enquiry', donationDetails, {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error: any) {
      console.error(error.response.data);
    }
  }
);

const mosqueSlice = createSlice({
  name: 'mosques',
  initialState,
  reducers: {
    // addMosque: (state, action: PayloadAction<Mosque>) => {
    //   const newMosque: Mosque = {
    //     id: new Date().toISOString() + Math.random().toString(),
    //     mosqueName: action.payload.mosqueName,
    //     email: action.payload.email,
    //     phone: action.payload.phone,
    //     imamName: action.payload.imamName,
    //     locationDisplayName: action.payload.locationDisplayName,
    //     long: action.payload.long,
    //     lat: action.payload.lat,
    //     password: action.payload.password,
    //     role: action.payload.role,
    //     content: action.payload.content,
    //     image: action.payload.image,
    //     certificate: action.payload.certificate,
    //     donations: [],
    //     location: '',
    //      name: undefined,
    //     // imam: undefined
    //   };
    //   state.mosques.push(newMosque);
    // },
    updateMosque: (state, action: PayloadAction<{ id: string; updatedMosque: Partial<Mosque> }>) => {
      const { id, updatedMosque } = action.payload;
      const index = state.mosques.findIndex((mosque) => mosque.id === id);
      if (index !== -1) {
        state.mosques[index] = { ...state.mosques[index], ...updatedMosque };
      }
    },
    addMosqueSuccess: (state) => {
      state.error = null;
    },
    addMosqueFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    addDonationToMosque: (state, action: PayloadAction<{ mosqueId: string; donation: Donation }>) => {
      const { mosqueId, donation } = action.payload;
      const mosque = state.mosques.find((mosque) => mosque.id === mosqueId);
      if (mosque) {
        mosque.donations.push(donation);
      }
    },
    toggleFavourite: (state, action: PayloadAction<{ mosqueId: string }>) => {
      const { mosqueId } = action.payload;
      const mosque = state.mosques.find((mosque) => mosque.id === mosqueId);
      if (mosque) {
        mosque.favourite = !mosque.favourite;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createMosque.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to create mosque';
      })
      .addCase(getAllMosqueData.fulfilled, (state, action: PayloadAction<Mosque[]>) => {
        state.mosques = action.payload;
      });
  },
});

export const {  updateMosque, addMosqueSuccess, addMosqueFailure, addDonationToMosque, toggleFavourite } =
  mosqueSlice.actions;
export default mosqueSlice.reducer;
