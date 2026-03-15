import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { prisma } from './prisma';

export interface ImageOptimizeOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
}

export async function optimizeImage(
  inputPath: string,
  outputPath: string,
  options: ImageOptimizeOptions = {}
) {
  const {
    width,
    height,
    quality = 80,
    format = 'webp'
  } = options;

  let pipeline = sharp(inputPath);

  // Resize if dimensions provided
  if (width || height) {
    pipeline = pipeline.resize(width, height, {
      fit: 'cover',
      withoutEnlargement: true
    });
  }

  // Convert format
  switch (format) {
    case 'webp':
      pipeline = pipeline.webp({ quality });
      break;
    case 'jpeg':
      pipeline = pipeline.jpeg({ quality });
      break;
    case 'png':
      pipeline = pipeline.png({ quality });
      break;
  }

  await pipeline.toFile(outputPath);
}

export async function optimizePropertyImages(propertyId: number) {
  const uploadDir = path.join(process.cwd(), 'public/uploads');
  const optimizedDir = path.join(process.cwd(), 'public/images/optimized');
  
  // Ensure optimized directory exists
  if (!fs.existsSync(optimizedDir)) {
    fs.mkdirSync(optimizedDir, { recursive: true });
  }

  // Get all images for property from database
  const images = await prisma.propertyImage.findMany({
    where: { propertyId: propertyId }
  });

  for (const image of images) {
    const originalPath = path.join(uploadDir, image.imageUrl);
    const filename = path.basename(image.imageUrl, path.extname(image.imageUrl));
    
    // Create multiple sizes for responsive images
    const sizes = [
      { width: 400, suffix: 'small' },
      { width: 800, suffix: 'medium' },
      { width: 1200, suffix: 'large' }
    ];

    for (const size of sizes) {
      const outputPath = path.join(
        optimizedDir,
        `${filename}-${size.suffix}.webp`
      );
      
      await optimizeImage(originalPath, outputPath, {
        width: size.width,
        format: 'webp',
        quality: 75
      });
    }
  }
}