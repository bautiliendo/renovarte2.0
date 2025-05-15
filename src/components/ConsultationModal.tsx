import { FaWhatsapp } from "react-icons/fa";
import { MdOutlineClose } from "react-icons/md";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    productName: string;
}

export const ConsultationModal: React.FC<ModalProps> = ({ open, onClose, productName }) => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const nombre = (form.elements.namedItem('nombre') as HTMLInputElement).value;
        const ciudad = (form.elements.namedItem('ciudad') as HTMLInputElement).value;
        const barrio = (form.elements.namedItem('barrio') as HTMLInputElement).value;
        const mutual = (form.elements.namedItem('mutual') as HTMLSelectElement).value;

        const mensaje = `Hola! Mi nombre es ${nombre}. Me contacto desde su página web para preguntar por la cotización de:

*${productName}*

*Ciudad:* ${ciudad}
*Barrio:* ${barrio}
*Mutual:* ${mutual}`;

        const numeroTel = '5493512399026';
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        let whatsappLink;
        if (isMobile) {
            whatsappLink = `https://wa.me/${numeroTel}?text=${encodeURIComponent(mensaje)}`;
        } else {
            whatsappLink = `https://web.whatsapp.com/send?text=${encodeURIComponent(mensaje)}&phone=${numeroTel}`;
        }
        
        // Cerrar el modal antes de abrir WhatsApp
        onClose();
        
        // Abrir WhatsApp después de cerrar el modal
        window.open(whatsappLink, '_blank');
    }

    if (!open) return null;
    
    return (
        <div 
            onClick={onClose} 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] transition-all duration-300 ease-in-out"
        >
            <div 
                onClick={(e) => e.stopPropagation()} 
                className="bg-white w-full max-w-[500px] shadow-2xl relative rounded-2xl mx-4 transform transition-all duration-300 ease-in-out hover:shadow-3xl"
            >
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-800">Consultar por {productName}</h2>
                    <button 
                        onClick={onClose} 
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                        <MdOutlineClose className="w-6 h-6 text-gray-500 hover:text-gray-700" />
                    </button>
                </div>

                <form className="p-6 space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                                Nombre y Apellido 
                            </label>
                            <p className="text-sm text-red-500">*</p>
                        </div>
                        <input 
                            type="text" 
                            id="nombre" 
                            name="nombre"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 outline-none bg-white text-gray-900 placeholder-gray-400" 
                            placeholder="Nombre y Apellido" 
                            required 
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <label htmlFor="ciudad" className="block text-sm font-medium text-gray-700">
                                Ciudad
                            </label>
                            <p className="text-sm text-red-500">*</p>
                        </div>
                        <input 
                            type="text" 
                            id="ciudad" 
                            name="ciudad"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 outline-none bg-white text-gray-900 placeholder-gray-400" 
                            placeholder="Córdoba Capital" 
                            required 
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <label htmlFor="barrio" className="block text-sm font-medium text-gray-700">
                                Barrio 
                            </label>
                            <p className="text-sm text-red-500">*</p>
                        </div>
                        <input 
                            type="text" 
                            id="barrio" 
                            name="barrio"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 outline-none bg-white text-gray-900 placeholder-gray-400" 
                            placeholder="General Paz / Arguello" 
                            required 
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <label htmlFor="mutual" className="block text-sm font-medium text-gray-700">
                                Mutual
                            </label>
                            <p className="text-sm text-red-500">*</p>
                        </div>
                        <select 
                            id="mutual" 
                            name="mutual"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 outline-none bg-white text-gray-900"
                        >
                            <option value="Empleados Hospital Privado">Empleados Hospital Privado</option>
                            <option value="UPCN">UPCN</option>
                            <option value="3 Abril">3 Abril</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        <FaWhatsapp className="w-5 h-5" />
                        Enviar consulta
                    </button>
                </form>
            </div>
        </div>
    );
}; 