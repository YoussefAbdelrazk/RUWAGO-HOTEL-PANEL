import { getAccessToken, getRefreshToken, removeTokens, setTokens } from '@/lib/utils/cookies';
import { handleError } from '@/lib/utils/error-handler';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, Method } from 'axios';

// import baseUrl
export const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: Record<string, string | string[]>;
}

// ---- Refresh config ----
const DEFAULT_LANG = 'en';
const refreshPath = (lang: string) => `/api/${lang}/auth/refresh-token`;

// Single-flight refresh (prevents 10 parallel 401s => 10 refresh calls)
let refreshPromise: Promise<{ accessToken: string; refreshToken: string } | null> | null = null;

type RetryableConfig = AxiosRequestConfig & {
  _retry?: boolean;
  _skipAuthRefresh?: boolean;
};

async function doRefreshTokens(
  lang: string,
): Promise<{ accessToken: string; refreshToken: string } | null> {
  const rt = await getRefreshToken();
  if (!rt) return null;

  // Use a plain axios call (no interceptors) to avoid infinite loops
  const res = await axios.post(
    `${baseURL}${refreshPath(lang)}`,
    { refreshToken: rt },
    {
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': lang,
      },
    },
  );

  const newAccessToken = res?.data?.data?.accessToken;
  const newRefreshToken = res?.data?.data?.refreshToken;

  if (!newAccessToken || !newRefreshToken) return null;

  await setTokens(newAccessToken, newRefreshToken);
  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

function attachInterceptors(api: AxiosInstance, lang: string) {
  // Always attach latest access token to each request
  api.interceptors.request.use(async config => {
    const token = await getAccessToken();
    config.headers = config.headers ?? {};
    config.headers['Accept-Language'] = config.headers['Accept-Language'] ?? lang;

    if (token && !config.headers['Authorization']) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    res => res,
    async (error: AxiosError) => {
      const originalConfig = (error.config ?? {}) as RetryableConfig;
      const status = error.response?.status;

      // Only handle 401 once per request, and never for refresh endpoint itself
      if (
        status !== 401 ||
        originalConfig._retry ||
        originalConfig._skipAuthRefresh ||
        (typeof originalConfig.url === 'string' &&
          originalConfig.url.includes('/auth/refresh-token'))
      ) {
        throw error;
      }

      originalConfig._retry = true;

      try {
        // single-flight
        if (!refreshPromise) {
          refreshPromise = doRefreshTokens(lang);
        }
        const tokens = await refreshPromise;
        refreshPromise = null;

        if (!tokens) {
          await removeTokens();
          throw error;
        }

        // retry original request with new token
        originalConfig.headers = originalConfig.headers ?? {};
        originalConfig.headers['Authorization'] = `Bearer ${tokens.accessToken}`;

        return api.request(originalConfig);
      } catch (e) {
        refreshPromise = null;
        await removeTokens();
        throw e;
      }
    },
  );
}

// server-side axios instance factory (async)
export const baseAPI = async () => {
  const lang = DEFAULT_LANG;

  const api = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      'Accept-Language': lang,
      Accept: 'application/json',
    },
  });

  attachInterceptors(api, lang);
  return api;
};

// for form data
export const baseAPIForm = async () => {
  const lang = DEFAULT_LANG;

  const api = axios.create({
    baseURL,
    headers: {
      // NOTE: usually better to NOT set multipart boundary manually,
      // axios will set it when FormData is used.
      'Content-Type': 'multipart/form-data',
      'Accept-Language': lang,
      Accept: 'application/json',
    },
  });

  attachInterceptors(api, lang);
  return api;
};

export async function callAPI<T>(
  method: Method,
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
  isForm: boolean = false,
): Promise<ApiResponse<T>> {
  try {
    const api = isForm ? await baseAPIForm() : await baseAPI();

    const response = await api.request<ApiResponse<T>>({
      method,
      url,
      data,
      ...config,
    });

    return {
      success: response?.data?.success ?? true,
      data: response?.data?.data,
      message: response?.data?.message || 'ok',
      errors: response?.data?.errors || {},
    };
  } catch (error: unknown) {
    return handleError(error) as unknown as ApiResponse<T>;
  }
}
