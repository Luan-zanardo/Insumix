// src/components/common/Navbar.jsx
import React, { useState } from 'react';
import {
    Package,
    Warehouse,
    Truck,
    ShoppingCart,
    Users,
    Menu,
    X,
    Home
} from 'lucide-react';

const Navbar = ({ currentPage, onNavigate }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const menuItems = [
        { id: 'home', label: 'Home', icon: Home, active: true },
        { id: 'materias-primas', label: 'Matérias-Primas', icon: Package, active: true },
        { id: 'estoque', label: 'Estoque', icon: Warehouse, active: false },
        { id: 'fornecedores', label: 'Fornecedores', icon: Truck, active: false },
        { id: 'produtos', label: 'Produtos', icon: ShoppingCart, active: false },
        { id: 'pedidos', label: 'Pedidos', icon: Users, active: false },
    ];

    const handleMenuClick = (itemId) => {
        if (itemId === 'home' || itemId === 'materias-primas') {
            onNavigate(itemId);
        }
        setIsMenuOpen(false);
    };

    return (
        <nav className="bg-white shadow-lg border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">

                    {/* Logo */}
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <Package className="h-8 w-8 text-blue-600 mr-2" />
                            <span className="text-2xl font-bold text-gray-900">
                                Insu<span className="text-blue-600">mix</span>
                            </span>
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = currentPage === item.id;
                            const isClickable = item.active;

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => handleMenuClick(item.id)}
                                    disabled={!isClickable}
                                    className={`
                    flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                    ${isActive
                                            ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600'
                                            : isClickable
                                                ? 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                                : 'text-gray-400 cursor-not-allowed'
                                        }
                  `}
                                >
                                    <Icon className="h-4 w-4 mr-2" />
                                    {item.label}
                                    {!isClickable && (
                                        <span className="ml-2 text-xs bg-gray-200 text-gray-500 px-2 py-1 rounded">
                                            Em breve
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900 p-2"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = currentPage === item.id;
                            const isClickable = item.active;

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => handleMenuClick(item.id)}
                                    disabled={!isClickable}
                                    className={`
                    w-full flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors duration-200
                    ${isActive
                                            ? 'text-blue-600 bg-blue-50'
                                            : isClickable
                                                ? 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                                : 'text-gray-400 cursor-not-allowed'
                                        }
                  `}
                                >
                                    <Icon className="h-5 w-5 mr-3" />
                                    <span className="flex-1 text-left">{item.label}</span>
                                    {!isClickable && (
                                        <span className="text-xs bg-gray-200 text-gray-500 px-2 py-1 rounded">
                                            Em breve
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;