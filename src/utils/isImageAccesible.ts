export async function isImageAccessible(url: string): Promise<boolean> {
    if (!url) return false; // Si no hay URL, no es accesible
  
    try {
      const response = await fetch(url, { method: 'HEAD', cache: 'no-store' }); // Usamos HEAD para eficiencia
      if (response.ok) {
        const contentType = response.headers.get('Content-Type');
        return contentType?.startsWith('image/') ?? false; // Verifica si el Content-Type es de una imagen
      }
      return false; // La solicitud falló (404, etc.)
    } catch (error) {
      console.error(`Error checking image URL ${url}:`, error);
      return false; // Error de red u otro
    }
  }