// Add this helper function near the top of src/actions/productActions.ts
// after the imports, for example.
export async function isValidImageUrl(url: string): Promise<boolean> {
    if (!url) return false;
    try {
      // Using AbortSignal.timeout for fetch requests if your Node.js version supports it (v17.3.0+ for stable, v16.14.0+ for experimental)
      // If not, you might need a different timeout mechanism or omit it.
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5-second timeout
  
      const response = await fetch(url, { method: 'HEAD', signal: controller.signal });
      clearTimeout(timeoutId);
  
      if (response.ok) {
        const contentType = response.headers.get('Content-Type');
        return contentType ? contentType.startsWith('image/') : false;
      }
      // console.warn(`isValidImageUrl: Non-ok response for URL ${url}: ${response.status}`);
        return false;
    } catch (error: unknown) {
        if (error instanceof Error && error.name === 'AbortError') {
            // console.warn(`isValidImageUrl: Timeout validating URL ${url}`);
        } else {
        // console.warn(`isValidImageUrl: Error validating URL ${url}:`, error);
      }
      return false; // Treat errors (network, timeout, etc.) as invalid
    }
  }