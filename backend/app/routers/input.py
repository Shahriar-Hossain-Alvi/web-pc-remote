from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.services.input_service import InputService

router = APIRouter(prefix="/input", tags=["Input"])


# Request models

class MouseMoveRequest(BaseModel):
    x: int = Field(ge=0)
    y: int = Field(ge=0)


class MouseClickRequest(BaseModel):
    button: str = Field(default="left", pattern="^(left|right|middle)$")


class ScrollRequest(BaseModel):
    amount: int = Field(ge=-100, le=100)


class TypeTextRequest(BaseModel):
    text: str = Field(max_length=5000)


class PressKeyRequest(BaseModel):
    key: str = Field(min_length=1, max_length=30)


class HotkeyRequest(BaseModel):
    keys: list[str] = Field(min_length=1, max_length=5)


# Routes

@router.get("/screen")
async def get_screen_size():
    return InputService.get_screen_size()


@router.post("/mouse/move")
async def move_mouse(request: MouseMoveRequest):
    try:
        InputService.move_mouse(request.x, request.y)
        return {"status": "success"}
    except Exception as error:
        raise HTTPException(status_code=400, detail=str(error))


@router.post("/mouse/click")
async def mouse_click(request: MouseClickRequest):
    try:
        InputService.click(request.button)
        return {"status": "success"}
    except Exception as error:
        raise HTTPException(status_code=400, detail=str(error))


@router.post("/mouse/double-click")
async def mouse_double_click():
    try:
        InputService.double_click()
        return {"status": "success"}
    except Exception as error:
        raise HTTPException(status_code=400, detail=str(error))


@router.post("/mouse/scroll")
async def mouse_scroll(request: ScrollRequest):
    try:
        InputService.scroll(request.amount)
        return {"status": "success"}
    except Exception as error:
        raise HTTPException(status_code=400, detail=str(error))


@router.post("/keyboard/type")
async def type_text(request: TypeTextRequest):
    try:
        InputService.type_text(request.text)
        return {"status": "success"}
    except Exception as error:
        raise HTTPException(status_code=400, detail=str(error))


@router.post("/keyboard/press")
async def press_key(request: PressKeyRequest):
    try:
        InputService.press_key(request.key)
        return {"status": "success"}
    except Exception as error:
        raise HTTPException(status_code=400, detail=str(error))


@router.post("/keyboard/hotkey")
async def press_hotkey(request: HotkeyRequest):
    try:
        InputService.hotkey(*request.keys)
        return {"status": "success"}
    except Exception as error:
        raise HTTPException(status_code=400, detail=str(error))
