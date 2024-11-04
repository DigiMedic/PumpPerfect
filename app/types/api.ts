import { ProcessedData } from './index';

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  processed_data?: ProcessedData;
  message?: string;
} 