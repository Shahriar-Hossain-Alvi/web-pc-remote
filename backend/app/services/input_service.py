import pyautogui


class InputService:

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
    def get_screen_size():
        size = pyautogui.size()

        return {
            "width": size.width,
            "height": size.height,
        }
