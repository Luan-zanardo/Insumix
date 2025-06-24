// src/pages/Home.jsx
import React from 'react';
import {
    Package,
    Warehouse,
    Truck,
    ShoppingCart,
    Users,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    BarChart3,
    ArrowRight
} from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';

const Home = ({ onNavigate }) => {
    const features = [
        {
            icon: Package,
            title: 'Matérias-Primas',
            description: 'Controle completo de insumos com categorização e especificações técnicas.',
            status: 'Disponível',
            color: 'blue',
            active: true,
            route: 'materias-primas'
        },
        {
            icon: Warehouse,
            title: 'Gestão de Estoque',
            description: 'Movimentações em tempo real com alertas de estoque mínimo.',
            status: 'Em breve',
            color: 'green',
            active: false
        },
        {
            icon: Truck,
            title: 'Fornecedores',
            description: 'Cadastro e gestão de fornecedores com histórico de compras.',
            status: 'Em breve',
            color: 'purple',
            active: false
        },
        {
            icon: ShoppingCart,
            title: 'Produtos',
            description: 'Catálogo de produtos com fórmulas e composições.',
            status: 'Em breve',
            color: 'orange',
            active: false
        },
        {
            icon: Users,
            title: 'Pedidos de Compra',
            description: 'Automação de pedidos com aprovações e rastreamento.',
            status: 'Em breve',
            color: 'indigo',
            active: false
        },
        {
            icon: BarChart3,
            title: 'Relatórios',
            description: 'Dashboards e relatórios para análise estratégica.',
            status: 'Em breve',
            color: 'red',
            active: false
        }
    ];

    const stats = [
        {
            icon: TrendingUp,
            title: 'Eficiência',
            value: '+40%',
            description: 'Redução no tempo de gestão',
            color: 'green'
        },
        {
            icon: CheckCircle,
            title: 'Controle',
            value: '100%',
            description: 'Rastreabilidade dos insumos',
            color: 'blue'
        },
        {
            icon: AlertTriangle,
            title: 'Alertas',
            value: 'Tempo real',
            description: 'Notificações de estoque baixo',
            color: 'yellow'
        }
    ];

    const getColorClasses = (color) => {
        const colors = {
            blue: 'bg-blue-500 text-white',
            green: 'bg-green-500 text-white',
            purple: 'bg-purple-500 text-white',
            orange: 'bg-orange-500 text-white',
            indigo: 'bg-indigo-500 text-white',
            red: 'bg-red-500 text-white',
            yellow: 'bg-yellow-500 text-white'
        };
        return colors[color] || colors.blue;
    };

    return (
        <>
            <PageHeader
                title="Sistema Insumix"
                subtitle="Gestão Inteligente de Insumos Industriais"
                icon={Package}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Hero Section */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Controle total da sua cadeia de suprimentos
                    </h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Simplifique a gestão de matérias-primas, controle estoques em tempo real e
                        otimize seus processos de compra com nossa plataforma integrada.
                    </p>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                                <div className="flex items-center">
                                    <div className={`p-3 rounded-lg ${getColorClasses(stat.color)}`}>
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-gray-900">{stat.title}</h3>
                                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                        <p className="text-sm text-gray-500">{stat.description}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Features Grid */}
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                        Funcionalidades do Sistema
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={index}
                                    className={`
                    bg-white rounded-lg shadow-md border border-gray-200 p-6 
                    transition-all duration-200 
                    ${feature.active
                                            ? 'hover:shadow-lg hover:border-blue-300 cursor-pointer'
                                            : 'opacity-75'
                                        }
                  `}
                                    onClick={() => feature.active && onNavigate(feature.route)}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`p-3 rounded-lg ${getColorClasses(feature.color)}`}>
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <span className={`
                      px-2 py-1 text-xs font-medium rounded-full
                      ${feature.active
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-600'
                                            }
                    `}>
                                            {feature.status}
                                        </span>
                                    </div>

                                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                        {feature.title}
                                    </h4>

                                    <p className="text-gray-600 text-sm mb-4">
                                        {feature.description}
                                    </p>

                                    {feature.active && (
                                        <div className="flex items-center text-blue-600 text-sm font-medium">
                                            Acessar módulo
                                            <ArrowRight className="h-4 w-4 ml-1" />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Call to Action */}
                <div className="mt-12 bg-blue-50 rounded-lg p-8 text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        Pronto para começar?
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                        Explore o módulo de Matérias-Primas para ver como o Insumix pode
                        transformar a gestão dos seus insumos industriais.
                    </p>
                    <button
                        onClick={() => onNavigate('materias-primas')}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <Package className="h-5 w-5 mr-2" />
                        Gerenciar Matérias-Primas
                        <ArrowRight className="h-5 w-5 ml-2" />
                    </button>
                </div>
            </div>
        </>
    );
};

export default Home;