// src/components/materiaPrima/MateriaPrimaCard.jsx
import React from 'react';
import {
    Edit,
    Trash2,
    Eye,
    AlertTriangle,
    CheckCircle,
    Package
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { STATUS_ESTOQUE, CORES_STATUS } from '../../constants';

const MateriaPrimaCard = ({
    materia,
    onView,
    onEdit,
    onDelete
}) => {
    // Calcular status do estoque
    const getEstoqueStatus = () => {
        if (materia.estoque_atual <= 0) return STATUS_ESTOQUE.ZERADO;
        if (materia.estoque_atual <= materia.estoque_minimo) return STATUS_ESTOQUE.CRITICO;
        return STATUS_ESTOQUE.NORMAL;
    };

    const status = getEstoqueStatus();
    const statusColors = CORES_STATUS[status];

    const getStatusIcon = () => {
        switch (status) {
            case STATUS_ESTOQUE.NORMAL:
                return <CheckCircle className="h-4 w-4" />;
            case STATUS_ESTOQUE.CRITICO:
                return <AlertTriangle className="h-4 w-4" />;
            case STATUS_ESTOQUE.ZERADO:
                return <AlertTriangle className="h-4 w-4" />;
            default:
                return <Package className="h-4 w-4" />;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200">
            {/* Header do Card */}
            <div className="p-4 border-b border-gray-100">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                                {materia.descricao}
                            </h3>
                            <span className={`
                inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                ${statusColors}
              `}>
                                {getStatusIcon()}
                                <span className="ml-1">{status}</span>
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                            Código: <span className="font-medium">{materia.codigo}</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Conteúdo do Card */}
            <div className="p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-gray-500">Categoria:</span>
                        <p className="font-medium text-gray-900">{materia.categoria}</p>
                    </div>
                    <div>
                        <span className="text-gray-500">Unidade:</span>
                        <p className="font-medium text-gray-900">{materia.unidade_medida}</p>
                    </div>
                    <div>
                        <span className="text-gray-500">Preço Unitário:</span>
                        <p className="font-medium text-gray-900">
                            {formatCurrency(materia.preco_unitario)}
                        </p>
                    </div>
                    <div>
                        <span className="text-gray-500">Estoque Atual:</span>
                        <p className={`font-medium ${status === STATUS_ESTOQUE.NORMAL ? 'text-green-600' :
                            status === STATUS_ESTOQUE.CRITICO ? 'text-yellow-600' :
                                'text-red-600'
                            }`}>
                            {materia.estoque_atual} {materia.unidade_medida}
                        </p>
                    </div>
                    <div>
                        <span className="text-gray-500">Estoque Mínimo:</span>
                        <p className="font-medium text-gray-900">
                            {materia.estoque_minimo} {materia.unidade_medida}
                        </p>
                    </div>
                    <div>
                        <span className="text-gray-500">Data Cadastro:</span>
                        <p className="font-medium text-gray-900">
                            {formatDate(materia.data_cadastro)}
                        </p>
                    </div>
                </div>

                {/* Especificações */}
                {materia.especificacoes && (
                    <div className="mt-4">
                        <span className="text-gray-500 text-sm">Especificações:</span>
                        <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                            {materia.especificacoes}
                        </p>
                    </div>
                )}
            </div>

            {/* Footer com Ações */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 rounded-b-lg">
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={() => onView(materia)}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                    </button>
                    <button
                        onClick={() => onEdit(materia)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                    </button>
                    <button
                        onClick={() => onDelete(materia)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                    >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Excluir
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MateriaPrimaCard;