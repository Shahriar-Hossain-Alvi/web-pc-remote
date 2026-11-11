
import { apiRequest } from '../../lib/api'

export interface VLCStatus {
  state: 'playing' | 'paused' | 'stopped' | string
  time: number
  length: number
  volume: number
  position: number
  fullscreen: number
  currentplid: number
  information?: {
    category?: {
      meta?: {
        title?: string
        artist?: string
        album?: string
        filename?: string
      }
    }
  }
}

interface VLCActionResponse {
  status: string
  action: string
}

export function getVLCStatus() {
  return apiRequest<VLCStatus>('/vlc/status')
}

export function vlcPlayPause() {
  return apiRequest<VLCActionResponse>('/vlc/play-pause', {
    method: 'POST',
  })
}

export function vlcPrevious() {
  return apiRequest<VLCActionResponse>('/vlc/previous', {
    method: 'POST',
  })
}

export function vlcNext() {
  return apiRequest<VLCActionResponse>('/vlc/next', {
    method: 'POST',
  })
}

export function vlcVolumeUp() {
  return apiRequest<VLCActionResponse>('/vlc/volume-up', {
    method: 'POST',
  })
}

export function vlcVolumeDown() {
  return apiRequest<VLCActionResponse>('/vlc/volume-down', {
    method: 'POST',
  })
}

export function vlcMute() {
  return apiRequest<VLCActionResponse>('/vlc/mute', {
    method: 'POST',
  })
}
