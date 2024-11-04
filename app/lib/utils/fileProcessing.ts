export const processLargeFile = async (file: File, chunkSize = 1024 * 1024) => {
  const chunks = Math.ceil(file.size / chunkSize);
  const results = [];

  for (let i = 0; i < chunks; i++) {
    const chunk = file.slice(i * chunkSize, (i + 1) * chunkSize);
    const result = await processChunk(chunk);
    results.push(result);
  }

  return results;
};

const processChunk = async (chunk: Blob): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.readAsText(chunk);
  });
}; 