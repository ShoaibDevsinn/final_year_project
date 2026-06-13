// src/views/pages/HouseDetails.jsx
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '../components/navbar';
import { ArrowLeft, MapPin, Bed, Bath, Home, Calendar, CheckCircle, Users, Warehouse, Building2 } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useHouseDetailViewModel } from '../../viewmodels/useHouseDetailViewModel.js';

export default function HouseDetails() {
  const { id } = useParams();
  
  // Use ViewModel for house details
  const {
    house,
    loading,
    error,
    formatPrice,
    formatNumber,
    propertyAge,
    propertyCondition,
    refresh
  } = useHouseDetailViewModel(id);
  

  const imageUrls = [
    'https://images.unsplash.com/photo-1622015663381-d2e05ae91b72?w=500',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500',
    'https://images.unsplash.com/photo-1668911495278-487418f8f72d?w=500',
    'https://images.unsplash.com/photo-1721815693498-cc28507c0ba2?w=500',
    'https://images.unsplash.com/photo-1682357042725-77af1ef2789b?w=500',
    'https://images.unsplash.com/photo-1616632821499-61ac29f49ff8?w=500',
    'https://images.unsplash.com/photo-1650059232481-352cd48eb740?w=500',
    'https://images.unsplash.com/photo-1768637087224-cffa17561c53?w=500',
  ];

  const houseIndex = parseInt(id || '0') - 1;
  const imageUrl = imageUrls[houseIndex % imageUrls.length];

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50 to-teal-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            <p className="mt-4 text-gray-600">Loading property details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !house) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50 to-teal-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">House Not Found</h2>
            <p className="text-gray-600 mb-6">{error || "The property you're looking for doesn't exist."}</p>
            <Link
              to="/listings"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Listings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50 to-teal-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link
          to="/listings"
          className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Listings
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="relative h-96">
                <ImageWithFallback
                    src={house.primaryImage|| imageUrls[houseIndex % imageUrls.length]}
                    alt={house.title}
                  className="w-full h-full object-contain"
                />
                <div className="absolute top-4 right-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                  {house.marla} Marla
                </div>
                {house.yearBuilt >= 2025 && (
                  <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    NEW
                  </div>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="bg-white rounded-xl shadow-lg p-5">
              <div className="flex justify-between items-start mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{house.title}</h1>
                <div className={`px-3 py-1 rounded-full text-sm font-semibold ${propertyCondition.bg} ${propertyCondition.color}`}>
                  {propertyCondition.label}
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <span className="text-lg">{house.location}</span>
              </div>

             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
  {/* Bedrooms - Always show */}
  <div className="bg-emerald-50 p-3 rounded-lg">
    <div className="flex items-center gap-2 text-emerald-600 mb-1">
      <Bed className="w-5 h-5" />
      <span className="font-semibold text-sm">Bedrooms</span>
    </div>
    <div className="text-xl font-bold text-gray-900">{house.bedrooms || 0}</div>
  </div>

  {/* Bathrooms - Always show */}
  <div className="bg-teal-50 p-3 rounded-lg">
    <div className="flex items-center gap-2 text-teal-600 mb-1">
      <Bath className="w-5 h-5" />
      <span className="font-semibold text-sm">Bathrooms</span>
    </div>
    <div className="text-xl font-bold text-gray-900">{house.bathrooms || 0}</div>
  </div>

  {/* Kitchen - Always show */}
  <div className="bg-blue-50 p-3 rounded-lg">
    <div className="flex items-center gap-2 text-blue-600 mb-1">
      <Home className="w-5 h-5" />
      <span className="font-semibold text-sm">Kitchens</span>
    </div>
    <div className="text-xl font-bold text-gray-900">{house.kitchen || 0}</div>
  </div>

  {/* Year Built - Always show if exists */}
  {house.yearBuilt && (
    <div className="bg-purple-50 p-3 rounded-lg">
      <div className="flex items-center gap-2 text-purple-600 mb-1">
        <Calendar className="w-5 h-5" />
        <span className="font-semibold text-sm">Year Built</span>
      </div>
      <div className="text-xl font-bold text-gray-900">{house.yearBuilt}</div>
    </div>
  )}

  {/* Number of Floors - Show if exists and > 0 */}
  {house.numberOfFloors > 0 && (
    <div className="bg-orange-50 p-3 rounded-lg">
      <div className="flex items-center gap-2 text-orange-600 mb-1">
        <Home className="w-5 h-5" />
        <span className="font-semibold text-sm">Floors</span>
      </div>
      <div className="text-xl font-bold text-gray-900">{house.numberOfFloors}</div>
    </div>
  )}

  {/* Servant Rooms - Show if exists and > 0 */}
  {house.servantRooms > 0 && (
    <div className="bg-rose-50 p-3 rounded-lg">
      <div className="flex items-center gap-2 text-rose-600 mb-1">
        <Users className="w-5 h-5" />
        <span className="font-semibold text-sm">Servant Rooms</span>
      </div>
      <div className="text-xl font-bold text-gray-900">{house.servantRooms}</div>
    </div>
  )}

  {/* Store Rooms - Show if exists and > 0 */}
  {house.storeRooms > 0 && (
    <div className="bg-amber-50 p-3 rounded-lg">
      <div className="flex items-center gap-2 text-amber-600 mb-1">
        <Warehouse className="w-5 h-5" />
        <span className="font-semibold text-sm">Store Rooms</span>
      </div>
      <div className="text-xl font-bold text-gray-900">{house.storeRooms}</div>
    </div>
  )}

  {/* Property Type - Show if exists */}
  {house.propertyTypeDisplay && (
    <div className="bg-indigo-50 p-3 rounded-lg">
      <div className="flex items-center gap-2 text-indigo-600 mb-1">
        <Building2 className="w-5 h-5" />
        <span className="font-semibold text-sm">Property Type</span>
      </div>
      <div className="text-xl font-bold text-gray-900">{house.propertyTypeDisplay}</div>
    </div>
  )}

  {/* Property Status - Show if exists */}
  {house.statusDisplay && (
    <div className={`p-3 rounded-lg ${
      house.status === 'available' ? 'bg-green-50' : 'bg-red-50'
    }`}>
      <div className={`flex items-center gap-2 mb-1 ${
        house.status === 'available' ? 'text-green-600' : 'text-red-600'
      }`}>
        <CheckCircle className="w-5 h-5" />
        <span className="font-semibold text-sm">Status</span>
      </div>
      <div className={`text-xl font-bold ${
        house.status === 'available' ? 'text-green-600' : 'text-red-600'
      }`}>
        {house.statusDisplay}
      </div>
    </div>
  )}
</div>
              <div className="border-t border-gray-200 pt-2">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Description</h2>
                <p className="text-gray-600 leading-relaxed">{house.description}</p>
              </div>

             <div className="border-t border-gray-200 pt-2 mt-5">
  <h2 className="text-xl font-semibold text-gray-900 mb-3">Key Features</h2>
  <div className="grid md:grid-cols-2 gap-3">
    {/* Define all possible features with their display names */}
    {[
      { condition: house.hasGarage, label: 'Parking/Garage' },
      { condition: house.hasGarden, label: 'Lawn/Garden' },
      { condition: house.hasSwimmingPool, label: 'Swimming Pool' },
      { condition: house.hasGym, label: 'Gym Facility' },
      { condition: house.hasSecurity, label: 'Security System' },
      { condition: house.hasElectricityBackup, label: 'Electricity Backup' },
      { condition: house.hasServantQuarter, label: 'Servant Quarter' },
      { condition: house.furnished, label: 'Fully Furnished' },
      { condition: house.isCornerPlot, label: 'Corner Plot' },
      { condition: house.isFacingPark, label: 'Facing Park' },
      { condition: house.livingRooms > 0, label: 'Living Room' },
      { condition: house.diningRooms > 0, label: 'Dining Room' },
      { condition: house.studyRooms > 0, label: 'Study Room' },
      // { condition: house.servantRooms > 0, label: `${house.servantRooms} Servant Room${house.servantRooms > 1 ? 's' : ''}` },
      // { condition: house.storeRooms > 0, label: `${house.storeRooms} Store Room${house.storeRooms > 1 ? 's' : ''}` },
      // { condition: house.numberOfFloors > 0, label: `${house.numberOfFloors} Floor${house.numberOfFloors > 1 ? 's' : ''}` },
    ].map((feature, index) => (
      feature.condition && (
        <div key={index} className="flex items-center gap-2 text-gray-700">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <span>{feature.label}</span>
        </div>
      )
    ))}
    
    {/* Custom Features */}
    {house.customFeatures && (
      <div className="flex items-center gap-2 text-gray-700">
        <CheckCircle className="w-5 h-5 text-emerald-600" />
        <span>{house.customFeatures}</span>
      </div>
    )}
    
    
  </div>
</div>
            </div>

            {/* Similar Properties Section */}
            {/* {similarHouses.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Similar Properties</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {similarHouses.map((similar) => (
                    <Link
                      key={similar.id}
                      to={`/house/${similar.id}`}
                      className="group block bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-all"
                    >
                      <div className="relative h-32">
                        <ImageWithFallback
                          src={imageUrls[parseInt(similar.id) % imageUrls.length]}
                          alt={similar.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{similar.title}</h3>
                        <p className="text-emerald-600 font-bold text-sm mt-1">
                          PKR {(similar.price / 10000000).toFixed(1)} Cr
                        </p>
                        <p className="text-xs text-gray-500">{similar.marla} Marla</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )} */}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              <div className="mb-6">
                <div className="text-sm text-gray-600 mb-1">Total Price</div>
                <div className="text-4xl font-bold text-emerald-600 mb-2">
  {formatPrice(house.price)}
</div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="text-sm text-gray-600 mb-1">Per Marla Rate</div>
               <div className="text-2xl font-bold text-teal-600">
  {formatPrice(house.pricePerMarla)}
</div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Property Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium text-gray-900">{house.area}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plot Size:</span>
                    <span className="font-medium text-gray-900">{house.marla} Marla</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bedrooms:</span>
                    <span className="font-medium text-gray-900">{house.bedrooms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bathrooms:</span>
                    <span className="font-medium text-gray-900">{house.bathrooms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kitchen:</span>
                    <span className="font-medium text-gray-900">{house.kitchen}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Property Age:</span>
                    <span className="font-medium text-gray-900">{propertyAge} years</span>
                  </div>
                </div>
              </div>

              <Link
                to="/listings"
                className="w-full block text-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
              >
                View More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}