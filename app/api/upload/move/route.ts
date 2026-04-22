import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

// POST - Move one or many images from their current Supabase Storage path
// to a new folder under `uploads/`. Accepts either:
//   { fromPath: string,    toFolder: string }   // single
//   { fromPaths: string[], toFolder: string }   // bulk
//
// `toFolder` may be "" / "root" for the uploads root, or a nested path
// like "products/lw-compressors". Returns the list of successful moves
// with their new public URLs so the client can refresh state.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawFromPaths: string[] = Array.isArray(body.fromPaths)
      ? body.fromPaths
      : body.fromPath
      ? [body.fromPath]
      : [];

    const toFolderRaw: string = (body.toFolder ?? '').toString();

    if (rawFromPaths.length === 0) {
      return NextResponse.json(
        { error: 'No source paths provided' },
        { status: 400 }
      );
    }

    // Normalize source paths: accept either a full public URL or a bucket path.
    const fromPaths = rawFromPaths
      .map((p) => extractBucketPath(p))
      .filter((p): p is string => Boolean(p));

    if (fromPaths.length === 0) {
      return NextResponse.json(
        { error: 'Invalid source paths; expected "uploads/..." paths or public URLs' },
        { status: 400 }
      );
    }

    const toFolder = normalizeFolder(toFolderRaw);

    const results: Array<{
      from: string;
      to: string;
      url?: string;
      success: boolean;
      error?: string;
    }> = [];

    for (const from of fromPaths) {
      const filename = from.split('/').pop() || '';
      if (!filename) {
        results.push({ from, to: '', success: false, error: 'Invalid source filename' });
        continue;
      }

      const to = toFolder ? `uploads/${toFolder}/${filename}` : `uploads/${filename}`;

      if (from === to) {
        results.push({ from, to, success: true, error: 'Source and destination are the same' });
        continue;
      }

      const { error: moveError } = await supabase.storage
        .from('images')
        .move(from, to);

      if (moveError) {
        results.push({ from, to, success: false, error: moveError.message });
        continue;
      }

      const { data: publicData } = supabase.storage.from('images').getPublicUrl(to);
      results.push({ from, to, url: publicData.publicUrl, success: true });
    }

    const succeeded = results.filter((r) => r.success).length;
    const failed = results.length - succeeded;

    return NextResponse.json({
      success: failed === 0,
      moved: succeeded,
      failed,
      results,
    });
  } catch (error: any) {
    console.error('Move error:', error);
    return NextResponse.json(
      { error: 'Unexpected error during move' },
      { status: 500 }
    );
  }
}

// Accept a public URL like https://<ref>.supabase.co/storage/v1/object/public/images/uploads/foo.jpg
// or a local path like /uploads/foo.jpg, and return "uploads/foo.jpg".
function extractBucketPath(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  if (trimmed.startsWith('uploads/')) return trimmed;

  const marker = '/uploads/';
  const idx = trimmed.indexOf(marker);
  if (idx >= 0) {
    return 'uploads/' + trimmed.substring(idx + marker.length);
  }
  return null;
}

function normalizeFolder(folder: string): string {
  const trimmed = folder.trim().replace(/^\/+|\/+$/g, '');
  if (!trimmed || trimmed === 'root') return '';
  return trimmed;
}
