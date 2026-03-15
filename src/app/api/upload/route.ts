import { NextRequest, NextResponse } from 'next/server';
import { uploadFile } from '@/lib/fileUpload';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Handle file upload
    const formData = await request.formData();
    const file = formData.get('file');
    const folder = formData.get('folder') as string;

    if (!file || !folder) {
      return NextResponse.json({ error: 'Missing file or folder' }, { status: 400 });
    }

    // Upload the file
    const uploadedFile = await uploadFile(file as File, folder as 'properties' | 'companies' | 'testimonials');

    return NextResponse.json({ success: true, file: uploadedFile }, { status: 200 });
  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
