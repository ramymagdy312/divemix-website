import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';
import fs from 'fs';
import path from 'path';

// GET - جلب قائمة المجلدات (مع دعم المجلدات المتداخلة)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const parentPath = searchParams.get('path') || '';
    
    const folders: any[] = [];

    // Build the full path for listing
    const listPath = parentPath ? `uploads/${parentPath}` : 'uploads';

    // Try to get folders from Supabase Storage first
    try {
      const { data: supabaseFolders, error } = await supabase.storage
        .from('images')
        .list(listPath, {
          limit: 1000,
          offset: 0,
        });

      if (!error && supabaseFolders) {
        // Get unique folder names from file paths and actual folders
        const folderSet = new Set<string>();
        
        for (const item of supabaseFolders) {
          if (item.name && item.name !== '.emptyFolderPlaceholder') {
            // Check if it's a folder (no extension and no size metadata)
            if (!item.name.includes('.') && !item.metadata?.size) {
              folderSet.add(item.name);
            }
            // Also check for nested paths in file names
            else if (item.name.includes('/')) {
              const folderName = item.name.split('/')[0];
              folderSet.add(folderName);
            }
          }
        }

        // Convert to array and add folder info
        folderSet.forEach(folderName => {
          const fullPath = parentPath ? `${parentPath}/${folderName}` : folderName;
          folders.push({
            name: folderName,
            path: `uploads/${fullPath}`,
            fullPath: fullPath,
            parentPath: parentPath,
            source: 'supabase',
            createdAt: new Date().toISOString(),
            isNested: parentPath.length > 0
          });
        });
      }
    } catch (supabaseError) {
      console.log('Supabase storage not available, checking local folders...');
    }

    // Also check local uploads folder as fallback
    try {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      const targetDir = parentPath ? path.join(uploadsDir, parentPath) : uploadsDir;
      
      if (fs.existsSync(targetDir)) {
        const items = fs.readdirSync(targetDir, { withFileTypes: true });
        const localFolders = items.filter(item => item.isDirectory());

        for (const folder of localFolders) {
          // Check if this folder is not already in the list
          const existingFolder = folders.find(f => f.name === folder.name);
          if (!existingFolder) {
            const folderPath = path.join(targetDir, folder.name);
            const stats = fs.statSync(folderPath);
            const fullPath = parentPath ? `${parentPath}/${folder.name}` : folder.name;
            
            folders.push({
              name: folder.name,
              path: `uploads/${fullPath}`,
              fullPath: fullPath,
              parentPath: parentPath,
              source: 'local',
              createdAt: stats.birthtime.toISOString(),
              isNested: parentPath.length > 0
            });
          }
        }
      }
    } catch (localError) {
      console.log('Local uploads folder not accessible');
    }

    // Don't add default folders - let users create their own structure

    // Sort folders by name
    folders.sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({
      success: true,
      folders: folders
    });
  } catch (error) {
    console.error('Error fetching folders:', error);
    return NextResponse.json({ error: 'Failed to fetch folders' }, { status: 500 });
  }
}

// POST - إنشاء مجلد جديد (مع دعم المجلدات المتداخلة)
export async function POST(req: NextRequest) {
  try {
    const { folderName, parentPath } = await req.json();

    if (!folderName || typeof folderName !== 'string') {
      return NextResponse.json({ error: 'Folder name is required' }, { status: 400 });
    }

    // Clean folder name (remove special characters)
    const cleanFolderName = folderName
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    if (!cleanFolderName) {
      return NextResponse.json({ error: 'Invalid folder name' }, { status: 400 });
    }

    // Build the full path
    const fullPath = parentPath ? `${parentPath}/${cleanFolderName}` : cleanFolderName;

    try {
      // Create folder in Supabase by uploading a placeholder file
      const placeholderContent = new Uint8Array([]);
      
      const { data, error } = await supabase.storage
        .from('images')
        .upload(`uploads/${fullPath}/.emptyFolderPlaceholder`, placeholderContent, {
          contentType: 'text/plain',
        });

      if (error) {
        console.error('Supabase folder creation error:', error);
        return NextResponse.json({ error: 'Failed to create folder in Supabase' }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        folder: {
          name: cleanFolderName,
          path: `uploads/${fullPath}`,
          fullPath: fullPath,
          parentPath: parentPath || '',
          source: 'supabase',
          createdAt: new Date().toISOString(),
          isNested: Boolean(parentPath)
        }
      });
    } catch (supabaseError) {
      // Fallback to local folder creation
      try {
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        const folderPath = path.join(uploadsDir, fullPath);

        if (!fs.existsSync(folderPath)) {
          fs.mkdirSync(folderPath, { recursive: true });
          
          return NextResponse.json({
            success: true,
            folder: {
              name: cleanFolderName,
              path: `uploads/${fullPath}`,
              fullPath: fullPath,
              parentPath: parentPath || '',
              source: 'local',
              createdAt: new Date().toISOString(),
              isNested: Boolean(parentPath)
            }
          });
        } else {
          return NextResponse.json({ error: 'Folder already exists' }, { status: 400 });
        }
      } catch (localError) {
        console.error('Local folder creation error:', localError);
        return NextResponse.json({ error: 'Failed to create folder' }, { status: 500 });
      }
    }
  } catch (error) {
    console.error('Error creating folder:', error);
    return NextResponse.json({ error: 'Unexpected error occurred' }, { status: 500 });
  }
}

