// src/constants/index.js

export const CATEGORIAS_MATERIA_PRIMA = [
    'Química',
    'Plástica',
    'Metálica',
    'Orgânica',
    'Têxtil',
    'Eletrônica',
    'Alimentícia',
    'Farmacêutica',
    'Cosmética',
    'Automotiva'
];

export const UNIDADES_MEDIDA = [
    'kg',
    'g',
    'l',
    'ml',
    'm',
    'cm',
    'mm',
    'm²',
    'm³',
    'unidade',
    'caixa',
    'pacote',
    'saco',
    'tambor',
    'galão'
];

export const STATUS_ESTOQUE = {
    NORMAL: 'NORMAL',
    CRITICO: 'CRÍTICO',
    ZERADO: 'ZERADO'
};

export const CORES_STATUS = {
    [STATUS_ESTOQUE.NORMAL]: 'text-green-600 bg-green-100',
    [STATUS_ESTOQUE.CRITICO]: 'text-yellow-600 bg-yellow-100',
    [STATUS_ESTOQUE.ZERADO]: 'text-red-600 bg-red-100'
};

export const MENSAGENS = {
    SUCESSO: {
        CRIAR: 'Matéria-prima criada com sucesso!',
        ATUALIZAR: 'Matéria-prima atualizada com sucesso!',
        DELETAR: 'Matéria-prima removida com sucesso!',
        PRECO: 'Preço atualizado com sucesso!'
    },
    ERRO: {
        GENERICO: 'Ocorreu um erro. Tente novamente.',
        CARREGAR: 'Erro ao carregar matérias-primas',
        SALVAR: 'Erro ao salvar matéria-prima',
        DELETAR: 'Erro ao remover matéria-prima',
        CAMPOS_OBRIGATORIOS: 'Preencha todos os campos obrigatórios'
    },
    CONFIRMACAO: {
        DELETAR: 'Tem certeza que deseja remover esta matéria-prima?',
        PRECO: 'Deseja atualizar o preço desta matéria-prima?'
    }
};