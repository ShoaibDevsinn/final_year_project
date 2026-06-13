// src/services/services.jsx
import axios from 'axios';

// API Base URL
const API_BASE_URL = 'http://127.0.0.1:8000/api';

//  Create publicClient for endpoints that don't need authentication
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
    
    //  Handle 401 without redirect
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

// AUTHENTICATION SERVICES (Use publicClient for login/register)

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
      console.error('Registration API error details:', error.response?.data);
      
      //  Handle the exact error format from your backend
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        
        // Your backend returns: { success: false, errors: { email: [...], username: [...], password: [...] } }
        if (errorData.errors) {
          // Throw with the errors object and formatted message
          const errorMessage = authService.getFirstErrorMessage(errorData.errors);
          throw {
            success: false,
            errors: errorData.errors,
            message: errorMessage
          };
        }
        
        throw {
          success: false,
          message: errorData.message || errorData.detail || 'Registration failed',
          errors: {}
        };
      }
      
      throw {
        success: false,
        message: error.message || 'Network error. Please try again.',
        errors: {}
      };
    }
  },

  //  Helper method to get first error message
  getFirstErrorMessage: (errors) => {
    if (!errors) return 'Registration failed';
    
    // Check each field in order
    const fieldOrder = ['email', 'username', 'password', 'password2', 'non_field_errors'];
    
    for (const field of fieldOrder) {
      if (errors[field] && errors[field].length > 0) {
        return errors[field][0];
      }
    }
    
    // If no field found, try to get any error message
    const firstKey = Object.keys(errors)[0];
    if (firstKey && errors[firstKey] && errors[firstKey].length > 0) {
      return errors[firstKey][0];
    }
    
    return 'Registration failed';
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
    console.error('Login API error details:', error.response?.data);
    
    //  Handle the exact error format from your backend
    if (error.response && error.response.data) {
      const errorData = error.response.data;
      
      // Check for different error formats
      if (errorData.errors) {
        // Field-specific errors
        let errorMessage = 'Login failed';
        if (errorData.errors.email && errorData.errors.email.length > 0) {
          errorMessage = errorData.errors.email[0];
        } else if (errorData.errors.password && errorData.errors.password.length > 0) {
          errorMessage = errorData.errors.password[0];
        } else if (errorData.errors.non_field_errors && errorData.errors.non_field_errors.length > 0) {
          errorMessage = errorData.errors.non_field_errors[0];
        }
        
        throw {
          success: false,
          message: errorMessage,
          errors: errorData.errors
        };
      } 
      // Handle non_field_errors
      else if (errorData.non_field_errors && errorData.non_field_errors.length > 0) {
        throw {
          success: false,
          message: errorData.non_field_errors[0],
          errors: {}
        };
      }
      // Handle simple message
      else if (errorData.message) {
        throw {
          success: false,
          message: errorData.message,
          errors: {}
        };
      }
      // Handle detail
      else if (errorData.detail) {
        throw {
          success: false,
          message: errorData.detail,
          errors: {}
        };
      }
    }
    
    throw {
      success: false,
      message: error.message || 'Invalid email or password',
      errors: {}
    };
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
    //  This is where the error formatting happens
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
    console.error('Update username error:', error);
    console.error('Error response:', error.response);
    
    //  Handle different error formats
    if (error.response && error.response.data) {
      const errorData = error.response.data;
      
      // Check if it's a string response (like "PRO FEATURE ONLY")
      if (typeof errorData === 'string') {
        throw {
          success: false,
          message: errorData,
          errors: {}
        };
      }
      // Check if it's an object with errors
      else if (errorData.errors) {
        throw {
          success: false,
          message: Object.values(errorData.errors)[0]?.[0] || 'Update failed',
          errors: errorData.errors
        };
      }
      // Check if it's an object with message
      else if (errorData.message) {
        throw {
          success: false,
          message: errorData.message,
          errors: {}
        };
      }
      // Return as is
      else {
        throw errorData;
      }
    }
    
    throw error.response?.data || { success: false, message: error.message || 'Update failed' };
  }
},

