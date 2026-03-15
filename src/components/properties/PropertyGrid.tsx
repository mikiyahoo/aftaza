'use client';

import { useState, useEffect } from 'react';
import PropertyCard from './PropertyCard';
import PropertyCardSkeleton from './PropertyCardSkeleton';
import Spinner from '@/components/ui/Spinner';

interface PropertyGridProps {
  initialProperties?: any[];
  filters?: any;
}

export default function PropertyGrid({ initialProperties, filters }: PropertyGridProps) {
  const [properties, setProperties] = useState(initialProperties || []);
  const [loading, setLoading] = useState(!initialProperties);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Load more properties
  const loadMore = async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: (page + 1).toString(),
        ...filters
      });
      
      const res = await fetch(`/api/properties?${params}`);
      const data = await res.json();
      
      if (data.properties.length > 0) {
        setProperties(prev => [...prev, ...data.properties]);
        setPage(prev => prev + 1);
        setHasMore(data.pagination.page < data.pagination.pages);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Failed to load more properties:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load if no initialProperties
  useEffect(() => {
    if (!initialProperties) {
      loadMore();
    }
  }, []);

  return (
    <div className="space-y-8">
      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map(property => (
          <PropertyCard key={property.pkey} property={property} />
        ))}
        
        {/* Show skeletons while loading */}
        {loading && (
          <>
            <PropertyCardSkeleton />
            <PropertyCardSkeleton />
            <PropertyCardSkeleton />
          </>
        )}
      </div>

      {/* Load more button */}
      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading ? (
              <>
                <Spinner size="sm" color="white" />
                <span>Loading...</span>
              </>
            ) : (
              <span>Load More Properties</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}