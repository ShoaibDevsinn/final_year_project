import React from "react";
import { ArrowRight, Search, Shield, Zap, Medal } from "lucide-react";

const Hero = () => {
  return (
    <section className="bg-gradient-to-br from-green-600 to-green-500 text-white py-20 px-6 flex flex-col items-center text-center">
      
      {/* Icon */}
      <div className="mb-4">
        <ArrowRight size={48} className="text-yellow-300" />
      </div>

      {/* Headings */}
      <h1 className="text-4xl md:text-5xl font-bold mb-2">
        Welcome to Lahore
      </h1>
      <h2 className="text-3xl md:text-4xl font-semibold mb-4">
        House Price Predictor
      </h2>
      <p className="text-lg md:text-xl mb-8">
        Discover accurate property valuations powered by <strong>AI insights</strong> and data analysis
      </p>

      {/* Buttons */}
      <div className="flex gap-4 mb-6 flex-wrap justify-center">
        <button className="bg-white text-green-700 px-6 py-3 rounded-lg flex items-center gap-2 font-semibold hover:bg-gray-100 transition">
          <ArrowRight size={16} /> Predict House Price
        </button>
        <button className="border border-white px-6 py-3 rounded-lg flex items-center gap-2 font-semibold hover:bg-white hover:text-green-700 transition">
          <Search size={16} /> Browse Properties
        </button>
      </div>

      {/* Badges */}
      <div className="flex gap-4 flex-wrap justify-center">
        <div className="bg-green-700 px-4 py-2 rounded-full flex items-center gap-2">
          <Shield size={16} /> Verified Data
        </div>
        <div className="bg-yellow-400 text-black px-4 py-2 rounded-full flex items-center gap-2">
          <Zap size={16} /> Instant Results
        </div>
        <div className="bg-purple-600 px-4 py-2 rounded-full flex items-center gap-2">
          <Medal size={16} /> Top Rated
        </div>
      </div>
    </section>
  );
};

export default Hero;