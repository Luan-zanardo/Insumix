// src/App.jsx
import React, { useState } from 'react';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import MateriaPrima from './pages/MateriaPrima';
import Estoque from './pages/Estoque';
import Fornecedores from './pages/Fornecedores';
import Produtos from './pages/Produtos';
import PedidosCompra from './pages/PedidosCompra';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigate} />;
      case 'materias-primas':
        return <MateriaPrima />;
      case 'estoque':
        return <Estoque />;
      case 'fornecedores':
        return <Fornecedores />;
      case 'produtos':
        return <Produtos />;
      case 'pedidos':
        return <PedidosCompra />;
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={handleNavigate}>
      {renderPage()}
    </Layout>
  );
}

export default App;