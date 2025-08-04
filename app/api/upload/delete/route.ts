import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';
import fs from 'fs';
import path from 'path';

// DELETE - حذف صورة
export async function DELETE(req: NextRequest) {
  try {
    const { imageUrl } = await req.json();

    if (!imageUrl || typeof imageUrl !== 'string') {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    // Extract the file path from the URL
    let filePath = '';
    
    if (imageUrl.includes('/uploads/')) {
      // For both local and Supabase URLs, extract the path after /uploads/
      const urlParts = imageUrl.split('/uploads/');
      if (urlParts.length > 1) {
        filePath = `uploads/${urlParts[1]}`;
      }
    } else {
      return NextResponse.json({ error: 'Invalid image URL format' }, { status: 400 });
    }

    try {
      // Try to delete from Supabase first
      const { error: supabaseError } = await supabase.storage
        .from('images')
        .remove([filePath]);

      if (supabaseError) {
        console.error('Supabase deletion error:', supabaseError);
        // Continue to try local deletion as fallback
      } else {
        return NextResponse.json({ 
          success: true, 
          message: 'Image deleted successfully from cloud storage' 
        });
      }
    } catch (supabaseError) {
      console.log('Supabase not available, trying local deletion...');
    }

    // Fallback to local file deletion
    try {
      const localFilePath = path.join(process.cwd(), 'public', filePath);
      
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
        return NextResponse.json({ 
          success: true, 
          message: 'Image deleted successfully from local storage' 
        });
      } else {
        return NextResponse.json({ error: 'Image file not found' }, { status: 404 });
      }
    } catch (localError) {
      console.error('Local file deletion error:', localError);
      return NextResponse.json({ error: 'Failed to delete image file' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json({ error: 'Unexpected error occurred' }, { status: 500 });
  }
}