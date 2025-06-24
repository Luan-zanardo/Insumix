// src/components/materiaPrima/MateriaPrimaForm.jsx
import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import { CATEGORIAS_MATERIA_PRIMA, UNIDADES_MEDIDA } from '../../constants';
import { validateMateriaPrima } from '../../utils/validators';

const MateriaPrimaForm = ({
    materia = null,
    onSubmit,
    onCancel,
    loading = false
}) => {
    const isEditing = !!materia;

    const [formData, setFormData] = useState({
        codigo: '',
        descricao: '',
        unidade_medida: '',
        preco_unitario: '',
        estoque_minimo: '',
        estoque_atual: '',
        categoria: '',
        especificacoes: ''
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    // Carregar dados para edição
    useEffect(() => {
        if (materia) {
            setFormData({
                codigo: materia.codigo || '',
                descricao: materia.descricao || '',
                unidade_medida: materia.unidade_medida || '',
                preco_unitario: materia.preco_unitario || '',
                estoque_minimo: materia.estoque_minimo || '',
                estoque_atual: materia.estoque_atual || '',
                categoria: materia.categoria || '',
                especificacoes: materia.especificacoes || ''
            });
        }
    }, [materia]);

    // Validar formulário em tempo real
    useEffect(() => {
        const validation = validateMateriaPrima(formData);
        setErrors(validation.errors);
    }, [formData]);

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Marcar campo como "tocado"
        setTouched(prev => ({
            ...prev,
            [field]: true
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Marcar todos os campos como tocados
        const allFields = Object.keys(formData);
        const newTouched = {};
        allFields.forEach(field => {
            newTouched[field] = true;
        });
        setTouched(newTouched);

        // Validar formulário
        const validation = validateMateriaPrima(formData);

        if (validation.isValid) {
            // Converter valores numéricos
            const dataToSubmit = {
                ...formData,
                preco_unitario: parseFloat(formData.preco_unitario) || 0,
                estoque_minimo: parseInt(formData.estoque_minimo) || 0,
                estoque_atual: parseInt(formData.estoque_atual) || 0
            };

            onSubmit(dataToSubmit);
        }
    };

    const getFieldError = (field) => {
        return touched[field] && errors[field] ? errors[field] : null;
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">

            {/* Grid de Campos Básicos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Código */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Código *
                    </label>
                    <input
                        type="text"
                        value={formData.codigo}
                        onChange={(e) => handleChange('codigo', e.target.value)}
                        className={`
              w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1
              ${getFieldError('codigo')
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                            }
            `}
                        placeholder="Ex: MP001"
                    />
                    {getFieldError('codigo') && (
                        <p className="mt-1 text-sm text-red-600">{getFieldError('codigo')}</p>
                    )}
                </div>

                {/* Categoria */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Categoria *
                    </label>
                    <select
                        value={formData.categoria}
                        onChange={(e) => handleChange('categoria', e.target.value)}
                        className={`
              w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 bg-white
              ${getFieldError('categoria')
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                            }
            `}
                    >
                        <option value="">Selecione uma categoria</option>
                        {CATEGORIAS_MATERIA_PRIMA.map(categoria => (
                            <option key={categoria} value={categoria}>
                                {categoria}
                            </option>
                        ))}
                    </select>
                    {getFieldError('categoria') && (
                        <p className="mt-1 text-sm text-red-600">{getFieldError('categoria')}</p>
                    )}
                </div>
            </div>

            {/* Descrição */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição *
                </label>
                <input
                    type="text"
                    value={formData.descricao}
                    onChange={(e) => handleChange('descricao', e.target.value)}
                    className={`
            w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1
            ${getFieldError('descricao')
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                        }
          `}
                    placeholder="Descrição detalhada da matéria-prima"
                />
                {getFieldError('descricao') && (
                    <p className="mt-1 text-sm text-red-600">{getFieldError('descricao')}</p>
                )}
            </div>

            {/* Grid de Campos Numéricos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Unidade de Medida */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Unidade de Medida *
                    </label>
                    <select
                        value={formData.unidade_medida}
                        onChange={(e) => handleChange('unidade_medida', e.target.value)}
                        className={`
              w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 bg-white
              ${getFieldError('unidade_medida')
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                            }
            `}
                    >
                        <option value="">Selecione</option>
                        {UNIDADES_MEDIDA.map(unidade => (
                            <option key={unidade} value={unidade}>
                                {unidade}
                            </option>
                        ))}
                    </select>
                    {getFieldError('unidade_medida') && (
                        <p className="mt-1 text-sm text-red-600">{getFieldError('unidade_medida')}</p>
                    )}
                </div>

                {/* Preço Unitário */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preço Unitário (R$)
                    </label>
                    <input
                        type="number"
                        step="0.0001"
                        min="0"
                        value={formData.preco_unitario}
                        onChange={(e) => handleChange('preco_unitario', e.target.value)}
                        className={`
              w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1
              ${getFieldError('preco_unitario')
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                            }
            `}
                        placeholder="0,00"
                    />
                    {getFieldError('preco_unitario') && (
                        <p className="mt-1 text-sm text-red-600">{getFieldError('preco_unitario')}</p>
                    )}
                </div>

                {/* Estoque Mínimo */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estoque Mínimo
                    </label>
                    <input
                        type="number"
                        min="0"
                        value={formData.estoque_minimo}
                        onChange={(e) => handleChange('estoque_minimo', e.target.value)}
                        className={`
              w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1
              ${getFieldError('estoque_minimo')
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                            }
            `}
                        placeholder="0"
                    />
                    {getFieldError('estoque_minimo') && (
                        <p className="mt-1 text-sm text-red-600">{getFieldError('estoque_minimo')}</p>
                    )}
                </div>
            </div>

            {/* Estoque Atual (apenas para criação) */}
            {!isEditing && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Estoque Atual
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={formData.estoque_atual}
                            onChange={(e) => handleChange('estoque_atual', e.target.value)}
                            className={`
                w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1
                ${getFieldError('estoque_atual')
                                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                }
              `}
                            placeholder="0"
                        />
                        {getFieldError('estoque_atual') && (
                            <p className="mt-1 text-sm text-red-600">{getFieldError('estoque_atual')}</p>
                        )}
                    </div>
                </div>
            )}

            {/* Especificações */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Especificações
                </label>
                <textarea
                    rows={3}
                    value={formData.especificacoes}
                    onChange={(e) => handleChange('especificacoes', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Informações técnicas, observações, etc."
                />
            </div>

            {/* Botões de Ação */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <X className="h-4 w-4 mr-2 inline" />
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={loading || Object.keys(errors).length > 0}
                    className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Save className="h-4 w-4 mr-2 inline" />
                    {loading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar'}
                </button>
            </div>
        </form>
    );
};

export default MateriaPrimaForm;