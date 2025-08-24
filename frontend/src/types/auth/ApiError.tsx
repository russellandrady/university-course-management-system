export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: Record<string, any>;
  response?: {
    data?: {
      message?: string;
      errors?: Record<string, string[]>;
    };
    status?: number;
  };
}