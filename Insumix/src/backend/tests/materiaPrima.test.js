const request = require('supertest');
const express = require('express');
const materiaPrimaRoutes = require('../routes/materiaPrima');

const app = express();
app.use(express.json());
app.use('/api/materias-primas', materiaPrimaRoutes);

describe('Rotas de Matéria-Prima', () => {
  let server, idMateriaPrima;

  beforeAll(async () => {
    server = app.listen(0);
    await new Promise(resolve => setTimeout(resolve, 3000));
  });

  afterAll(done => server.close(done));

  it('deve criar nova matéria-prima', async () => {
    const res = await request(app).post('/api/materias-primas').send({
      codigo: `MP-${Date.now()}`,
      descricao: 'Matéria Teste',
      unidade_medida: 'KG',
      categoria: 'Teste'
    });
    expect(res.statusCode).toBe(201);
    idMateriaPrima = res.body.data.id_materia_prima;
  });

  it('deve atualizar o preço da matéria-prima', async () => {
    const res = await request(app).put(`/api/materias-primas/${idMateriaPrima}/preco`).send({
      novo_preco: 150
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.preco_unitario).toBe('150.0000');
  });
});
