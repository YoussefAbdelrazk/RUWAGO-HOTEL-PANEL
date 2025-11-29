import { IActionState } from '@/lib/types/error-handler';
import { AxiosError } from 'axios';

export function handleError(error: unknown): IActionState {
  const err = error as AxiosError<{
    message?: string;
    errors?: Record<string, string | string[]>;
  }>;

  // Normalize errors -> لو string حولة لمصفوفة
  const normalizedErrors: Record<string, string[]> = {};
  if (err.response?.data?.errors) {
    for (const key in err.response.data.errors) {
      const value = err.response.data.errors[key];
      normalizedErrors[key] = Array.isArray(value) ? value : [value];
    }
  }
  return {
    success: false,
    message: err.response?.data?.message || err.message || 'Something went wrong',
    errors: normalizedErrors,
  };
}
