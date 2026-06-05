import { useState, useEffect } from 'react';
import { listingService } from '../services/services';

export const useHouseDetailViewModel = (id) => {
  const [house, setHouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchHouseDetail();
    }
  }, [id]);

  const fetchHouseDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await listingService.getListing(id);
      
      // Handle different response structures
      let houseData;
      if (response.success && response.data) {
        houseData = response.data;
      } else if (response.data) {
        houseData = response.data;
      } else {
        houseData = response;
      }
      
      // Transform API data to match component expectations
      const transformedHouse = {
        id: houseData.id,
        title: houseData.title || `${houseData.marla} Marla House in ${houseData.location}`,
        area: houseData.location,
        location: houseData.city || 'Lahore',
        marla: houseData.area_marla,
        bedrooms: houseData.bedrooms,
        bathrooms: houseData.bathrooms,
        kitchen: houseData.kitchens,
        yearBuilt: houseData.construction_year,
        price: houseData.price || calculateEstimatedPrice(houseData),
        pricePerMarla: houseData.price ? houseData.price / houseData.area_marla : 0,
        description: houseData.description || generateDescription(houseData),
        hasGarage: houseData.garage || false,
        hasGarden: houseData.lawn_garden || false,
        hasRoofAccess: houseData.roof_access || false,
        furnished: houseData.furnished || false,
        features: extractFeatures(houseData),
        // Store raw data for additional fields
        ...houseData
      };
      
      setHouse(transformedHouse);
    } catch (err) {
      console.error('Error fetching house details:', err);
      setError(err.message || 'Failed to load house details');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to calculate estimated price if not provided
  const calculateEstimatedPrice = (data) => {
    // This is a basic calculation - you can enhance it
    let estimatedPrice = data.area_marla * 5000000; // Base 5M per marla
    
    // Adjust based on features
    if (data.furnished) estimatedPrice *= 1.1;
    if (data.lawn_garden) estimatedPrice *= 1.05;
    if (data.swimming_pool) estimatedPrice *= 1.15;
    if (data.corner_plot) estimatedPrice *= 1.08;
    if (data.facing_park) estimatedPrice *= 1.04;
    
    return Math.round(estimatedPrice);
  };

  // Generate description from data
  const generateDescription = (data) => {
    let description = `Beautiful ${data.area_marla} marla house located in ${data.location}. `;
    description += `This property features ${data.bedrooms} bedrooms, ${data.bathrooms} bathrooms, and ${data.kitchens} kitchen(s). `;
    
    if (data.furnished) description += `The house is fully furnished. `;
    if (data.lawn_garden) description += `It includes a beautiful lawn/garden. `;
    if (data.swimming_pool) description += `A swimming pool adds to the luxury. `;
    
    description += `Built in ${data.construction_year}, this property offers modern amenities and comfortable living.`;
    
    return description;
  };

  // Extract features from data
  const extractFeatures = (data) => {
    const features = [];
    if (data.furnished) features.push('Fully Furnished');
    if (data.gym) features.push('Gym Facility');
    if (data.study_room) features.push('Study Room');
    if (data.drawing_room) features.push('Drawing Room');
    if (data.dining_room) features.push('Dining Room');
    if (data.lawn_garden) features.push('Lawn/Garden');
    if (data.swimming_pool) features.push('Swimming Pool');
    if (data.electricity_backup) features.push('Electricity Backup');
    if (data.lounge_sitting) features.push('Lounge/Sitting Area');
    if (data.corner_plot) features.push('Corner Plot');
    if (data.facing_park) features.push('Facing Park');
    return features;
  };

  const formatPrice = (price) => {
    if (!price) return 'PKR 0';
    if (price >= 10000000) {
      return `PKR ${(price / 10000000).toFixed(2)} Cr`;
    }
    if (price >= 100000) {
      return `PKR ${(price / 100000).toFixed(1)} Lakh`;
    }
    return `PKR ${price.toLocaleString()}`;
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    return num.toLocaleString('en-PK');
  };

  const propertyAge = house ? new Date().getFullYear() - house.yearBuilt : 0;
  
  const propertyCondition = {
    label: propertyAge <= 2 ? 'New Construction' : 
           propertyAge <= 5 ? 'Excellent' : 
           propertyAge <= 10 ? 'Good' : 'Well Maintained',
    bg: propertyAge <= 2 ? 'bg-green-100' : 
        propertyAge <= 5 ? 'bg-blue-100' : 'bg-yellow-100',
    color: propertyAge <= 2 ? 'text-green-700' : 
           propertyAge <= 5 ? 'text-blue-700' : 'text-yellow-700'
  };

  const refresh = () => {
    fetchHouseDetail();
  };

  return {
    house,  
    loading,
    error,
    formatPrice,
    formatNumber,
    propertyAge,
    propertyCondition,
    refresh
  };
};