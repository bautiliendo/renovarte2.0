"use client";

import Link from 'next/link';
interface CategoryFilterProps {
    allCategories: string[];
    selectedCategory?: string;
    basePath: string; // e.g., "/products"
}

export default function CategoryFilter({
    allCategories,
    basePath,
}: CategoryFilterProps) {

    const commonLinkClasses = "font-medium px-4 py-2 rounded-lg flex items-center justify-center whitespace-nowrap text-sm";

    return (
        <div className="sticky top-28 md:top-16 z-50 w-full flex justify-center sm:px-4 bg-background/95 ">
            <div className="overflow-x-auto py-3">
                <div className="inline-flex items-center space-x-3">
                    {allCategories.map((cat) => (
                        <Link
                            key={cat}
                            href={`${basePath}?category=${encodeURIComponent(cat)}`}
                            className={`${commonLinkClasses}`}
                        >
                            {cat}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
} 