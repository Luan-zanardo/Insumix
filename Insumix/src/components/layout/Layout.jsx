// src/components/layout/Layout.jsx
import React from 'react';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

const Layout = ({ children, currentPage, onNavigate }) => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Navbar fixa no topo */}
            <Navbar currentPage={currentPage} onNavigate={onNavigate} />

            {/* Conteúdo principal com padding-top para compensar navbar fixa */}
            <main className="flex-1 pt-16">
                {children}
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Layout;