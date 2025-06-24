// src/pages/MateriaPrima.jsx
import React from 'react';
import { Package } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import MateriaPrimaList from '../components/materiaPrima/MateriaPrimaList';

const MateriaPrima = () => {
    return (
        <>
            <PageHeader
                title="Matérias-Primas"
                subtitle="Gerencie seus insumos industriais de forma eficiente"
                icon={Package}
                breadcrumb={['Home', 'Matérias-Primas']}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <MateriaPrimaList />
            </div>
        </>
    );
};

export default MateriaPrima;