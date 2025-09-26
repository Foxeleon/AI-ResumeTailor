import React from 'react';
import Textarea, { type TextareaAutosizeProps } from 'react-textarea-autosize';


interface AutoExpandingTextareaProps extends TextareaAutosizeProps {
    title: string;
}
export const AutoExpandingTextarea: React.FC<AutoExpandingTextareaProps> = ({ title, ...props }) => {
    return (
        <div className="flex flex-col animate-fade-in">
            <h2 className="text-xl font-semibold text-brand-secondary mb-3">{title}</h2>
            <Textarea
                className=" flex-grow p-4 border-2 border-brand-accent/50 rounded-2xl bg-brand-light shadow-lg focus:ring-4 focus:ring-brand-primary/50 focus:outline-none transition-all duration-300 placeholder-brand-secondary/40 text-brand-secondary"
                minRows={12}
                {...props}
            />
        </div>
    );
};
