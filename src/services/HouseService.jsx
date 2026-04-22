import { HouseModel, DashboardStatsModel } from '../models/HouseModel';

// Mock data for now
const mockHouses = [
  new HouseModel(101, '5 Marla, DHA Phase 6', 5, 25000000, 3, 3, 1, 'Active', 'DHA Phase 6'),
  new HouseModel(102, '11 Marla, DHA Phase 8', 11, 25000000, 3, 3, 1, 'Active', 'DHA Phase 8'),
  new HouseModel(103, '5 Marla, DHA Phase 7', 5, 25000000, 3, 3, 1, 'Sold', 'DHA Phase 7'),
  new HouseModel(104, '5 Marla, DHA Phase 6', 5, 25000000, 3, 3, 1, 'Sold', 'DHA Phase 6'),
  new HouseModel(105, '5 Marla, DHA Phase 8', 5, 25000000, 3, 3, 1, 'Sold', 'DHA Phase 8'),
  new HouseModel(106, '10 Marla, DHA Phase 12', 10, 25000000, 3, 3, 1, 'Active', 'DHA Phase 12'),
];

export class HouseService {
  // Get all houses
  async getHouses() {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...mockHouses]), 500);
    });
  }

  // Add new house
  async addHouse(houseData) {
    const newHouse = new HouseModel(
      Date.now(),
      houseData.title,
      houseData.area,
      houseData.price,
      houseData.beds,
      houseData.baths,
      houseData.kitchen,
      'Active',
      houseData.location
    );
    mockHouses.push(newHouse);
    return newHouse;
  }

  // Update house
  async updateHouse(id, updatedData) {
    const index = mockHouses.findIndex(h => h.id === id);
    if (index !== -1) {
      mockHouses[index] = { ...mockHouses[index], ...updatedData };
      return mockHouses[index];
    }
    return null;
  }

  // Delete house
  async deleteHouse(id) {
    const index = mockHouses.findIndex(h => h.id === id);
    if (index !== -1) {
      return mockHouses.splice(index, 1)[0];
    }
    return null;
  }

  // Get dashboard stats
  async getDashboardStats() {
    const currentMonth = new Date().getMonth();
    const newListings = mockHouses.filter(h => 
      h.createdAt.getMonth() === currentMonth
    ).length;
    
    const pendingRequests = mockHouses.filter(h => 
      h.status === 'Pending'
    ).length;

    return new DashboardStatsModel(
      mockHouses.length,
      newListings,
      pendingRequests
    );
  }
}