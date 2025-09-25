import React from 'react';
import Textarea, { type TextareaAutosizeProps } from 'react-textarea-autosize';

interface AutoExpandingTextareaProps extends TextareaAutosizeProps {
    title: string;
}
export const AutoExpandingTextarea: React.FC<AutoExpandingTextareaProps> = ({ title, ...props }) => {
    return (
        <div className="w-full">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">{title}</h2>
            <Textarea
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow duration-200"
                minRows={10}
                {...props}
            />
        </div>
    );
};