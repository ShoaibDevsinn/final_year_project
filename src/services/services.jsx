// src/services/services.jsx
import axios from 'axios';

// API Base URL
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// ✅ Create publicClient for endpoints that don't need authentication
const publicClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Create apiClient for endpoints that need authentication
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Request interceptor to add auth token (ONLY to apiClient)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh (ONLY for apiClient)
// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // ✅ Handle 401 without redirect
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          // No refresh token, redirect to login
          localStorage.clear();
          window.location.href = 'http://localhost:5173/sign_in';
          return Promise.reject(error);
        }
        
        const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
          refresh_token: refreshToken
        });
        
        if (response.data.success) {
          localStorage.setItem('access_token', response.data.access_token);
          originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
          return apiClient(originalRequest);
        } else {
          // Refresh failed, redirect to login
          localStorage.clear();
          window.location.href = 'http://localhost:5173/sign_in';
          return Promise.reject(error);
        }
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = 'http://localhost:5173/sign_in';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// ============================================
// AUTHENTICATION SERVICES (Use publicClient for login/register)
// ============================================

export const authService = {
  register: async (userData) => {
    try {
      const response = await publicClient.post('/auth/register/', {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        password2: userData.confirm_password,
        phone: userData.phone || '',
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  login: async (email, password) => {
    try {
      const response = await publicClient.post('/auth/login/', {
        email: email,
        password: password
      });
      
      if (response.data.success) {
        localStorage.setItem('access_token', response.data.data.access_token);
        localStorage.setItem('refresh_token', response.data.data.refresh_token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        window.dispatchEvent(new Event('storage'));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  logout: async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await apiClient.post('/auth/logout/', { refresh_token: refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('storage'));
    }
  },

  getCurrentUser: () => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('access_token');
    return !!token;
  },

changePassword: async (oldPassword, newPassword, confirmPassword) => {
  try {
    const response = await apiClient.post('/auth/change-password/', {
      old_password: oldPassword,
      new_password: newPassword,
      confirm_password: confirmPassword
    });
    return response.data;
  } catch (error) {
    // ✅ Throw the actual error response
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw error;
  }
},

  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
        refresh_token: refreshToken
      });
      
      if (response.data.success) {
        localStorage.setItem('access_token', response.data.access_token);
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  // Add to authService in services.jsx
getProfile: async () => {
  try {
    const response = await apiClient.get('/auth/user/profile/');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
},

updateUsername: async (newUsername) => {
  try {
    const response = await apiClient.put('/auth/user/update-username/', {
      new_username: newUsername
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
},

updateEmail: async (newEmail, currentPassword) => {
  try {
    const response = await apiClient.put('/auth/user/update-email/', {
      new_email: newEmail,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
},

updateProfileImage: async (formData) => {
  try {
    const response = await apiClient.put('/auth/user/update-profile-image/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
},

// Add to authService in services.jsx
forgotPassword: async (email) => {
  try {
    const response = await publicClient.post('/auth/forgot-password/', { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
},

verifyOTP: async (email, otp) => {
  try {
    const response = await publicClient.post('/auth/verify-otp/', { email, otp });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
},

resetPassword: async (email, newPassword, confirmPassword) => {
  try {
    const response = await publicClient.post('/auth/reset-password/', { 
      email, 
      new_password: newPassword, 
      confirm_password: confirmPassword 
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
},
};



// ============================================
// PREDICTION SERVICES (Require auth - use apiClient)
// ============================================

export const predictionService = {
  predictPrice: async (propertyData) => {
  try {
    const response = await apiClient.post('/predict/', propertyData);
    console.log('Service - Full axios response:', response);
    console.log('Service - Response data:', response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
},

  savePrediction: async (predictionResult, inputData) => {
    try {
      const response = await apiClient.post('/predict/save/', {
        prediction_result: predictionResult,
        input_data: inputData
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getPredictionHistory: async () => {
    try {
      const response = await apiClient.get('/predictions/');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getPredictionDetail: async (predictionId) => {
    try {
      const response = await apiClient.get(`/predictions/${predictionId}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deletePrediction: async (predictionId) => {
    try {
      const response = await apiClient.delete(`/predictions/${predictionId}/delete/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getPredictionStats: async () => {
    try {
      const response = await apiClient.get('/predictions/stats/');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};


// ============================================
// LISTING SERVICES (PUBLIC - use publicClient, NO AUTH)
// ============================================

export const listingService = {
  getListings: async () => {
    try {
      // ✅ Use publicClient (no auth token)
      const response = await publicClient.get('/listings/listings');
      return response.data;
    } catch (error) {
      console.error('Get listings error:', error);
      return { success: false, data: [], error: error.message };
    }
  },

  getListing: async (id) => {
    try {
      // ✅ Use publicClient (no auth token)
      const response = await publicClient.get(`/listings/listings/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getLocations: async () => {
    try {
      const response = await publicClient.get('/listings/locations');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  filterListings: async (filters) => {
    try {
      const response = await publicClient.post('/listings/filter', filters);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getFilterOptions: async () => {
    try {
      const response = await publicClient.get('/listings/filter-options');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

// ============================================
// HISTORICAL RATES SERVICES (PUBLIC - use publicClient)
// ============================================

export const historicalRatesService = {
  getLocations: async () => {
    try {
      const response = await publicClient.get('/historical-rates/public/locations');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  
  getLocationDetail: async (locationId) => {
  try {
    const response = await publicClient.get(`/historical-rates/public/locations/${locationId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
},
  
  getLocationYears: async (locationId) => {
    try {
      const response = await publicClient.get(`/historical-rates/public/locations/${locationId}/years`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  
  compareYears: async (locationId, year1, year2) => {
    try {
      const response = await publicClient.get(`/historical-rates/public/locations/${locationId}/compare-years`, {
        params: { year1, year2 }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  
  getPublicStats: async () => {
    try {
      const response = await publicClient.get('/historical-rates/public/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

export const formatPrice = (price) => {
  if (!price) return 'PKR 0';
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatPriceInCrores = (price) => {
  if (!price) return 'PKR 0';
  
  if (price >= 10_000_000) {
    const crores = price / 10_000_000;
    return `PKR ${crores.toFixed(2)} Crore`;
  } else if (price >= 100_000) {
    const lakhs = price / 100_000;
    return `PKR ${lakhs.toFixed(2)} Lakh`;
  }
  return `PKR ${price.toLocaleString()}`;
};

export const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

const services = {
  auth: authService,
  prediction: predictionService,
  listing: listingService,
  historicalRates: historicalRatesService,
  formatPrice,
  formatPriceInCrores,
  getAuthHeaders,
};

export default services;