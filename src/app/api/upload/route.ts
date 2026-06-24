import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const ALLOWED_IMAGES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
];

const ALLOWED_VIDEOS = [
  'video/mp4',
  'video/webm',
  'video/ogg',
];

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

function getExtension(mimeType: string): string {
  const map: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'image/svg+xml': '.svg',
    'video/mp4': '.mp4',
    'video/webm': '.webm',
    'video/ogg': '.ogg',
  };
  return map[mimeType] || '.bin';
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Fichier trop volumineux (max 50 Mo)' },
        { status: 400 },
      );
    }

    const isImage = ALLOWED_IMAGES.includes(file.type);
    const isVideo = ALLOWED_VIDEOS.includes(file.type);

    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: `Type de fichier non autorisé : ${file.type}` },
        { status: 400 },
      );
    }

    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const ext = getExtension(file.type);
    const filename = `${timestamp}-${randomStr}${ext}`;

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json({
      url: publicUrl,
      filename,
      mimeType: file.type,
      size: file.size,
      type: isImage ? 'image' : 'video',
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Upload failed';
    console.error('Upload error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}