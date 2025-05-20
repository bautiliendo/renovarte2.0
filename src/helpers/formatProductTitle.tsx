export const formatProductTitle = (title: string): string => {
    // Split the title into parts
    const parts = title.split(' ');
    
    // For TV products
    if (title.toLowerCase().includes('tv')) {
      return parts.slice(0, 4).join(' '); // Take first 4 words for TVs
    }
    
    // For Notebooks
    if (title.toLowerCase().includes('notebook')) {
      return parts.slice(0, 5).join(' '); // Take first 3 words for notebooks
    }
    
    // For Phones
    if (title.toLowerCase().includes('celular')) {
      return parts.slice(0, 5).join(' '); // Take first 4 words for phones
    }
    
    // Default case: take first 3 words
    return parts.slice(0, 3).join(' ');
  };