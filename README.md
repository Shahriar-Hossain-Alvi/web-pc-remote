# PC Remote

A self-hosted LAN remote control application that lets you control your Windows PC using your smartphone's browser.

PC Remote turns your phone into a wireless remote for your computer. It provides media controls, a touchpad-style mouse, and a keyboard — all through a web interface hosted directly on your PC.

No cloud server, external account, subscription, or internet connection is required. Both devices simply need to be connected to the same local network.

## Overview

PC Remote was built to solve a simple problem: controlling a computer from a phone without installing a dedicated Android application or relying on third-party remote-control services.

The application runs a lightweight FastAPI server on the PC and provides a React-based frontend that can be accessed from any device on the same LAN.

A Windows desktop launcher starts and stops the server, detects the PC's local network address, and generates a QR code for quick access.

## Features

### 1. Media Remote
- Play/Pause
- Volume Up
- Volume Down
- Works with general media playback controls, making it useful with different media players.
- Dedicated VLC controls are available separately.

### 2. Mouse Remote
- Touchpad-style cursor movement.
- Mouse click controls.
- Scroll controls.
- Drag mode for click-and-drag interactions.
- Adjustable touchpad sensitivity.

### 3. Keyboard Remote
- Text input from the phone.
- Special keys such as Esc, Tab, Ctrl, Alt, and Shift.
- Common keyboard shortcuts:
  - Alt + Tab
  - Win + D
  - Ctrl + C
  - Ctrl + V
  - Ctrl + Z
  - Ctrl + A

### 4. Windows Desktop Launcher
- Start and stop the PC Remote server.
- Display the server status.
- Automatically detect the PC's LAN IP address.
- Generate a QR code for quick connection.
- Gracefully shut down the server when the launcher closes.

### 5. Browser-Based Access
- Access the remote interface from a smartphone browser.
- No Android application installation required.
- Works over a local Wi-Fi/Ethernet network.
- Can be added to the phone's home screen when supported by the browser.

## Tech Stack

| Component | Technology |
|---|---|
| Frontend | React, TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Backend | Python, FastAPI |
| Desktop Launcher | Python, Tkinter |
| Mouse & Keyboard Automation | PyAutoGUI |
| Real-time Mouse Communication | WebSocket |
| QR Code Generation | qrcode, Pillow |
| Desktop Packaging | PyInstaller |

## Architecture

PC Remote uses a client-server architecture.

```text
             Smartphone
                  |
             Web Browser
                  |
             Local Network
                  |
                  v
           Windows PC
                  |
          PC Remote Launcher
                  |
             FastAPI Server
              /         \
             /           \
        REST API       WebSocket
             \           /
              \         /
               v       v
            PC Input Controls
            (Mouse / Keyboard)
                  |
                  v
             Windows OS
```

In production, FastAPI also serves the compiled React frontend, so the application can run from a single packaged Windows executable.

## Requirements

### For using the packaged application
- Windows 11 PC.
- Smartphone with a modern web browser.
- Both devices connected to the same local network.
- A private LAN connection, such as home Wi-Fi and Ethernet.

### For development
- Python 3.12+
- Node.js and npm
- Git

## Getting Started

### Using the packaged application

1. Download or obtain the PC Remote release.
2. Extract the application folder if it comes as an archive.
3. Run `PCRemote.exe`.
4. If Windows displays a security confirmation, verify the application and allow it to launch.
5. Click **Start Server**.
6. Wait until the status changes to **Running**.
7. Scan the displayed QR code using your smartphone.
8. Open the displayed address in your phone's browser.
9. Start controlling your PC.

To disconnect, click **Stop Server** or close the launcher.

> Keep the launcher running while using PC Remote. Stopping it shuts down the server and disconnects the remote interface.

## Development Setup

Clone the repository:

```bash
git clone <repository-url>
cd pc-remote
```

### 1. Backend Setup

Open a terminal in the project root.

Create a virtual environment:

```bash
cd backend
python -m venv .venv
```

Activate it:

**Windows CMD:**

```cmd
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the backend development server:

```bash
uvicorn app.main:app --reload
```

The backend will be available at:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

### 2. Frontend Setup

Open another terminal in the project root:

```bash
cd frontend
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will be available at the Vite development address, usually:

```text
http://localhost:5173
```

The Vite development server proxies API requests to the FastAPI backend.

To access the development frontend from a phone, use the PC's LAN address with port `5173`, while keeping both development servers running.

## Building for Production

The production application uses the compiled React frontend served directly by FastAPI.

### 1. Build the frontend

From the `frontend` directory:

```bash
npm run build
```

This generates the production files inside:

```text
frontend/dist/
```

### 2. Build the Windows application

Return to the project root and run:

```cmd
backend\.venv\Scripts\python.exe -m PyInstaller --clean pc_remote.spec
```

The packaged application will be generated inside:

```text
dist/PCRemote/
```

Run:

```text
dist/PCRemote/PCRemote.exe
```

The PyInstaller specification file (`pc_remote.spec`) contains the packaging configuration.

## Project Structure

```text
pc-remote/
│
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   │   ├── input.py
│   │   │   ├── mouse_ws.py
│   │   │   ├── media.py
│   │   │   └── vlc.py
│   │   │
│   │   ├── services/
│   │   │   ├── input_service.py
│   │   │   ├── vlc_service.py
│   │   │   └── vlc_controls.py
│   │   │
│   │   └── main.py
│   │
│   ├── launcher.py
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── index.html
│   └── package.json
│
├── pc_remote.spec
├── .gitignore
└── README.md
```

*The structure above shows the main project components; individual source files may change as development continues.*

## Network and Security

PC Remote is designed for use within a trusted private local network.

- The backend listens on `0.0.0.0` so other devices on the LAN can connect.
- The default server port is `8000`.
- No cloud service or external server is needed.
- No authentication or device-pairing mechanism is currently implemented.

**Security warning:** Anyone who can reach the PC Remote server over the network may be able to interact with the computer through its remote-control features.

For this reason:

- Use PC Remote only on a trusted private network.
- Do not expose port `8000` to the public internet.
- Do not configure router port forwarding for this application.
- Avoid using it on public or untrusted Wi-Fi networks.

Authentication and device pairing would be appropriate additions before making the application accessible to untrusted networks.

## Important Notes

- The Windows launcher is intended to be started manually; it does not need to run automatically at Windows startup.
- The packaged application is currently designed for Windows.
- VLC-specific functionality requires the appropriate VLC configuration.
- The PC must remain powered on and connected to the network while being controlled.
- Windows Firewall may ask for permission to allow the server to communicate over the private network.

## Current Scope

PC Remote currently focuses on three primary remote-control functions:

1. Media playback control.
2. Mouse and touchpad control.
3. Keyboard input and shortcuts.

The goal is to keep the application lightweight, straightforward, and easy to use without unnecessary features or subscriptions.

## License

No license has been specified yet. All rights reserved unless a license is added to this repository.