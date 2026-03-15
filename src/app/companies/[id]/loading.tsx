import Skeleton from '@/components/ui/Skeleton';
import PropertyCardSkeleton from '@/components/properties/PropertyCardSkeleton';

export default function CompanyDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Company header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <Skeleton className="h-8 w-64" variant="text" />
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-5 w-5" variant="circular" />
                <Skeleton className="h-5 w-48" variant="text" />
              </div>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-5 w-5" variant="circular" />
                <Skeleton className="h-5 w-36" variant="text" />
              </div>
            </div>
          </div>
          <Skeleton className="h-10 w-32" variant="rectangular" />
        </div>
      </div>

      {/* Properties title */}
      <div className="mb-6">
        <Skeleton className="h-6 w-48" variant="text" />
      </div>

      {/* Properties grid with skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <PropertyCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}