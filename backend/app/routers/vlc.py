
from pydantic import BaseModel, Field
from fastapi import APIRouter

from app.services.vlc_controls import VLCControlService


router = APIRouter(
    prefix="/vlc",
    tags=["VLC Controls"],
)


class VLCSeekRequest(BaseModel):
    seconds: int = Field(ge=0)


@router.get("/status")
async def get_vlc_status():
    return await VLCControlService.get_status()


@router.post("/play-pause")
async def vlc_play_pause():
    await VLCControlService.play_pause()
    return {"status": "success", "action": "play_pause"}


@router.post("/previous")
async def vlc_previous():
    await VLCControlService.previous()
    return {"status": "success", "action": "previous"}


@router.post("/next")
async def vlc_next():
    await VLCControlService.next()
    return {"status": "success", "action": "next"}


@router.post("/volume-up")
async def vlc_volume_up():
    await VLCControlService.volume_up()
    return {"status": "success", "action": "volume_up"}


@router.post("/volume-down")
async def vlc_volume_down():
    await VLCControlService.volume_down()
    return {"status": "success", "action": "volume_down"}


@router.post("/mute")
async def vlc_mute():
    await VLCControlService.mute()
    return {"status": "success", "action": "mute"}


@router.post("/seek")
async def vlc_seek(request: VLCSeekRequest):
    await VLCControlService.seek(request.seconds)

    return {
        "status": "success",
        "action": "seek",
        "seconds": request.seconds,
    }
