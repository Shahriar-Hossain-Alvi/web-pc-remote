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

export function pressKey(key: string) {
   return apiRequest<ApiResponse>('/input/keyboard/press', {
      method: 'POST',
      body: JSON.stringify({ key }),
   })
}

export function pressHotkey(keys: string[]) {
   return apiRequest<ApiResponse>('/input/keyboard/hotkey', {
      method: 'POST',
      body: JSON.stringify({ keys }),
   })
}