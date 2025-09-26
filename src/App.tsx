import { useState } from 'react';
import { Header } from "./components/Header.tsx";
import { ThreeColumnLayout } from "./components/ThreeColumnLayout.tsx";
// TODO: Replace with your actual API Gateway URL after deploying the backend
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
        // We don't clear the result text immediately for a smoother UX

        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jobDescription, resumeText }),
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'An unknown server error occurred.' }));
                throw new Error(errorData.message);
            }
            const data = await response.json();
            setResultText(data.tailoredResume);
        } catch (err: any) {
            setError(err.message);
            console.error("Fetch error:", err);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-background via-[#FEF7F0] to-[#FCEAE0] font-sans flex flex-col">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <Header />
                <main className="flex-grow py-8">
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
                        <div className="text-center p-4 mt-6 bg-red-100 border border-red-400 text-red-700 rounded-lg animate-fade-in">
                            <p><strong>Error:</strong> {error}</p>
                        </div>
                    )}
                </main>
                <footer className="text-center py-6 text-sm text-brand-secondary/60">
                    <p>Showcase Project | Stack: React, Go, AWS Lambda.</p>
                </footer>
            </div>
        </div>
    )
}
export default App;