const request = require('supertest');
const express = require('express');
const fornecedorRoutes = require('../routes/fornecedor');

const app = express();
app.use(express.json());
app.use('/api/fornecedores', fornecedorRoutes);

describe('Rotas de Fornecedor', () => {
  let server, idFornecedor;

  beforeAll(async () => {
    server = app.listen(0);
    await new Promise(resolve => setTimeout(resolve, 3000));
  });

  afterAll(done => server.close(done));

  it('deve criar um novo fornecedor', async () => {
    const res = await request(app).post('/api/fornecedores').send({
      razao_social: 'Fornecedor Teste',
      cnpj: `00${Date.now()}`
    });
    expect(res.statusCode).toBe(201);
    idFornecedor = res.body.data.id_fornecedor;
  });

  it('deve buscar fornecedor por ID', async () => {
    const res = await request(app).get(`/api/fornecedores/${idFornecedor}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.razao_social).toBe('Fornecedor Teste');
  });
});
