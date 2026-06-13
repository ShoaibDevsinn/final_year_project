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
      
      console.log('API Response:', response); // Debug log
      
      // Handle different response structures
      let houseData;
      if (response.success && response.data) {
        houseData = response.data;
      } else if (response.data) {
        houseData = response.data;
      } else {
        houseData = response;
      }
      
      console.log('Processed house data:', houseData); // Debug log
      
      // Transform API data to match component expectations
      const transformedHouse = {
        id: houseData.listing_id || houseData.id,
        title: houseData.title || `${houseData.area_marla} Marla Property in ${houseData.location_name}`,
        area: houseData.location_name, // Using location_name for area
        location: houseData.location_name || 'Lahore',
        marla: parseFloat(houseData.area_marla),
        bedrooms: houseData.bedrooms || 0,
        bathrooms: houseData.bathrooms || 0,
        kitchen: houseData.kitchens || 0,
        yearBuilt: houseData.construction_year,
        price: parseFloat(houseData.price) || 0,
        pricePerMarla: houseData.current_per_marla_rate ? parseFloat(houseData.current_per_marla_rate) : 
                      (houseData.price ? parseFloat(houseData.price) / parseFloat(houseData.area_marla) : 0),
        description: houseData.description || generateDescription(houseData),
        // Property status
        status: houseData.property_status,
        statusDisplay: houseData.property_status_display,
        propertyType: houseData.property_type,
        propertyTypeDisplay: houseData.property_type_display,
        // Features based on actual API response fields
        hasGarage: houseData.has_parking || false,
        hasGarden: houseData.has_lawn || false,
        hasSwimmingPool: houseData.has_swimming_pool || false,
        hasGym: houseData.has_gym || false,
        hasSecurity: houseData.has_security || false,
        hasElectricityBackup: houseData.has_electricity_backup || false,
        hasServantQuarter: houseData.has_servant_quarter || false,
        furnished: houseData.is_furnished || false,
        isCornerPlot: houseData.is_corner_plot || false,
        isFacingPark: houseData.is_facing_park || false,
        // Room details
        livingRooms: houseData.has_living_room ? 1 : 0,
        diningRooms: houseData.has_dining_room ? 1 : 0,
        studyRooms: houseData.has_study_room ? 1 : 0,
        servantRooms: houseData.servant_rooms || 0,
        storeRooms: houseData.store_rooms || 0,
        // Other details
        numberOfFloors: houseData.number_of_floors || 1,
        constructionYear: houseData.construction_year,
        customFeatures: houseData.custom_features,
        customFeaturesList: houseData.custom_features_list || [],
        amenities: houseData.amenities || [],
        // Images
        primaryImage: houseData.primary_image,
        images: houseData.images || [],
        // Creator info
        createdBy: houseData.created_by,
        createdByName: houseData.created_by_name,
        createdAt: houseData.created_at,
        updatedAt: houseData.updated_at,
        // Extract features array for display
        features: extractFeatures(houseData)
      };
      
      setHouse(transformedHouse);
    } catch (err) {
      console.error('Error fetching house details:', err);
      setError(err.message || 'Failed to load house details');
    } finally {
      setLoading(false);
    }
  };

  // Generate description from data
  const generateDescription = (data) => {
    let description = `Beautiful ${data.area_marla} marla property located in ${data.location_name}. `;
    description += `This ${data.property_type_display || data.property_type} features ${data.bedrooms} bedrooms, ${data.bathrooms} bathrooms, and ${data.kitchens} kitchen(s). `;
    
    if (data.is_furnished) description += `The property is fully furnished. `;
    if (data.has_lawn) description += `It includes a beautiful lawn/garden. `;
    if (data.has_swimming_pool) description += `A swimming pool adds to the luxury. `;
    if (data.has_parking) description += `Parking space is available. `;
    if (data.is_corner_plot) description += `This is a corner plot. `;
    if (data.is_facing_park) description += `The property faces a park. `;
    
    if (data.construction_year) {
      description += `Built in ${data.construction_year}, this property offers modern amenities and comfortable living.`;
    }
    
    if (data.custom_features) {
      description += ` Additional features: ${data.custom_features}.`;
    }
    
    return description;
  };

  // Extract features from data based on actual API response
  const extractFeatures = (data) => {
    const features = [];
    
    // Basic features
    if (data.is_furnished) features.push('Fully Furnished');
    if (data.has_parking) features.push('Parking');
    if (data.has_lawn) features.push('Lawn/Garden');
    if (data.has_swimming_pool) features.push('Swimming Pool');
    if (data.has_gym) features.push('Gym Facility');
    if (data.has_security) features.push('Security System');
    if (data.has_electricity_backup) features.push('Electricity Backup');
    if (data.has_servant_quarter) features.push('Servant Quarter');
    if (data.is_corner_plot) features.push('Corner Plot');
    if (data.is_facing_park) features.push('Facing Park');
    
    // Room features
    if (data.has_living_room) features.push('Living Room');
    if (data.has_dining_room) features.push('Dining Room');
    if (data.has_study_room) features.push('Study Room');
    
    // Custom features
    if (data.custom_features_list && Array.isArray(data.custom_features_list)) {
      features.push(...data.custom_features_list);
    } else if (data.custom_features) {
      features.push(data.custom_features);
    }
    
    // Amenities
    if (data.amenities && Array.isArray(data.amenities)) {
      features.push(...data.amenities);
    }
    
    return features;
  };

  const formatPrice = (price) => {
    if (!price || price === 0) return 'PKR 0';
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (numPrice >= 10000000) {
      return `PKR ${(numPrice / 10000000).toFixed(2)} Cr`;
    }
    if (numPrice >= 100000) {
      return `PKR ${(numPrice / 100000).toFixed(2)} Lakh`;
    }
    return `PKR ${numPrice.toLocaleString()}`;
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    const numValue = typeof num === 'string' ? parseFloat(num) : num;
    return numValue.toLocaleString('en-PK');
  };

  const propertyAge = house && house.yearBuilt ? new Date().getFullYear() - house.yearBuilt : 0;
  
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