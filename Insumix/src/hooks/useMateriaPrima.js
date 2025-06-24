// src/hooks/useMateriaPrima.js
import { useState, useEffect, useCallback } from 'react';
import { materiaPrimaService } from '../services/materiaPrimaService';
import { MENSAGENS } from '../constants';

export const useMateriaPrima = () => {
    const [materiasPrimas, setMateriasPrimas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedMateria, setSelectedMateria] = useState(null);

    // Carregar todas as matérias-primas
    const loadMateriasPrimas = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await materiaPrimaService.getAll();
            setMateriasPrimas(response.data || []);
        } catch (err) {
            setError(err.message || MENSAGENS.ERRO.CARREGAR);
            console.error('Erro ao carregar matérias-primas:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Carregar matéria-prima por ID
    const loadMateriaPrimaById = useCallback(async (id) => {
        setLoading(true);
        setError(null);

        try {
            const response = await materiaPrimaService.getById(id);
            setSelectedMateria(response.data);
            return response.data;
        } catch (err) {
            setError(err.message || MENSAGENS.ERRO.CARREGAR);
            console.error('Erro ao carregar matéria-prima:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Criar nova matéria-prima
    const createMateriaPrima = useCallback(async (data) => {
        setLoading(true);
        setError(null);

        try {
            const response = await materiaPrimaService.create(data);
            await loadMateriasPrimas(); // Recarregar lista
            return response;
        } catch (err) {
            setError(err.message || MENSAGENS.ERRO.SALVAR);
            console.error('Erro ao criar matéria-prima:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [loadMateriasPrimas]);

    // Atualizar matéria-prima
    const updateMateriaPrima = useCallback(async (id, data) => {
        setLoading(true);
        setError(null);

        try {
            const response = await materiaPrimaService.update(id, data);
            await loadMateriasPrimas(); // Recarregar lista
            return response;
        } catch (err) {
            setError(err.message || MENSAGENS.ERRO.SALVAR);
            console.error('Erro ao atualizar matéria-prima:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [loadMateriasPrimas]);

    // Deletar matéria-prima
    const deleteMateriaPrima = useCallback(async (id) => {
        setLoading(true);
        setError(null);

        try {
            const response = await materiaPrimaService.delete(id);
            await loadMateriasPrimas(); // Recarregar lista
            return response;
        } catch (err) {
            setError(err.message || MENSAGENS.ERRO.DELETAR);
            console.error('Erro ao deletar matéria-prima:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [loadMateriasPrimas]);

    // Atualizar preço
    const updatePrice = useCallback(async (id, novoPreco) => {
        setLoading(true);
        setError(null);

        try {
            const response = await materiaPrimaService.updatePrice(id, novoPreco);
            await loadMateriasPrimas(); // Recarregar lista
            return response;
        } catch (err) {
            setError(err.message || MENSAGENS.ERRO.SALVAR);
            console.error('Erro ao atualizar preço:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [loadMateriasPrimas]);

    // Filtrar matérias-primas
    const filterMaterias = useCallback((searchTerm, categoria, statusEstoque) => {
        let filtered = [...materiasPrimas];

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(materia =>
                materia.codigo.toLowerCase().includes(term) ||
                materia.descricao.toLowerCase().includes(term)
            );
        }

        if (categoria && categoria !== 'todas') {
            filtered = filtered.filter(materia => materia.categoria === categoria);
        }

        if (statusEstoque && statusEstoque !== 'todos') {
            filtered = filtered.filter(materia => {
                const status = materia.estoque_atual <= 0 ? 'ZERADO' :
                    materia.estoque_atual <= materia.estoque_minimo ? 'CRÍTICO' : 'NORMAL';
                return status === statusEstoque;
            });
        }

        return filtered;
    }, [materiasPrimas]);

    // Calcular estatísticas
    const getEstoqueStats = useCallback(() => {
        const total = materiasPrimas.length;
        const criticos = materiasPrimas.filter(m =>
            m.estoque_atual > 0 && m.estoque_atual <= m.estoque_minimo
        ).length;
        const zerados = materiasPrimas.filter(m => m.estoque_atual <= 0).length;
        const normais = total - criticos - zerados;

        return { total, criticos, zerados, normais };
    }, [materiasPrimas]);

    // Carregar dados iniciais
    useEffect(() => {
        loadMateriasPrimas();
    }, [loadMateriasPrimas]);

    return {
        // Estado
        materiasPrimas,
        loading,
        error,
        selectedMateria,

        // Ações
        loadMateriasPrimas,
        loadMateriaPrimaById,
        createMateriaPrima,
        updateMateriaPrima,
        deleteMateriaPrima,
        updatePrice,

        // Utilitários
        filterMaterias,
        getEstoqueStats,
        setSelectedMateria,
        clearError: () => setError(null)
    };
};