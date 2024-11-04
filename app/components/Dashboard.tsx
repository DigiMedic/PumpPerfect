import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
            if (status === 'uploading') {
                setUploadMessage('Nahrávání souborů...');
                await validateFiles(data.files);
            } else if (status === 'finished' && data?.processed_data) {
                setUploadMessage('Data byla úspěšně nahrána');
                setProcessedData(data.processed_data);
                toast({
                    title: "Úspěch",
                    description: "Data byla úspěšně zpracována",
                });
            } else if (status === 'error') {
                const errorMessage = data?.error || 'Neznámá chyba';
                setUploadMessage(`Chyba: ${errorMessage}`);
                setError(new Error(errorMessage));
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
            toast({
                title: "Chyba",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setProcessedData(null);
        setError(null);
        setUploadMessage('');
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
                    <Loading />
                    <p className="text-center text-muted-foreground mt-4">
                        {uploadMessage}
                    </p>
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