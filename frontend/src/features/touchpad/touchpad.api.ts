import { apiRequest } from '../../lib/api';

interface ApiResponse {
   status: string;
}

export interface ScreenSize {
   width: number;
   height: number;
}

export function getScreenSize() {
   return apiRequest<ScreenSize>('/input/screen');
}

export function moveMouse(x: number, y: number) {
   return apiRequest<ApiResponse>('/input/mouse/move', {
      method: 'POST',
      body: JSON.stringify({ x, y }),
   });
}

export function clickMouse(button: 'left' | 'right' | 'middle' = 'left') {
   return apiRequest<ApiResponse>('/input/mouse/click', {
      method: 'POST',
      body: JSON.stringify({ button }),
   });
}

export function doubleClickMouse() {
   return apiRequest<ApiResponse>('/input/mouse/double-click', {
      method: 'POST',
   });
}

export function scrollMouse(amount: number) {
   return apiRequest<ApiResponse>('/input/mouse/scroll', {
      method: 'POST',
      body: JSON.stringify({ amount }),
   });
}


export function moveMouseRelative(dx: number, dy: number) {
   return apiRequest<ApiResponse>('/input/mouse/move-relative', {
      method: 'POST',
      body: JSON.stringify({ dx, dy }),
   });
}

export function mouseDown() {
   return apiRequest<ApiResponse>('/input/mouse/down', {
      method: 'POST',
   });
}

export function mouseUp() {
   return apiRequest<ApiResponse>('/input/mouse/up', {
      method: 'POST',
   });
}

export function createMouseSocket() {
   const protocol =
      window.location.protocol === 'https:' ? 'wss:' : 'ws:'

   return new WebSocket(
      `${protocol}//${window.location.host}/ws/mouse`,
   )
}

export function connectMouseSocket() {
   const protocol =
      window.location.protocol === 'https:' ? 'wss:' : 'ws:'

   return new WebSocket(
      `${protocol}//${window.location.host}/ws/mouse`,
   )
}