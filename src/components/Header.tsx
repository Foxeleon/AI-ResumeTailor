import { FileText } from 'lucide-react';
import React from 'react';


export const Header: React.FC = () => {
    return (
        <header className="text-center py-8">
            <div className="flex items-center justify-center gap-4 mb-2">
                <FileText className="w-10 h-10 text-brand-primary" />
                <h1 className="text-4xl md:text-5xl font-bold text-brand-secondary">
                    AI Resume Tailor
                </h1>
            </div>
            <p className="text-lg text-brand-secondary/80">
                Adapt your resume to any job description in seconds
            </p>
        </header>
    );
};