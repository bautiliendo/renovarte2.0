// User-facing display names for the main categories.
// These are what users will click on.
export const DISPLAY_MAIN_CATEGORIES: string[] = [
  "Notebooks",
  "Computadoras",
  "Celulares Libres",
  "Television",
  "Tabletas",
  "Electrodomesticos",
  "Climatizacion",
  "Componentes y Accesorios",
  "Movilidad Urbana",
  "Accesorios para Celular",
  "Informatica Accesorios",
  "Bazar",
  "Muebles y Sillas",
];

// This maps a display category to the actual database category names it groups.
// If a display category also directly matches a database category name,
// it will be handled correctly by getAllInternalMainCategories.
export const COMBINED_CATEGORIES_MAP: { [displayCategory: string]: string[] } =
  {
    "Informatica Accesorios": ["Impresoras y Scanner"],
    Computadoras: ["Monitores"],
    "Componentes y Accesorios": ["Componentes", "Accesorios Gamer"],
    Electrodomesticos: [
      "Lavado y Secado",
      "Refrigeracion",
      "Termotanques y Calefones",
      "Coccion",
    ],
  };

// Helper to get all unique *internal* database category names that are considered "main".
// This is used for the "Otros" logic (items NOT IN this list).
const getAllInternalMainCategories = (): string[] => {
  const internalCategories = new Set<string>();
  DISPLAY_MAIN_CATEGORIES.forEach((displayCat) => {
    // Add the display category itself, as it might be a direct DB category name
    // (e.g., "Electrodomesticos", "Notebooks").
    internalCategories.add(displayCat);

    // If this display category also has a mapping for other DB categories, add them too.
    if (
      COMBINED_CATEGORIES_MAP[displayCat] &&
      COMBINED_CATEGORIES_MAP[displayCat].length > 0
    ) {
      COMBINED_CATEGORIES_MAP[displayCat].forEach((internalCat) =>
        internalCategories.add(internalCat)
      );
    }
  });
  return Array.from(internalCategories).sort(); // Added sort for consistency
};

export const INTERNAL_MAIN_CATEGORIES: string[] =
  getAllInternalMainCategories();

// Final list for UI: combines main display categories and "Otros"
export const DISPLAY_CATEGORIES_FOR_UI: string[] = [
  ...new Set([...DISPLAY_MAIN_CATEGORIES, "Otros"]),
];
