export const validateDataFiles = (files: File[]) => {
  const requiredFiles = ['basal', 'bolus', 'cgm'];
  const fileTypes = files.map(f => {
    const name = f.name.toLowerCase();
    if (name.includes('basal')) return 'basal';
    if (name.includes('bolus')) return 'bolus';
    if (name.includes('cgm')) return 'cgm';
    return null;
  }).filter(Boolean);

  const missingFiles = requiredFiles.filter(
    req => !fileTypes.includes(req)
  );

  if (missingFiles.length > 0) {
    throw new Error(`Chybí požadované soubory: ${missingFiles.join(', ')}`);
  }

  return true;
}; 