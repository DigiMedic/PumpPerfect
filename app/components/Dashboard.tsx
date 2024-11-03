import { useState } from "react";
import FileUploader from "./FileUploader";
import PythonData from "./PythonData";
import { ProcessedData } from "@/types";
import type { ServerResponse } from "./FileUploader";

export default function Dashboard() {
    const [uploadMessage, setUploadMessage] = useState<string>('');
    const [processedData, setProcessedData] = useState<ProcessedData | null>(null);

    const handleUploadStatus = (status: string, data?: ServerResponse) => {
        if (status === 'uploading') {
            setUploadMessage('Uploading files...');
        } else if (status === 'finished' && data?.processed_data) {
            setUploadMessage('Upload successful');
            setProcessedData(data.processed_data);
        } else if (status === 'error') {
            setUploadMessage(`Upload error: ${data?.error || 'Unknown error'}`);
            setProcessedData(null);
        }
    };

    return (
        <div className={'flex-1 h-full bg-white m-[2rem] p-8'}>
            {uploadMessage && (
                <div className="mb-4 p-4 rounded bg-gray-100">
                    {uploadMessage}
                </div>
            )}
            {processedData && <PythonData data={processedData} />}
            <FileUploader onUploadStatus={handleUploadStatus} />
        </div>
    );
}