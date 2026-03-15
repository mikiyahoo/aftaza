import Skeleton from '@/components/ui/Skeleton';

export default function PropertyDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button skeleton */}
      <div className="mb-6">
        <Skeleton className="h-10 w-24" variant="rectangular" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Images */}
        <div className="lg:col-span-2 space-y-4">
          {/* Main image */}
          <Skeleton className="h-[400px] w-full" variant="rectangular" />
          
          {/* Thumbnail grid */}
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" variant="rectangular" />
            ))}
          </div>
        </div>

        {/* Right column - Details */}
        <div className="space-y-6">
          {/* Title */}
          <Skeleton className="h-8 w-3/4" variant="text" />
          
          {/* Price */}
          <Skeleton className="h-10 w-1/2" variant="text" />
          
          {/* Location */}
          <div className="flex items-center space-x-2">
            <Skeleton className="h-5 w-5" variant="circular" />
            <Skeleton className="h-5 w-2/3" variant="text" />
          </div>
          
          {/* Amenities grid */}
          <div className="grid grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center space-x-2">
                <Skeleton className="h-5 w-5" variant="circular" />
                <Skeleton className="h-5 w-16" variant="text" />
              </div>
            ))}
          </div>
          
          {/* Description */}
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" variant="text" />
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" variant="text" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}