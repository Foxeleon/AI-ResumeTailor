import React from "react";
import {AutoExpandingTextarea} from "./AutoExpandingTextarea.tsx";
import ResultDisplay from "./ResultDisplay.tsx";

interface ThreeColumnLayoutProps {
    jobDescription: string;
    setJobDescription: (value: string) => void;
    resumeText: string;
    setResumeText: (value: string) => void;
    result: string;
    isLoading: boolean;
    handleTailor: () => void;
}
export const ThreeColumnLayout: React.FC<ThreeColumnLayoutProps> =
    ({ jobDescription, setJobDescription, resumeText, setResumeText, result, isLoading, handleTailor }) =>
    {
        const isButtonDisabled = !jobDescription || !resumeText || isLoading;
        return (
            <div className="p-4 md:p-6 flex-grow">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <AutoExpandingTextarea
                        title="1. Описание вакансии"
                        placeholder="Вставьте сюда полное описание вакансии..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                    />
                    <AutoExpandingTextarea
                        title="2. Ваше резюме"
                        placeholder="Вставьте сюда текст вашего текущего резюме..."
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                    />
                    <ResultDisplay result={result} isLoading={isLoading} />
                </div>
                <div className="text-center">
                    <button
                        onClick={handleTailor}
                        disabled={isButtonDisabled}
                        className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300"
                    >
                        {isLoading ? 'Анализ...' : '✨ Адаптировать резюме'}
                    </button>
                </div>
            </div>
        );
}