import { LoaderCircle } from 'lucide-react';
import React from 'react';
interface ResultDisplayProps {
    result: string;
    isLoading: boolean;
}
export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, isLoading }) => {
    return (
        <div className="w-full h-full flex flex-col animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-xl font-semibold text-brand-secondary mb-3">3. AI-Powered Result</h2>
            <div className="w-full flex-grow p-4 border-2 border-transparent rounded-2xl bg-brand-light shadow-lg min-h-[324px] flex items-center justify-center transition-all duration-300">
                {isLoading ? (
                    <div className="flex flex-col items-center gap-4 text-center animate-fade-in">
                        <LoaderCircle className="w-12 h-12 text-brand-primary animate-spin" />
                        <span className="text-brand-secondary/80 font-medium">AI is analyzing the data...</span>
                    </div>
                ) : result ? (
                    <pre className="whitespace-pre-wrap text-left w-full text-brand-secondary font-sans animate-fade-in">{result}</pre>
                ) : (
                    <p className="text-brand-secondary/50 text-center px-4">
                        Your tailored resume will appear here...
                    </p>
                )}
            </div>
        </div>
    );
};