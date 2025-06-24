// src/pages/Fornecedores.jsx
import React from 'react';
import { Truck } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';

const Fornecedores = () => {
    return (
        <div>
            <PageHeader
                title="Fornecedores"
                subtitle="Em desenvolvimento"
                icon={Truck}
                breadcrumb={['Home', 'Fornecedores']}
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center py-12">
                    <Truck className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-xl font-medium text-gray-900">Módulo em Desenvolvimento</h3>
                    <p className="mt-1 text-gray-500">
                        Este módulo estará disponível em breve.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Fornecedores;