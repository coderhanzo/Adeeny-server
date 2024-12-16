// src/redux/slice/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from 'axios';

interface User {
  [x: string]: any;
  first_name: string;
  last_name: string;
  other_name?: string;
  email: string;
  password: string;
  confirm_password: string;
  role: string;
  phone_number:string,
  profile_pic: File | null; 
}

interface AuthState {
  login: boolean;
  error: string | null;
  user: User | null;
  accessToken: string | null;
  currentUser: User | null;
  refreshToken: string | null;
  loading: boolean;
  token: string | null
}

interface LoginPayload {
  email: string;
  password: string;
}

interface otpPayload {
  email: string;
   otp: string;
}

interface TokenResponse {
  access: string;
  refresh: string;
}

interface ApiError {
  detail?: string;
}

// Async thunks
export const createUser = createAsyncThunk<User, User, { rejectValue: ApiError }>(
  'auth/createUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://13.244.112.116:8000/api/auth/users/', userData,

        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      console.log(response,"respomse")
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      if (axiosError.response) {
        return rejectWithValue(axiosError.response.data);
      }
      return rejectWithValue({ detail: 'An unknown error occurred' });
    }
  }
);

export const getCurrentUser = createAsyncThunk<User, string, { rejectValue: ApiError }>(
  'auth/currentUser',
  async (accessToken, { rejectWithValue }) => {

    console.log(accessToken,"curr")
    try {
      const response = await axios.get('http://13.244.112.116:8000/api/auth/users/me/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log(response,"rescurr")
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      if (axiosError.response) {
        return rejectWithValue(axiosError.response.data);
      }
      return rejectWithValue({ detail: 'An unknown error occurred' });
    }
  }
);

export const loginUser = createAsyncThunk<TokenResponse, LoginPayload, { rejectValue: string }>(
  'auth/loginUser',
  async ({email,password}, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://13.244.112.116:8000/api/auth/jwt/create/', {email, password },
        
      );

      console.log(response)
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      if (axiosError.response) {
        const errorMessage = axiosError.response.data.detail || 'An unknown error occurred';
        return rejectWithValue(errorMessage);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const verifyUser = createAsyncThunk<TokenResponse, otpPayload, { rejectValue: string }>(
  'auth/verifyUser',
  async ({email,otp}, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://13.244.112.116:8000/api/auth/verify-otp/', {email,otp },
        
      );

      console.log(response)
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      if (axiosError.response) {
        const errorMessage = axiosError.response.data.detail || 'An unknown error occurred';
        return rejectWithValue(errorMessage);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);


// Slice
const initialState: AuthState = {
  login: false,
  error: null,
  user: null,
  accessToken: null,
  currentUser: null,
  refreshToken: null,
  loading: false,
  token: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.login = true;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.login = true;
      state.user = action.payload;
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.login = false;
      state.accessToken = null;
      state.refreshToken = null;
    },
    loginError: (state, action: PayloadAction<string>) => {
      state.login = false;
      state.error = action.payload;
      state.user = null;
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.login = true;
        state.error = null;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<TokenResponse>) => {
        state.loading = false;
        console.log(action.payload, "access")       
        // state.accessToken = action.payload.access;
        // state.refreshToken = action.payload.refresh;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload ?? 'An unknown error occurred';
      })
      .addCase(verifyUser.fulfilled, (state, action: PayloadAction<TokenResponse>) => {
        state.loading = false;
        console.log(action.payload, "access")       
        state.accessToken = action.payload.access;
        // state.refreshToken = action.payload.refresh;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.login = true;
        state.error = null;
        state.currentUser = action.payload;
        console.log(action.payload, state.currentUser,"jeje")
      })
  },
});

export const { addUser, logout, loginSuccess, loginError } = authSlice.actions;
export default authSlice.reducer;
