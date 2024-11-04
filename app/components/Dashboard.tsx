import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import FileUploader from "./FileUploader";
import PythonData from "./PythonData";
import { ProcessedData } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { Loading } from "@/components/ui/loading";
import { ErrorDisplay } from "@/components/ui/error";
import { EmptyState } from "@/components/ui/empty-state";
import { uploadFiles, validateFiles } from "@/lib/api";

export default function Dashboard() {
    const [uploadMessage, setUploadMessage] = useState<string>('');
    const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (processedData) {
            console.log('Data received:', {
                hasBasal: processedData.basal?.length > 0,
                hasBolus: processedData.bolus?.length > 0,
                hasCGM: processedData.cgm?.length > 0,
                sampleData: {
                    basal: processedData.basal?.[0],
                    bolus: processedData.bolus?.[0],
                    cgm: processedData.cgm?.[0]
                }
            });
        }
    }, [processedData]);

    const handleUploadStatus = async (status: string, data?: any) => {
        setIsLoading(true);
        setError(null);

        try {
            console.log('Upload status:', status, 'Data:', data);

            if (status === 'uploading') {
                setUploadMessage('Nahrávání souborů...');
                setProgress(25);
                if (data && Array.isArray(data)) {
                    await validateFiles(data);
                }
                setProgress(50);
            } else if (status === 'processing') {
                setUploadMessage('Zpracování dat...');
                setProgress(75);
            } else if (status === 'finished' && data?.processed_data) {
                console.log('Processed data received:', data.processed_data);
                setUploadMessage('Data byla úspěšně nahrána');
                setProcessedData(data.processed_data);
                setProgress(100);
                toast({
                    title: "Úspěch",
                    description: "Data byla úspěšně zpracována",
                });
            } else if (status === 'error') {
                const errorMessage = data?.error || 'Neznámá chyba';
                console.error('Upload error:', errorMessage);
                setUploadMessage(`Chyba: ${errorMessage}`);
                setError(new Error(errorMessage));
                setProgress(0);
                toast({
                    title: "Chyba",
                    description: errorMessage,
                    variant: "destructive",
                });
            }
        } catch (err) {
            console.error('Error processing upload:', err);
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
                }, 500);
            } else {
                setIsLoading(false);
                setProgress(0);
            }
        }
    };

    const handleReset = () => {
        setProcessedData(null);
        setError(null);
        setUploadMessage('');
        setProgress(0);
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
                        <Loading />
                        <Progress value={progress} className="w-full" />
                        <p className="text-center text-muted-foreground">
                            {uploadMessage}
                        </p>
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