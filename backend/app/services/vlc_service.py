import httpx

from app.core.config import VLC_HOST, VLC_PASSWORD

print("VLC password configured:", bool(VLC_PASSWORD))
print("VLC password length:", len(VLC_PASSWORD))


class VLCService:

    @staticmethod
    async def get_status():
        async with httpx.AsyncClient(
            auth=("", VLC_PASSWORD),
            timeout=3.0,
        ) as client:
            response = await client.get(
                f"{VLC_HOST}/requests/status.json"
            )

            response.raise_for_status()
            return response.json()
