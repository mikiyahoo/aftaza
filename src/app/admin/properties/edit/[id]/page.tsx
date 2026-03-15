'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Upload, X, Building2 } from 'lucide-react';

interface Company {
  id: string;
  name: string;
}

interface PropertyImage {
  id: string;
  imageUrl: string;
  isPrimary: boolean;
  sortOrder: number;
}

interface Property {
  id: string;
  title: string;
  slug: string;
  price: number;
  location: string;
  propertyType: string;
  status: string;
  bedrooms: number | null;
  bathrooms: number | null;
  parking: number | null;
  area: number | null;
  description: string | null;
  featured: boolean;
  companyId: string | null;
  images: PropertyImage[];
}

const PROPERTY_TYPES = ['Apartment', 'House', 'Villa', 'Land', 'Commercial', 'Office'];
const PROPERTY_STATUS = ['For Sale', 'For Rent', 'Sold'];

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id as string;

  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<{ id?: string; imageUrl: string; isPrimary: boolean; sortOrder?: number }[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    price: '',
    location: '',
    propertyType: 'Apartment',
    status: 'For Sale',
    bedrooms: '',
    bathrooms: '',
    parking: '',
    area: '',
    description: '',
    featured: false,
    companyId: '',
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [propertyRes, companiesRes] = await Promise.all([
          fetch(`/api/properties/${propertyId}`),
          fetch('/api/companies'),
        ]);

        if (propertyRes.ok) {
          const property: Property = await propertyRes.json();
          
          setFormData({
            title: property.title,
            slug: property.slug,
            price: String(property.price),
            location: property.location,
            propertyType: property.propertyType,
            status: property.status,
            bedrooms: property.bedrooms ? String(property.bedrooms) : '',
            bathrooms: property.bathrooms ? String(property.bathrooms) : '',
            parking: property.parking ? String(property.parking) : '',
            area: property.area ? String(property.area) : '',
            description: property.description || '',
            featured: property.featured,
            companyId: property.companyId || '',
          });

          setImages(property.images.map(img => ({
  id: img.id,
  imageUrl: img.imageUrl,
  isPrimary: img.isPrimary,
  sortOrder: img.sortOrder,
})));
        }

        const companiesData = await companiesRes.json();
        setCompanies(companiesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [propertyId]);

  // Auto-generate slug from title (only when creating)
  // For editing, we don't auto-update slug

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    
    try {
      for (const file of Array.from(files)) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);

        const response = await fetch('/api/upload-image', {
          method: 'POST',
          body: formDataUpload,
        });

        if (response.ok) {
          const data = await response.json();
          setImages(prev => [
            ...prev,
            { 
              imageUrl: data.url || data.secure_url, 
              isPrimary: prev.length === 0 
            }
          ]);
        }
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async (index: number) => {
    const img = images[index];
    // If it's an existing image (has an ID), we need to delete it from the database
    if (img.id) {
      try {
        await fetch(`/api/properties/${propertyId}/images/${img.id}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        // Remove from local state after successful deletion
        setImages(prev => prev.filter((_, i) => i !== index));
      } catch (error) {
        console.error('Error deleting image:', error);
        alert('Failed to delete image');
      }
    } else {
      // For newly uploaded images (no ID), just remove from local state
      setImages(prev => prev.filter((_, i) => i !== index));
    }
  };

  const setPrimaryImage = async (index: number) => {
    const img = images[index];
    // Update local state immediately
    setImages(prev => prev.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    })));
    
    // If it's an existing image (has an ID), persist the change via API
    if (img.id) {
      try {
        await fetch(`/api/properties/${propertyId}/images/${img.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            isPrimary: true,
          }),
        });
      } catch (error) {
        console.error('Error setting primary image:', error);
        alert('Failed to set primary image');
        // Revert local state on error
        setImages(prev => prev.map((img, i) => ({
          ...img,
          isPrimary: i === index ? false : img.isPrimary,
        })));
      }
    }
  };

  const moveImageUp = (index: number) => {
    if (index === 0) return;
    setImages(prev => {
      const newImages = [...prev];
      const temp = newImages[index];
      newImages[index] = newImages[index - 1];
      newImages[index - 1] = temp;
      return newImages;
    });
  };

  const moveImageDown = (index: number) => {
    if (index === images.length - 1) return;
    setImages(prev => {
      const newImages = [...prev];
      const temp = newImages[index];
      newImages[index] = newImages[index + 1];
      newImages[index + 1] = temp;
      return newImages;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
 
    try {
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
          bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
          parking: formData.parking ? parseInt(formData.parking) : null,
          area: formData.area ? parseFloat(formData.area) : null,
          companyId: formData.companyId || null,
        }),
      });
 
      if (response.ok) {
        const property = await response.json();
        
        // Update existing images (primary flag and sort order)
        const updatePromises = images
          .filter(img => img.id) // Only existing images
          .map(img => 
            fetch(`/api/properties/${propertyId}/images/${img.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
              body: JSON.stringify({
                isPrimary: img.isPrimary,
                sortOrder: img.sortOrder,
              }),
            })
          );
        
        await Promise.all(updatePromises);
        
        // Add new images (those without an ID)
        const newImages = images.filter(img => !img.id);
        if (newImages.length > 0) {
          await fetch(`/api/properties/${propertyId}/images`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ images: newImages }),
          });
        }
        
        router.push('/admin/properties/manage-properties');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update property');
      }
    } catch (error) {
      console.error('Error updating property:', error);
      alert('Failed to update property');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c8a34d]"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-slate-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Edit Property</h1>
          <p className="text-slate-600 mt-1">Update property details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Property Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#c8a34d] focus:border-[#c8a34d] outline-none"
                  placeholder="e.g., Luxury Apartment in Bole"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  URL Slug *
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#c8a34d] focus:border-[#c8a34d] outline-none"
                  placeholder="luxury-apartment-in-bole"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Price (ETB) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#c8a34d] focus:border-[#c8a34d] outline-none"
                    placeholder="12500000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#c8a34d] focus:border-[#c8a34d] outline-none"
                    placeholder="Bole, Addis Ababa"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Property Type *
                  </label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#c8a34d] focus:border-[#c8a34d] outline-none"
                  >
                    {PROPERTY_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Status *
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#c8a34d] focus:border-[#c8a34d] outline-none"
                  >
                    {PROPERTY_STATUS.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Property Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Bedrooms
                </label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#c8a34d] focus:border-[#c8a34d] outline-none"
                  placeholder="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Bathrooms
                </label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#c8a34d] focus:border-[#c8a34d] outline-none"
                  placeholder="2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Parking
                </label>
                <input
                  type="number"
                  name="parking"
                  value={formData.parking}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#c8a34d] focus:border-[#c8a34d] outline-none"
                  placeholder="1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Area (sq meters)
              </label>
              <input
                type="number"
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#c8a34d] focus:border-[#c8a34d] outline-none"
                placeholder="120"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Description</h2>
            
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={6}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#c8a34d] focus:border-[#c8a34d] outline-none resize-none"
              placeholder="Describe the property features, amenities, and other relevant details..."
            />
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Property Images</h2>
            
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
                disabled={uploading}
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="text-slate-400 mb-2" size={32} />
                <span className="text-slate-600 font-medium">
                  {uploading ? 'Uploading...' : 'Click to upload images'}
                </span>
                <span className="text-slate-400 text-sm mt-1">
                  PNG, JPG up to 10MB each
                </span>
              </label>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {images.map((img, index) => (
  <div key={index} className="relative group">
    <img
      src={img.imageUrl}
      alt={`Property ${index + 1}`}
      className="w-full h-32 object-cover rounded-lg"
    />
    {img.isPrimary && (
      <span className="absolute top-2 left-2 bg-[#c8a34d] text-white text-xs px-2 py-1 rounded">
        Primary
      </span>
    )}
    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
      <div className="flex flex-col gap-1">
        {!img.isPrimary && (
          <button
            type="button"
            onClick={() => setPrimaryImage(index)}
            className="bg-white text-slate-900 px-2 py-1 rounded text-xs font-medium"
          >
            Set Primary
          </button>
        )}
        <button
          type="button"
          onClick={() => moveImageUp(index)}
          disabled={index === 0}
          className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium"
        >
          ▲
        </button>
        <button
          type="button"
          onClick={() => moveImageDown(index)}
          disabled={index === images.length - 1}
          className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium"
        >
          ▼
        </button>
      </div>
      <button
        type="button"
        onClick={() => removeImage(index)}
        className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium"
      >
        <X size={14} />
      </button>
    </div>
  </div>
))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Company
                </label>
                <select
                  name="companyId"
                  value={formData.companyId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#c8a34d] focus:border-[#c8a34d] outline-none"
                >
                  <option value="">No Company</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>{company.name}</option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 mt-1">Only visible to admins</p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="featured"
                  id="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-[#c8a34d] border-slate-300 rounded focus:ring-[#c8a34d]"
                />
                <label htmlFor="featured" className="text-sm font-medium text-slate-700">
                  Featured Listing
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-[#c8a34d] text-white py-3 rounded-lg font-bold hover:bg-[#b8933f] transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="w-full mt-3 bg-slate-100 text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
