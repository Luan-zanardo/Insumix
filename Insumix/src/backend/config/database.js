const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  application_name: 'insumix-app'
});

pool.on('connect', () => {
  console.log('✅ Conectado ao PostgreSQL via Supabase');
});

pool.on('error', (err) => {
  console.error('❌ Erro na conexão PostgreSQL:', err);
});

// Teste inicial de conexão
async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('🔗 Pool de conexões inicializado com sucesso');
    const result = await client.query('SELECT NOW(), version()');
    console.log('🕐 Timestamp do servidor:', result.rows[0].now);
    console.log('📋 Versão PostgreSQL:', result.rows[0].version.split(' ')[0]);
    client.release();
  } catch (err) {
    console.error('❌ Erro ao conectar:', err.message);
    console.error('🔍 Verifique se a DATABASE_URL está correta no .env');
  }
}

testConnection();

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};