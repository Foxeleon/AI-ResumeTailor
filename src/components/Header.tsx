import React from 'react';
import {FileText} from 'lucide-react';

export const Header: React.FC = () => {
    return (
        <header className="text-center p-4 md:p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-center gap-3 mb-2">
                <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
                    AI Resume Tailor
                </h1>
            </div>
            <p className="text-md text-gray-600 dark:text-gray-400">
                Адаптируйте ваше резюме под любую вакансию за секунды
            </p>
        </header>
    );
};