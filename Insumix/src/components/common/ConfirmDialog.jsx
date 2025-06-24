// src/components/common/ConfirmDialog.jsx
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

const ConfirmDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirmar ação',
    message = 'Tem certeza que deseja continuar?',
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    type = 'warning' // warning, danger, info
}) => {
    const typeClasses = {
        warning: {
            icon: 'text-yellow-400',
            button: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
        },
        danger: {
            icon: 'text-red-400',
            button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
        },
        info: {
            icon: 'text-blue-400',
            button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
        }
    };

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={false}>
            <div className="flex items-start">
                <div className={`flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mr-4`}>
                    <AlertTriangle className={`h-6 w-6 ${typeClasses[type].icon}`} />
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {title}
                    </h3>
                    <p className="text-sm text-gray-500">
                        {message}
                    </p>
                </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
                <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                    {cancelText}
                </button>
                <button
                    onClick={handleConfirm}
                    className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ${typeClasses[type].button}`}
                >
                    {confirmText}
                </button>
            </div>
        </Modal>
    );
};

export default ConfirmDialog;