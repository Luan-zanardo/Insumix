# Backend Insumix

Sistema de controle de insumos desenvolvido em Node.js com Express e PostgreSQL.

## 🚀 Instalação e Configuração

### Pré-requisitos
- Node.js (versão 16 ou superior)
- PostgreSQL (versão 12 ou superior)
- npm ou yarn

### Passos para instalação

1. **Clone o repositório e navegue para a pasta do backend:**
```bash
cd Insumix
mkdir backend
cd backend
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure o banco de dados:**
   - Crie um banco de dados PostgreSQL chamado `insumix`
   - Execute o script SQL fornecido (`Scripts SQL.txt`) para criar as tabelas, procedures, views e triggers

4. **Configure as variáveis de ambiente:**
   - Copie o arquivo `.env` e ajuste as configurações do banco de dados
   - Altere as credenciais conforme sua configuração local

5. **Inicie o servidor:**
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

O servidor estará disponível em `http://localhost:3001`

## 📁 Estrutura do Projeto

```
backend/
├── config/
│   └── database.js          # Configuração do PostgreSQL
├── routes/
│   ├── usuario.js           # CRUD de usuários
│   ├── materiaPrima.js      # CRUD de matérias-primas
│   ├── fornecedor.js        # CRUD de fornecedores
│   ├── produto.js           # CRUD de produtos
│   ├── pedidoCompra.js      # CRUD de pedidos de compra
│   └── estoque.js           # Controle de estoque
├── .env                     # Variáveis de ambiente
├── package.json             # Dependências e scripts
├── server.js               # Servidor principal
└── README.md               # Este arquivo
```

## 🔌 Endpoints da API

### Usuários (`/api/usuarios`)
- `GET /` - Listar usuários
- `GET /:id` - Buscar usuário por ID
- `POST /` - Criar usuário
- `PUT /:id` - Atualizar usuário
- `DELETE /:id` - Desativar usuário
- `PUT /:id/senha` - Alterar senha

### Matérias-Primas (`/api/materias-primas`)
- `GET /` - Listar matérias-primas
- `GET /:id` - Buscar matéria-prima por ID
- `POST /` - Criar matéria-prima
- `PUT /:id` - Atualizar matéria-prima
- `DELETE /:id` - Desativar matéria-prima
- `PUT /:id/preco` - Atualizar preço (usa procedure)

### Fornecedores (`/api/fornecedores`)
- `GET /` - Listar fornecedores
- `GET /:id` - Buscar fornecedor por ID
- `POST /` - Criar fornecedor
- `PUT /:id` - Atualizar fornecedor
- `DELETE /:id` - Desativar fornecedor

### Produtos (`/api/produtos`)
- `GET /` - Listar produtos
- `GET /:id` - Buscar produto por ID
- `POST /` - Criar produto
- `PUT /:id` - Atualizar produto
- `DELETE /:id` - Desativar produto
- `GET /:id/formula` - Buscar fórmula do produto
- `POST /:id/formula` - Adicionar item à fórmula

### Pedidos de Compra (`/api/pedidos-compra`)
- `GET /` - Listar pedidos em aberto (usa view)
- `GET /todos` - Listar todos os pedidos
- `GET /:id` - Buscar pedido por ID com itens
- `POST /` - Criar pedido de compra
- `PUT /:id/status` - Atualizar status do pedido
- `DELETE /:id` - Cancelar pedido

### Estoque (`/api/estoque`)
- `GET /` - Visualizar estoque (usa view)
- `GET /:id/total` - Calcular estoque total (usa function)
- `POST /movimentacao` - Registrar movimentação (usa procedure)
- `GET /movimentacoes` - Histórico de movimentações
- `GET /critico` - Relatório de estoque crítico

## 🔧 Funcionalidades Especiais

### Procedures Implementadas
1. **`atualizar_preco_materia()`** - Atualização de preços de matérias-primas
2. **`registrar_movimentacao()`** - Controle de movimentação de estoque

### Functions Implementadas
1. **`calcular_estoque_total()`** - Cálculo de estoque total por matéria-prima

### Views Utilizadas
1. **`vw_estoque_materia`** - Visão do status do estoque
2. **`vw_pedidos_abertos`** - Pedidos em aberto
3. **`vw_producao_planejada`** - Produção planejada

### Triggers
- **`trg_atualiza_materia`** - Atualiza automaticamente a data de modificação

## 🛡️ Segurança

- Senhas criptografadas com bcrypt
- Validação de dados de entrada
- Soft delete para preservação de dados
- Tratamento de erros padronizado

## 📊 Estrutura de Resposta

Todas as rotas seguem o padrão de resposta:

```json
{
  "success": true|false,
  "message": "Mensagem descritiva",
  "data": { ... },
  "total": 123
}
```

## 🧪 Testando a API

Você pode testar os endpoints usando ferramentas como:
- Postman
- Insomnia
- curl
- Extensão REST Client do VS Code

### Exemplo de teste:
```bash
# Listar matérias-primas
curl http://localhost:3001/api/materias-primas

# Criar usuário
curl -X POST http://localhost:3001/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{"nome":"Admin","email":"admin@insumix.com","senha":"123456","tipo_usuario":"admin"}'
```

