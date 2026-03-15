'use client';

import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  fill?: boolean;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  fill = false
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  // Extract filename without extension
  const filename = src.split('/').pop()?.split('.')[0] || '';
  const basePath = '/images/optimized';

  // Generate WebP paths for different sizes
  const imageUrls = {
    small: `${basePath}/${filename}-small.webp`,
    medium: `${basePath}/${filename}-medium.webp`,
    large: `${basePath}/${filename}-large.webp`,
    fallback: src
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <Image
        src={imageUrls.large}
        alt={alt}
        width={fill ? undefined : (width || 800)}
        height={fill ? undefined : (height || 600)}
        fill={fill}
        priority={priority}
        sizes={sizes}
        className={`
          duration-700 ease-in-out
          ${isLoading ? 'scale-110 blur-2xl grayscale' : 'scale-100 blur-0 grayscale-0'}
          ${fill ? 'object-cover object-center' : ''}
        `}
        onLoadingComplete={() => setIsLoading(false)}
        onError={(e) => {
          // Fallback to original image if WebP fails
          e.currentTarget.src = imageUrls.fallback;
        }}
      />
    </div>
  );
}