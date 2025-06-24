const request = require('supertest');
const express = require('express');
const estoqueRoutes = require('../routes/estoque');

const app = express();
app.use(express.json());
app.use('/api/estoque', estoqueRoutes);

describe('Rotas de Estoque', () => {
  let server;

  beforeAll(async () => {
    server = app.listen(0);
    await new Promise(resolve => setTimeout(resolve, 3000));
  });

  afterAll(done => server.close(done));

  it('deve listar estoque geral', async () => {
    const res = await request(app).get('/api/estoque');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('deve retornar erro ao registrar movimentação inválida', async () => {
    const res = await request(app).post('/api/estoque/movimentacao').send({
      id_materia_prima: 1,
      id_usuario: 1,
      tipo_movimentacao: 'invalida',
      quantidade: -10
    });
    expect(res.statusCode).toBe(400);
  });
});
