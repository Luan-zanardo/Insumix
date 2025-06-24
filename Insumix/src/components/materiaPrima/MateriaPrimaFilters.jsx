// src/components/materiaPrima/MateriaPrimaFilters.jsx
import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { CATEGORIAS_MATERIA_PRIMA, STATUS_ESTOQUE } from '../../constants';

const MateriaPrimaFilters = ({
    searchTerm,
    onSearchChange,
    selectedCategoria,
    onCategoriaChange,
    selectedStatus,
    onStatusChange,
    onClearFilters,
    totalItems,
    filteredItems
}) => {
    const hasActiveFilters = searchTerm || selectedCategoria !== 'todas' || selectedStatus !== 'todos';

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">

                {/* Busca */}
                <div className="flex-1 max-w-md">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por código ou descrição..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                    </div>
                </div>

                {/* Filtros */}
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">

                    {/* Filtro por Categoria */}
                    <div className="min-w-40">
                        <select
                            value={selectedCategoria}
                            onChange={(e) => onCategoriaChange(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                        >
                            <option value="todas">Todas as categorias</option>
                            {CATEGORIAS_MATERIA_PRIMA.map(categoria => (
                                <option key={categoria} value={categoria}>
                                    {categoria}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Filtro por Status do Estoque */}
                    <div className="min-w-36">
                        <select
                            value={selectedStatus}
                            onChange={(e) => onStatusChange(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                        >
                            <option value="todos">Todos os status</option>
                            <option value={STATUS_ESTOQUE.NORMAL}>Normal</option>
                            <option value={STATUS_ESTOQUE.CRITICO}>Crítico</option>
                            <option value={STATUS_ESTOQUE.ZERADO}>Zerado</option>
                        </select>
                    </div>

                    {/* Botão Limpar Filtros */}
                    {hasActiveFilters && (
                        <button
                            onClick={onClearFilters}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                            <X className="h-4 w-4 mr-1" />
                            Limpar
                        </button>
                    )}
                </div>
            </div>

            {/* Informações de Resultados */}
            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-4">
                    <span>
                        Mostrando <span className="font-medium">{filteredItems}</span> de{' '}
                        <span className="font-medium">{totalItems}</span> itens
                    </span>
                    {hasActiveFilters && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <Filter className="h-3 w-3 mr-1" />
                            Filtros ativos
                        </span>
                    )}
                </div>
            </div>

            {/* Filtros Ativos */}
            {hasActiveFilters && (
                <div className="mt-3 flex flex-wrap gap-2">
                    {searchTerm && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Busca: "{searchTerm}"
                            <button
                                onClick={() => onSearchChange('')}
                                className="ml-1 inline-flex items-center p-0.5 rounded-full text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                    )}

                    {selectedCategoria !== 'todas' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Categoria: {selectedCategoria}
                            <button
                                onClick={() => onCategoriaChange('todas')}
                                className="ml-1 inline-flex items-center p-0.5 rounded-full text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                    )}

                    {selectedStatus !== 'todos' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Status: {selectedStatus}
                            <button
                                onClick={() => onStatusChange('todos')}
                                className="ml-1 inline-flex items-center p-0.5 rounded-full text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default MateriaPrimaFilters;