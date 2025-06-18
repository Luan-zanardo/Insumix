const express = require('express');
const router = express.Router();
const db = require('../config/database');
const bcrypt = require('bcrypt');

// GET - Listar todos os usuários
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT id_usuario, nome, email, tipo_usuario, data_cadastro, ativo
      FROM usuario 
      WHERE ativo = true
      ORDER BY nome
    `);
    
    res.json({
      success: true,
      data: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// GET - Buscar usuário por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'SELECT id_usuario, nome, email, tipo_usuario, data_cadastro, ativo FROM usuario WHERE id_usuario = $1 AND ativo = true',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// POST - Criar novo usuário
router.post('/', async (req, res) => {
  try {
    const {
      nome,
      email,
      senha,
      tipo_usuario = 'operador'
    } = req.body;

    // Validações básicas
    if (!nome || !email || !senha) {
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios: nome, email, senha'
      });
    }

    // Verificar se o email já existe
    const emailExiste = await db.query('SELECT id_usuario FROM usuario WHERE email = $1', [email]);
    if (emailExiste.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Email já cadastrado'
      });
    }

    // Criptografar senha
    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(senha, saltRounds);

    const result = await db.query(`
      INSERT INTO usuario (nome, email, senha, tipo_usuario)
      VALUES ($1, $2, $3, $4)
      RETURNING id_usuario, nome, email, tipo_usuario, data_cadastro, ativo
    `, [nome, email, senhaHash, tipo_usuario]);

    res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// PUT - Atualizar usuário
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, tipo_usuario } = req.body;

    const result = await db.query(`
      UPDATE usuario 
      SET nome = $1, email = $2, tipo_usuario = $3
      WHERE id_usuario = $4 AND ativo = true
      RETURNING id_usuario, nome, email, tipo_usuario, data_cadastro, ativo
    `, [nome, email, tipo_usuario, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Usuário atualizado com sucesso',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// DELETE - Desativar usuário (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(
      'UPDATE usuario SET ativo = false WHERE id_usuario = $1 AND ativo = true RETURNING id_usuario',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Usuário desativado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao desativar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// PUT - Alterar senha
router.put('/:id/senha', async (req, res) => {
  try {
    const { id } = req.params;
    const { senha_atual, nova_senha } = req.body;

    if (!senha_atual || !nova_senha) {
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios: senha_atual, nova_senha'
      });
    }

    // Buscar usuário e senha atual
    const usuario = await db.query('SELECT senha FROM usuario WHERE id_usuario = $1 AND ativo = true', [id]);
    
    if (usuario.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Verificar senha atual
    const senhaValida = await bcrypt.compare(senha_atual, usuario.rows[0].senha);
    if (!senhaValida) {
      return res.status(401).json({
        success: false,
        message: 'Senha atual incorreta'
      });
    }

    // Criptografar nova senha
    const saltRounds = 10;
    const novaSenhaHash = await bcrypt.hash(nova_senha, saltRounds);

    await db.query('UPDATE usuario SET senha = $1 WHERE id_usuario = $2', [novaSenhaHash, id]);

    res.json({
      success: true,
      message: 'Senha alterada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

module.exports = router;