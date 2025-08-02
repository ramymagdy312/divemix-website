const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ixqhqfqjqjqjqjqjqjqj.supabase.co';
const supabaseKey = 'your-anon-key-here'; // Replace with your actual key

const supabase = createClient(supabaseUrl, supabaseKey);

// Sample diving equipment images from Unsplash
const divingImages = {
  masks: [
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800',
    'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=800'
  ],
  fins: [
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800',
    'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=800'
  ],
  general: [
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800',
    'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=800',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800'
  ]
};

async function updateProductImages() {
  try {
    console.log('🔄 Updating product images...');

    // Get all products
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, image_url')
      .eq('is_active', true);

    if (error) throw error;

    console.log(`Found ${products.length} products to update`);

    for (const product of products) {
      let imagesToUse = divingImages.general;
      
      // Choose specific images based on product name
      if (product.name.toLowerCase().includes('mask')) {
        imagesToUse = divingImages.masks;
      } else if (product.name.toLowerCase().includes('fin')) {
        imagesToUse = divingImages.fins;
      }

      // Update the product with multiple images
      const { error: updateError } = await supabase
        .from('products')
        .update({
          images: imagesToUse,
          image_url: imagesToUse[0] // Keep the first image as primary
        })
        .eq('id', product.id);

      if (updateError) {
        console.error(`❌ Error updating ${product.name}:`, updateError);
      } else {
        console.log(`✅ Updated ${product.name} with ${imagesToUse.length} images`);
      }
    }

    console.log('🎉 All products updated successfully!');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

updateProductImages();