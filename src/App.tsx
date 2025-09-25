import { useState } from 'react';
import {Header} from "./components/Header.tsx";
import {ThreeColumnLayout} from "./components/ThreeColumnLayout.tsx";


// replace url
const API_ENDPOINT = "https://your-api-gateway-url.execute-api.us-east-1.amazonaws.com/prod/";
function App() {
    const [jobDescription, setJobDescription] = useState('');
    const [resumeText, setResumeText] = useState('');
    const [resultText, setResultText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const handleTailor = async () => {
        setIsLoading(true);
        setError(null);
        setResultText('');
        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jobDescription: jobDescription,
                    resumeText: resumeText,
                }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Произошла ошибка на сервере');
            }
            const data = await response.json();
            setResultText(data.tailoredResume);
        } catch (err: any) {
            setError(err.message);
            // Можно также отобразить ошибку пользователю
            console.error("Fetch error:", err);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans flex flex-col">
            <Header />
            <main className="flex-grow">
                <ThreeColumnLayout
                    jobDescription={jobDescription}
                    setJobDescription={setJobDescription}
                    resumeText={resumeText}
                    setResumeText={setResumeText}
                    result={resultText}
                    isLoading={isLoading}
                    handleTailor={handleTailor}
                />
                {error && (
                    <div className="text-center p-4 text-red-500">
                        <p>Ошибка: {error}</p>
                    </div>
                )}
            </main>
            <footer className="text-center p-4 text-sm text-gray-500 border-t border-gray-200 dark:border-gray-800">
                <p>Проект для собеседования. Стек: React, Go, AWS Lambda.</p>
            </footer>
        </div>
    )
}
export default App;