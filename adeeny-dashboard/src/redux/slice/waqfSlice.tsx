import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface Waqf {
  title: string;
  description: string;
  name: any;
  upload_image?: string;
  imams_name: string;
  payment_type: string;
  target_amount: string;
  phone_number: string;
  start_date: string;
  end_dated: string; 
}



interface createWaqfPayload {
  waqfData: FormData;
  token: string | null;
}


interface WaqfState {
  error: string | null;
  waqfs: Waqf[];
  donationStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  token: string | null;
  name: string;
  cardResponse: any;
  apiWaqf: any;
}

const initialState: WaqfState = {
  error: null,
  waqfs: [],
  donationStatus: 'idle',
  token: null,
  name: 'no name',
  cardResponse: {},
  apiWaqf: {},
};

export const createWaqf = createAsyncThunk(
  'Waqf/createWaqf',
  async ({ waqfData, token }: createWaqfPayload, { rejectWithValue }) => {
    try {
      console.log(waqfData,"wa je")
      const response = await axios.post(
        'http://13.244.112.116:8000/api/v1/create-waqf-donation/',
        waqfData,
      
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      console.log(response,"hh")
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getAllwaqfData = createAsyncThunk<Waqf[], string>(
  'Waqf/getWaqf',
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://13.244.112.116:8000/api/v1/get-all-waqf-donations/', {
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
  'Waqf/nameEnquiry',
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

const waqfSlice = createSlice({
  name: 'Waqfs',
  initialState,
  reducers: {
    // addWaqf: (state, action: PayloadAction<Waqf>) => {
    //   const newWaqf: Waqf = {
    //     id: new Date().toISOString() + Math.random().toString(),
    //     WaqfName: action.payload.WaqfName,
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
    //   state.Waqfs.push(newWaqf);
    // },
    // updateWaqf: (state, action: PayloadAction<{ id: string; updatedWaqf: Partial<Waqf> }>) => {
    //   const { id, updatedWaqf } = action.payload;
    //   const index = state.waqfs.findIndex((waqf) => waqf.id === id);
    //   if (index !== -1) {
    //     state.waqfs[index] = { ...state.waqfs[index], ...updatedWaqf };
    //   }
    // },
    // addWaqfSuccess: (state) => {
    //   state.error = null;
    // },
    // addWaqfFailure: (state, action: PayloadAction<string>) => {
    //   state.error = action.payload;
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createWaqf.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to create Waqf';
      })
      .addCase(getAllwaqfData.fulfilled, (state, action: PayloadAction<Waqf[]>) => {
        state.waqfs = action.payload;
      });
  },
});

export const {   } = waqfSlice.actions;
export default waqfSlice.reducer;
