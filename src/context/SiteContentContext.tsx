import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { SiteContent } from '../types/siteContent';

// Import the default content directly for the frontend (no backend required for public site)
import defaultContent from '../../data/siteContent.json';

interface SiteContentContextType {
  content: SiteContent;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const SiteContentContext = createContext<SiteContentContextType>({
  content: defaultContent as SiteContent,
  isLoading: false,
  error: null,
  refetch: async () => {},
});

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaultContent as SiteContent);
  const [isLoading, setIsLoading] = useState(false);

  const fetchContent = async () => {
    setIsLoading(true);
    try {
      // Try fetching from the API first (if backend is running)
      const res = await fetch('http://localhost:3001/api/content');
      if (res.ok) {
        const data = await res.json();
        setContent(data as SiteContent);
      }
      // If API isn't available, we already have the default content from the import
    } catch {
      // Backend not running — use static JSON import (already set as default)
      console.info('[SiteContent] Using static content (backend not available)');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  return (
    <SiteContentContext.Provider value={{ content, isLoading, error: null, refetch: fetchContent }}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent(): SiteContent {
  const ctx = useContext(SiteContentContext);
  return ctx.content;
}

export function useSiteContentContext(): SiteContentContextType {
  return useContext(SiteContentContext);
}
