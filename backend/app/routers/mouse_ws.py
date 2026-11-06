from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.services.input_service import InputService

router = APIRouter(tags=["Mouse WebSocket"])


@router.websocket("/ws/mouse")
async def mouse_websocket(websocket: WebSocket):
    await websocket.accept()

    try:
        while True:
            data = await websocket.receive_json()

            dx = data.get("dx")
            dy = data.get("dy")

            if (
                not isinstance(dx, int)
                or isinstance(dx, bool)
                or not isinstance(dy, int)
                or isinstance(dy, bool)
            ):
                continue

            if abs(dx) > 2000 or abs(dy) > 2000:
                continue

            InputService.move_mouse_relative(dx, dy)

    except WebSocketDisconnect:
        print("Mouse WebSocket disconnected")
