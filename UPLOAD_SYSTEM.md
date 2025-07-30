# Image Upload System

## Overview
The image upload system has been developed to be similar to WordPress, where users can upload images directly instead of entering URLs.

## New Features

### 🖼️ Drag & Drop Image Upload
- Images can be dragged directly to the upload area
- Or click to select images from device

### 📁 Supported File Types
- PNG
- JPG/JPEG  
- GIF
- Maximum 5MB per image

### 🔄 Instant Preview
- Preview images immediately after upload
- Ability to delete images before saving
- Grid display for multiple images

### 🗂️ File Management
- Save images in `/public/uploads/` folder
- Unique file names to avoid conflicts
- Automatic deletion of images when removed from form

## Updated Pages

### 📱 Applications
- **Add New Application**: `/admin/applications/new`
- **Edit Application**: `/admin/applications/[id]/edit`
- Supports multiple image upload (up to 10 images)

### 🖼️ Gallery
- **Add New Image**: `/admin/gallery/new`
- **Edit Image**: `/admin/gallery/[id]/edit`
- Supports single image upload

### 📦 Products
- **Add New Product**: `/admin/products/new`
- **Edit Product**: `/admin/products/[id]/edit`
- Supports multiple image upload (up to 10 images)

### 🏷️ Categories
- **Add New Category**: `/admin/categories/new`
- **Edit Category**: `/admin/categories/[id]/edit`
- Supports two images: Hero image and Category image

## New Components

### `ImageUploader`
Component for multiple image upload
```tsx
<ImageUploader
  images={images}
  onImagesChange={setImages}
  multiple={true}
  maxImages={10}
  label="Product Images"
/>
```

### `SingleImageUploader`
Component for single image upload
```tsx
<SingleImageUploader
  image={image}
  onImageChange={setImage}
  label="Hero Image"
  required={true}
/>
```

## New API

### `POST /api/upload`
Upload new image file
- Accepts FormData with image file
- Saves file in `/public/uploads/`
- Returns image URL

### `DELETE /api/upload?filename=...`
Delete image file
- Deletes file from server
- Used when removing images from forms

## Security

### ✅ File Type Validation
- Only accepts image files (image/*)
- Rejects any other file types

### ✅ File Size Validation
- Maximum 5MB per image
- Clear error message when limit exceeded

### ✅ Safe File Names
- Add timestamp to avoid conflicts
- Clean file names from dangerous characters
- Prevent path traversal attacks

## Folder Structure

```
public/
├── uploads/           # Uploaded images folder
│   ├── .gitkeep      # To keep folder in Git
│   ├── .gitignore    # To ignore uploaded files
│   └── [uploaded files]
```

## Usage

1. **Navigate to any admin page containing images**
2. **Drag images to upload area or click to select**
3. **Wait for upload to complete**
4. **Review uploaded images**
5. **Save the form**

## Important Notes

- Uploaded images are saved locally in `/public/uploads/` folder
- In production environment, it's recommended to use cloud storage service like AWS S3
- Old images (external URLs) will continue to work
- Can mix uploaded images with external URLs

## Future Development

- [ ] Support more file types
- [ ] Automatic image compression
- [ ] Web-optimized images (WebP)
- [ ] Integration with cloud storage services
- [ ] Media library management