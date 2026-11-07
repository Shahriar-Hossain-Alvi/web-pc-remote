import pyautogui
import ctypes

pyautogui.PAUSE = 0


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
    def type_text(text: str):
        pyautogui.write(text, interval=0.02)

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
