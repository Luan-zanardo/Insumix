const request = require('supertest');
const express = require('express');

// Configuração da aplicação de teste
const app = express();
app.use(express.json());

// Importar as rotas
const usuarioRoutes = require('../routes/usuario');
app.use('/api/usuarios', usuarioRoutes);

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    error: err.message
  });
});

describe('Rotas de Usuário', () => {
  let idCriado = null;
  let emailTeste = null;
  let server = null;

  // Configuração antes de todos os testes
  beforeAll(async () => {
    // Inicia o servidor na porta de teste
    server = app.listen(0); // Porta aleatória para teste
    
    // Aguarda a conexão com o banco
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log('🧪 Servidor de teste iniciado');
  });

  // Limpeza após todos os testes
  afterAll(async (done) => {
    // Remove usuário de teste se ainda existir
    if (idCriado) {
      try {
        await request(app).delete(`/api/usuarios/${idCriado}`);
      } catch (error) {
        console.log('Erro ao limpar dados de teste:', error.message);
      }
    }
    
    // Fecha o servidor
    if (server) {
      server.close(() => {
        console.log('🧪 Servidor de teste encerrado');
        done();
      });
    } else {
      done();
    }
  });

  it('deve criar um novo usuário', async () => {
    emailTeste = `teste_${Date.now()}_${Math.random().toString(36).substr(2, 9)}@email.com`;
    
    const res = await request(app)
      .post('/api/usuarios')
      .send({
        nome: 'Teste User',
        email: emailTeste,
        senha: '123456',
        tipo_usuario: 'operador'
      });

    console.log('Resposta criação:', res.body);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('id_usuario');
    expect(res.body.data.nome).toBe('Teste User');
    expect(res.body.data.email).toBe(emailTeste);
    expect(res.body.data.tipo_usuario).toBe('operador');
    
    idCriado = res.body.data.id_usuario;
    console.log('ID criado:', idCriado);
  });

  it('deve retornar erro ao tentar criar usuário com email duplicado', async () => {
    const res = await request(app)
      .post('/api/usuarios')
      .send({
        nome: 'Outro User',
        email: emailTeste, // Mesmo email do teste anterior
        senha: '123456',
        tipo_usuario: 'operador'
      });

    expect(res.statusCode).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Email já cadastrado');
  });

  it('deve retornar erro ao criar usuário sem campos obrigatórios', async () => {
    const res = await request(app)
      .post('/api/usuarios')
      .send({
        nome: 'User Incompleto'
        // Faltando email e senha
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Campos obrigatórios: nome, email, senha');
  });

  it('deve buscar todos os usuários', async () => {
    const res = await request(app).get('/api/usuarios');
    
    console.log('Resposta buscar todos:', res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body).toHaveProperty('total');
  });

  it('deve buscar o usuário recém-criado por ID', async () => {
    const res = await request(app).get(`/api/usuarios/${idCriado}`);
    
    console.log('Resposta buscar por ID:', res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id_usuario).toBe(idCriado);
    expect(res.body.data.nome).toBe('Teste User');
    expect(res.body.data.email).toBe(emailTeste);
  });

  it('deve retornar 404 para usuário inexistente', async () => {
    const res = await request(app).get('/api/usuarios/99999');
    
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Usuário não encontrado');
  });

  it('deve atualizar o usuário', async () => {
    const emailAtualizado = `atualizado_${Date.now()}_${Math.random().toString(36).substr(2, 9)}@email.com`;
    
    const res = await request(app)
      .put(`/api/usuarios/${idCriado}`)
      .send({
        nome: 'Usuário Atualizado',
        email: emailAtualizado,
        tipo_usuario: 'admin'
      });

    console.log('Resposta atualização:', res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.nome).toBe('Usuário Atualizado');
    expect(res.body.data.email).toBe(emailAtualizado);
    expect(res.body.data.tipo_usuario).toBe('admin');
  });

  it('deve alterar a senha do usuário', async () => {
    const res = await request(app)
      .put(`/api/usuarios/${idCriado}/senha`)
      .send({
        senha_atual: '123456',
        nova_senha: 'novaSenha123'
      });

    console.log('Resposta alteração senha:', res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Senha alterada com sucesso');
  });

  it('deve retornar erro ao alterar senha com senha atual incorreta', async () => {
    const res = await request(app)
      .put(`/api/usuarios/${idCriado}/senha`)
      .send({
        senha_atual: 'senhaErrada',
        nova_senha: 'outraSenha123'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Senha atual incorreta');
  });

  it('deve desativar o usuário (soft delete)', async () => {
    const res = await request(app).delete(`/api/usuarios/${idCriado}`);
    
    console.log('Resposta desativação:', res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Usuário desativado com sucesso');
  });

  it('deve retornar 404 ao buscar usuário desativado', async () => {
    const res = await request(app).get(`/api/usuarios/${idCriado}`);
    
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Usuário não encontrado');
  });

  it('deve retornar 404 ao tentar desativar usuário já desativado', async () => {
    const res = await request(app).delete(`/api/usuarios/${idCriado}`);
    
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Usuário não encontrado');
    
    // Limpa a variável pois o usuário já foi deletado
    idCriado = null;
  });
});

// Configuração Jest para evitar que testes fiquem pendentes
afterAll(async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
});