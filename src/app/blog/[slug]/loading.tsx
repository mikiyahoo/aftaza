import Skeleton from '@/components/ui/Skeleton';

export default function BlogPostLoading() {
  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Hero image */}
      <Skeleton className="h-[400px] w-full rounded-lg mb-8" variant="rectangular" />
      
      {/* Title */}
      <Skeleton className="h-10 w-3/4 mx-auto mb-4" variant="text" />
      
      {/* Author & date */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-10 w-10" variant="circular" />
          <Skeleton className="h-5 w-24" variant="text" />
        </div>
        <Skeleton className="h-5 w-32" variant="text" />
      </div>
      
      {/* Content */}
      <div className="space-y-4">
        {[...Array(10)].map((_, i) => (
          <Skeleton 
            key={i} 
            className={`h-4 w-${i % 3 === 0 ? 'full' : i % 3 === 1 ? '5/6' : '4/5'}`} 
            variant="text" 
          />
        ))}
      </div>
    </article>
  );
}