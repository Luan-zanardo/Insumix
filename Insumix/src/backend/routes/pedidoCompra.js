const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET - Listar pedidos de compra (usando view)
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT * FROM vw_pedidos_abertos
      ORDER BY data_pedido DESC
    `);
    
    res.json({
      success: true,
      data: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// GET - Todos os pedidos (não apenas em aberto)
router.get('/todos', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT p.*, f.razao_social, u.nome as usuario
      FROM pedido_compra p
      JOIN fornecedor f ON f.id_fornecedor = p.id_fornecedor
      JOIN usuario u ON u.id_usuario = p.id_usuario
      ORDER BY p.data_pedido DESC
    `);
    
    res.json({
      success: true,
      data: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    console.error('Erro ao buscar todos os pedidos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// GET - Buscar pedido por ID com itens
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Buscar dados do pedido
    const pedido = await db.query(`
      SELECT p.*, f.razao_social, u.nome as usuario
      FROM pedido_compra p
      JOIN fornecedor f ON f.id_fornecedor = p.id_fornecedor
      JOIN usuario u ON u.id_usuario = p.id_usuario
      WHERE p.id_pedido = $1
    `, [id]);

    if (pedido.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado'
      });
    }

    // Buscar itens do pedido
    const itens = await db.query(`
      SELECT i.*, mp.codigo, mp.descricao, mp.unidade_medida
      FROM item_pedido_compra i
      JOIN materia_prima mp ON mp.id_materia_prima = i.id_materia_prima
      WHERE i.id_pedido = $1
      ORDER BY mp.descricao
    `, [id]);

    res.json({
      success: true,
      data: {
        ...pedido.rows[0],
        itens: itens.rows
      }
    });
  } catch (error) {
    console.error('Erro ao buscar pedido:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// POST - Criar novo pedido de compra
router.post('/', async (req, res) => {
  const client = await db.pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const {
      id_fornecedor,
      id_usuario,
      numero_pedido,
      data_prevista_entrega,
      observacoes,
      itens
    } = req.body;

    // Validações básicas
    if (!id_fornecedor || !id_usuario || !numero_pedido || !itens || itens.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios: id_fornecedor, id_usuario, numero_pedido, itens'
      });
    }

    // Criar pedido
    const pedidoResult = await client.query(`
      INSERT INTO pedido_compra (id_fornecedor, id_usuario, numero_pedido, 
                                data_prevista_entrega, observacoes)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [id_fornecedor, id_usuario, numero_pedido, data_prevista_entrega, observacoes]);

    const id_pedido = pedidoResult.rows[0].id_pedido;
    let valor_total = 0;

    // Adicionar itens do pedido
    for (const item of itens) {
      const { id_materia_prima, quantidade, preco_unitario } = item;
      const subtotal = quantidade * preco_unitario;
      valor_total += subtotal;

      await client.query(`
        INSERT INTO item_pedido_compra (id_pedido, id_materia_prima, quantidade, preco_unitario, subtotal)
        VALUES ($1, $2, $3, $4, $5)
      `, [id_pedido, id_materia_prima, quantidade, preco_unitario, subtotal]);
    }

    // Atualizar valor total do pedido
    await client.query(
      'UPDATE pedido_compra SET valor_total = $1 WHERE id_pedido = $2',
      [valor_total, id_pedido]
    );

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'Pedido criado com sucesso',
      data: {
        ...pedidoResult.rows[0],
        valor_total
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro ao criar pedido:', error);
    
    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        message: 'Número do pedido já existe'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  } finally {
    client.release();
  }
});

// PUT - Atualizar status do pedido
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status é obrigatório'
      });
    }

    const result = await db.query(`
      UPDATE pedido_compra 
      SET status = $1
      WHERE id_pedido = $2
      RETURNING *
    `, [status, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Status do pedido atualizado com sucesso',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao atualizar status do pedido:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// DELETE - Cancelar pedido
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(`
      UPDATE pedido_compra 
      SET status = 'cancelado' 
      WHERE id_pedido = $1 AND status IN ('pendente', 'enviado')
      RETURNING *
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado ou não pode ser cancelado'
      });
    }

    res.json({
      success: true,
      message: 'Pedido cancelado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao cancelar pedido:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

module.exports = router;