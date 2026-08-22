import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

// In-memory cache to prevent redundant fetches
const dataCache: Record<string, any[]> = {};
const pendingRequests: Record<string, Promise<any[]>> = {};

export function usePortfolioData(tableName: string) {
  const [data, setData] = useState<any[] | null>(dataCache[tableName] || null);
  const [loading, setLoading] = useState(!dataCache[tableName]);
  const [error, setError] = useState<Error | null>(null);
  const [timedOut, setTimedOut] = useState(false);

  const fetchData = useCallback(async (force = false) => {
    // If already in cache and not forcing refresh, no need to fetch
    if (dataCache[tableName] && !force) {
      setData(dataCache[tableName]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setTimedOut(false);
    
    try {
      // If there's an ongoing request for this table (and not forcing), await it
      if (!pendingRequests[tableName] || force) {
        let query = supabase.from(tableName).select('*');
        
        if (tableName !== 'hero_content' && tableName !== 'about_content') {
          query = query.order('order_index', { ascending: true });
        }
        
        const fetchPromise = query.then(({ data: result, error: fetchError }) => {
          if (fetchError) throw fetchError;
          return result || [];
        });

        // 8 second timeout for supabase request
        const timeoutPromise = new Promise<any[]>((_, reject) => {
          setTimeout(() => reject(new Error('TIMEOUT')), 8000);
        });

        pendingRequests[tableName] = Promise.race([fetchPromise, timeoutPromise]).catch(err => {
          if (err.message === 'TIMEOUT') {
            throw err;
          }
          console.warn(`Fallback active for ${tableName}. (Supabase fetch failed)`);
          return []; // Graceful fallback for non-timeout errors
        });
      }

      const result = await pendingRequests[tableName];
      
      dataCache[tableName] = result;
      setData(result);
    } catch (err: any) {
      if (err.message === 'TIMEOUT') {
        setTimedOut(true);
      } else {
        setError(err);
      }
    } finally {
      setLoading(false);
    }
  }, [tableName]);

  useEffect(() => {
    let isMounted = true;
    
    // We only want to set state if mounted
    const runFetch = async () => {
      await fetchData();
    };
    
    runFetch();

    return () => {
      isMounted = false;
    };
  }, [fetchData]);

  const retry = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  return { data, loading, error, timedOut, retry };
}
