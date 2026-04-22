import { useState, useEffect } from 'react';
import { HouseService } from '../services/HouseService';

export const useHouseViewModel = () => {
  const [houses, setHouses] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const houseService = new HouseService();

  // Load all houses
  const loadHouses = async () => {
    setLoading(true);
    try {
      const data = await houseService.getHouses();
      setHouses(data);
    } catch (error) {
      console.error('Error loading houses:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load dashboard stats
  const loadStats = async () => {
    try {
      const data = await houseService.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  // Add new house
  const addHouse = async (houseData) => {
    setLoading(true);
    try {
      const newHouse = await houseService.addHouse(houseData);
      setHouses([...houses, newHouse]);
      await loadStats(); // Refresh stats
      return newHouse;
    } catch (error) {
      console.error('Error adding house:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update house
  const updateHouse = async (id, updatedData) => {
    setLoading(true);
    try {
      const updated = await houseService.updateHouse(id, updatedData);
      if (updated) {
        setHouses(houses.map(h => h.id === id ? updated : h));
      }
    } catch (error) {
      console.error('Error updating house:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete house
  const deleteHouse = async (id) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      setLoading(true);
      try {
        await houseService.deleteHouse(id);
        setHouses(houses.filter(h => h.id !== id));
        await loadStats(); // Refresh stats
      } catch (error) {
        console.error('Error deleting house:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Filter houses by search
  const filteredHouses = houses.filter(house =>
    house.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    house.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Load data on mount
  useEffect(() => {
    loadHouses();
    loadStats();
  }, []);

  return {
    houses: filteredHouses,
    stats,
    loading,
    searchTerm,
    setSearchTerm,
    addHouse,
    updateHouse,
    deleteHouse,
    refreshData: () => {
      loadHouses();
      loadStats();
    }
  };
};