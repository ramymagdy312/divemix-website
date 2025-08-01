import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files allowed' }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image must be under 5MB' }, { status: 400 })
    }

    // Check if Supabase is properly configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey || 
        supabaseUrl === 'your-supabase-url' || 
        supabaseKey === 'your-supabase-anon-key' ||
        supabaseUrl === 'https://placeholder.supabase.co' ||
        supabaseKey === 'placeholder-key') {
      
      // Development mode: return a placeholder image URL
      console.warn('Supabase not configured. Using placeholder image.');
      const placeholderImages = [
        'https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?auto=format&fit=crop&w=2000',
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000',
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=2000',
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=2000',
        'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=2000',
        'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=2000',
        'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=2000'
      ];
      
      const randomImage = placeholderImages[Math.floor(Math.random() * placeholderImages.length)];
      
      return NextResponse.json({
        success: true,
        url: randomImage,
        filename: `placeholder_${Date.now()}.jpg`,
        development: true
      })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const filename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`

    const { data, error } = await supabase.storage
      .from('images')
      .upload(`uploads/${filename}`, buffer, {
        contentType: file.type,
      })

    if (error) {
      console.error(error)
      return NextResponse.json({ error: 'Failed to upload to Supabase' }, { status: 500 })
    }

    const { data: publicData } = supabase.storage.from('images').getPublicUrl(data.path)

    return NextResponse.json({
      success: true,
      url: publicData.publicUrl,
      filename: filename,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Unexpected error occurred' }, { status: 500 })
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
