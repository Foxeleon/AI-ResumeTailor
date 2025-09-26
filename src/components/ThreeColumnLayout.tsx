import React from "react";
import { AutoExpandingTextarea } from "./AutoExpandingTextarea.tsx";
import { ResultDisplay } from "./ResultDisplay.tsx";
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
            <div className="w-full">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <AutoExpandingTextarea
                        title="1. Job Description"
                        placeholder="Paste the full job description here..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                    />
                    <AutoExpandingTextarea
                        title="2. Your Current Resume"
                        placeholder="Paste your current resume text here..."
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                        style={{ animationDelay: '0.1s' }}
                    />
                    <ResultDisplay result={result} isLoading={isLoading} />
                </div>
                <div className="text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    <button
                        onClick={handleTailor}
                        disabled={isButtonDisabled}
                        className="px-10 py-4 bg-brand-primary text-white text-lg font-bold rounded-full shadow-lg transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-brand-primary/50 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none transition-all duration-300"
                    >
                        {isLoading ? 'Analyzing...' : '✨ Tailor My Resume'}
                    </button>
                </div>
            </div>
        );
    }