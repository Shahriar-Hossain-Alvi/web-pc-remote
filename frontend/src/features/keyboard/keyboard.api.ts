import { apiRequest } from '../../lib/api'

interface ApiResponse {
   status: string
}

export function typeText(text: string) {
   return apiRequest<ApiResponse>('/input/keyboard/type', {
      method: 'POST',
      body: JSON.stringify({ text }),
   })
}