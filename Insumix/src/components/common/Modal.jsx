// src/components/common/Modal.jsx
import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    showCloseButton = true
}) => {
    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl'
    };

    // Fechar modal com ESC
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.keyCode === 27) onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
        }

        return () => document.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    // Prevenir scroll do body quando modal está aberto
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">

                {/* Overlay com fundo transparente escuro */}
                <div
                    className="fixed inset-0 bg-opacity-50 transition-opacity backdrop-blur-sm"
                    onClick={onClose}
                    aria-hidden="true"
                />

                {/* Modal Container */}
                <div className="relative z-[10000]">
                    <div className={`
            inline-block w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden text-left 
            align-middle transition-all transform bg-white shadow-xl rounded-lg
            animate-fadeIn
          `}>

                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {title}
                            </h3>
                            {showCloseButton && (
                                <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500 transition-colors duration-150 p-1 rounded-md hover:bg-gray-100"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            )}
                        </div>

                        {/* Content */}
                        <div className="p-6 max-h-[70vh] overflow-y-auto">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;