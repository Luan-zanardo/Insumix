const request = require('supertest');
const express = require('express');
const pedidoRoutes = require('../routes/pedidoCompra');

const app = express();
app.use(express.json());
app.use('/api/pedidos-compra', pedidoRoutes);

describe('Rotas de Pedido de Compra', () => {
  let server;

  beforeAll(async () => {
    server = app.listen(0);
    await new Promise(resolve => setTimeout(resolve, 3000));
  });

  afterAll(done => server.close(done));

  it('deve listar pedidos abertos', async () => {
    const res = await request(app).get('/api/pedidos-compra');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('deve retornar erro ao criar pedido sem itens', async () => {
    const res = await request(app).post('/api/pedidos-compra').send({
      id_fornecedor: 1,
      id_usuario: 1,
      numero_pedido: `PED-${Date.now()}`
    });
    expect(res.statusCode).toBe(400);
  });
});
