import { API_URL } from "../config"

export class ApiClient {
  private baseUrl: string

  constructor(url: string) {
    this.baseUrl = url
  }

  private async handleResponse<TResult>(response: Response): Promise<TResult> {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    try {
      return await response.json()
    } catch {
      return {} as TResult
    }
  }

  public async get<TResult = unknown>(
    endpoint: string,
    queryParams?: Record<string, string | number>,
  ): Promise<TResult> {
    const url = new URL(endpoint, this.baseUrl)

    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        url.searchParams.append(key, String(value))
      })
    }

    const response = await fetch(url.toString())
    return this.handleResponse<TResult>(response)
  }

  public async post<TResult = unknown, TData = Record<string, unknown>>(
    endpoint: string,
    body: TData,
  ): Promise<TResult> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    return this.handleResponse<TResult>(response)
  }

  public async put<TResult = unknown, TData = Record<string, unknown>>(
    endpoint: string,
    body: TData,
  ): Promise<TResult> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    return this.handleResponse<TResult>(response)
  }

  public async patch<TResult = unknown, TData = Record<string, unknown>>(
    endpoint: string,
    body: TData,
  ): Promise<TResult> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    return this.handleResponse<TResult>(response)
  }

  public async delete<TResult = unknown>(endpoint: string): Promise<TResult> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "DELETE",
    })
    return this.handleResponse<TResult>(response)
  }
}

export const apiClient = new ApiClient(API_URL)
