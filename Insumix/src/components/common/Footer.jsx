// src/components/common/Footer.jsx
import React from 'react';
import { Package, Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    {/* Logo e Descrição */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center mb-4">
                            <Package className="h-8 w-8 text-blue-400 mr-2" />
                            <span className="text-2xl font-bold">
                                Insu<span className="text-blue-400">mix</span>
                            </span>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed max-w-md">
                            Sistema completo de gestão de insumos industriais.
                            Controle seu estoque, fornecedores e produção de forma eficiente e integrada.
                        </p>
                        <div className="flex space-x-4 mt-6">
                            <a
                                href="#"
                                className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                                aria-label="GitHub"
                            >
                                <Github className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                                aria-label="LinkedIn"
                            >
                                <Linkedin className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                                aria-label="Email"
                            >
                                <Mail className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Links Úteis */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Funcionalidades</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors duration-200">
                                    Controle de Estoque
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors duration-200">
                                    Gestão de Fornecedores
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors duration-200">
                                    Pedidos de Compra
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors duration-200">
                                    Relatórios
                                </a>
                            </li>
                        </ul>
                    </div>  
                </div>

                {/* Linha divisória */}
                <div className="border-t border-gray-800 mt-8 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400 text-sm">
                            © {currentYear} Insumix. 
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;