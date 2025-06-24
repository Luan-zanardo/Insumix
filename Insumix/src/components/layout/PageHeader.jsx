// src/components/layout/PageHeader.jsx
import React from 'react';

const PageHeader = ({
    title,
    subtitle,
    icon: Icon,
    children,
    breadcrumb = []
}) => {
    return (
        <div className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

                {/* Breadcrumb */}
                {breadcrumb.length > 0 && (
                    <nav className="flex mb-4" aria-label="Breadcrumb">
                        <ol className="inline-flex items-center space-x-1 md:space-x-3">
                            {breadcrumb.map((item, index) => (
                                <li key={index} className="inline-flex items-center">
                                    {index > 0 && (
                                        <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                    <span className={`
                    text-sm font-medium 
                    ${index === breadcrumb.length - 1
                                            ? 'text-gray-500'
                                            : 'text-blue-600 hover:text-blue-800 cursor-pointer'
                                        }
                  `}>
                                        {item}
                                    </span>
                                </li>
                            ))}
                        </ol>
                    </nav>
                )}

                {/* Header Content */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center">
                        {Icon && (
                            <div className="flex-shrink-0 mr-4">
                                <Icon className="h-8 w-8 text-blue-600" />
                            </div>
                        )}
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {title}
                            </h1>
                            {subtitle && (
                                <p className="mt-1 text-sm text-gray-500">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    {children && (
                        <div className="mt-4 sm:mt-0 sm:ml-4 flex-shrink-0">
                            {children}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PageHeader;