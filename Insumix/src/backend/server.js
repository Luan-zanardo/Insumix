const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importar rotas
const usuarioRoutes = require('./routes/usuario');
const materiaPrimaRoutes = require('./routes/materiaPrima');
const fornecedorRoutes = require('./routes/fornecedor');
const produtoRoutes = require('./routes/produto');
const pedidoCompraRoutes = require('./routes/pedidoCompra');
const estoqueRoutes = require('./routes/estoque');

// Usar rotas
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/materias-primas', materiaPrimaRoutes);
app.use('/api/fornecedores', fornecedorRoutes);
app.use('/api/produtos', produtoRoutes);
app.use('/api/pedidos-compra', pedidoCompraRoutes);
app.use('/api/estoque', estoqueRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Insumix funcionando!', 
    version: '1.0.0',
    endpoints: [
      'GET /api/usuarios',
      'GET /api/materias-primas',
      'GET /api/fornecedores',
      'GET /api/produtos',
      'GET /api/pedidos-compra',
      'GET /api/estoque'
    ]
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Algo deu errado!', 
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 Ambiente: ${process.env.NODE_ENV}`);
  console.log(`🔗 API disponível em: http://localhost:${PORT}`);
});