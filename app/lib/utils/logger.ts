export const logger = {
  info: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(message, data);
    }
    // Zde můžete přidat produkční logování (např. Sentry)
  },
  error: (message: string, error?: any) => {
    console.error(message, error);
    // Zde můžete přidat produkční logování chyb
  }
}; 