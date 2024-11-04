import { ProcessedData } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function uploadFiles(files: File[]): Promise<{
  message: string;
  processed_data: ProcessedData;
}> {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('file', file);
  });

  const response = await fetch(`${API_URL}/post_data`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Chyba při nahrávání souborů');
  }

  const data = await response.json();

  if (!data.processed_data) {
    throw new Error('Server nevrátil zpracovaná data');
  }

  return data;
}

export async function validateFiles(files: File[]): Promise<boolean> {
  const requiredTypes = ['basal', 'bolus', 'cgm'];
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