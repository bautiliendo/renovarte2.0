export async function isValidImageUrl(url: string): Promise<boolean> {
  if (!url) return false;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5-second timeout

    const response = await fetch(url, { method: 'HEAD', signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      const contentType = response.headers.get('Content-Type');
      return contentType ? contentType.startsWith('image/') : false;
    }
    return false;
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
    } else {
    }
    return false;
  }
}