// DELETE - حذف مجلد (مع دعم المجلدات المتداخلة)
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const folderPath = searchParams.get('path');

    if (!folderPath) {
      return NextResponse.json({ error: 'Folder path is required' }, { status: 400 });
    }

    try {
      // Recursively delete all files and subfolders from Supabase
      const deleteRecursively = async (currentPath: string) => {
        console.log(`Deleting folder: ${currentPath}`);
        
        const { data: items, error: listError } = await supabase.storage
          .from('images')
          .list(`uploads/${currentPath}`, {
            limit: 1000,
            offset: 0,
          });

        if (listError) {
          console.error('Error listing folder contents:', listError);
          return;
        }

        if (items && items.length > 0) {
          const filesToDelete: string[] = [];
          const foldersToDelete: string[] = [];

          for (const item of items) {
            if (item.name) {
              const itemPath = `uploads/${currentPath}/${item.name}`;
              
              // Check if it's a file (has extension or size metadata) or placeholder
              if (item.name.includes('.') || item.metadata?.size !== undefined || item.name === '.emptyFolderPlaceholder') {
                filesToDelete.push(itemPath);
                console.log(`Adding file to delete: ${itemPath}`);
              } else {
                // It's a subfolder, add to recursive deletion
                foldersToDelete.push(`${currentPath}/${item.name}`);
                console.log(`Adding folder to delete: ${currentPath}/${item.name}`);
              }
            }
          }

          // Delete files first (including placeholder files)
          if (filesToDelete.length > 0) {
            console.log(`Deleting ${filesToDelete.length} files:`, filesToDelete);
            const { error: deleteError } = await supabase.storage
              .from('images')
              .remove(filesToDelete);

            if (deleteError) {
              console.error('Error deleting files:', deleteError);
            } else {
              console.log('Files deleted successfully');
            }
          }

          // Recursively delete subfolders
          for (const subfolderPath of foldersToDelete) {
            await deleteRecursively(subfolderPath);
          }
        }

        // Also try to delete the placeholder file for this folder
        const placeholderPath = `uploads/${currentPath}/.emptyFolderPlaceholder`;
        console.log(`Attempting to delete placeholder: ${placeholderPath}`);
        
        const { error: placeholderError } = await supabase.storage
          .from('images')
          .remove([placeholderPath]);

        if (placeholderError) {
          console.log('Placeholder file not found or already deleted:', placeholderError);
        } else {
          console.log('Placeholder file deleted successfully');
        }
      };

      await deleteRecursively(folderPath);

      console.log(`Folder deletion completed for: ${folderPath}`);
      return NextResponse.json({ 
        success: true, 
        message: `Folder '${folderPath}' deleted successfully` 
      });
    } catch (supabaseError) {
      console.error('Supabase deletion error:', supabaseError);
      // Fallback to local folder deletion
      try {
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        const targetFolderPath = path.join(uploadsDir, folderPath);

        if (fs.existsSync(targetFolderPath)) {
          fs.rmSync(targetFolderPath, { recursive: true, force: true });
        }

        return NextResponse.json({ success: true });
      } catch (localError) {
        console.error('Local folder deletion error:', localError);
        return NextResponse.json({ error: 'Failed to delete folder' }, { status: 500 });
      }
    }
  } catch (error) {
    console.error('Error deleting folder:', error);
    return NextResponse.json({ error: 'Unexpected error occurred' }, { status: 500 });
  }
}