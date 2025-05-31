'use client';

import { useState } from "react";
import Image from "next/image";
import ExpandableDescription from "@/components/ExpandableDescription";
import { FaWhatsapp, FaShare, FaBox, FaShieldAlt, FaTruck } from "react-icons/fa";
import { ConsultationModal } from "@/components/ConsultationModal";
import type { IProduct } from "@/models/Product";
import { Breadcrumb, BreadcrumbItem, BreadcrumbPage, BreadcrumbList, BreadcrumbSeparator, BreadcrumbLink } from '@/components/ui/breadcrumb';
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

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: product.item_desc_0,
                text: `Mira este producto: ${product.item_desc_0}`,
                url: window.location.href
            });
        }
    };

    return (
        <>
            <h1 className="mb-4 text-xl font-semibold">
                <Breadcrumb className="p-4">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/products">Productos</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{product.category}</BreadcrumbPage>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{product.item_desc_0.slice(0, 30) + '...'}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </h1>



            <div className="bg-gray-50 min-h-screen my-4 rounded-lg">
                <div className="container mx-auto max-w-7xl px-4 py-6">
                    {/* Breadcrumb
                    <nav className="mb-6">
                        <div className="text-sm text-gray-500">
                            <span>Inicio</span>
                            <span className="mx-2">/</span>
                            <span>{product.category}</span>
                            {product.subcategory && (
                                <>
                                    <span className="mx-2">/</span>
                                    <span>{product.subcategory}</span>
                                </>
                            )}
                            <span className="mx-2">/</span>
                            <span className="text-gray-800 font-medium">{product.item_desc_0}</span>
                        </div>
                    </nav> */}

                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
                            {/* Enhanced Image Gallery */}
                            <div className="space-y-4">
                                {/* Main Image */}
                                <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                                    {selectedImageUrl ? (
                                        <Image
                                            src={selectedImageUrl}
                                            alt={product.item_desc_0 || 'Imagen del producto'}
                                            fill
                                            className="object-contain p-6 hover:scale-105 transition-transform duration-300"
                                            sizes="(max-width: 1024px) 100vw, 50vw"
                                            priority
                                            key={selectedImageUrl}
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-center">
                                                <FaBox className="w-16 h-16 text-gray-300 mx-auto mb-2" />
                                                <span className="text-gray-400">Imagen no disponible</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Image Actions */}
                                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                                        <button
                                            onClick={handleShare}
                                            className="p-2 bg-white text-gray-600 hover:text-blue-500 rounded-full shadow-md transition-colors"
                                        >
                                            <FaShare className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Thumbnail Gallery */}
                                {product.url_imagenes && product.url_imagenes.length > 1 && (
                                    <div className="flex gap-3 overflow-x-auto pb-2">
                                        {product.url_imagenes.map((img: { url: string }, index: number) => (
                                            <div
                                                key={index}
                                                className={`flex-shrink-0 w-20 h-20 border-2 rounded-lg overflow-hidden relative cursor-pointer transition-all ${selectedImageUrl === img.url
                                                        ? 'border-blue-500 ring-2 ring-blue-200'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                                onClick={() => handleThumbnailClick(img.url)}
                                            >
                                                <Image
                                                    src={img.url}
                                                    alt={`Vista ${index + 1}`}
                                                    fill
                                                    className="object-contain p-1"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Enhanced Product Details */}
                            <div className="flex flex-col h-full">
                                {/* Product Header */}
                                <div className="mb-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-full font-medium">
                                            {product.marca}
                                        </span>
                                    </div>

                                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight mb-3">
                                        {product.item_desc_0}
                                    </h1>

                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <span className="flex items-center gap-1">
                                            <FaBox className="w-4 h-4" />
                                            {product.category}
                                            {product.subcategory && ` • ${product.subcategory}`}
                                        </span>
                                    </div>
                                </div>

                                {/* Features */}
                                <div className="mb-6">
                                    <div className="grid grid-cols-1 gap-3">
                                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                            <FaShieldAlt className="w-5 h-5 text-green-600" />
                                            <div>
                                                <div className="font-medium text-green-800">Garantía incluida</div>
                                                <div className="text-sm text-green-600">Producto con respaldo del fabricante</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                            <FaTruck className="w-5 h-5 text-blue-600" />
                                            <div>
                                                <div className="font-medium text-blue-800">Envío disponible</div>
                                                <div className="text-sm text-blue-600">Envio gratis en Córdoba Capital</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Key Information */}
                                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                    <h3 className="font-semibold text-gray-800 mb-3">Información del producto</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Marca:</span>
                                            <span className="font-medium text-gray-800">{product.marca}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Categoría:</span>
                                            <span className="font-medium text-gray-800">
                                                {product.category}
                                                {product.subcategory && ` • ${product.subcategory}`}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Disponibilidad:</span>
                                            <span className="font-medium text-green-600">Consultar stock</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-auto space-y-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(true)}
                                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl text-lg transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                    >
                                        <FaWhatsapp className="w-5 h-5" />
                                        Consultar cotización
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description Section */}
                    {product.item_desc_2 && (
                        <div className="bg-white rounded-xl shadow-sm mt-6 p-6 lg:p-8">
                            <div className="border-b border-gray-200 pb-4 mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Descripción del producto</h2>
                            </div>
                            <div className="prose max-w-none">
                                <ExpandableDescription description={product.item_desc_2} />
                            </div>
                        </div>
                    )}

                    {/* Additional Sections */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                        {/* Specifications */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Especificaciones</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Marca</span>
                                    <span className="font-medium text-gray-800">{product.marca}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Categoría</span>
                                    <span className="font-medium text-gray-800">{product.category}</span>
                                </div>
                                {product.subcategory && (
                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                        <span className="text-gray-600">Subcategoría</span>
                                        <span className="font-medium text-gray-800">{product.subcategory}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Support Info */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Soporte y garantía</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <FaShieldAlt className="w-5 h-5 text-green-600 mt-0.5" />
                                    <div>
                                        <div className="font-medium text-gray-800">Garantía del fabricante</div>
                                        <div className="text-sm text-gray-600">Cobertura según especificaciones del producto</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <FaWhatsapp className="w-5 h-5 text-green-600 mt-0.5" />
                                    <div>
                                        <div className="font-medium text-gray-800">Soporte técnico</div>
                                        <div className="text-sm text-gray-600">Asesoría especializada vía WhatsApp</div>
                                    </div>
                                </div>
                            </div>
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