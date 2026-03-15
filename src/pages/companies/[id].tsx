import { useEffect, useState } from 'react';
import { Building2, Mail, Phone, MapPin, DollarSign, Bed, Bath, Ruler, Building } from 'lucide-react';
import Image from 'next/image';

interface Company {
  id: string;
  name: string;
  email: string;
  phone: string;
  _count?: {
    properties: number;
  };
}

interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  property_type: string;
  status: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: Array<{
    url: string;
    alt: string;
  }>;
}

const CompanyDetailPage = ({ id }: { id: string }) => {
  const [company, setCompany] = useState<Company | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const [companyResponse, propertiesResponse] = await Promise.all([
          fetch(`/api/companies/${id}`),
          fetch(`/api/companies/${id}/properties`)
        ]);
        
        const companyData = await companyResponse.json();
        const propertiesData = await propertiesResponse.json();
        
        setCompany(companyData);
        setProperties(propertiesData.properties);
      } catch (error) {
        console.error('Error fetching company:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-8 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <Building className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Company Not Found</h1>
            <p className="text-gray-600">The company you're looking for doesn't exist or has been removed.</p>
            <a href="/companies" className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors">
              Back to Companies
            </a>
          </div>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Company Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                <Building2 className="w-10 h-10 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
                <p className="text-gray-600 mt-1">Real Estate Company</p>
                <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    {company.email}
                  </span>
                  <span className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    {company.phone}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-lg font-semibold bg-green-100 text-green-800">
                {company._count?.properties || 0} Properties
              </span>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Properties</h2>
            <span className="text-gray-600">
              {properties.length} {properties.length === 1 ? 'property' : 'properties'}
            </span>
          </div>

          {properties.length === 0 ? (
            <div className="text-center py-12">
              <Building className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Properties Found</h3>
              <p className="text-gray-600">This company currently has no properties listed.</p>
              <a href="/properties" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
                Browse all properties →
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <div key={property.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="relative h-48 bg-gray-200">
                    {property.images.length > 0 ? (
                      <Image
                        src={property.images[0].url}
                        alt={property.images[0].alt}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Building className="w-12 h-12" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        property.status === 'available' 
                          ? 'bg-green-100 text-green-800' 
                          : property.status === 'sold'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {property.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{property.title}</h3>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-bold text-blue-600">{formatPrice(property.price)}</span>
                      <span className="text-sm text-gray-500">{property.property_type}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="text-sm">{property.location}</span>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-2 text-xs text-gray-600 border-t border-gray-200 pt-3">
                      <div className="flex items-center">
                        <Bed className="w-3 h-3 mr-1" />
                        {property.bedrooms} bd
                      </div>
                      <div className="flex items-center">
                        <Bath className="w-3 h-3 mr-1" />
                        {property.bathrooms} ba
                      </div>
                      <div className="flex items-center">
                        <Ruler className="w-3 h-3 mr-1" />
                        {property.area} sqft
                      </div>
                      <div className="flex items-center">
                        <Building className="w-3 h-3 mr-1" />
                        {property.property_type}
                      </div>
                    </div>
                    
                    <a 
                      href={`/properties/${property.id}`}
                      className="mt-4 w-full bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium block"
                    >
                      View Details
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailPage;
