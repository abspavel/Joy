import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { compressImage } from '../../utils/imageCompression';
import { Loader2 } from 'lucide-react';

export function OptimizeImagesAdmin() {
  const [status, setStatus] = useState<string>('');
  const [progress, setProgress] = useState<string>('');
  const [running, setRunning] = useState(false);

  const optimizeTable = async (tableName: string, urlColumn: string, maxWidth: number) => {
    const { data: rows, error: fetchError } = await supabase.from(tableName).select(`id, ${urlColumn}`);
    if (fetchError || !rows) {
      console.error(`Error fetching ${tableName}`, fetchError);
      return { compressedCount: 0, savedBytes: 0 };
    }

    let compressedCount = 0;
    let savedBytes = 0;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const url = row[urlColumn];
      
      if (!url || typeof url !== 'string' || !url.includes('supabase.co') || !url.includes('/portfolio-media/')) {
        continue; // Not a supabase media file or empty
      }

      setStatus(`Optimizing ${tableName} - Item ${i + 1} of ${rows.length}...`);
      
      try {
        // Download image
        const response = await fetch(url);
        if (!response.ok) continue;
        const blob = await response.blob();
        
        // Skip if already very small (e.g., < 50KB) or not an image we compress
        if (blob.size < 50 * 1024) continue;
        if (!blob.type.startsWith('image/') || blob.type === 'image/gif' || blob.type === 'image/svg+xml') continue;

        const file = new File([blob], 'image.jpg', { type: blob.type });
        const compressedFile = await compressImage(file, maxWidth);
        
        // If it actually compressed and is at least 10% smaller
        if (compressedFile.size < file.size * 0.9) {
          savedBytes += (file.size - compressedFile.size);
          compressedCount++;

          // Upload compressed version replacing the old file
          const pathPath = url.split('/portfolio-media/')[1];
          if (pathPath) {
             const { error: uploadError } = await supabase.storage.from('portfolio-media').upload(pathPath, compressedFile, { upsert: true, cacheControl: '31536000' });
             if (uploadError) {
                console.error('Upload error', uploadError);
             }
          }
        }
      } catch (err) {
        console.error(`Error optimizing ${url}`, err);
      }
    }
    
    return { compressedCount, savedBytes };
  };

  const handleStart = async () => {
    if (!confirm('This will download, compress, and overwrite existing uncompressed images. Proceed?')) return;
    
    setRunning(true);
    setStatus('Starting optimization...');
    setProgress('');
    
    let totalCompressed = 0;
    let totalSavedBytes = 0;

    try {
      // Circle Photos (800px)
      const circleRes = await optimizeTable('circle_photos', 'image_url', 800);
      totalCompressed += circleRes.compressedCount;
      totalSavedBytes += circleRes.savedBytes;

      // Carousel (1200px)
      const carouselRes = await optimizeTable('carousel_photos', 'image_url', 1200);
      totalCompressed += carouselRes.compressedCount;
      totalSavedBytes += carouselRes.savedBytes;

      // Projects (1600px max)
      const pRes1 = await optimizeTable('projects', 'col1_image1_url', 1600);
      const pRes2 = await optimizeTable('projects', 'col1_image2_url', 1600);
      const pRes3 = await optimizeTable('projects', 'col2_image_url', 1600);
      totalCompressed += pRes1.compressedCount + pRes2.compressedCount + pRes3.compressedCount;
      totalSavedBytes += pRes1.savedBytes + pRes2.savedBytes + pRes3.savedBytes;

      // Certifications
      const certRes = await optimizeTable('certifications', 'image_url', 1600);
      totalCompressed += certRes.compressedCount;
      totalSavedBytes += certRes.savedBytes;

      // Testimonials
      const testRes = await optimizeTable('testimonials', 'client_photo_url', 800);
      totalCompressed += testRes.compressedCount;
      totalSavedBytes += testRes.savedBytes;

      setStatus('Optimization complete!');
      setProgress(`Compressed ${totalCompressed} images. Saved ${(totalSavedBytes / 1024 / 1024).toFixed(2)} MB total.`);
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Optimize Existing Images</h2>
      <p className="text-sm text-gray-600 mb-6">
        This utility will scan existing images in Supabase, download them, compress them via the browser, and re-upload the optimized versions.
      </p>
      
      <button 
        onClick={handleStart} 
        disabled={running}
        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
      >
        {running ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
        {running ? 'Optimizing...' : 'Start Optimization'}
      </button>

      {status && (
        <div className="mt-6 p-4 bg-gray-50 rounded border">
          <p className="text-sm font-medium text-gray-800">{status}</p>
          {progress && <p className="text-sm text-green-600 mt-2">{progress}</p>}
        </div>
      )}
    </div>
  );
}
