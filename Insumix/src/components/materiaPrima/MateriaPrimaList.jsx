// src/components/materiaPrima/MateriaPrimaList.jsx
import React, { useState, useMemo } from 'react';
import { Plus, Grid, List, Package } from 'lucide-react';
import MateriaPrimaCard from './MateriaPrimaCard';
import MateriaPrimaFilters from './MateriaPrimaFilters';
import MateriaPrimaForm from './MateriaPrimaForm';
import Modal from '../common/Modal';
import ConfirmDialog from '../common/ConfirmDialog';
import Loading from '../common/Loading';
import { useMateriaPrima } from '../../hooks/useMateriaPrima';
import { MENSAGENS } from '../../constants';

const MateriaPrimaList = () => {
    const {
        materiasPrimas,
        loading,
        error,
        createMateriaPrima,
        updateMateriaPrima,
        deleteMateriaPrima,
        filterMaterias,
        getEstoqueStats,
        clearError
    } = useMateriaPrima();

    // Estados locais
    const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'list'
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategoria, setSelectedCategoria] = useState('todas');
    const [selectedStatus, setSelectedStatus] = useState('todos');

    // Estados dos modais
    const [showForm, setShowForm] = useState(false);
    const [editingMateria, setEditingMateria] = useState(null);
    const [viewingMateria, setViewingMateria] = useState(null);
    const [deletingMateria, setDeletingMateria] = useState(null);

    // Estados de loading para ações específicas
    const [formLoading, setFormLoading] = useState(false);

    // Filtrar matérias-primas
    const filteredMaterias = useMemo(() => {
        return filterMaterias(searchTerm, selectedCategoria, selectedStatus);
    }, [filterMaterias, searchTerm, selectedCategoria, selectedStatus]);

    // Estatísticas do estoque
    const stats = useMemo(() => {
        return getEstoqueStats();
    }, [getEstoqueStats]);

    // Handlers dos filtros
    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedCategoria('todas');
        setSelectedStatus('todos');
    };

    // Handlers do formulário
    const handleCreate = () => {
        setEditingMateria(null);
        setShowForm(true);
    };

    const handleEdit = (materia) => {
        setEditingMateria(materia);
        setShowForm(true);
    };

    const handleFormSubmit = async (data) => {
        setFormLoading(true);
        clearError();

        try {
            if (editingMateria) {
                await updateMateriaPrima(editingMateria.id_materia_prima, data);
            } else {
                await createMateriaPrima(data);
            }

            setShowForm(false);
            setEditingMateria(null);

            // Feedback de sucesso poderia ser implementado aqui
        } catch (error) {
            console.error('Erro ao salvar:', error);
        } finally {
            setFormLoading(false);
        }
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setEditingMateria(null);
    };

    // Handlers de visualização
    const handleView = (materia) => {
        setViewingMateria(materia);
    };

    // Handlers de exclusão
    const handleDelete = (materia) => {
        setDeletingMateria(materia);
    };

    const handleConfirmDelete = async () => {
        if (deletingMateria) {
            try {
                await deleteMateriaPrima(deletingMateria.id_materia_prima);
                setDeletingMateria(null);
            } catch (error) {
                console.error('Erro ao deletar:', error);
            }
        }
    };

    // Loading inicial
    if (loading && materiasPrimas.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loading size="lg" text="Carregando matérias-primas..." />
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* Cabeçalho com Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <Package className="h-8 w-8 text-blue-600" />
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500">Total</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <Package className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500">Normal</p>
                            <p className="text-2xl font-semibold text-green-600">{stats.normais}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="h-8 w-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <Package className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500">Crítico</p>
                            <p className="text-2xl font-semibold text-yellow-600">{stats.criticos}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="h-8 w-8 bg-red-100 rounded-lg flex items-center justify-center">
                            <Package className="h-5 w-5 text-red-600" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500">Zerado</p>
                            <p className="text-2xl font-semibold text-red-600">{stats.zerados}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controles */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-md ${viewMode === 'grid'
                            ? 'bg-blue-100 text-blue-600'
                            : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        <Grid className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-md ${viewMode === 'list'
                            ? 'bg-blue-100 text-blue-600'
                            : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        <List className="h-5 w-5" />
                    </button>
                </div>

                <button
                    onClick={handleCreate}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Matéria-Prima
                </button>
            </div>

            {/* Filtros */}
            <MateriaPrimaFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedCategoria={selectedCategoria}
                onCategoriaChange={setSelectedCategoria}
                selectedStatus={selectedStatus}
                onStatusChange={setSelectedStatus}
                onClearFilters={handleClearFilters}
                totalItems={materiasPrimas.length}
                filteredItems={filteredMaterias.length}
            />

            {/* Mensagem de Erro */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <div className="text-sm text-red-600">{error}</div>
                </div>
            )}

            {/* Lista de Matérias-Primas */}
            {filteredMaterias.length === 0 ? (
                <div className="text-center py-12">
                    <Package className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                        Nenhuma matéria-prima encontrada
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                        {materiasPrimas.length === 0
                            ? 'Comece criando sua primeira matéria-prima.'
                            : 'Tente ajustar os filtros de busca.'
                        }
                    </p>
                    {materiasPrimas.length === 0 && (
                        <div className="mt-6">
                            <button
                                onClick={handleCreate}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Nova Matéria-Prima
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className={`
          grid gap-6
          ${viewMode === 'grid'
                        ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                        : 'grid-cols-1'
                    }
        `}>
                    {filteredMaterias.map((materia) => (
                        <MateriaPrimaCard
                            key={materia.id_materia_prima}
                            materia={materia}
                            onView={handleView}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            {/* Modal de Formulário */}
            <Modal
                isOpen={showForm}
                onClose={handleFormCancel}
                title={editingMateria ? 'Editar Matéria-Prima' : 'Nova Matéria-Prima'}
                size="lg"
            >
                <MateriaPrimaForm
                    materia={editingMateria}
                    onSubmit={handleFormSubmit}
                    onCancel={handleFormCancel}
                    loading={formLoading}
                />
            </Modal>

            {/* Modal de Visualização */}
            {viewingMateria && (
                <Modal
                    isOpen={!!viewingMateria}
                    onClose={() => setViewingMateria(null)}
                    title="Detalhes da Matéria-Prima"
                    size="lg"
                >
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium text-gray-900">Código:</span>
                                <p className="text-gray-600">{viewingMateria.codigo}</p>
                            </div>
                            <div>
                                <span className="font-medium text-gray-900">Categoria:</span>
                                <p className="text-gray-600">{viewingMateria.categoria}</p>
                            </div>
                            <div className="col-span-2">
                                <span className="font-medium text-gray-900">Descrição:</span>
                                <p className="text-gray-600">{viewingMateria.descricao}</p>
                            </div>
                            {viewingMateria.especificacoes && (
                                <div className="col-span-2">
                                    <span className="font-medium text-gray-900">Especificações:</span>
                                    <p className="text-gray-600">{viewingMateria.especificacoes}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </Modal>
            )}

            {/* Dialog de Confirmação de Exclusão */}
            <ConfirmDialog
                isOpen={!!deletingMateria}
                onClose={() => setDeletingMateria(null)}
                onConfirm={handleConfirmDelete}
                title="Confirmar Exclusão"
                message={`Tem certeza que deseja excluir a matéria-prima "${deletingMateria?.descricao}"?`}
                confirmText="Excluir"
                type="danger"
            />
        </div>
    );
};

export default MateriaPrimaList;