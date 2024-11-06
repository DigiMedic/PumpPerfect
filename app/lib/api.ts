import { ProcessedData, AnalyticsResult } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
    throw new Error('API_URL není nakonfigurována');
}

interface UploadResponse {
    message: string;
    processed_data: ProcessedData;
    session_id: string;
}

export const api = {
    async uploadFiles(files: File[]): Promise<UploadResponse> {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });

        console.log('Sending request to:', `${API_URL}/api/upload/files`);
        
        try {
            const response = await fetch(`${API_URL}/api/upload/files`, {
                method: 'POST',
                body: formData,
                mode: 'cors',
                headers: {
                    'Accept': 'application/json'
                }
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                console.error('Error response:', errorData);
                throw new Error(
                    errorData?.detail || 
                    `HTTP error! status: ${response.status}`
                );
            }

            const data = await response.json();
            console.log('Response data:', data);
            return data;
        } catch (error) {
            console.error('Request failed:', error);
            throw error;
        }
    }
};

export async function validateFiles(files: File[]): Promise<boolean> {
    const requiredTypes = ['basal_data', 'bolus_data', 'cgm_data'];
    const fileTypes = files.map(file => {
        for (const type of requiredTypes) {
            if (file.name.toLowerCase().includes(type)) {
                return type;
            }
        }
        return null;
    });

    const missingTypes = requiredTypes.filter(
        type => !fileTypes.includes(type)
    );

    if (missingTypes.length > 0) {
        throw new Error(`Chybí požadované soubory: ${missingTypes.join(', ')}`);
    }

    return true;
}

export async function analyzeDataAPI(data: ProcessedData): Promise<AnalyticsResult> {
    const response = await fetch(`${API_URL}/api/analysis`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Chyba při analýze dat');
    }

    return response.json();
} 