import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Configuration
const ASSETS_PATH = process.env.ASSETS_PATH || '/home/aftazaco/public_html/assets';
const ASSETS_URL = process.env.ASSETS_URL || 'https://aftaza.com/assets';
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '5242880');
const ALLOWED_TYPES = (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/webp,image/gif').split(',');

export interface UploadedFile {
  filename: string;
  originalName: string;
  path: string;
  url: string;
  size: number;
  mimeType: string;
}

export async function uploadFile(
  file: File | Buffer,
  folder: 'properties' | 'companies' | 'testimonials',
  originalName?: string
): Promise<UploadedFile> {
  try {
    // Validate file
    if (file instanceof File) {
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(`File too large. Max size: ${MAX_FILE_SIZE / 1024 / 1024}MB`);
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        throw new Error(`File type not allowed. Allowed: ${ALLOWED_TYPES.join(', ')}`);
      }
    }
    
    // Generate unique filename
    const fileExt = path.extname(originalName || (file instanceof File ? file.name : 'file.jpg'));
    const filename = `${uuidv4()}${fileExt}`;
    
    // Create folder path
    const folderPath = path.join(ASSETS_PATH, folder);
    const filePath = path.join(folderPath, filename);
    
    // Ensure folder exists
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    
    // Write file
    const buffer = file instanceof File ? Buffer.from(await file.arrayBuffer()) : file;
    fs.writeFileSync(filePath, buffer);
    
    // Return file info
    return {
      filename,
      originalName: originalName || (file instanceof File ? file.name : 'file.jpg'),
      path: filePath,
      url: `${ASSETS_URL}/${folder}/${filename}`,
      size: buffer.length,
      mimeType: file instanceof File ? file.type : 'image/jpeg'
    };
  } catch (error) {
    console.error('File upload error:', error);
    throw error;
  }
}

export async function deleteFile(fileUrl: string): Promise<void> {
  try {
    // Extract path from URL
    const urlPath = fileUrl.replace(ASSETS_URL, '');
    const filePath = path.join(ASSETS_PATH, urlPath);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('File delete error:', error);
  }
}
