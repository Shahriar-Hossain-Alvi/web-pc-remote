const API_BASE_URL = import.meta.env.DEV ? '/api' : '';

interface ApiRequestOptions extends RequestInit {
   body?: BodyInit | null;
}

export async function apiRequest<T>(
   endpoint: string,
   options: ApiRequestOptions = {},
): Promise<T> {
   const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
         'Content-Type': 'application/json',
         ...options.headers,
      },
   });

   if (!response.ok) {
      const errorMessage = await response.text();

      throw new Error(
         errorMessage || `API request failed: ${response.status}`,
      );
   }

   return response.json() as Promise<T>;
}

export interface HealthResponse {
   status: string;
}

export function checkBackendHealth() {
   return apiRequest<HealthResponse>('/health');
}