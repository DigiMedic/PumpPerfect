import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { FileIcon } from "lucide-react";

interface FileUploaderProps {
    onUploadStatus: (status: string, data?: any) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onUploadStatus }) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        console.log('Přijaté soubory:', acceptedFiles.map(f => f.name));
        setSelectedFiles(acceptedFiles);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/csv': ['.csv']
        },
        multiple: true
    });

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            toast({
                title: "Chyba",
                description: "Nejsou vybrány žádné soubory",
                variant: "destructive"
            });
            return;
        }

        setIsUploading(true);
        onUploadStatus('uploading');

        try {
            const formData = new FormData();
            selectedFiles.forEach((file) => {
                formData.append('file', file);
            });

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post_data`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Server response:', data);

            if (data.error) {
                throw new Error(data.error);
            }

            if (!data.processed_data || 
                !data.processed_data.basal || 
                !data.processed_data.bolus || 
                !data.processed_data.cgm) {
                throw new Error('Neplatná struktura dat ze serveru');
            }

            toast({
                title: "Úspěch",
                description: "Soubory byly úspěšně nahrány a zpracovány",
            });

            onUploadStatus('finished', data);
            setSelectedFiles([]);
        } catch (error) {
            console.error('Upload error:', error);
            toast({
                title: "Chyba při nahrávání",
                description: error instanceof Error ? error.message : 'Neznámá chyba',
                variant: "destructive"
            });
            onUploadStatus('error', { 
                message: 'Upload failed',
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div
                {...getRootProps()}
                className={`
                    border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                    transition-colors duration-200
                    ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300'}
                    ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary hover:bg-primary/5'}
                `}
            >
                <input {...getInputProps()} disabled={isUploading} />
                <div className="flex flex-col items-center justify-center gap-4">
                    <FileIcon className="h-12 w-12 text-muted-foreground" />
                    {isDragActive ? (
                        <p className="text-primary font-medium">Přetáhněte soubory sem...</p>
                    ) : (
                        <div className="space-y-2">
                            <p className="text-muted-foreground">
                                Přetáhněte CSV soubory sem nebo klikněte pro výběr
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Požadované soubory: basal, bolus, cgm
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {selectedFiles.length > 0 && (
                <Card>
                    <CardContent className="pt-6">
                        <h3 className="font-medium mb-4">Vybrané soubory:</h3>
                        <ul className="space-y-2 mb-6">
                            {selectedFiles.map((file, index) => (
                                <li key={index} className="flex items-center gap-2">
                                    <FileIcon className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{file.name}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="flex justify-end gap-4">
                            <Button
                                variant="outline"
                                onClick={() => setSelectedFiles([])}
                                disabled={isUploading}
                            >
                                Zrušit
                            </Button>
                            <Button
                                onClick={handleUpload}
                                disabled={isUploading}
                            >
                                {isUploading ? 'Nahrávání...' : 'Nahrát soubory'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default FileUploader;
