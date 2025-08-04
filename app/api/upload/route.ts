import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const folder = formData.get('folder') as string | null

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files allowed' }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image must be under 5MB' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    
    // Determine upload path based on folder (support nested paths)
    const uploadPath = folder && folder !== 'root' 
      ? `uploads/${folder}/${filename}` 
      : `uploads/${filename}`;

    const { data, error } = await supabase.storage
      .from('images')
      .upload(uploadPath, buffer, {
        contentType: file.type,
      })

    if (error) {
      console.error(error);
      return NextResponse.json({ error: 'Failed to upload to Supabase' }, { status: 500 });
    }
    
    const { data: publicData } = supabase.storage.from('images').getPublicUrl(data.path);

    return NextResponse.json({
      success: true,
      url: publicData.publicUrl,
      filename: filename,
      folder: folder || 'root',
      path: uploadPath
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Unexpected error occurred' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const filename = searchParams.get('filename')

    if (!filename) {
      return NextResponse.json({ error: 'No filename provided' }, { status: 400 })
    }

    // اسم الملف لازم يكون في المسار الصحيح داخل الـ bucket
    const filepath = `uploads/${filename}`

    const { error } = await supabase.storage
      .from('images')
      .remove([filepath])

    if (error) {
      console.error(error)
      return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Unexpected error occurred' }, { status: 500 })
  }
}
