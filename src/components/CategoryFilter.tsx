"use client";

import Link from 'next/link';
import { useState } from 'react';

interface CategoryFilterProps {
    allCategories: string[];
    selectedCategory?: string;
    basePath: string; // e.g., "/products"
}

const MAX_VISIBLE_CATEGORIES = 8;

export default function CategoryFilter({
    allCategories,
    selectedCategory,
    basePath,
}: CategoryFilterProps) {
    const [showMore, setShowMore] = useState(false);

    const visibleCategories = allCategories.slice(0, MAX_VISIBLE_CATEGORIES);
    const hiddenCategories = allCategories.slice(MAX_VISIBLE_CATEGORIES);

    const commonLinkClasses = "px-3 py-1 rounded-xs text-sm text-black";
    const activeLinkClasses = "bg-emerald-500 hover:bg-emerald-600 text-black";
    const inactiveLinkClasses = "bg-gray-200 hover:bg-gray-300";

    return (
        <div className="my-4">
            <div className="flex mx-auto justify-center flex-wrap items-center gap-2">
                {/* Link "Todas" */}
                {/* <Link
                    href={basePath}
                    className={`${commonLinkClasses} ${!selectedCategory ? activeLinkClasses : inactiveLinkClasses
                        }`}
                >
                    Todos los productos
                </Link> */}

                {/* Categorías Visibles */}
                {visibleCategories.map((cat) => (
                    <Link
                        key={cat}
                        href={`${basePath}?category=${encodeURIComponent(cat)}`}
                        className={`${commonLinkClasses} ${selectedCategory === cat ? activeLinkClasses : inactiveLinkClasses
                            }`}
                    >
                        {cat}
                    </Link>
                ))}

                {/* Botón "Ver más" y Menú Desplegable */}
                {hiddenCategories.length > 0 && (
                    <div className="relative">
                        <button
                            onClick={() => setShowMore(!showMore)}
                            className={`${commonLinkClasses} ${inactiveLinkClasses}`}
                        >
                            Ver más {showMore ? '▲' : '▼'}
                        </button>
                        {showMore && (
                            <div className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none py-1">
                                {hiddenCategories.map((cat) => (
                                    <Link
                                        key={cat}
                                        href={`${basePath}?category=${encodeURIComponent(cat)}`}
                                        className={`block px-4 py-2 text-sm ${selectedCategory === cat
                                                ? "bg-blue-100 text-blue-700" // Estilo diferente para activa en dropdown
                                                : "text-gray-700 hover:bg-gray-100"
                                            }`}
                                        onClick={() => setShowMore(false)} // Opcional: cerrar al seleccionar
                                    >
                                        {cat}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
} 