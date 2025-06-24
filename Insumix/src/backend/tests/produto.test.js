const request = require('supertest');
const express = require('express');
const produtoRoutes = require('../routes/produto');

const app = express();
app.use(express.json());
app.use('/api/produtos', produtoRoutes);

describe('Rotas de Produto', () => {
  let server;
  let idProduto;

  beforeAll(async () => {
    server = app.listen(0);
    await new Promise(resolve => setTimeout(resolve, 3000));
  });

  afterAll(done => server.close(done));

  it('deve criar um novo produto', async () => {
    const res = await request(app).post('/api/produtos').send({
      codigo: `COD-${Date.now()}`,
      nome: 'Produto Teste',
      unidade_medida: 'UN',
      categoria: 'Categoria Teste'
    });
    expect(res.statusCode).toBe(201);
    idProduto = res.body.data.id_produto;
  });

  it('deve buscar o produto criado por ID', async () => {
    const res = await request(app).get(`/api/produtos/${idProduto}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.nome).toBe('Produto Teste');
  });

  it('deve desativar o produto', async () => {
    const res = await request(app).delete(`/api/produtos/${idProduto}`);
    expect(res.statusCode).toBe(200);
  });
});
