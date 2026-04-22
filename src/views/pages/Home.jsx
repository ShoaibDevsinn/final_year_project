// src/views/pages/Home.jsx
import { Link } from 'react-router-dom';
import { 
  TrendingUp, Home as HomeIcon, Search, BarChart3, Users, Award, 
  Building2, ArrowRight, Sparkles, MapPin, Zap, Shield, Star, 
  ChevronRight, Bed, Bath, Eye, Heart, Clock 
} from 'lucide-react';
import { Navbar } from '../components/navbar';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useHouseListViewModel } from '../../viewmodels/useHouseListViewModel';

export default function Home() {
  // Use ViewModel for data
  const { houses, loading, error } = useHouseListViewModel();
  
  // Featured houses (first 8)
  const featuredHouses = houses.slice(0, 8);
  
  // ✅ Fixed: Added more images to match 8 featured houses
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

  const stats = {
    properties: '500+',
    users: '1000+',
    areas: '50+',
    accuracy: '95%'
  };

  const testimonials = [
    { name: 'Ahmed Khan', role: 'Property Buyer', text: 'This platform helped me find my dream home in DHA! The price predictions were spot on.' },
    { name: 'Sara Ali', role: 'Real Estate Agent', text: 'Best tool for property valuation in Lahore. My clients love the accuracy and ease of use.' },
    { name: 'Usman Tariq', role: 'Investor', text: 'Historical data insights helped me make informed investment decisions. Highly recommended!' },
  ];

  // Loading state
  if (loading && houses.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50 to-teal-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            <p className="mt-4 text-gray-600">Loading amazing properties...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50 to-teal-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-red-500 text-lg">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50 to-teal-50 w-full">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 text-white w-full">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full blur-3xl"
              style={{
                width: Math.random() * 400 + 200,
                height: Math.random() * 400 + 200,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 py-24 md:py-32">
          <div className="text-center">
            <div className="inline-block mb-6">
              <div className="relative">
                <Sparkles className="w-20 h-20 mx-auto text-emerald-200" />
                <div className="absolute inset-0">
                  <Star className="w-8 h-8 text-yellow-300 absolute top-0 right-0" />
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Welcome to Lahore<br />
              <span className="bg-gradient-to-r from-emerald-200 via-teal-200 to-cyan-200 bg-clip-text text-transparent">
                House Price Predictor
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-emerald-100 mb-10 max-w-3xl mx-auto">
              Discover accurate property valuations powered by{' '}
              <span className="font-bold text-white">AI insights</span>
              {' '}and data analysis
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/predict">
                <button className="group flex items-center gap-3 px-10 py-5 bg-white text-emerald-700 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-emerald-500/50 transition-all relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-100 to-teal-100" />
                  <TrendingUp className="w-6 h-6 relative z-10" />
                  <span className="relative z-10">Predict House Price</span>
                  <ArrowRight className="w-6 h-6 relative z-10" />
                </button>
              </Link>

              <Link to="/listings">
                <button className="group flex items-center gap-3 px-10 py-5 bg-transparent text-white rounded-2xl font-bold text-lg border-3 border-white hover:bg-white hover:text-emerald-700 transition-all backdrop-blur-sm">
                  <Search className="w-6 h-6" />
                  <span>Browse Properties</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </Link>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap justify-center gap-4 mt-12">
              <div className="bg-emerald-500 text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-lg">
                <Shield className="w-5 h-5" />
                <span className="font-semibold">Verified Data</span>
              </div>
              <div className="bg-yellow-500 text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-lg">
                <Zap className="w-5 h-5" />
                <span className="font-semibold">Instant Results</span>
              </div>
              <div className="bg-purple-500 text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-lg">
                <Award className="w-5 h-5" />
                <span className="font-semibold">Top Rated</span>
              </div>
            </div>
          </div>
        </div>

        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="rgb(249, 250, 251)" fillOpacity="0.3"/>
            <path d="M0 40L60 46.7C120 53 240 67 360 70C480 73 600 67 720 63.3C840 60 960 60 1080 63.3C1200 67 1320 73 1380 76.7L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V40Z" fill="rgb(249, 250, 251)"/>
          </svg>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="w-full px-6 md:px-12 -mt-8 relative z-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-6 border-4 border-emerald-100">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-2xl mb-3">
                  <Building2 className="w-8 h-8 text-emerald-600" />
                </div>
                <div className="text-4xl font-bold text-emerald-600 mb-1">{stats.properties}</div>
                <div className="text-gray-600 font-medium">Properties</div>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-3">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-4xl font-bold text-blue-600 mb-1">{stats.users}</div>
                <div className="text-gray-600 font-medium">Happy Users</div>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-3">
                  <MapPin className="w-8 h-8 text-purple-600" />
                </div>
                <div className="text-4xl font-bold text-purple-600 mb-1">{stats.areas}</div>
                <div className="text-gray-600 font-medium">Areas</div>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-2xl mb-3">
                  <Award className="w-8 h-8 text-orange-600" />
                </div>
                <div className="text-4xl font-bold text-orange-600 mb-1">{stats.accuracy}</div>
                <div className="text-gray-600 font-medium">Accuracy</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Properties Section */}
      <div className="w-full px-6 md:px-12 py-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <HomeIcon className="w-12 h-12 text-emerald-600" />
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-4">Featured Properties</h2>
            <p className="text-2xl text-gray-600 mb-8">Discover our hand-picked premium homes in Lahore</p>
          </div>

          {/* Properties Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredHouses.map((house, index) => (
              <div key={house.id} className="group relative">
                <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all overflow-hidden border-2 border-emerald-100">
                  {/* Image Section */}
                  <div className="relative h-64 overflow-hidden">
                    <ImageWithFallback
                      src={imageUrls[index % imageUrls.length]}
                      alt={house.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                        <Link to={`/house/${house.id}`}>
                          <button className="flex items-center gap-2 px-4 py-2 bg-white text-emerald-700 rounded-xl font-semibold shadow-lg">
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                        </Link>
                        <button className="p-3 rounded-full shadow-lg bg-white text-gray-700 hover:text-red-500 transition-colors">
                          <Heart className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Badge */}
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 rounded-full font-bold shadow-xl">
                      {house.marla} Marla
                    </div>

                    {/* NEW badge */}
                    {house.yearBuilt >= 2023 && (
                      <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                        NEW
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="p-6">
                    <h3 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors line-clamp-1">
                      {house.title}
                    </h3>

                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-medium">{house.area}</span>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <Bed className="w-5 h-5 text-emerald-600" />
                        <span className="font-medium">{house.bedrooms}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bath className="w-5 h-5 text-teal-600" />
                        <span className="font-medium">{house.bathrooms}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <span className="font-medium">{house.yearBuilt}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        PKR {(house.price / 10000000).toFixed(1)} Cr
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {(house.pricePerMarla / 100000).toFixed(1)} Lakh per Marla
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-12">
            <Link to="/listings">
              <button className="px-10 py-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-emerald-500/50 transition-all flex items-center gap-3 mx-auto">
                View All Properties
                <ArrowRight className="w-6 h-6" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 w-full py-20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-white mb-4">What Our Users Say</h2>
            <p className="text-2xl text-emerald-100">Real feedback from real customers</p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-12 shadow-2xl">
              <div className="text-6xl text-emerald-600 mb-6">"</div>
              <p className="text-2xl text-gray-700 mb-6 italic">
                {testimonials[0].text}
              </p>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {testimonials[0].name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">{testimonials[0].name}</h4>
                  <p className="text-emerald-600 font-medium">{testimonials[0].role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="w-full px-6 md:px-12 py-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-2xl text-gray-600">Get your property valuation in 3 simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { step: '01', title: 'Enter Details', description: 'Provide property specifications and location', icon: HomeIcon, color: 'emerald' },
              { step: '02', title: 'AI Analysis', description: 'Our system analyzes market data instantly', icon: BarChart3, color: 'blue' },
              { step: '03', title: 'Get Results', description: 'Receive accurate price predictions', icon: TrendingUp, color: 'purple' },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="bg-white rounded-3xl p-8 shadow-2xl relative z-10 border-2 border-emerald-100">
                  <div className="text-8xl font-bold text-emerald-100 mb-4">{item.step}</div>
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl">
                    <item.icon className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 text-lg">{item.description}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-6 z-20">
                    <ArrowRight className="w-12 h-12 text-emerald-600" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-full px-6 md:px-12 py-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 rounded-[3rem] p-16 text-center text-white shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute bg-white rounded-full"
                  style={{
                    width: Math.random() * 100 + 20,
                    height: Math.random() * 100 + 20,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                />
              ))}
            </div>

            <div className="relative z-10">
              <Sparkles className="w-20 h-20 mx-auto mb-6 text-emerald-200" />
              <h2 className="text-5xl md:text-6xl font-bold mb-6">Ready to Get Started?</h2>
              <p className="text-2xl text-emerald-100 mb-10 max-w-3xl mx-auto">
                Predict your house price now or explore our extensive property listings
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link to="/predict">
                  <button className="group flex items-center gap-3 px-10 py-5 bg-white text-emerald-700 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-white/50 transition-all">
                    <TrendingUp className="w-7 h-7" />
                    <span>Start Predicting</span>
                  </button>
                </Link>

                <Link to="/historical-rates">
                  <button className="flex items-center gap-3 px-10 py-5 bg-white/10 backdrop-blur-lg text-white rounded-2xl font-bold text-xl border-3 border-white hover:bg-white hover:text-emerald-700 transition-all">
                    <BarChart3 className="w-7 h-7" />
                    View Historical Rates
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white w-full py-12">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="text-center">
            <div className="inline-block mb-4">
              <HomeIcon className="w-12 h-12 text-emerald-500" />
            </div>
            <p className="text-gray-400 text-lg mb-2">© 2026 Lahore House Price Predictor. All rights reserved.</p>
            <p className="text-gray-500">Making property valuation simple and accurate</p>
          </div>
        </div>
      </footer>
    </div>
  );
}