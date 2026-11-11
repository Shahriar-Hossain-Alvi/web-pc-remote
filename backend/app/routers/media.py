from fastapi import APIRouter, HTTPException
import httpx
from app.services.vlc_service import VLCService

router = APIRouter(prefix="/media", tags=["Media"])


@router.get("/status")
async def get_media_status():
    try:
        return await VLCService.get_status()

    except httpx.RequestError:
        raise HTTPException(
            status_code=503,
            detail="VLC is not running or its HTTP interface is unavailable.",
        )
    except httpx.HTTPStatusError as exc:
        print("VLC HTTP status:", exc.response.status_code)
        print("VLC response:", exc.response.text)

        raise HTTPException(
            status_code=502,
            detail=f"VLC returned HTTP {exc.response.status_code}",
        )

   #  except httpx.HTTPStatusError:
   #      raise HTTPException(
   #          status_code=502,
   #          detail="VLC returned an error.",
   #      )
