'use client';


import { useState } from "react";
import Image from "next/image";
import ExpandableDescription from "@/components/ExpandableDescription";
import { FaWhatsapp } from "react-icons/fa";
import { ConsultationModal } from "@/components/ConsultationModal";
import type { IProduct } from "@/models/Product";

export interface ProductClientViewProps {
    product: IProduct;
}

export function ProductClientView({ product }: ProductClientViewProps) {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(
        product.url_imagenes && product.url_imagenes.length > 0 ? product.url_imagenes[0].url : null
    );

    const handleThumbnailClick = (imageUrl: string) => {
        setSelectedImageUrl(imageUrl);
    };

    return (
        <>
            <div className="container mx-auto min-h-[500px] p-4 md:p-8 bg-white m-8 border border-gray-200 rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Image Section */}
                    <div className="relative aspect-square border rounded-md overflow-hidden bg-gray-100">
                        {selectedImageUrl ? (
                            <Image
                                src={selectedImageUrl}
                                alt={product.item_desc_0 || 'Imagen del producto'}
                                fill
                                className="object-contain p-4"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority
                                key={selectedImageUrl}
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-gray-500">Imagen no disponible</span>
                            </div>
                        )}
                        {product.url_imagenes && product.url_imagenes.length > 1 && (
                            <div className="absolute bottom-2 left-2 right-2 flex space-x-2 justify-center p-1 bg-white/75 rounded">
                                {product.url_imagenes.map((img: { url: string }, index: number) => (
                                    <div
                                        key={index}
                                        className={`w-12 h-12 border rounded overflow-hidden relative cursor-pointer hover:border-blue-500 ${selectedImageUrl === img.url ? 'border-blue-500 border-2' : 'border-gray-300'}`}
                                        onClick={() => handleThumbnailClick(img.url)}
                                    >
                                        <Image src={img.url} alt={`Thumbnail ${index + 1}`} fill className="object-contain" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details Section */}
                    <div className="flex flex-col">
                        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800">{product.item_desc_0}</h1>

                        <div className="mb-4">
                            <span className="text-gray-700 font-semibold">Marca:</span>
                            <span className="ml-2 text-gray-600">{product.marca}</span>
                        </div>
                        <div className="mb-4">
                            <span className="text-gray-700 font-semibold">Categoría:</span>
                            <span className="ml-2 text-gray-600">{product.category} {product.subcategory ? `> ${product.subcategory}` : ''}</span>
                        </div>
                        {/* Description */}
                        {product.item_desc_2 && (
                            <ExpandableDescription description={product.item_desc_2} />
                        )}

                        {/* Action Button */}
                        <div className="mt-auto pt-4">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(true)}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded text-lg transition duration-150 ease-in-out flex items-center justify-center"
                            >
                                <FaWhatsapp className="w-5 h-5 mr-2 inline-block" />
                                Consultar cotización
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <ConsultationModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                productName={product.item_desc_0 || 'Producto'}
            />
        </>
    );
}