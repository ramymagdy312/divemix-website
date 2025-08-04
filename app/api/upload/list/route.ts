import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const folder = searchParams.get('folder') || 'root';
    
    const images: any[] = [];

    // Try to get images from Supabase Storage first
    try {
      let listPath = 'uploads';
      if (folder !== 'root') {
        listPath = `uploads/${folder}`;
      }

      const { data: supabaseImages, error } = await supabase.storage
        .from('images')
        .list(listPath, {
          limit: 100,
          offset: 0,
        });

      if (!error && supabaseImages) {
        for (const file of supabaseImages) {
          if (file.name && file.name !== '.emptyFolderPlaceholder') {
            // Skip folders when listing root
            if (folder === 'root' && !file.name.includes('.')) {
              continue;
            }
            
            const filePath = folder === 'root' 
              ? `uploads/${file.name}` 
              : `uploads/${folder}/${file.name}`;
              
            const { data: publicData } = supabase.storage
              .from('images')
              .getPublicUrl(filePath);
            
            images.push({
              url: publicData.publicUrl,
              filename: file.name,
              size: file.metadata?.size || 0,
              uploadedAt: file.created_at || file.updated_at,
              source: 'supabase',
              folder: folder,
              path: filePath
            });
          }
        }
      }
    } catch (supabaseError) {
      console.log('Supabase storage not available, checking local uploads...');
    }

    // Also check local uploads folder as fallback
    try {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      let targetDir = uploadsDir;
      
      if (folder !== 'root') {
        targetDir = path.join(uploadsDir, folder);
      }
      
      if (fs.existsSync(targetDir)) {
        const files = fs.readdirSync(targetDir);
        const imageFiles = files.filter(file => {
          const ext = path.extname(file).toLowerCase();
          return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
        });

        for (const file of imageFiles) {
          const filePath = path.join(targetDir, file);
          const stats = fs.statSync(filePath);
          
          // Check if this image is not already in the list (avoid duplicates)
          const existingImage = images.find(img => img.filename === file);
          if (!existingImage) {
            const urlPath = folder === 'root' 
              ? `/uploads/${file}` 
              : `/uploads/${folder}/${file}`;
              
            images.push({
              url: urlPath,
              filename: file,
              size: stats.size,
              uploadedAt: stats.mtime.toISOString(),
              source: 'local',
              folder: folder,
              path: urlPath
            });
          }
        }
      }
    } catch (localError) {
      console.log('Local uploads folder not accessible');
    }

    // Sort images by upload date (newest first)
    images.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

    return NextResponse.json({
      success: true,
      images: images,
      count: images.length
    });

  } catch (error) {
    console.error('Error listing images:', error);
    return NextResponse.json(
      { 
        error: 'Failed to list images',
        images: [],
        count: 0
      }, 
      { status: 500 }
    );
  }
}