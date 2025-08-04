const https = require('https');
const fs = require('fs');
const path = require('path');

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