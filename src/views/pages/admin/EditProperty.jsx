import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import Navbar from '../../components/AdminNavbar'

const EditProperty = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [images, setImages] = useState([])
  const [imagePreview, setImagePreview] = useState([])

  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    location: '',
    type: 'Rent',
    offer: '',
    beds: '',
    baths: '',
    regularPrice: '',
    discountedPrice: '',
    furnished: true,
    parking: false
  })

  // Mock data - In real app, fetch from API
  useEffect(() => {
    // Simulate fetching property data
    const mockProperty = {
      id: parseInt(id),
      title: 'Cottage in the Heart of Willow',
      description: 'This cozy 2-bedroom, 1-bathroom cottage is the perfect place to call home. Nestled in the picturesque neighborhood of Willowbrook, you’ll enjoy a peaceful and serene environment.',
      location: '123 Maple Lane, Willowbrook, FAKE123',
      type: 'Rent',
      offer: '4 Beds 3 Baths',
      beds: 4,
      baths: 3,
      regularPrice: 550,
      discountedPrice: 530,
      furnished: true,
      parking: false
    }
    setFormData(mockProperty)
  }, [id])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    if (files.length + images.length > 6) {
      alert('Maximum 6 images allowed')
      return
    }
    setImages([...images, ...files])
    
    const previews = files.map(file => URL.createObjectURL(file))
    setImagePreview([...imagePreview, ...previews])
  }

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index)
    const newPreviews = imagePreview.filter((_, i) => i !== index)
    setImages(newImages)
    setImagePreview(newPreviews)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Updated Form Data:', formData)
    console.log('Updated Images:', images)
    alert('Property updated successfully!')
    navigate('/properties')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:ml-64">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <div className="p-4 lg:p-8">
          
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Edit a Listing</h1>
            <p className="text-sm text-gray-500 mt-1">Update your property listing details</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Property Info Section */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Property Type Section */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Property Details</h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {['Sell', 'Rent', 'Parking spot', 'Furnished'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      if (type === 'Parking spot') {
                        setFormData(prev => ({ ...prev, parking: !prev.parking }))
                      } else if (type === 'Furnished') {
                        setFormData(prev => ({ ...prev, furnished: !prev.furnished }))
                      } else {
                        setFormData(prev => ({ ...prev, type: type }))
                      }
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      (type === 'Sell' && formData.type === 'Sell') ||
                      (type === 'Rent' && formData.type === 'Rent') ||
                      (type === 'Parking spot' && formData.parking) ||
                      (type === 'Furnished' && formData.furnished)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Offer</label>
                <input
                  type="text"
                  name="offer"
                  value={formData.offer}
                  onChange={handleChange}
                  placeholder="e.g., 2 Beds 4 Baths"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Beds</label>
                  <input
                    type="number"
                    name="beds"
                    value={formData.beds}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Baths</label>
                  <input
                    type="number"
                    name="baths"
                    value={formData.baths}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Regular price ($ / Month)</label>
                  <input
                    type="number"
                    name="regularPrice"
                    value={formData.regularPrice}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discounted price ($ / Month)</label>
                  <input
                    type="number"
                    name="discountedPrice"
                    value={formData.discountedPrice}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Images</h2>
              <p className="text-sm text-gray-500 mb-3">The first image will be the cover (max 6)</p>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
                >
                  Choose files
                </label>
                <p className="text-xs text-gray-500 mt-2">No file chosen</p>
              </div>

              {/* Image Previews */}
              {imagePreview.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                  {imagePreview.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-24 object-cover rounded-lg border" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition text-xs"
                      >
                        ✕
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-1 rounded">Cover</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
              >
                EDIT LISTING
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditProperty