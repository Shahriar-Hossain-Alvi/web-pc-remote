import { apiRequest } from '../../lib/api'

interface ApiResponse {
   status: string
   action: string
}

export function playPauseMedia() {
   return apiRequest<ApiResponse>('/input/media/play-pause', {
      method: 'POST',
   })
}

export function previousMedia() {
   return apiRequest<ApiResponse>('/input/media/previous', {
      method: 'POST',
   })
}

export function nextMedia() {
   return apiRequest<ApiResponse>('/input/media/next', {
      method: 'POST',
   })
}

export function volumeUp() {
   return apiRequest<ApiResponse>('/input/media/volume-up', {
      method: 'POST',
   })
}

export function volumeDown() {
   return apiRequest<ApiResponse>('/input/media/volume-down', {
      method: 'POST',
   })
}

export function toggleMute() {
   return apiRequest<ApiResponse>('/input/media/mute', {
      method: 'POST',
   })
}