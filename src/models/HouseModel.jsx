export class HouseModel {
  constructor(id, title, area, price, beds, baths, kitchen, status, location) {
    this.id = id;
    this.title = title;
    this.area = area; // in Marla
    this.price = price; // in PKR
    this.beds = beds;
    this.baths = baths;
    this.kitchen = kitchen;
    this.status = status; // 'Active', 'Sold', 'Pending'
    this.location = location;
    this.createdAt = new Date();
  }
}

export class DashboardStatsModel {
  constructor(totalListings, newListings, pendingRequests) {
    this.totalListings = totalListings;
    this.newListings = newListings;
    this.pendingRequests = pendingRequests;
  }
}