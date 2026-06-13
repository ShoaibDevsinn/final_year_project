// usePredictionViewModel.js
import { predictionService } from '../services/services';

export const usePredictionViewModel = () => {
  
  const getPrediction = async (propertyData) => {
    try {
      // Make sure propertyData has 'location' field, not 'area'
      const transformedData = {
        location: propertyData.location || propertyData.area,
        area_marla: propertyData.area_marla,
        bedrooms: propertyData.bedrooms,
        bathrooms: propertyData.bathrooms,
        kitchens: propertyData.kitchens,
        construction_year: propertyData.construction_year,
        number_of_floors: propertyData.number_of_floors,
        servant_quarters: propertyData.servant_quarters,
        store_rooms: propertyData.store_rooms,
        furnished: propertyData.furnished,
        gym: propertyData.gym,
        study_room: propertyData.study_room,
        drawing_room: propertyData.drawing_room,
        dining_room: propertyData.dining_room,
        lawn_garden: propertyData.lawn_garden,
        swimming_pool: propertyData.swimming_pool,
        electricity_backup: propertyData.electricity_backup,
        lounge_sitting_room: propertyData.lounge_sitting_room,
        corner_plot: propertyData.corner_plot,
        facing_park: propertyData.facing_park,
      };
      
      const response = await predictionService.predictPrice(transformedData);
      
      // Return the response directly
      return response;
    } catch (error) {
      console.error('ViewModel error:', error);
      
      //  FIX: Properly format and re-throw the error
      // This ensures the error from predictionService reaches the component
      if (error.response) {
        // If it's an axios error with response
        throw {
          success: false,
          message: error.response.data?.message || error.response.data?.detail || 'Prediction failed',
          errors: error.response.data?.errors || {}
        };
      } else if (error.errors) {
        // If it's already formatted from predictionService
        throw error;
      } else if (error.message) {
        // Simple error message
        throw {
          success: false,
          message: error.message,
          errors: {}
        };
      } else {
        // Unknown error
        throw {
          success: false,
          message: 'An unexpected error occurred',
          errors: {}
        };
      }
    }
  };
  
  return { getPrediction };
};