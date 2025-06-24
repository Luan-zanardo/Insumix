const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET - Listar todas as matérias-primas
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT id_materia_prima, codigo, descricao, unidade_medida, 
             preco_unitario, estoque_minimo, estoque_atual, categoria, 
             especificacoes, data_cadastro, ativo
      FROM materia_prima 
      WHERE ativo = true
      ORDER BY descricao
    `);
    
    res.json({
      success: true,
      data: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    console.error('Erro ao buscar matérias-primas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// GET - Buscar matéria-prima por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'SELECT * FROM materia_prima WHERE id_materia_prima = $1 AND ativo = true',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Matéria-prima não encontrada'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao buscar matéria-prima:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// POST - Criar nova matéria-prima
router.post('/', async (req, res) => {
  try {
    const {
      codigo,
      descricao,
      unidade_medida,
      preco_unitario = 0.0000,
      estoque_minimo = 0,
      estoque_atual = 0,
      categoria,
      especificacoes
    } = req.body;

    // Validações básicas
    if (!codigo || !descricao || !unidade_medida || !categoria) {
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios: codigo, descricao, unidade_medida, categoria'
      });
    }

    const result = await db.query(`
      INSERT INTO materia_prima (codigo, descricao, unidade_medida, preco_unitario, 
                                estoque_minimo, estoque_atual, categoria, especificacoes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [codigo, descricao, unidade_medida, preco_unitario, estoque_minimo, estoque_atual, categoria, especificacoes]);

    res.status(201).json({
      success: true,
      message: 'Matéria-prima criada com sucesso',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao criar matéria-prima:', error);
    
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

// PUT - Atualizar matéria-prima
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      codigo,
      descricao,
      unidade_medida,
      preco_unitario,
      estoque_minimo,
      estoque_atual,
      categoria,
      especificacoes
    } = req.body;

    const result = await db.query(`
      UPDATE materia_prima 
      SET codigo = $1, descricao = $2, unidade_medida = $3, preco_unitario = $4,
          estoque_minimo = $5, estoque_atual = $6, categoria = $7, especificacoes = $8
      WHERE id_materia_prima = $9 AND ativo = true
      RETURNING *
    `, [codigo, descricao, unidade_medida, preco_unitario, estoque_minimo, estoque_atual, categoria, especificacoes, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Matéria-prima não encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Matéria-prima atualizada com sucesso',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao atualizar matéria-prima:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// DELETE - Desativar matéria-prima (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(
      'UPDATE materia_prima SET ativo = false WHERE id_materia_prima = $1 AND ativo = true RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Matéria-prima não encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Matéria-prima desativada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao desativar matéria-prima:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// PUT - Atualizar preço usando procedure
router.put('/:id/preco', async (req, res) => {
  try {
    const { id } = req.params;
    const { novo_preco } = req.body;

    if (!novo_preco || novo_preco <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Preço deve ser maior que zero'
      });
    }

    // Chama a procedure criada no SQL
    await db.query('CALL atualizar_preco_materia($1, $2)', [id, novo_preco]);

    // Busca os dados atualizados
    const result = await db.query(
      'SELECT * FROM materia_prima WHERE id_materia_prima = $1',
      [id]
    );

    res.json({
      success: true,
      message: 'Preço atualizado com sucesso',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao atualizar preço:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

module.exports = router;