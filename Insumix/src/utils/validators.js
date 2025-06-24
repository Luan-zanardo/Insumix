// src/utils/validators.js

export const validateMateriaPrima = (data) => {
    const errors = {};

    // Código obrigatório
    if (!data.codigo?.trim()) {
        errors.codigo = 'Código é obrigatório';
    } else if (data.codigo.length < 2) {
        errors.codigo = 'Código deve ter pelo menos 2 caracteres';
    }

    // Descrição obrigatória
    if (!data.descricao?.trim()) {
        errors.descricao = 'Descrição é obrigatória';
    } else if (data.descricao.length < 3) {
        errors.descricao = 'Descrição deve ter pelo menos 3 caracteres';
    }

    // Unidade de medida obrigatória
    if (!data.unidade_medida?.trim()) {
        errors.unidade_medida = 'Unidade de medida é obrigatória';
    }

    // Categoria obrigatória
    if (!data.categoria?.trim()) {
        errors.categoria = 'Categoria é obrigatória';
    }

    // Preço unitário deve ser >= 0
    if (data.preco_unitario < 0) {
        errors.preco_unitario = 'Preço não pode ser negativo';
    }

    // Estoque mínimo deve ser >= 0
    if (data.estoque_minimo < 0) {
        errors.estoque_minimo = 'Estoque mínimo não pode ser negativo';
    }

    // Estoque atual deve ser >= 0
    if (data.estoque_atual < 0) {
        errors.estoque_atual = 'Estoque atual não pode ser negativo';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

export const validateRequired = (value, fieldName) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
        return `${fieldName} é obrigatório`;
    }
    return null;
};

export const validateNumber = (value, fieldName, min = 0) => {
    const num = parseFloat(value);
    if (isNaN(num)) {
        return `${fieldName} deve ser um número válido`;
    }
    if (num < min) {
        return `${fieldName} deve ser maior ou igual a ${min}`;
    }
    return null;
};