const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET - Listar todos os produtos
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT id_produto, codigo, nome, descricao, unidade_medida, 
             preco_venda, estoque_atual, categoria, data_cadastro, ativo
      FROM produto 
      WHERE ativo = true
      ORDER BY nome
    `);
    
    res.json({
      success: true,
      data: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// GET - Buscar produto por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'SELECT * FROM produto WHERE id_produto = $1 AND ativo = true',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// POST - Criar novo produto
router.post('/', async (req, res) => {
  try {
    const {
      codigo,
      nome,
      descricao,
      unidade_medida,
      preco_venda = 0.0000,
      estoque_atual = 0,
      categoria
    } = req.body;

    // Validações básicas
    if (!codigo || !nome || !unidade_medida || !categoria) {
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios: codigo, nome, unidade_medida, categoria'
      });
    }

    const result = await db.query(`
      INSERT INTO produto (codigo, nome, descricao, unidade_medida, preco_venda, estoque_atual, categoria)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [codigo, nome, descricao, unidade_medida, preco_venda, estoque_atual, categoria]);

    res.status(201).json({
      success: true,
      message: 'Produto criado com sucesso',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    
    if (error.code === '23505') { // Erro de chave duplicada
      return res.status(409).json({
        success: false,
        message: 'Código já existe'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// PUT - Atualizar produto
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      codigo,
      nome,
      descricao,
      unidade_medida,
      preco_venda,
      estoque_atual,
      categoria
    } = req.body;

    const result = await db.query(`
      UPDATE produto 
      SET codigo = $1, nome = $2, descricao = $3, unidade_medida = $4,
          preco_venda = $5, estoque_atual = $6, categoria = $7
      WHERE id_produto = $8 AND ativo = true
      RETURNING *
    `, [codigo, nome, descricao, unidade_medida, preco_venda, estoque_atual, categoria, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Produto atualizado com sucesso',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// DELETE - Desativar produto (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(
      'UPDATE produto SET ativo = false WHERE id_produto = $1 AND ativo = true RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Produto desativado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao desativar produto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// GET - Buscar fórmula do produto
router.get('/:id/formula', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(`
      SELECT fp.*, mp.codigo, mp.descricao, mp.unidade_medida
      FROM formula_produto fp
      JOIN materia_prima mp ON mp.id_materia_prima = fp.id_materia_prima
      WHERE fp.id_produto = $1 AND fp.ativo = true
      ORDER BY fp.tipo_uso, mp.descricao
    `, [id]);

    res.json({
      success: true,
      data: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    console.error('Erro ao buscar fórmula do produto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// POST - Adicionar item à fórmula do produto
router.post('/:id/formula', async (req, res) => {
  try {
    const { id } = req.params;
    const { id_materia_prima, quantidade_necessaria, tipo_uso = 'principal' } = req.body;

    if (!id_materia_prima || !quantidade_necessaria) {
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios: id_materia_prima, quantidade_necessaria'
      });
    }

    const result = await db.query(`
      INSERT INTO formula_produto (id_produto, id_materia_prima, quantidade_necessaria, tipo_uso)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [id, id_materia_prima, quantidade_necessaria, tipo_uso]);

    res.status(201).json({
      success: true,
      message: 'Item adicionado à fórmula com sucesso',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao adicionar item à fórmula:', error);
    
    if (error.code === '23505') { // Erro de chave duplicada
      return res.status(409).json({
        success: false,
        message: 'Matéria-prima já existe na fórmula deste produto'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

module.exports = router;