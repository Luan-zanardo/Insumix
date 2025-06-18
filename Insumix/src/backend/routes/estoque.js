const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET - Visualizar estoque (usando a view criada)
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT * FROM vw_estoque_materia 
      ORDER BY 
        CASE WHEN status_estoque = 'CRÍTICO' THEN 1 ELSE 2 END,
        descricao
    `);
    
    res.json({
      success: true,
      data: result.rows,
      total: result.rows.length,
      criticos: result.rows.filter(item => item.status_estoque === 'CRÍTICO').length
    });
  } catch (error) {
    console.error('Erro ao buscar estoque:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// GET - Buscar estoque de uma matéria-prima específica usando function
router.get('/:id/total', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query('SELECT calcular_estoque_total($1) as estoque_total', [id]);
    
    if (result.rows[0].estoque_total === null) {
      return res.status(404).json({
        success: false,
        message: 'Matéria-prima não encontrada'
      });
    }

    res.json({
      success: true,
      data: {
        id_materia_prima: id,
        estoque_total: result.rows[0].estoque_total
      }
    });
  } catch (error) {
    console.error('Erro ao calcular estoque:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// POST - Registrar movimentação de estoque (usando procedure)
router.post('/movimentacao', async (req, res) => {
  try {
    const {
      id_materia_prima,
      id_usuario,
      tipo_movimentacao,
      quantidade,
      documento_referencia,
      observacoes
    } = req.body;

    // Validações
    if (!id_materia_prima || !id_usuario || !tipo_movimentacao || !quantidade) {
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios: id_materia_prima, id_usuario, tipo_movimentacao, quantidade'
      });
    }

    if (!['entrada', 'saida'].includes(tipo_movimentacao)) {
      return res.status(400).json({
        success: false,
        message: 'Tipo de movimentação deve ser "entrada" ou "saida"'
      });
    }

    if (quantidade <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantidade deve ser maior que zero'
      });
    }

    // Chama a procedure para registrar movimentação
    await db.query(`
      CALL registrar_movimentacao($1, $2, $3, $4, $5, $6)
    `, [id_materia_prima, id_usuario, tipo_movimentacao, quantidade, documento_referencia, observacoes]);

    // Busca o estoque atualizado
    const estoqueAtual = await db.query(
      'SELECT estoque_atual FROM materia_prima WHERE id_materia_prima = $1',
      [id_materia_prima]
    );

    res.json({
      success: true,
      message: 'Movimentação registrada com sucesso',
      data: {
        id_materia_prima,
        tipo_movimentacao,
        quantidade,
        estoque_atual: estoqueAtual.rows[0].estoque_atual
      }
    });
  } catch (error) {
    console.error('Erro ao registrar movimentação:', error);
    
    if (error.message.includes('Tipo de movimentação inválido')) {
      return res.status(400).json({
        success: false,
        message: 'Tipo de movimentação inválido'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// GET - Histórico de movimentações
router.get('/movimentacoes', async (req, res) => {
  try {
    const { id_materia_prima, limite = 50 } = req.query;
    
    let query = `
      SELECT m.*, mp.descricao as materia_prima, u.nome as usuario
      FROM movimentacao_estoque m
      JOIN materia_prima mp ON mp.id_materia_prima = m.id_materia_prima
      JOIN usuario u ON u.id_usuario = m.id_usuario
    `;
    
    const params = [];
    
    if (id_materia_prima) {
      query += ' WHERE m.id_materia_prima = $1';
      params.push(id_materia_prima);
    }
    
    query += ' ORDER BY m.data_movimentacao DESC LIMIT $' + (params.length + 1);
    params.push(limite);

    const result = await db.query(query, params);
    
    res.json({
      success: true,
      data: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    console.error('Erro ao buscar movimentações:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// GET - Relatório de estoque crítico
router.get('/critico', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT * FROM vw_estoque_materia 
      WHERE status_estoque = 'CRÍTICO'
      ORDER BY descricao
    `);
    
    res.json({
      success: true,
      data: result.rows,
      total: result.rows.length,
      message: result.rows.length === 0 ? 'Nenhum item com estoque crítico' : `${result.rows.length} itens com estoque crítico`
    });
  } catch (error) {
    console.error('Erro ao buscar estoque crítico:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

module.exports = router;