updateEmail: async (newEmail, currentPassword) => {
  try {
    const response = await apiClient.put('/auth/user/update-email/', {
      new_email: newEmail,
    });
    return response.data;
  } catch (error) {
    console.error('Update email error:', error);
    console.error('Error response:', error.response);
    
    //  Handle different error formats
    if (error.response && error.response.data) {
      const errorData = error.response.data;
      
      // Check if it's a string response (like "PRO FEATURE ONLY")
      if (typeof errorData === 'string') {
        throw {
          success: false,
          message: errorData,
          errors: {}
        };
      }
      // Check if it's an object with errors
      else if (errorData.errors) {
        throw {
          success: false,
          message: Object.values(errorData.errors)[0]?.[0] || 'Update failed',
          errors: errorData.errors
        };
      }
      // Check if it's an object with message
      else if (errorData.message) {
        throw {
          success: false,
          message: errorData.message,
          errors: {}
        };
      }
      // Return as is
      else {
        throw errorData;
      }
    }
    
    throw error.response?.data || { success: false, message: error.message || 'Update failed' };
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



// PREDICTION SERVICES (Require auth - use apiClient)

export const predictionService = {
  predictPrice: async (propertyData) => {
    try {
      const response = await apiClient.post('/predict/', propertyData);
      console.log('Service - Full axios response:', response);
      console.log('Service - Response data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Prediction API error details:', error.response?.data);
      
      // Handle the exact error format from your backend
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        
        // Check for field-specific errors
        if (errorData.errors) {
          let errorMessage = 'Prediction failed';
          
          // Get first error message
          if (errorData.errors.location && errorData.errors.location.length > 0) {
            errorMessage = errorData.errors.location[0];
          } else if (errorData.errors.area_marla && errorData.errors.area_marla.length > 0) {
            errorMessage = errorData.errors.area_marla[0];
          } else if (errorData.errors.bedrooms && errorData.errors.bedrooms.length > 0) {
            errorMessage = errorData.errors.bedrooms[0];
          } else if (errorData.errors.bathrooms && errorData.errors.bathrooms.length > 0) {
            errorMessage = errorData.errors.bathrooms[0];
          } else if (errorData.errors.kitchens && errorData.errors.kitchens.length > 0) {
            errorMessage = errorData.errors.kitchens[0];
          } else if (errorData.errors.construction_year && errorData.errors.construction_year.length > 0) {
            errorMessage = errorData.errors.construction_year[0];
          } else if (errorData.errors.non_field_errors && errorData.errors.non_field_errors.length > 0) {
            errorMessage = errorData.errors.non_field_errors[0];
          }
          
          throw {
            success: false,
            message: errorMessage,
            errors: errorData.errors
          };
        }
        // Handle non_field_errors
        else if (errorData.non_field_errors && errorData.non_field_errors.length > 0) {
          throw {
            success: false,
            message: errorData.non_field_errors[0],
            errors: {}
          };
        }
        // Handle simple message
        else if (errorData.message) {
          throw {
            success: false,
            message: errorData.message,
            errors: {}
          };
        }
        // Handle detail
        else if (errorData.detail) {
          throw {
            success: false,
            message: errorData.detail,
            errors: {}
          };
        }
      }
      
      throw {
        success: false,
        message: error.message || 'Failed to predict price. Please try again.',
        errors: {}
      };
    }
  },

  // Keep your other methods unchanged
  savePrediction: async (predictionResult, inputData) => {
    try {
      const response = await apiClient.post('/predict/save/', {
        prediction_result: predictionResult,
        input_data: inputData
      });
      return response.data;
    } catch (error) {
      console.error('Save prediction error:', error);
      if (error.response && error.response.data) {
        throw error.response.data;
      }
      throw error;
    }
  },

  getPredictionHistory: async () => {
    try {
      const response = await apiClient.get('/predictions/');
      console.log('Get prediction history response:', response);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getPredictionDetail: async (predictionId) => {
    try {
      const response = await apiClient.get(`/predictions/${predictionId}/`);
      console.log('Get prediction detail response:', response);
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


// LISTING SERVICES (PUBLIC - use publicClient, NO AUTH)

export const listingService = {
  getListings: async () => {
    try {
      const response = await publicClient.get('/listings/listings', {
        params: {
          _t: new Date().getTime() // Forces fresh request
        }
      });
      return response.data;
    } catch (error) {
      console.error('Get listings error:', error);
      return { success: false, data: [], error: error.message };
    }
  },

    getStatistics: async () => {
    try {
      const response = await publicClient.get('/listings/statistics');
      return response.data;
    } catch (error) {
      console.error('Get statistics error:', error);
      return { success: false, data: null, error: error.message };
    }
  },

  getListing: async (id) => {
    try {
      //  Use publicClient (no auth token)
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

// HISTORICAL RATES SERVICES (PUBLIC - use publicClient)

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

// UTILITY FUNCTIONS

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