const https = require('https');
const fs = require('fs');
const path = require('path');

// Sample images from Unsplash
// const sampleImages = [
//   {
//     url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800&q=80',
//     filename: 'diving-mask-professional.jpg'
//   },
//   {
//     url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
//     filename: 'diving-fins-blue.jpg'
//   },
//   {
//     url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80',
//     filename: 'underwater-camera.jpg'
//   },
//   {
//     url: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=800&q=80',
//     filename: 'diving-equipment-set.jpg'
//   },
//   {
//     url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800&q=80',
//     filename: 'safety-gear-diving.jpg'
//   }
// ];

const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(uploadsDir, filename);
    
    // Skip if file already exists
    if (fs.existsSync(filePath)) {
      console.log(`✓ ${filename} already exists`);
      resolve();
      return;
    }

    const file = fs.createWriteStream(filePath);
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✓ Downloaded ${filename}`);
          resolve();
        });
      } else {
        fs.unlink(filePath, () => {}); // Delete the file on error
        reject(new Error(`Failed to download ${filename}: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      fs.unlink(filePath, () => {}); // Delete the file on error
      reject(err);
    });
  });
}

async function downloadAllImages() {
  console.log('🚀 Downloading sample images...');
  
  try {
    for (const image of sampleImages) {
      await downloadImage(image.url, image.filename);
    }
    console.log('✅ All sample images downloaded successfully!');
  } catch (error) {
    console.error('❌ Error downloading images:', error);
  }
}

downloadAllImages();