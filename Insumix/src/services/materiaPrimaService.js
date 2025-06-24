// src/services/materiaPrimaService.js
import api from './api';

const ENDPOINT = '/materias-primas';

export const materiaPrimaService = {
    // Listar todas as matérias-primas
    getAll: async () => {
        try {
            const response = await api.get(ENDPOINT);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar matérias-primas:', error);
            throw error;
        }
    },

    // Buscar matéria-prima por ID
    getById: async (id) => {
        try {
            const response = await api.get(`${ENDPOINT}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar matéria-prima:', error);
            throw error;
        }
    },

    // Criar nova matéria-prima
    create: async (data) => {
        try {
            const response = await api.post(ENDPOINT, data);
            return response.data;
        } catch (error) {
            console.error('Erro ao criar matéria-prima:', error);
            throw error;
        }
    },

    // Atualizar matéria-prima
    update: async (id, data) => {
        try {
            const response = await api.put(`${ENDPOINT}/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Erro ao atualizar matéria-prima:', error);
            throw error;
        }
    },

    // Deletar matéria-prima (soft delete)
    delete: async (id) => {
        try {
            const response = await api.delete(`${ENDPOINT}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao deletar matéria-prima:', error);
            throw error;
        }
    },

    // Atualizar preço da matéria-prima
    updatePrice: async (id, novoPreco) => {
        try {
            const response = await api.put(`${ENDPOINT}/${id}/preco`, {
                novo_preco: novoPreco
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao atualizar preço:', error);
            throw error;
        }
    }
};