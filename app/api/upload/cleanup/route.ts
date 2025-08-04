import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

// DELETE - حذف المجلدات الافتراضية غير المرغوب فيها
export async function DELETE(req: NextRequest) {
  try {
    const defaultFolders = ['products', 'categories', 'gallery'];
    const results = [];

    for (const folderName of defaultFolders) {
      try {
        console.log(`Attempting to delete default folder: ${folderName}`);
        
        // List all files in the folder first
        const { data: items, error: listError } = await supabase.storage
          .from('images')
          .list(`uploads/${folderName}`, {
            limit: 1000,
            offset: 0,
          });

        if (!listError && items && items.length > 0) {
          const filesToDelete: string[] = [];

          for (const item of items) {
            if (item.name) {
              const itemPath = `uploads/${folderName}/${item.name}`;
              filesToDelete.push(itemPath);
              console.log(`Adding to delete: ${itemPath}`);
            }
          }

          // Delete all files in the folder
          if (filesToDelete.length > 0) {
            const { error: deleteError } = await supabase.storage
              .from('images')
              .remove(filesToDelete);

            if (deleteError) {
              console.error(`Error deleting files in ${folderName}:`, deleteError);
              results.push({
                folder: folderName,
                success: false,
                error: deleteError.message,
                filesDeleted: 0
              });
            } else {
              console.log(`Successfully deleted ${filesToDelete.length} files from ${folderName}`);
              results.push({
                folder: folderName,
                success: true,
                filesDeleted: filesToDelete.length
              });
            }
          } else {
            results.push({
              folder: folderName,
              success: true,
              filesDeleted: 0,
              message: 'Folder was empty'
            });
          }
        } else {
          results.push({
            folder: folderName,
            success: true,
            filesDeleted: 0,
            message: 'Folder not found or already empty'
          });
        }

        // Also try to delete the placeholder file
        const placeholderPath = `uploads/${folderName}/.emptyFolderPlaceholder`;
        const { error: placeholderError } = await supabase.storage
          .from('images')
          .remove([placeholderPath]);

        if (!placeholderError) {
          console.log(`Deleted placeholder for ${folderName}`);
        }

      } catch (error) {
        console.error(`Error processing folder ${folderName}:`, error);
        results.push({
          folder: folderName,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Cleanup completed',
      results: results
    });

  } catch (error) {
    console.error('Error during cleanup:', error);
    return NextResponse.json({ 
      error: 'Cleanup failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// GET - عرض المجلدات الافتراضية الموجودة
export async function GET(req: NextRequest) {
  try {
    const defaultFolders = ['products', 'categories', 'gallery'];
    const folderStatus = [];

    for (const folderName of defaultFolders) {
      try {
        const { data: items, error } = await supabase.storage
          .from('images')
          .list(`uploads/${folderName}`, {
            limit: 10,
            offset: 0,
          });

        if (!error && items) {
          folderStatus.push({
            folder: folderName,
            exists: true,
            fileCount: items.length,
            files: items.map(item => item.name)
          });
        } else {
          folderStatus.push({
            folder: folderName,
            exists: false,
            fileCount: 0,
            files: []
          });
        }
      } catch (error) {
        folderStatus.push({
          folder: folderName,
          exists: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return NextResponse.json({
      success: true,
      defaultFolders: folderStatus
    });

  } catch (error) {
    console.error('Error checking default folders:', error);
    return NextResponse.json({ 
      error: 'Failed to check default folders' 
    }, { status: 500 });
  }
}