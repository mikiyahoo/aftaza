import Skeleton from '@/components/ui/Skeleton';

export default function MobileSkeleton() {
  return (
    <div className="lg:hidden space-y-4 p-4">
      {/* Mobile header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-32" variant="text" />
        <Skeleton className="h-8 w-8" variant="circular" />
      </div>

      {/* Mobile search */}
      <Skeleton className="h-12 w-full rounded-lg" variant="rectangular" />

      {/* Mobile list */}
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex space-x-3">
            <Skeleton className="h-20 w-20 rounded-lg" variant="rectangular" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4" variant="text" />
              <Skeleton className="h-4 w-1/2" variant="text" />
              <Skeleton className="h-4 w-1/3" variant="text" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}