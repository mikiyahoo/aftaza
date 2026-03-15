import Skeleton from '@/components/ui/Skeleton';

export default function PropertyCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Image skeleton */}
      <Skeleton className="h-48 w-full" variant="rectangular" />
      
      <div className="p-4 space-y-3">
        {/* Title skeleton */}
        <Skeleton className="h-6 w-3/4" variant="text" />
        
        {/* Location skeleton */}
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4" variant="circular" />
          <Skeleton className="h-4 w-1/2" variant="text" />
        </div>
        
        {/* Divider */}
        <div className="border-t pt-3">
          {/* Amenities skeleton */}
          <div className="flex justify-between">
            <Skeleton className="h-4 w-16" variant="text" />
            <Skeleton className="h-4 w-16" variant="text" />
            <Skeleton className="h-4 w-16" variant="text" />
          </div>
        </div>
      </div>
    </div>
  );
}