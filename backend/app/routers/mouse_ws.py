import pyautogui

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.services.input_service import InputService

router = APIRouter(tags=["Mouse WebSocket"])


@router.websocket("/ws/mouse")
async def mouse_websocket(websocket: WebSocket):
    await websocket.accept()

    failsafe_logged = False

    try:
        while True:
            data = await websocket.receive_json()

            if not isinstance(data, dict):
                continue

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

            try:
                InputService.move_mouse_relative(dx, dy)
                failsafe_logged = False

            except pyautogui.FailSafeException:
                if not failsafe_logged:
                    print(
                        "Mouse fail-safe triggered. "
                        "Move the physical mouse away from the screen corner."
                    )
                    failsafe_logged = True

                continue

    except WebSocketDisconnect:
        print("Mouse WebSocket disconnected")
