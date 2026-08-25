export async function compressImage(file: File, maxWidth = 1600): Promise<File> {
  // Only compress images, skip others (gifs, svg, etc. if any)
  if (!file.type.startsWith('image/') || file.type === 'image/gif' || file.type === 'image/svg+xml') {
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file); // Fallback to original if ctx fails
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP for better compression if supported, else JPEG
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Create a new File from the blob
              const newName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
              const compressedFile = new File([blob], newName, {
                type: 'image/webp',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file); // Fallback to original
            }
          },
          'image/webp',
          0.8 // Quality
        );
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
}
