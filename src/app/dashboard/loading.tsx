import Skeleton from '@/components/ui/Skeleton';

export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-5 w-24" variant="text" />
              <Skeleton className="h-8 w-8" variant="circular" />
            </div>
            <Skeleton className="h-8 w-32 mb-2" variant="text" />
            <Skeleton className="h-4 w-20" variant="text" />
          </div>
        ))}
      </div>

      {/* Charts skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6">
            <Skeleton className="h-6 w-40 mb-4" variant="text" />
            <Skeleton className="h-64 w-full" variant="rectangular" />
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <Skeleton className="h-6 w-32 mb-4" variant="text" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-10 w-10" variant="circular" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" variant="text" />
                <Skeleton className="h-3 w-1/2" variant="text" />
              </div>
              <Skeleton className="h-4 w-20" variant="text" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}