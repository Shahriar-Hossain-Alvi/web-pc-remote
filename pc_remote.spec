
from pathlib import Path

project_root = Path(SPECPATH)
backend_dir = project_root / "backend"

a = Analysis(
    [str(backend_dir / "launcher.py")],
    pathex=[str(backend_dir)],
    binaries=[],
    datas=[
        (str(project_root / "frontend" / "dist"), "frontend/dist"),
    ],
    hiddenimports=[
        "app.main",
        "app.routers.input",
        "app.routers.mouse_ws",
        "app.routers.media",
        "app.routers.vlc",
        "app.services.input_service",
        "app.services.vlc_service",
        "app.services.vlc_controls",
    ],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
)

pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name="PCRemote",
    console=False,
    upx=True,
)

coll = COLLECT(
    exe,
    a.binaries,
    a.datas,
    strip=False,
    upx=True,
    name="PCRemote",
)