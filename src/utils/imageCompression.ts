export async function compressImage(file: File | Blob, maxWidth = 1600, filename = 'image.webp'): Promise<File> {
  const fileName = (file as File).name || filename;
  
  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      
      let width = img.naturalWidth || img.width;
      let height = img.naturalHeight || img.height;

      if (!width || !height) {
        const fallbackFile = file instanceof File ? file : new File([file], fileName, { type: file.type || 'image/jpeg' });
        resolve(fallbackFile);
        return;
      }

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        const fallbackFile = file instanceof File ? file : new File([file], fileName, { type: file.type || 'image/jpeg' });
        resolve(fallbackFile);
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const newName = fileName.replace(/\.[^/.]+$/, "") + ".webp";
            const compressedFile = new File([blob], newName, {
              type: 'image/webp',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            const fallbackFile = file instanceof File ? file : new File([file], fileName, { type: file.type || 'image/jpeg' });
            resolve(fallbackFile);
          }
        },
        'image/webp',
        0.82
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      const fallbackFile = file instanceof File ? file : new File([file], fileName, { type: file.type || 'image/jpeg' });
      resolve(fallbackFile);
    };

    img.src = objectUrl;
  });
}
