const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET - Listar todos os fornecedores
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT id_fornecedor, razao_social, nome_fantasia, cnpj, inscricao_estadual,
             telefone, email, endereco, cidade, estado, cep, status, data_cadastro
      FROM fornecedor 
      WHERE status = 'ativo'
      ORDER BY razao_social
    `);
    
    res.json({
      success: true,
      data: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    console.error('Erro ao buscar fornecedores:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// GET - Buscar fornecedor por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'SELECT * FROM fornecedor WHERE id_fornecedor = $1 AND status = \'ativo\'',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Fornecedor não encontrado'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao buscar fornecedor:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// POST - Criar novo fornecedor
router.post('/', async (req, res) => {
  try {
    const {
      razao_social,
      nome_fantasia,
      cnpj,
      inscricao_estadual,
      telefone,
      email,
      endereco,
      cidade,
      estado,
      cep
    } = req.body;

    // Validações básicas
    if (!razao_social || !cnpj) {
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios: razao_social, cnpj'
      });
    }

    const result = await db.query(`
      INSERT INTO fornecedor (razao_social, nome_fantasia, cnpj, inscricao_estadual, 
                             telefone, email, endereco, cidade, estado, cep)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [razao_social, nome_fantasia, cnpj, inscricao_estadual, telefone, email, endereco, cidade, estado, cep]);

    res.status(201).json({
      success: true,
      message: 'Fornecedor criado com sucesso',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao criar fornecedor:', error);
    
    if (error.code === '23505') { // Erro de chave duplicada
      return res.status(409).json({
        success: false,
        message: 'CNPJ já cadastrado'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// PUT - Atualizar fornecedor
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      razao_social,
      nome_fantasia,
      cnpj,
      inscricao_estadual,
      telefone,
      email,
      endereco,
      cidade,
      estado,
      cep
    } = req.body;

    const result = await db.query(`
      UPDATE fornecedor 
      SET razao_social = $1, nome_fantasia = $2, cnpj = $3, inscricao_estadual = $4,
          telefone = $5, email = $6, endereco = $7, cidade = $8, estado = $9, cep = $10
      WHERE id_fornecedor = $11 AND status = 'ativo'
      RETURNING *
    `, [razao_social, nome_fantasia, cnpj, inscricao_estadual, telefone, email, endereco, cidade, estado, cep, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Fornecedor não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Fornecedor atualizado com sucesso',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao atualizar fornecedor:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// DELETE - Desativar fornecedor (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(
      'UPDATE fornecedor SET status = \'inativo\' WHERE id_fornecedor = $1 AND status = \'ativo\' RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Fornecedor não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Fornecedor desativado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao desativar fornecedor:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

module.exports = router