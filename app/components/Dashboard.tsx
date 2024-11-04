import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import FileUploader from "./FileUploader";
import PythonData from "./PythonData";
import { ProcessedData } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { Loading } from "@/components/ui/loading";
import { ErrorDisplay } from "@/components/ui/error";
import { uploadFiles, validateFiles } from "@/lib/api";

interface LoadingStep {
    message: string;
    progress: number;
}

const LOADING_STEPS: LoadingStep[] = [
    { message: "Kontrola souborů...", progress: 10 },
    { message: "Validace dat...", progress: 25 },
    { message: "Nahrávání souborů...", progress: 40 },
    { message: "Zpracování dat...", progress: 60 },
    { message: "Analýza dat...", progress: 80 },
    { message: "Dokončování...", progress: 95 },
];

export default function Dashboard() {
    const [uploadMessage, setUploadMessage] = useState<string>('');
    const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [progress, setProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isLoading && currentStep < LOADING_STEPS.length) {
            timer = setTimeout(() => {
                const step = LOADING_STEPS[currentStep];
                setUploadMessage(step.message);
                setProgress(step.progress);
                setCurrentStep(prev => prev + 1);
            }, 1000); // Každý krok trvá 1 sekundu
        }
        return () => clearTimeout(timer);
    }, [isLoading, currentStep]);

    const handleUploadStatus = async (status: string, data?: any) => {
        try {
            setIsLoading(true);
            setError(null);
            setCurrentStep(0);

            console.log('Upload status:', status, 'Data:', data);

            switch (status) {
                case 'uploading':
                    if (data && Array.isArray(data)) {
                        await validateFiles(data);
                    }
                    break;

                case 'processing':
                    setUploadMessage('Zpracování dat...');
                    setProgress(60);
                    break;

                case 'finished':
                    if (data?.processed_data) {
                        console.log('Processed data received:', data.processed_data);
                        setProcessedData(data.processed_data);
                        setProgress(100);
                        setUploadMessage('Data byla úspěšně zpracována');
                        toast({
                            title: "Úspěch",
                            description: "Data byla úspěšně zpracována",
                        });
                    }
                    break;

                case 'error':
                    throw new Error(data?.error || 'Neznámá chyba');
            }
        } catch (err) {
            console.error('Error in handleUploadStatus:', err);
            const errorMessage = err instanceof Error ? err.message : 'Neznámá chyba';
            setError(new Error(errorMessage));
            setProgress(0);
            toast({
                title: "Chyba",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            if (!error) {
                setTimeout(() => {
                    setIsLoading(false);
                    setProgress(0);
                    setCurrentStep(0);
                }, 1000);
            } else {
                setIsLoading(false);
                setProgress(0);
                setCurrentStep(0);
            }
        }
    };

    const handleReset = () => {
        setProcessedData(null);
        setError(null);
        setUploadMessage('');
        setProgress(0);
        setCurrentStep(0);
    };

    if (error) {
        return (
            <ErrorDisplay
                title="Chyba při zpracování dat"
                description="Nepodařilo se zpracovat nahrané soubory"
                error={error}
                onRetry={handleReset}
            />
        );
    }

    if (isLoading) {
        return (
            <Card>
                <CardContent className="py-10">
                    <div className="space-y-6">
                        <Loading 
                            size={40}
                            text={uploadMessage}
                            showProgress={true}
                            progress={progress}
                        />
                        <div className="space-y-2">
                            <Progress value={progress} className="w-full" />
                            <p className="text-center text-xs text-muted-foreground">
                                Krok {currentStep + 1} z {LOADING_STEPS.length}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!processedData) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Nahrát data</CardTitle>
                    <CardDescription>
                        Nahrajte CSV soubory z inzulínové pumpy pro analýzu
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <FileUploader onUploadStatus={handleUploadStatus} />
                </CardContent>
            </Card>
        );
    }

    return <PythonData data={processedData} onReset={handleReset} />;
}