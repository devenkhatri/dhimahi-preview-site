// Development-only content file watcher
let contentCache: Map<string, { content: any; mtime: number }> = new Map();

export function clearContentCache() {
  contentCache.clear();
}

export function getCachedContent<T>(
  filePath: string, 
  loader: () => T,
  isDev: boolean = process.env.NODE_ENV === 'development'
): T {
  if (!isDev) {
    // In production, just load the content normally
    return loader();
  }

  try {
    const fs = require('fs');
    const stats = fs.statSync(filePath);
    const mtime = stats.mtime.getTime();
    
    const cached = contentCache.get(filePath);
    
    // If we have cached content and the file hasn't changed, return cached version
    if (cached && cached.mtime === mtime) {
      return cached.content;
    }
    
    // File has changed or not cached, load fresh content
    const content = loader();
    contentCache.set(filePath, { content, mtime });
    
    return content;
  } catch (error) {
    // If there's any error with file watching, fall back to normal loading
    return loader();
  }
}

// Clear cache when module is hot reloaded
if (typeof window === 'undefined' && process.env.NODE_ENV === 'development') {
  // Server-side only
  if (module.hot) {
    module.hot.accept(() => {
      clearContentCache();
    });
  }
}