import tkinter as tk
from tkinter import ttk
import threading
import uvicorn
import socket
import qrcode
from PIL import ImageTk
from typing import cast
from qrcode.image.pil import PilImage


class PCRemoteLauncher:
    def __init__(self, root):
        self.root = root
        self.root.title("PC Remote")
        self.root.geometry("420x600")
        self.root.resizable(False, False)

        self.root.configure(bg="#f8fafc")
        self.server = None
        self.server_thread = None
        self.qr_image = None
        self.create_ui()

    def start_server(self):
        if self.server_thread and self.server_thread.is_alive():
            return

        self.status_label.config(
            text="● Starting...",
            foreground="#d97706",
        )

        self.start_button.config(state="disabled")
        self.stop_button.config(state="disabled")

        config = uvicorn.Config(
            "app.main:app",
            host="0.0.0.0",
            port=8000,
            log_level="warning",
        )

        self.server = uvicorn.Server(config)

        self.server_thread = threading.Thread(
            target=self.server.run,
            daemon=True,
        )
        self.server_thread.start()

        self.root.after(300, self.check_server_status)

    def check_server_status(self):
        if self.server and self.server.started:

            self.status_label.config(
                text="● Running",
                foreground="#16a34a",
            )
            self.start_button.config(state="disabled")
            self.stop_button.config(state="normal")

            self.show_connection_info()
            return

        if self.server_thread and self.server_thread.is_alive():
            self.root.after(300, self.check_server_status)
            return

        self.status_label.config(
            text="● Stopped",
            foreground="#dc2626",
        )
        self.start_button.config(state="normal")
        self.stop_button.config(state="disabled")

    def stop_server(self):
        if self.server:
            self.stop_button.config(state="disabled")
            self.status_label.config(
                text="● Stopping...",
                foreground="#d97706",
            )
            self.server.should_exit = True
            self.root.after(300, self.check_stop_status)

    def check_stop_status(self):
        if self.server_thread and self.server_thread.is_alive():
            self.root.after(300, self.check_stop_status)
            return

        self.server = None
        self.server_thread = None

        self.status_label.config(
            text="● Stopped",
            foreground="#dc2626",
        )
        self.start_button.config(state="normal")
        self.stop_button.config(state="disabled")

        self.clear_connection_info()

    def get_local_ip(self):
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            sock.connect(("8.8.8.8", 80))
            local_ip = sock.getsockname()[0]
            sock.close()
            return local_ip
        except OSError:
            return None

    def show_connection_info(self):
        local_ip = self.get_local_ip()

        if not local_ip:
            self.url_label.config(text="Could not detect LAN IP address")
            self.qr_placeholder.config(
                image="",
                text="QR code unavailable",
            )
            self.qr_image = None
            return

        url = f"http://{local_ip}:8000"

        self.url_label.config(text=url)
        qr = qrcode.QRCode(
            box_size=6,
            border=4,
        )

        qr.add_data(url)
        qr.make(fit=True)
        qr = cast(PilImage, qr.make_image(
            fill_color="black",
            back_color="white",
        ))
        qr_image = qr.get_image().resize((180, 180))
        self.qr_image = ImageTk.PhotoImage(qr_image)

        self.qr_placeholder.config(
            image=self.qr_image,
            text="",
        )

    def clear_connection_info(self):
        self.url_label.config(text="Server is not running")

        self.qr_placeholder.config(
            image="",
            text="QR code will appear here",
        )

        self.qr_image = None

    def create_ui(self):
        main = ttk.Frame(self.root, padding=24)
        main.pack(fill="both", expand=True)

        # Header
        ttk.Label(
            main,
            text="PC Remote",
            font=("Segoe UI", 22, "bold"),
        ).pack(pady=(5, 4))

        ttk.Label(
            main,
            text="Control your PC from your phone",
            font=("Segoe UI", 10),
        ).pack(pady=(0, 20))

        # Server status
        status_frame = ttk.LabelFrame(
            main,
            text="Server Status",
            padding=15,
        )
        status_frame.pack(fill="x", pady=5)

        self.status_label = ttk.Label(
            status_frame,
            text="● Stopped",
            foreground="#dc2626",
            font=("Segoe UI", 11, "bold"),
        )
        self.status_label.pack(anchor="w")

        # Server controls
        button_frame = ttk.Frame(main)
        button_frame.pack(fill="x", pady=15)

        self.start_button = ttk.Button(
            button_frame,
            text="Start Server",
            state="normal",
            command=self.start_server,
        )
        self.start_button.pack(side="left", expand=True, fill="x", padx=(0, 5))

        self.stop_button = ttk.Button(
            button_frame,
            text="Stop Server",
            state="disabled",
            command=self.stop_server,
        )
        self.stop_button.pack(side="left", expand=True, fill="x", padx=(5, 0))

        # Connection URL
        connection_frame = ttk.LabelFrame(
            main,
            text="Phone Connection",
            padding=15,
        )
        connection_frame.pack(fill="x", pady=5)

        self.url_label = ttk.Label(
            connection_frame,
            text="Server is not running",
            font=("Segoe UI", 10),
            wraplength=330,
        )
        self.url_label.pack(pady=5)

        # QR code placeholder
        self.qr_placeholder = ttk.Label(
            connection_frame,
            text="QR code will appear here",
            font=("Segoe UI", 9),
        )
        self.qr_placeholder.pack(pady=15)

        # Footer
        ttk.Label(
            main,
            text="Make sure your phone and PC are on the same network.",
            font=("Segoe UI", 8),
            foreground="#64748b",
            wraplength=350,
        ).pack(pady=(15, 0))


if __name__ == "__main__":
    root = tk.Tk()
    app = PCRemoteLauncher(root)
    root.mainloop()
