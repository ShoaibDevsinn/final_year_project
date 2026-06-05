// src/views/pages/Home.jsx
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, Home as HomeIcon, Search, BarChart3, Users, Award, 
  Building2, ArrowRight, Sparkles, MapPin, Zap, Shield, Star, 
  ChevronRight, Bed, Bath, Eye, Heart, Clock, CheckCircle
} from 'lucide-react';
import { Navbar } from '../components/navbar';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useHouseListViewModel } from '../../viewmodels/useHouseListViewModel.js';
import { toast, Toaster } from 'sonner';

export default function Home() {
  // ✅ KEEP YOUR ORIGINAL API CALL
  const { houses, loading, error } = useHouseListViewModel();
  
  // State declarations
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [likedHouses, setLikedHouses] = useState([]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [counters, setCounters] = useState({ properties: 0, users: 0, areas: 0, accuracy: 0 });
  
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  
  // Featured houses (first 8) - FROM YOUR API
  const displayedHouses = houses.slice(0, 8);
  const hasNoHouses = houses.length === 0;
  
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
  
  // Filter houses by category - USING YOUR API DATA
  const filteredHouses = selectedCategory === 'all' 
    ? displayedHouses 
    : selectedCategory === 'luxury'
    ? displayedHouses.filter(h => h.price > 50000000)
    : selectedCategory === 'affordable'
    ? displayedHouses.filter(h => h.price <= 30000000)
    : displayedHouses.filter(h => h.price > 30000000 && h.price <= 50000000);
  
  const getHouseImage = (house, index) => {
    if (house.images && house.images.length > 0) {
      return house.images[0];
    }
    return imageUrls[index % imageUrls.length];
  };
  
  const toggleLike = (id) => {
    if (likedHouses.includes(id)) {
      setLikedHouses(likedHouses.filter(houseId => houseId !== id));
      toast.info('Removed from favorites');
    } else {
      setLikedHouses([...likedHouses, id]);
      toast.success('Added to favorites!');
    }
  };
  
  // Mouse move effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Counter animation
  useEffect(() => {
    const targets = { properties: 500, users: 1200, areas: 50, accuracy: 95 };
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    
    const timer = setInterval(() => {
      setCounters(prev => ({
        properties: prev.properties < targets.properties ? Math.min(prev.properties + Math.ceil(targets.properties / steps), targets.properties) : targets.properties,
        users: prev.users < targets.users ? Math.min(prev.users + Math.ceil(targets.users / steps), targets.users) : targets.users,
        areas: prev.areas < targets.areas ? Math.min(prev.areas + Math.ceil(targets.areas / steps), targets.areas) : targets.areas,
        accuracy: prev.accuracy < targets.accuracy ? Math.min(prev.accuracy + Math.ceil(targets.accuracy / steps), targets.accuracy) : targets.accuracy,
      }));
    }, interval);
    
    return () => clearInterval(timer);
  }, []);
  
  // Testimonials rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);
  
  const testimonials = [
    { name: 'Ahmed Khan', role: 'Property Buyer', text: 'This platform helped me find my dream home in DHA! The price predictions were spot on.' },
    { name: 'Sara Ali', role: 'Real Estate Agent', text: 'Best tool for property valuation in Lahore. My clients love the accuracy and ease of use.' },
    { name: 'Usman Tariq', role: 'Investor', text: 'Historical data insights helped me make informed investment decisions. Highly recommended!' },
  ];
  
  // Loading state - FROM YOUR API
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
  
  // Error state - FROM YOUR API
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50 to-teal-50 overflow-hidden">
      <Toaster position="top-center" richColors />
      <Navbar />
      
      {/* Floating cursor effect */}
      {isHovering && (
        <motion.div
          className="fixed w-8 h-8 bg-emerald-500 rounded-full pointer-events-none z-50 mix-blend-difference"
          style={{
            left: mousePosition.x - 16,
            top: mousePosition.y - 16,
          }}
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
      
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 text-white"
        style={{ y }}
      >
        {/* Animated background patterns */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white rounded-full blur-3xl"
              style={{
                width: Math.random() * 400 + 200,
                height: Math.random() * 400 + 200,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </div>
        
<div className="relative z-10 max-w-7xl mx-auto px-4 pt-9 pb-18 md:pt-13 md:pb-26">
            <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center"
          >
            {/* Animated icon */}
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 1 }}
              className="inline-block mb-6"
            >
              <motion.div
                className="relative"
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Sparkles className="w-20 h-20 mx-auto text-emerald-200" />
                <motion.div
                  className="absolute inset-0"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <Star className="w-8 h-8 text-yellow-300 absolute top-0 right-0" />
                </motion.div>
              </motion.div>
            </motion.div>
            
            {/* Animated heading */}
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {['Welcome', 'to', 'Lahore'].map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="inline-block mr-4"
                >
                  {word}
                </motion.span>
              ))}
              <br />
              <motion.span 
                className="bg-gradient-to-r from-emerald-200 via-teal-200 to-cyan-200 bg-clip-text text-transparent"
                animate={{ 
                  backgroundPosition: ['0%', '100%', '0%'],
                }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                House Price Predictor
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-emerald-100 mb-10 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Discover accurate property valuations powered by{' '}
              <motion.span
                className="font-bold text-white"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                AI insights
              </motion.span>
              {' '}and data analysis
            </motion.p>
            
            {/* Animated CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Link to="/predict">
                <motion.button
                  whileHover={{ scale: 1.08, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onHoverStart={() => setIsHovering(true)}
                  onHoverEnd={() => setIsHovering(false)}
                  className="group flex items-center gap-3 px-10 py-5 bg-white text-emerald-700 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-emerald-500/50 transition-all relative overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-emerald-100 to-teal-100"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  <TrendingUp className="w-6 h-6 relative z-10 group-hover:rotate-12 transition-transform" />
                  <span className="relative z-10">Predict House Price</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-6 h-6 relative z-10" />
                  </motion.div>
                </motion.button>
              </Link>
              
              <Link to="/listings">
                <motion.button
                  whileHover={{ scale: 1.08, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="group flex items-center gap-3 px-10 py-5 bg-transparent text-white rounded-2xl font-bold text-lg border-3 border-white hover:bg-white hover:text-emerald-700 transition-all backdrop-blur-sm relative overflow-hidden"
                >
                  <Search className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                  <span>Browse Properties</span>
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </motion.div>
            
            {/* Floating badges */}
            <motion.div
              className="flex flex-wrap justify-center gap-4 mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {[
                { icon: Shield, text: 'Verified Data', color: 'bg-emerald-500' },
                { icon: Zap, text: 'Instant Results', color: 'bg-yellow-500' },
                { icon: Award, text: 'Top Rated', color: 'bg-purple-500' },
              ].map((badge, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ 
                    y: { duration: 2, repeat: Infinity, delay: i * 0.3 },
                  }}
                  className={`${badge.color} text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-lg cursor-pointer`}
                >
                  <badge.icon className="w-5 h-5" />
                  <span className="font-semibold">{badge.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
        
        {/* Animated wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <motion.svg 
            viewBox="0 0 1440 120" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-full"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.path 
              d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" 
              fill="rgb(249, 250, 251)" 
              fillOpacity="0.3"
              animate={{ 
                d: [
                  "M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z",
                  "M0 10L60 16.7C120 23 240 37 360 40C480 43 600 37 720 33.3C840 30 960 30 1080 36.7C1200 43 1320 57 1380 63.3L1440 70V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V10Z",
                  "M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
                ]
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
            <path d="M0 40L60 46.7C120 53 240 67 360 70C480 73 600 67 720 63.3C840 60 960 60 1080 63.3C1200 67 1320 73 1380 76.7L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V40Z" fill="rgb(249, 250, 251)"/>
          </motion.svg>
        </div>
      </motion.div>
      
      {/* Quick Stats Bar */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-2xl p-6 border-4 border-emerald-100"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: counters.properties, suffix: '+', label: 'Properties', icon: Building2, color: 'emerald' },
              { value: counters.users, suffix: '+', label: 'Happy Users', icon: Users, color: 'blue' },
              { value: counters.areas, suffix: '+', label: 'Areas', icon: MapPin, color: 'purple' },
              { value: counters.accuracy, suffix: '%', label: 'Accuracy', icon: Award, color: 'orange' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.1, y: -5 }}
                className="text-center cursor-pointer"
              >
                <motion.div
                  className={`inline-flex items-center justify-center w-16 h-16 bg-${stat.color}-100 rounded-2xl mb-3`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <stat.icon className={`w-8 h-8 text-${stat.color}-600`} />
                </motion.div>
                <motion.div 
                  className={`text-4xl font-bold text-${stat.color}-600 mb-1`}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  {stat.value}{stat.suffix}
                </motion.div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      
      {/* Featured Properties Section */}
     {/* Featured Properties Section */}
<div className="max-w-7xl mx-auto px-4 py-20">
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="text-center mb-12"
  >
    <motion.div
      animate={{ rotate: [0, 360] }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="inline-block mb-4"
    >
      <HomeIcon className="w-12 h-12 text-emerald-600" />
    </motion.div>
    <h2 className="text-5xl font-bold text-gray-900 mb-4">Featured Properties</h2>
    <p className="text-2xl text-gray-600 mb-8">Discover our hand-picked premium homes in Lahore</p>
    
    {/* Category Filter */}
    <div className="flex flex-wrap justify-center gap-4">
      {[
        { id: 'all', label: 'All Properties', icon: Building2 },
        { id: 'luxury', label: 'Luxury', icon: Award },
        { id: 'mid-range', label: 'Mid-Range', icon: HomeIcon },
        { id: 'affordable', label: 'Affordable', icon: TrendingUp },
      ].map((category) => (
        <motion.button
          key={category.id}
          whileHover={{ scale: 1.05, y: -3 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedCategory(category.id)}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
            selectedCategory === category.id
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl'
              : 'bg-white text-gray-700 hover:bg-emerald-50 shadow-md'
          }`}
        >
          <category.icon className="w-5 h-5" />
          {category.label}
        </motion.button>
      ))}
    </div>
  </motion.div>
  
  {/* Show when NO properties available */}
  {hasNoHouses && (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center py-16 bg-white rounded-2xl shadow-lg"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="inline-block mb-4"
      >
        <HomeIcon className="w-20 h-20 text-gray-400 mx-auto" />
      </motion.div>
      <p className="text-gray-500 text-2xl mb-2">No properties available</p>
      <p className="text-gray-400">Check back later for new listings</p>
    </motion.div>
  )}
  
  {/* Show when properties ARE available */}
  {!hasNoHouses && (
    <>
      {/* Properties Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredHouses.map((house, index) => (
            <motion.div
              key={house.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -15, scale: 1.02 }}
              className="group relative"
            >
              <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all overflow-hidden border-2 border-emerald-100">
                {/* Image Section */}
                <div className="relative h-64 overflow-hidden">
                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full"
                  >
                    <ImageWithFallback
                      src={getHouseImage(house, index)}
                      alt={house.title}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                      <Link to={`/house/${house.id}`}>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="flex items-center gap-2 px-4 py-2 bg-white text-emerald-700 rounded-xl font-semibold shadow-lg"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </motion.button>
                      </Link>
                      <motion.button
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.preventDefault();
                          toggleLike(house.id);
                        }}
                        className={`p-3 rounded-full shadow-lg transition-all ${
                          likedHouses.includes(house.id)
                            ? 'bg-red-500 text-white'
                            : 'bg-white text-gray-700'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${likedHouses.includes(house.id) ? 'fill-current' : ''}`} />
                      </motion.button>
                    </div>
                  </div>
                  
                  {/* Badge */}
                  <motion.div
                    initial={{ x: -100 }}
                    animate={{ x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="absolute top-4 right-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 rounded-full font-bold shadow-xl"
                  >
                    {house.marla} Marla
                  </motion.div>
                  
                  {/* "NEW" badge */}
                  {house.yearBuilt && house.yearBuilt >= 2023 && (
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg"
                    >
                      NEW
                    </motion.div>
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
                    <motion.div whileHover={{ scale: 1.1 }} className="flex items-center gap-2">
                      <Bed className="w-5 h-5 text-emerald-600" />
                      <span className="font-medium">{house.bedrooms}</span>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.1 }} className="flex items-center gap-2">
                      <Bath className="w-5 h-5 text-teal-600" />
                      <span className="font-medium">{house.bathrooms}</span>
                    </motion.div>
                    {house.yearBuilt && (
                      <motion.div whileHover={{ scale: 1.1 }} className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <span className="font-medium">{house.yearBuilt}</span>
                      </motion.div>
                    )}
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"
                    >
                      PKR {(house.price / 10000000).toFixed(1)} Cr
                    </motion.div>
                    <div className="text-sm text-gray-500 mt-1">
                      {(house.pricePerMarla / 100000).toFixed(1)} Lakh per Marla
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
      
      {/* View All Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="text-center mt-12"
      >
        <Link to="/listings">
          <motion.button
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-emerald-500/50 transition-all flex items-center gap-3 mx-auto"
          >
            View All Properties
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight className="w-6 h-6" />
            </motion.div>
          </motion.button>
        </Link>
      </motion.div>
    </>
  )}
</div>
      {/* Testimonials Section */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-5xl font-bold text-white mb-4">What Our Users Say</h2>
            <p className="text-2xl text-emerald-100">Real feedback from real customers</p>
          </motion.div>
          
          <div className="relative max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-3xl p-12 shadow-2xl"
              >
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-6xl text-emerald-600 mb-6"
                >
                  "
                </motion.div>
                <p className="text-2xl text-gray-700 mb-6 italic">
                  {testimonials[currentTestimonial].text}
                </p>
                <div className="flex items-center gap-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                  >
                    {testimonials[currentTestimonial].name.charAt(0)}
                  </motion.div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">
                      {testimonials[currentTestimonial].name}
                    </h4>
                    <p className="text-emerald-600 font-medium">
                      {testimonials[currentTestimonial].role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Dots indicator */}
            <div className="flex justify-center gap-3 mt-8">
              {testimonials.map((_, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.2 }}
                  onClick={() => setCurrentTestimonial(i)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    i === currentTestimonial ? 'bg-white w-8' : 'bg-emerald-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* How It Works Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-2xl text-gray-600">Get your property valuation in 3 simple steps</p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-12">
          {[
            { step: '01', title: 'Enter Details', description: 'Provide property specifications and location', icon: HomeIcon, color: 'emerald' },
            { step: '02', title: 'AI Analysis', description: 'Our system analyzes market data instantly', icon: BarChart3, color: 'blue' },
            { step: '03', title: 'Get Results', description: 'Receive accurate price predictions', icon: TrendingUp, color: 'purple' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="relative"
            >
              <div className="bg-white rounded-3xl p-8 shadow-2xl relative z-10 border-2 border-emerald-100">
                <motion.div
                  className={`text-8xl font-bold text-${item.color}-100 mb-4`}
                  whileHover={{ scale: 1.2, rotate: 10 }}
                >
                  {item.step}
                </motion.div>
                <motion.div
                  className={`w-20 h-20 bg-gradient-to-br from-${item.color}-500 to-${item.color}-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl`}
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  whileHover={{ rotate: 360 }}
                >
                  <item.icon className="w-10 h-10" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 text-lg">{item.description}</p>
              </div>
              {i < 2 && (
                <motion.div
                  className="hidden md:block absolute top-1/2 -right-6 z-20"
                  animate={{ x: [0, 10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-12 h-12 text-emerald-600" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 rounded-[3rem] p-16 text-center text-white shadow-2xl relative overflow-hidden"
        >
          {/* Animated background */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute bg-white rounded-full"
                style={{
                  width: Math.random() * 100 + 20,
                  height: Math.random() * 100 + 20,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, Math.random() * 100 - 50],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
            ))}
          </div>
          
          <div className="relative z-10">
            <motion.div
              animate={{ scale: [1, 1.1, 1], rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles className="w-20 h-20 mx-auto mb-6 text-emerald-200" />
            </motion.div>
            
            <h2 className="text-5xl md:text-6xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-2xl text-emerald-100 mb-10 max-w-3xl mx-auto">
              Predict your house price now or explore our extensive property listings
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/predict">
                <motion.button
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="group flex items-center gap-3 px-10 py-5 bg-white text-emerald-700 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-white/50 transition-all relative overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-teal-50"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                  />
                  <TrendingUp className="w-7 h-7 relative z-10" />
                  <span className="relative z-10">Start Predicting</span>
                </motion.button>
              </Link>
              
              <Link to="/historical-rates">
                <motion.button
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-3 px-10 py-5 bg-white/10 backdrop-blur-lg text-white rounded-2xl font-bold text-xl border-3 border-white hover:bg-white hover:text-emerald-700 transition-all"
                >
                  <BarChart3 className="w-7 h-7" />
                  View Historical Rates
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <motion.div
              whileHover={{ scale: 1.2, rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="inline-block mb-4"
            >
              <HomeIcon className="w-12 h-12 text-emerald-500" />
            </motion.div>
            <p className="text-gray-400 text-lg mb-2">© 2026 Lahore House Price Predictor. All rights reserved.</p>
            <p className="text-gray-500">Making property valuation simple and accurate</p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}