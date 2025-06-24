// src/components/common/Loading.jsx
import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading = ({ size = 'md', text = 'Carregando...' }) => {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
        xl: 'h-12 w-12'
    };

    return (
        <div className="flex items-center justify-center p-4">
            <div className="flex flex-col items-center space-y-2">
                <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600`} />
                <span className="text-sm text-gray-600">{text}</span>
            </div>
        </div>
    );
};

export default Loading;