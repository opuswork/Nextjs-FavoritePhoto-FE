import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_BYTES = 5 * 1024 * 1024; // 5MB

/**
 * POST /api/upload/photo-card
 * Body: FormData with "file" (image).
 * Uploads to Vercel Blob and returns { url }.
 * Set BLOB_READ_WRITE_TOKEN in Vercel (or locally) for the Blob store.
 */
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json(
        { error: '파일이 필요합니다.', code: 'MISSING_FILE' },
        { status: 400 }
      );
    }

    const { size, type } = file;
    if (!ALLOWED_TYPES.includes(type)) {
      return NextResponse.json(
        { error: 'JPG, PNG, WEBP만 업로드할 수 있습니다.', code: 'INVALID_TYPE' },
        { status: 400 }
      );
    }
    if (size > MAX_BYTES) {
      return NextResponse.json(
        { error: '파일 크기는 5MB 이하여야 합니다.', code: 'FILE_TOO_LARGE' },
        { status: 400 }
      );
    }

    const ext = type === 'image/png' ? 'png' : type === 'image/webp' ? 'webp' : 'jpg';
    const pathname = `photocards/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const blob = await put(pathname, file, {
      access: 'public',
      addRandomSuffix: true,
      contentType: type,
    });

    return NextResponse.json({ url: blob.url });
  } catch (err) {
    console.error('Photo card upload error:', err);
    return NextResponse.json(
      { error: err?.message ?? '업로드에 실패했습니다.' },
      { status: 500 }
    );
  }
}
