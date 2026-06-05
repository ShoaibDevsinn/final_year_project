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
      
      // ✅ FIX: Return the response directly (not response.data)
      // Because predictionService.predictPrice already returns response.data
      return response;
    } catch (error) {
      console.error('ViewModel error:', error);
      throw error;
    }
  };
  
  return { getPrediction };
};