"use client"

import axios, { AxiosRequestConfig, Method } from "axios"
import { handleError } from "@/lib/utils/error-handler"

export const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  errors: Record<string, string | string[]>
}

// Client-side API function (for auth endpoints that don't require token)
export async function callClientAPI<T>(
  method: Method,
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
  isForm: boolean = false,
): Promise<ApiResponse<T>> {
  try {
    const api = axios.create({
      baseURL,
      headers: {
        "Content-Type": isForm ? "multipart/form-data" : "application/json",
        "Accept-Language": "ar",
      },
    })

    const response = await api.request<ApiResponse<T>>({
      method,
      url,
      data,
      ...config,
    })

    return {
      success: response?.data?.success ?? true,
      data: response?.data?.data,
      message: response?.data?.message || "ok",
      errors: response?.data?.errors || {},
    }
  } catch (error: unknown) {
    return handleError(error) as unknown as ApiResponse<T>
  }
}

