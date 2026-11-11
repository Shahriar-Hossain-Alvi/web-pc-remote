from ctypes import wintypes
import platform
import pyautogui
import ctypes

pyautogui.PAUSE = 0


class MOUSEINPUT(ctypes.Structure):
    _fields_ = [
        ("dx", wintypes.LONG),
        ("dy", wintypes.LONG),
        ("mouseData", wintypes.DWORD),
        ("dwFlags", wintypes.DWORD),
        ("time", wintypes.DWORD),
        ("dwExtraInfo", ctypes.c_size_t),
    ]


class KEYBDINPUT(ctypes.Structure):
    _fields_ = [
        ("wVk", wintypes.WORD),
        ("wScan", wintypes.WORD),
        ("dwFlags", wintypes.DWORD),
        ("time", wintypes.DWORD),
        ("dwExtraInfo", ctypes.c_size_t),
    ]


class HARDWAREINPUT(ctypes.Structure):
    _fields_ = [
        ("uMsg", wintypes.DWORD),
        ("wParamL", wintypes.WORD),
        ("wParamH", wintypes.WORD),
    ]


class INPUTUNION(ctypes.Union):
    _fields_ = [
        ("mi", MOUSEINPUT),
        ("ki", KEYBDINPUT),
        ("hi", HARDWAREINPUT),
    ]


class INPUT(ctypes.Structure):
    _fields_ = [
        ("type", wintypes.DWORD),
        ("union", INPUTUNION),
    ]


class InputService:
    @staticmethod
    def move_mouse_to_center():
        user32 = ctypes.windll.user32

        width = user32.GetSystemMetrics(0)
        height = user32.GetSystemMetrics(1)

        x = width // 2
        y = height // 2

        success = user32.SetCursorPos(x, y)

        if not success:
            raise OSError("Failed to move mouse to screen center.")

        return {"x": x, "y": y}

    @staticmethod
    def move_mouse(x: int, y: int):
        pyautogui.moveTo(x, y)

    @staticmethod
    def click(button: str = "left"):
        pyautogui.click(button=button)

    @staticmethod
    def double_click():
        pyautogui.doubleClick()

    @staticmethod
    def scroll(amount: int):
        pyautogui.scroll(amount)

    @staticmethod
    def press_key(key: str):
        pyautogui.press(key)

    @staticmethod
    def hotkey(*keys: str):
        pyautogui.hotkey(*keys)

    @staticmethod
    def move_mouse_relative(dx: int, dy: int):
        pyautogui.moveRel(dx, dy)

    @staticmethod
    def mouse_down(button: str = "left"):
        pyautogui.mouseDown(button=button)

    @staticmethod
    def mouse_up(button: str = "left"):
        pyautogui.mouseUp(button=button)

    @staticmethod
    def get_screen_size():
        size = pyautogui.size()

        return {
            "width": size.width,
            "height": size.height,
        }

    @staticmethod
    def type_text(text: str):
        print("INPUT structure size:", ctypes.sizeof(INPUT))
        if not text:
            return

        if platform.system() != "Windows":
            pyautogui.write(text, interval=0.02)
            return

        KEYEVENTF_UNICODE = 0x0004
        KEYEVENTF_KEYUP = 0x0002

        user32 = ctypes.WinDLL("user32", use_last_error=True)

        user32.SendInput.argtypes = (
            wintypes.UINT,
            ctypes.POINTER(INPUT),
            ctypes.c_int,
        )
        user32.SendInput.restype = wintypes.UINT

        # Convert text into UTF-16 code units.
        encoded = text.encode("utf-16-le")
        code_units = [
            int.from_bytes(encoded[i:i + 2], "little")
            for i in range(0, len(encoded), 2)
        ]

        inputs = (INPUT * (len(code_units) * 2))()

        for index, code in enumerate(code_units):
            # Key down
            inputs[index * 2].type = 1
            inputs[index * 2].union.ki = KEYBDINPUT(
                0,
                code,
                KEYEVENTF_UNICODE,
                0,
                0,
            )

            # Key up
            inputs[index * 2 + 1].type = 1
            inputs[index * 2 + 1].union.ki = KEYBDINPUT(
                0,
                code,
                KEYEVENTF_UNICODE | KEYEVENTF_KEYUP,
                0,
                0,
            )

        sent = user32.SendInput(
            len(inputs),
            inputs,
            ctypes.sizeof(INPUT),
        )

        if sent != len(inputs):
            raise ctypes.WinError(ctypes.get_last_error())

    @staticmethod
    def media_play_pause():
        pyautogui.press("playpause")

    @staticmethod
    def media_previous():
        pyautogui.press("prevtrack")

    @staticmethod
    def media_next():
        pyautogui.press("nexttrack")

    @staticmethod
    def media_volume_up():
        pyautogui.press("volumeup")

    @staticmethod
    def media_volume_down():
        pyautogui.press("volumedown")

    @staticmethod
    def media_mute():
        pyautogui.press("volumemute")
