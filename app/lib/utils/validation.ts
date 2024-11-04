export const validateFiles = (files: File[]) => {
  const requiredFiles = ['basal', 'bolus', 'cgm'];
  const fileNames = files.map(f => f.name.toLowerCase());
  
  const missingFiles = requiredFiles.filter(required => 
    !fileNames.some(name => name.includes(required))
  );

  if (missingFiles.length > 0) {
    throw new Error(`Chybí požadované soubory: ${missingFiles.join(', ')}`);
  }

  return true;
}; 