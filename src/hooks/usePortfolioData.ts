import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// In-memory cache to prevent redundant fetches
const dataCache: Record<string, any[]> = {};
const pendingRequests: Record<string, Promise<any[]>> = {};

export function usePortfolioData(tableName: string) {
  const [data, setData] = useState<any[] | null>(dataCache[tableName] || null);
  const [loading, setLoading] = useState(!dataCache[tableName]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // If already in cache, no need to fetch
    if (dataCache[tableName]) {
      setData(dataCache[tableName]);
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function fetchData() {
      try {
        setLoading(true);

        // If there's an ongoing request for this table, await it
        if (!pendingRequests[tableName]) {
          let query = supabase.from(tableName).select('*');
          
          if (tableName !== 'hero_content' && tableName !== 'about_content') {
            query = query.order('order_index', { ascending: true });
          }

          const fetchPromise = query.then(({ data: result, error: fetchError }) => {
            if (fetchError) throw fetchError;
            return result || [];
          });

          // 10 second timeout for supabase request
          const timeoutPromise = new Promise<any[]>((_, reject) => {
            setTimeout(() => reject(new Error('Supabase request timeout')), 10000);
          });

          pendingRequests[tableName] = Promise.race([fetchPromise, timeoutPromise]).catch(err => {
            console.error(`Error fetching ${tableName}:`, err);
            return []; // Graceful fallback
          });
        }

        const result = await pendingRequests[tableName];
        
        if (isMounted) {
          dataCache[tableName] = result;
          setData(result);
        }
      } catch (err: any) {
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [tableName]);

  return { data, loading, error };
}
