'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function PageLoader() {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    // Listen for route changes
    window.addEventListener('beforeunload', handleStart);
    
    // Simulate loading complete after navigation
    const timeout = setTimeout(handleComplete, 500);

    return () => {
      window.removeEventListener('beforeunload', handleStart);
      clearTimeout(timeout);
    };
  }, [pathname, searchParams]);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-blue-200 z-50">
      <div 
        className="h-full bg-blue-600 animate-loading-bar"
        style={{ width: '100%', transformOrigin: 'left' }}
      />
    </div>
  );
}