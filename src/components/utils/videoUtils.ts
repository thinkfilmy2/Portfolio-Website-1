import { useState, useEffect } from 'react';

export function isDriveUrl(url: string): boolean {
  return url.includes('drive.google.com') || url.includes('drive.usercontent.google.com');
}

export function getDriveThumbnailUrl(url: string): string {
  const match = url.match(/(?:\/file\/d\/|\/d\/|id=)([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w800`;
  }
  return url;
}

export function getDriveStreamUrl(url: string): string {
  if (!url.includes('drive.google.com')) return url;
  const match = url.match(/(?:\/file\/d\/|\/d\/|id=)([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `https://drive.usercontent.google.com/download?id=${match[1]}`;
  }
  return url;
}

export function useBlobUrl(url: string) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!url) {
      setBlobUrl(null);
      setIsLoading(false);
      return;
    }

    const resolvedUrl = getDriveStreamUrl(url);

    if (!isDriveUrl(resolvedUrl)) {
      setBlobUrl(resolvedUrl);
      setIsLoading(false);
      return;
    }

    let active = true;
    let createdUrl: string | null = null;
    setIsLoading(true);
    setError(null);

    fetch(resolvedUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.blob();
      })
      .then((blob) => {
        if (!active) return;
        createdUrl = URL.createObjectURL(blob);
        setBlobUrl(createdUrl);
        setIsLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        console.error("Error fetching video blob:", err);
        setError(err);
        setIsLoading(false);
        // Fallback to resolved drive download URL
        setBlobUrl(resolvedUrl);
      });

    return () => {
      active = false;
      if (createdUrl) {
        URL.revokeObjectURL(createdUrl);
      }
    };
  }, [url]);

  return { blobUrl, isLoading, error };
}
