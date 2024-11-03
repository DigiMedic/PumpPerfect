import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from "next/image";
import { file_icon, zip_file } from "@/app/assets";
import { Button } from "@/components/ui/button";

export interface ServerResponse {
    message: string;
    processed_data?: {
        basal: Record<string, unknown>[];
        bolus: Record<string, unknown>[];
        insulin: Record<string, unknown>[];
        alarms: Record<string, unknown>[];
        bg: Record<string, unknown>[];
        cgm: Record<string, unknown>[];
    };
    error?: string;
}

interface FileUploaderProps {
    onUploadStatus: (status: string, data?: ServerResponse) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onUploadStatus }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const onDrop = async (acceptedFiles: File[]) => {
        setSelectedFiles(acceptedFiles);
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) return;

        setIsUploading(true);
        onUploadStatus('uploading');

        try {
            const formData = new FormData();
            selectedFiles.forEach((file) => {
                console.log('Uploading file:', file.name);
                formData.append('file', file);
            });

            console.log('Sending request to:', `${process.env.NEXT_PUBLIC_API_URL}/post_data`);
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post_data`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server response:', response.status, errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Received data:', data);
            
            if (data.processed_data) {
                console.log('Records count:', {
                    basal: data.processed_data.basal?.length || 0,
                    bolus: data.processed_data.bolus?.length || 0,
                    cgm: data.processed_data.cgm?.length || 0,
                });
            }

            onUploadStatus('finished', data);
            setSelectedFiles([]);
        } catch (error) {
            console.error('Upload error:', error);
            onUploadStatus('error', { 
                message: 'Upload failed',
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            });
        } finally {
            setIsUploading(false);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
        onDrop,
        accept: {
            'text/csv': ['.csv']
        }
    });

    return (
        <div className="w-full space-y-4">
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                    ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300'}
                    ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                <input {...getInputProps()} disabled={isUploading} />
                <div className="flex flex-col items-center justify-center gap-4">
                    <Image
                        src={file_icon}
                        alt="file icon"
                        width={50}
                        height={50}
                    />
                    {isDragActive ? (
                        <p className="text-primary font-medium">Přetáhněte soubory sem...</p>
                    ) : (
                        <p className="text-muted-foreground">
                            Přetáhněte CSV soubory sem nebo klikněte pro výběr
                        </p>
                    )}
                </div>
            </div>

            {selectedFiles.length > 0 && (
                <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                        <h3 className="font-medium mb-2">Vybrané soubory:</h3>
                        <ul className="space-y-2">
                            {selectedFiles.map((file, index) => (
                                <li key={index} className="flex items-center gap-2">
                                    <Image
                                        src={file_icon}
                                        alt="file"
                                        width={20}
                                        height={20}
                                    />
                                    <span>{file.name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

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
                </div>
            )}

            {isUploading && (
                <div className="text-center text-muted-foreground">
                    <p>Nahrávání souborů...</p>
                </div>
            )}
        </div>
    );
};

export default FileUploader;
