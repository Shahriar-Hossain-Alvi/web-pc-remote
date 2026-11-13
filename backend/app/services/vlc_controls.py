
import httpx

from fastapi import HTTPException

from app.core.config import VLC_HOST, VLC_PASSWORD


class VLCControlService:

    _last_nonzero_volume = 256

    @staticmethod
    async def _request(params: dict | None = None):
        try:
            async with httpx.AsyncClient(
                auth=("", VLC_PASSWORD),
                timeout=3.0,
            ) as client:
                response = await client.get(
                    f"{VLC_HOST.rstrip('/')}/requests/status.json",
                    params=params or {},
                )

                response.raise_for_status()
                return response.json()

        except httpx.RequestError:
            raise HTTPException(
                status_code=503,
                detail="VLC is not running or its HTTP interface is unavailable.",
            )

        except httpx.HTTPStatusError as exc:
            raise HTTPException(
                status_code=502,
                detail=f"VLC returned HTTP {exc.response.status_code}.",
            )

    @staticmethod
    async def get_status():
        return await VLCControlService._request()

    @staticmethod
    async def _command(command: str, value: str | None = None):
        params = {"command": command}

        if value is not None:
            params["val"] = value

        await VLCControlService._request(params)

    @staticmethod
    async def play_pause():
        await VLCControlService._command("pl_pause")

    @staticmethod
    async def previous():
        await VLCControlService._command("pl_previous")

    @staticmethod
    async def next():
        await VLCControlService._command("pl_next")

    @staticmethod
    async def volume_up():
        await VLCControlService._command("volume", "+5")

    @staticmethod
    async def volume_down():
        await VLCControlService._command("volume", "-5")

    @staticmethod
    async def mute():
        status = await VLCControlService.get_status()
        current_volume = int(status.get("volume", 0))

        if current_volume > 0:
            VLCControlService._last_nonzero_volume = current_volume
            await VLCControlService._command("volume", "0")
        else:
            restore_volume = (
                VLCControlService._last_nonzero_volume or 256
            )
            await VLCControlService._command(
                "volume",
                str(restore_volume),
            )

    @staticmethod
    async def seek(seconds: int):
        await VLCControlService._command("seek", str(seconds))
