// Development helper for content hot reloading
let isDevelopment = process.env.NODE_ENV === 'development';

// Simple cache busting mechanism for development
export function getContentCacheBuster(): string {
  if (!isDevelopment) return '';
  
  // In development, add a timestamp to force re-reading files
  return `?t=${Date.now()}`;
}

// Force content refresh in development
export function shouldRefreshContent(): boolean {
  return isDevelopment;
}

// Development-only: Clear any module-level caches
export function clearModuleCache() {
  if (!isDevelopment) return;
  
  // Clear require cache for content files in development
  Object.keys(require.cache).forEach(key => {
    if (key.includes('/content/') && (key.endsWith('.yml') || key.endsWith('.yaml') || key.endsWith('.md'))) {
      delete require.cache[key];
    }
  });
}

// Log content changes in development
export function logContentChange(filePath: string, action: 'changed' | 'added' | 'removed') {
  if (!isDevelopment) return;
  
  const emoji = action === 'changed' ? '📝' : action === 'added' ? '➕' : '🗑️';
  console.log(`${emoji} Content ${action}: ${filePath}`);
}