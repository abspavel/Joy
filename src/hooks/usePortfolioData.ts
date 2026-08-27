import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { DEFAULT_PORTFOLIO_DATA } from '../data/defaultPortfolioData';

// 5 minutes TTL for cache
const CACHE_TTL = 5 * 60 * 1000; 

interface CacheEntry {
  data: any[];
  timestamp: number;
}

// In-memory cache to prevent redundant fetches across components
const dataCache: Record<string, CacheEntry> = {};
const pendingRequests: Record<string, Promise<any[] | null>> = {};
const listeners: Record<string, Set<(data: any[]) => void>> = {};

// Subscribe to table updates
const subscribe = (tableName: string, callback: (data: any[]) => void) => {
  if (!listeners[tableName]) {
    listeners[tableName] = new Set();
  }
  listeners[tableName].add(callback);
  return () => {
    listeners[tableName]?.delete(callback);
  };
};

const notifyListeners = (tableName: string, data: any[]) => {
  listeners[tableName]?.forEach(cb => cb(data));
};

export const invalidatePortfolioCache = (tableName?: string) => {
  if (tableName) {
    delete dataCache[tableName];
    delete pendingRequests[tableName];
  } else {
    Object.keys(dataCache).forEach(k => delete dataCache[k]);
    Object.keys(pendingRequests).forEach(k => delete pendingRequests[k]);
  }
};

// Safe Supabase fetcher with reasonable timeout and graceful fallback
const fetchTableData = async (tableName: string): Promise<any[] | null> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 15000); // 15s timeout

    let query = supabase.from(tableName).select('*');
    if (tableName !== 'hero_content' && tableName !== 'about_content') {
      query = query.order('order_index', { ascending: true });
    }

    if (typeof query.abortSignal === 'function') {
      query = query.abortSignal(controller.signal);
    }

    const { data, error } = await query;
    clearTimeout(timeoutId);

    if (error) {
      console.warn(`[Supabase Fetch] Table '${tableName}' returned error:`, error.message || error);
      return null;
    }

    return data || [];
  } catch (err: any) {
    // Gracefully handle abort or network errors without raising hard uncaught errors
    console.warn(`[Supabase Fetch] Notice for table '${tableName}':`, err.message || 'Fetch aborted or delayed');
    return null;
  }
};

export function usePortfolioData(tableName: string) {
  const fallback = DEFAULT_PORTFOLIO_DATA[tableName] || [];
  const cached = dataCache[tableName];
  const initialData = cached && (Date.now() - cached.timestamp < CACHE_TTL) 
    ? cached.data 
    : fallback;

  const [data, setData] = useState<any[]>(initialData);
  const [loading, setLoading] = useState<boolean>(!cached && fallback.length === 0);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async (force = false) => {
    const now = Date.now();
    const currentCache = dataCache[tableName];

    // Use fresh cache if valid and not forced
    if (currentCache && (now - currentCache.timestamp < CACHE_TTL) && !force) {
      setData(currentCache.data);
      setLoading(false);
      return;
    }

    try {
      if (!pendingRequests[tableName] || force) {
        pendingRequests[tableName] = fetchTableData(tableName);
      }

      const result = await pendingRequests[tableName];
      delete pendingRequests[tableName];

      if (result && Array.isArray(result) && result.length > 0) {
        dataCache[tableName] = { data: result, timestamp: Date.now() };
        setData(result);
        notifyListeners(tableName, result);
      } else if (!dataCache[tableName]) {
        // Fallback to default bundled data if Supabase was empty or failed
        setData(fallback);
      }
    } catch (err: any) {
      delete pendingRequests[tableName];
      setError(err);
      if (!dataCache[tableName]) {
        setData(fallback);
      }
    } finally {
      setLoading(false);
    }
  }, [tableName, fallback]);

  useEffect(() => {
    // Listen for updates from other components fetching the same table
    const unsubscribe = subscribe(tableName, (newData) => {
      setData(newData);
    });

    fetchData();

    return () => {
      unsubscribe();
    };
  }, [tableName, fetchData]);

  const retry = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  return { 
    data: data.length > 0 ? data : fallback, 
    loading, 
    error, 
    timedOut: false, 
    retry 
  };
}
