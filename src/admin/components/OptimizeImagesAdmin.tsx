import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { compressImage } from '../../utils/imageCompression';
import { Loader2, Sparkles, CheckCircle2, AlertCircle, Play } from 'lucide-react';

interface LogEntry {
  id: string;
  text: string;
  type: 'info' | 'success' | 'warn' | 'error';
}

export function OptimizeImagesAdmin() {
  const [status, setStatus] = useState<string>('');
  const [running, setRunning] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [stats, setStats] = useState<{ totalScanned: number; totalCompressed: number; savedBytes: number } | null>(null);

  const addLog = (text: string, type: 'info' | 'success' | 'warn' | 'error' = 'info') => {
    setLogs(prev => [...prev.slice(-49), { id: Math.random().toString(), text, type }]);
  };

  const downloadImageBlob = async (url: string, path: string): Promise<Blob | null> => {
    if (path) {
      try {
        const { data, error } = await supabase.storage.from('portfolio-media').download(path);
        if (!error && data) return data;
      } catch (e) {
        console.warn(`Direct storage download failed for ${path}, trying fetch...`, e);
      }
    }

    try {
      const response = await fetch(url, { mode: 'cors' });
      if (response.ok) {
        return await response.blob();
      }
    } catch (e) {
      console.warn(`Fetch failed for ${url}:`, e);
    }

    return null;
  };

  const optimizeTable = async (tableName: string, urlColumn: string, maxWidth: number) => {
    addLog(`Scanning table "${tableName}" (${urlColumn})...`, 'info');
    const { data: rows, error: fetchError } = await supabase.from(tableName).select(`id, ${urlColumn}`);
    if (fetchError || !rows) {
      addLog(`Error querying table ${tableName}: ${fetchError?.message || 'unknown'}`, 'error');
      return { scannedCount: 0, compressedCount: 0, savedBytes: 0 };
    }

    let scannedCount = 0;
    let compressedCount = 0;
    let savedBytes = 0;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const url = row[urlColumn];
      
      if (!url || typeof url !== 'string' || !url.includes('/portfolio-media/')) {
        continue;
      }

      scannedCount++;
      const pathPart = url.split('/portfolio-media/')[1];
      if (!pathPart) continue;

      setStatus(`Processing ${tableName} (${i + 1}/${rows.length})...`);

      try {
        const blob = await downloadImageBlob(url, pathPart);
        if (!blob) {
          addLog(`Could not download image: ${pathPart}`, 'warn');
          continue;
        }

        if (blob.size < 60 * 1024) {
          addLog(`Skipped ${pathPart} (already small: ${(blob.size / 1024).toFixed(1)} KB)`, 'info');
          continue;
        }

        const fileName = pathPart.split('/').pop() || 'image.jpg';
        const file = new File([blob], fileName, { type: blob.type || 'image/jpeg' });
        
        const compressedFile = await compressImage(file, maxWidth, fileName);
        
        if (compressedFile.size < file.size * 0.92) {
          const diff = file.size - compressedFile.size;
          savedBytes += diff;
          compressedCount++;

          const { error: uploadError } = await supabase.storage
            .from('portfolio-media')
            .upload(pathPart, compressedFile, { upsert: true, cacheControl: '31536000' });

          if (uploadError) {
            addLog(`Failed to re-upload ${pathPart}: ${uploadError.message}`, 'error');
          } else {
            addLog(`Optimized ${pathPart}: ${(file.size / 1024).toFixed(1)} KB → ${(compressedFile.size / 1024).toFixed(1)} KB (-${(diff / 1024).toFixed(1)} KB)`, 'success');
          }
        } else {
          addLog(`Checked ${pathPart}: already optimized (${(blob.size / 1024).toFixed(1)} KB)`, 'info');
        }
      } catch (err: any) {
        addLog(`Error optimizing ${pathPart}: ${err.message}`, 'warn');
      }
    }
    
    return { scannedCount, compressedCount, savedBytes };
  };

  const runOptimization = async () => {
    setShowConfirm(false);
    setRunning(true);
    setStatus('Starting optimization batch...');
    setLogs([]);
    setStats(null);
    
    let totalScanned = 0;
    let totalCompressed = 0;
    let totalSavedBytes = 0;

    try {
      const circleRes = await optimizeTable('circle_photos', 'image_url', 800);
      totalScanned += circleRes.scannedCount;
      totalCompressed += circleRes.compressedCount;
      totalSavedBytes += circleRes.savedBytes;

      const carouselRes = await optimizeTable('carousel_photos', 'image_url', 1200);
      totalScanned += carouselRes.scannedCount;
      totalCompressed += carouselRes.compressedCount;
      totalSavedBytes += carouselRes.savedBytes;

      const pRes1 = await optimizeTable('projects', 'col1_image1_url', 1600);
      const pRes2 = await optimizeTable('projects', 'col1_image2_url', 1600);
      const pRes3 = await optimizeTable('projects', 'col2_image_url', 1600);
      totalScanned += pRes1.scannedCount + pRes2.scannedCount + pRes3.scannedCount;
      totalCompressed += pRes1.compressedCount + pRes2.compressedCount + pRes3.compressedCount;
      totalSavedBytes += pRes1.savedBytes + pRes2.savedBytes + pRes3.savedBytes;

      const certRes = await optimizeTable('certifications', 'image_url', 1600);
      totalScanned += certRes.scannedCount;
      totalCompressed += certRes.compressedCount;
      totalSavedBytes += certRes.savedBytes;

      const testRes = await optimizeTable('testimonials', 'client_photo_url', 800);
      totalScanned += testRes.scannedCount;
      totalCompressed += testRes.compressedCount;
      totalSavedBytes += testRes.savedBytes;

      setStatus('Optimization complete!');
      setStats({ totalScanned, totalCompressed, savedBytes: totalSavedBytes });
      addLog(`Finished! Scanned ${totalScanned} images, optimized ${totalCompressed}, saved ${(totalSavedBytes / 1024 / 1024).toFixed(2)} MB.`, 'success');
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
      addLog(`Optimization failed: ${err.message}`, 'error');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Optimize Existing Images</h2>
          <p className="text-sm text-gray-500">
            Scans all uploaded images across your portfolio, compresses them into lightweight WebP format, and replaces them on Supabase storage.
          </p>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
        <h3 className="text-sm font-semibold text-gray-700">What will be optimized:</h3>
        <ul className="text-xs text-gray-600 space-y-1.5 list-disc list-inside">
          <li><strong>Circle Photos:</strong> Scaled & compressed up to 800px WebP</li>
          <li><strong>Carousel Photos:</strong> Scaled & compressed up to 1200px WebP</li>
          <li><strong>Projects Media:</strong> Scaled & compressed up to 1600px WebP</li>
          <li><strong>Certifications:</strong> Scaled & compressed up to 1600px WebP</li>
          <li><strong>Testimonial Avatars:</strong> Scaled & compressed up to 800px WebP</li>
        </ul>
      </div>

      {showConfirm ? (
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-amber-800 text-sm font-medium">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <span>Ready to start? This will process and optimize all existing images in Supabase.</span>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => setShowConfirm(false)}
              className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={runOptimization}
              className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm"
            >
              Yes, Start Now
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setShowConfirm(true)} 
          disabled={running}
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-medium transition-colors shadow-sm"
        >
          {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
          {running ? 'Optimizing in progress...' : 'Start Image Optimization'}
        </button>
      )}

      {status && (
        <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-2">
          <div className="flex items-center gap-2">
            {running && <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />}
            {!running && <CheckCircle2 className="w-4 h-4 text-green-600" />}
            <span className="text-sm font-semibold text-gray-800">{status}</span>
          </div>

          {stats && (
            <div className="grid grid-cols-3 gap-3 pt-2 text-center">
              <div className="p-2 bg-white rounded-lg border border-gray-200">
                <span className="block text-xs text-gray-500">Scanned</span>
                <span className="text-base font-bold text-gray-800">{stats.totalScanned}</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-gray-200">
                <span className="block text-xs text-gray-500">Optimized</span>
                <span className="text-base font-bold text-indigo-600">{stats.totalCompressed}</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-gray-200">
                <span className="block text-xs text-gray-500">Total Saved</span>
                <span className="text-base font-bold text-green-600">{(stats.savedBytes / 1024 / 1024).toFixed(2)} MB</span>
              </div>
            </div>
          )}
        </div>
      )}

      {logs.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Live Activity Log</h4>
          <div className="p-3 bg-gray-900 text-gray-100 font-mono text-xs rounded-xl max-h-60 overflow-y-auto space-y-1">
            {logs.map((log) => (
              <div 
                key={log.id} 
                className={`leading-relaxed ${
                  log.type === 'success' ? 'text-green-400' :
                  log.type === 'error' ? 'text-red-400' :
                  log.type === 'warn' ? 'text-yellow-400' : 'text-gray-300'
                }`}
              >
                &gt; {log.text}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
