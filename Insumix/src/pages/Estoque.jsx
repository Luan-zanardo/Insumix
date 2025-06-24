// src/pages/Estoque.jsx
import React from 'react';
import { Warehouse } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';

const Estoque = () => {
    return (
        <div>
            <PageHeader
                title="Gestão de Estoque"
                subtitle="Controle de movimentações e níveis de estoque"
                icon={Warehouse}
                breadcrumb={['Home', 'Estoque']}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center py-12">
                    <Warehouse className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-xl font-medium text-gray-900">
                        Módulo em Desenvolvimento
                    </h3>
                    <p className="mt-1 text-gray-500">
                        Este módulo estará disponível em breve.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Estoque;