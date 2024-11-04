export class AnalysisError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'AnalysisError';
  }
}

export const handleAnalysisError = (error: unknown) => {
  if (error instanceof AnalysisError) {
    return {
      message: error.message,
      code: error.code
    };
  }
  
  return {
    message: 'Neočekávaná chyba při analýze',
    code: 'UNKNOWN_ERROR'
  };
}; 