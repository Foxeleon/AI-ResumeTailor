import { LoaderCircle } from 'lucide-react';
import React from 'react';


interface ResultDisplayProps {
    result: string;
    isLoading: boolean;
}
const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, isLoading }) => {
    return (
        <div className="w-full h-full flex flex-col">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">3. Результат</h2>
            <div className="w-full flex-grow p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800 min-h-[240px] flex items-center justify-center">
                {isLoading ? (
                    <div className="flex flex-col items-center gap-2 text-center">
                        <LoaderCircle className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
                        <span className="text-gray-600 dark:text-gray-400">AI анализирует данные...</span>
                    </div>
                ) : result ? (
                    <pre className="whitespace-pre-wrap text-left w-full text-gray-900 dark:text-gray-100 font-sans">{result}</pre>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center">
                        Здесь появится адаптированный текст вашего резюме...
                    </p>
                )}
            </div>
        </div>
    );
};
export default ResultDisplay;