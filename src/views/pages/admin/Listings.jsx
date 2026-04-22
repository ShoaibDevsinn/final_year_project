import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import Navbar from '../../components/AdminNavbar'

const Listings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [viewMode, setViewMode] = useState('grid')

  const [properties, setProperties] = useState([
    {
      id: 1,
      title: 'Cottage in the Heart of Willow',
      location: '123 Maple Lane, Willowbrook',
      price: 550,
      type: 'Rent',
      beds: 2,
      baths: 1,
      image: '🏡',
      status: 'Active'
    },
    {
      id: 2,
      title: 'Tranquil Lakeside Retreat',
      location: '456 Lake View Road, Lakeside',
      price: 850,
      type: 'Rent',
      beds: 3,
      baths: 2,
      image: '🏞️',
      status: 'Active'
    },
    {
      id: 3,
      title: 'Luxury Penthouse with Panoramic City Views',
      location: '789 Skyline Tower, Downtown',
      price: 2500,
      type: 'Sell',
      beds: 4,
      baths: 3,
      image: '🏙️',
      status: 'Active'
    },
    {
      id: 4,
      title: 'Modern Loft with Stunning Views',
      location: '321 Art District, Midtown',
      price: 1200,
      type: 'Rent',
      beds: 2,
      baths: 2,
      image: '🏢',
      status: 'Active'
    },
    {
      id: 5,
      title: 'Beachfront Villa with Private Access',
      location: '567 Ocean Drive, Malibu',
      price: 3500,
      type: 'Sell',
      beds: 5,
      baths: 4,
      image: '🏖️',
      status: 'Active'
    }
  ])

  const deleteProperty = (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      setProperties(properties.filter(prop => prop.id !== id))
    }
  }

  const formatPrice = (price, type) => {
    if (type === 'Sell') {
      return `$${price.toLocaleString()}`
    }
    return `$${price}/month`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:ml-64">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <div className="p-4 lg:p-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Your Listings</h1>
              <p className="text-sm text-gray-500 mt-1">Manage and view all your property listings</p>
            </div>
            <div className="flex gap-2 mt-3 sm:mt-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-xl">🏠</div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Total Listings</p>
                  <p className="text-2xl font-bold text-gray-900">{properties.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-xl">🏘️</div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">For Rent</p>
                  <p className="text-2xl font-bold text-gray-900">{properties.filter(p => p.type === 'Rent').length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-xl">💰</div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">For Sale</p>
                  <p className="text-2xl font-bold text-gray-900">{properties.filter(p => p.type === 'Sell').length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center text-xl">⭐</div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Active</p>
                  <p className="text-2xl font-bold text-gray-900">{properties.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Grid View - Fixed Height Cards */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <div key={property.id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col h-full">
                  {/* Image - Fixed Height */}
                  <div className="h-40 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-5xl flex-shrink-0">
                    {property.image}
                  </div>
                  
                  {/* Content - Flexible */}
                  <div className="p-4 flex flex-col flex-1">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900 line-clamp-1">{property.title}</h3>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{property.location}</p>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-600">{property.beds} beds</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span className="text-xs text-gray-600">{property.baths} baths</span>
                    </div>
                    
                    <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-blue-600">{formatPrice(property.price, property.type)}</p>
                        <span className="text-xs text-gray-400">{property.type === 'Rent' ? '/month' : 'total'}</span>
                      </div>
                      <div className="flex gap-1">
                        <Link
                          to={`/edit-property/${property.id}`}
                          className="px-2 py-1 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition"
                        >
                          EDIT
                        </Link>
                        <button
                          onClick={() => deleteProperty(property.id)}
                          className="px-2 py-1 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 rounded transition"
                        >
                          DELETE
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              {properties.map((property) => (
                <div key={property.id} className="flex items-center justify-between p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-xl flex-shrink-0">
                      {property.image}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 text-sm truncate">{property.title}</h3>
                      <p className="text-xs text-gray-500 truncate">{property.location}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-500">{property.beds} beds</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span className="text-xs text-gray-500">{property.baths} baths</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span className="text-xs font-medium text-blue-600">{formatPrice(property.price, property.type)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0 ml-2">
                    <Link
                      to={`/edit-property/${property.id}`}
                      className="px-2 py-1 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition"
                    >
                      EDIT
                    </Link>
                    <button
                      onClick={() => deleteProperty(property.id)}
                      className="px-2 py-1 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 rounded transition"
                    >
                      DELETE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {properties.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏠</div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No listings yet</h3>
              <p className="text-gray-500 mb-4">Get started by adding your first property</p>
              <Link
                to="/add-property"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
              >
                + Add New Property
              </Link>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400">© 2026 Lahore House. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Listings