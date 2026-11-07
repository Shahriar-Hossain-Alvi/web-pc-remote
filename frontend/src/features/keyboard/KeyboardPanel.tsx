
import { useState } from 'react'
import {
  Keyboard,
  Delete,
  CornerDownLeft,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Command,
  Eraser,
} from 'lucide-react'
import { pressHotkey, pressKey, typeText } from './keyboard.api'

function KeyboardPanel() {
  const [text, setText] = useState('')
  const [lastAction, setLastAction] = useState('Ready')
  const [error, setError] = useState('')
  const [isSending, setIsSending] = useState(false)

  const specialKeys = [
    'Esc',
    'Tab',
    'Ctrl',
    'Alt',
    'Shift',
  ]

  const shortcuts = [
    { label: 'Alt + Tab', keys: ['Alt', 'Tab'] },
    { label: 'Win + D', keys: ['Win', 'D'] },
    { label: 'Ctrl + C', keys: ['Ctrl', 'C'] },
    { label: 'Ctrl + V', keys: ['Ctrl', 'V'] },
    { label: 'Ctrl + Z', keys: ['Ctrl', 'Z'] },
    { label: 'Ctrl + A', keys: ['Ctrl', 'A'] },
  ]

  const handleKey = async (key: string) => {
    const keyMap: Record<string, string> = {
      Esc: 'esc',
      Tab: 'tab',
      Ctrl: 'ctrl',
      Alt: 'alt',
      Shift: 'shift',

      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right',

      Enter: 'enter',
      Backspace: 'backspace',
      Delete: 'delete',
    }

    const pyAutoGuiKey = keyMap[key] ?? key.toLowerCase()

    try {
      setError('')

      await pressKey(pyAutoGuiKey)

      setLastAction(`${key} pressed`)
    } catch (err) {
      console.error(err)
      setError(`Failed to press ${key}. Check your PC connection.`)
    }
  }

  const handleShortcut = async (
    label: string,
    keys: string[],
  ) => {
    const keyMap: Record<string, string> = {
      Win: 'win',
      Ctrl: 'ctrl',
      Alt: 'alt',
      Shift: 'shift',
    }

    const mappedKeys = keys.map(
      (key) => keyMap[key] ?? key.toLowerCase(),
    )

    try {
      setError('')

      await pressHotkey(mappedKeys)

      setLastAction(`${label} executed`)
    } catch (err) {
      console.error(err)
      setError(`Failed to execute ${label}.`)
    }
  }

  const handleSendText = async () => {
    if (!text.trim()) return

    try {
      setIsSending(true)
      setError('')

      await typeText(text)

      setLastAction('Text sent successfully')
      setText('')
    } catch (err) {
      console.error(err)
      setError('Failed to send text. Check your PC connection.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="space-y-5">

      {/* Text Input */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

        <div className="flex items-center gap-2">
          <Keyboard size={20} className="text-emerald-400" />
          <h2 className="font-semibold">Keyboard</h2>
        </div>

        <p className="mt-2 text-xs text-slate-400">
          Type using your phone's keyboard
        </p>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type something here..."
          rows={4}
          className="mt-4 w-full resize-none rounded-xl border border-slate-700 bg-slate-950 p-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-emerald-500"
        />

        <div className="mt-3 flex items-center justify-between">

          <span className="text-xs text-slate-500">
            {text.length} characters
          </span>

          <button
            onClick={() => setText('')}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <Eraser size={15} />
            Clear
          </button>

        </div>

        <div className="mt-3 space-y-2">
          <button
            onClick={() => void handleSendText()}
            disabled={!text || isSending}
            className="w-full rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSending ? 'Sending...' : 'Send Text to PC'}
          </button>

          {error && (
            <p className="text-xs text-red-400">{error}</p>
          )}
        </div>

      </div>

      {/* Special Keys */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

        <h3 className="font-semibold">Special Keys</h3>

        <div className="mt-4 grid grid-cols-5 gap-2">

          {specialKeys.map((key) => (
            <button
              key={key}
              onClick={() => handleKey(key)}
              className="rounded-lg border border-slate-700 bg-slate-800 py-3 text-xs font-medium text-slate-300 transition hover:bg-slate-700 active:scale-95"
            >
              {key}
            </button>
          ))}

        </div>

        {/* Navigation Keys */}
        <div className="mt-5">

          <h3 className="text-sm font-medium text-slate-300">
            Navigation
          </h3>

          <div className="mt-3 flex items-center justify-center gap-2">

            <button
              onClick={() => handleKey('ArrowLeft')}
              className="rounded-lg border border-slate-700 bg-slate-800 p-3 text-slate-300 hover:bg-slate-700"
              aria-label="Left arrow"
            >
              <ArrowLeft size={20} />
            </button>

            <div className="flex flex-col gap-2">

              <button
                onClick={() => handleKey('ArrowUp')}
                className="rounded-lg border border-slate-700 bg-slate-800 p-3 text-slate-300 hover:bg-slate-700"
                aria-label="Up arrow"
              >
                <ArrowUp size={20} />
              </button>

              <button
                onClick={() => handleKey('ArrowDown')}
                className="rounded-lg border border-slate-700 bg-slate-800 p-3 text-slate-300 hover:bg-slate-700"
                aria-label="Down arrow"
              >
                <ArrowDown size={20} />
              </button>

            </div>

            <button
              onClick={() => handleKey('ArrowRight')}
              className="rounded-lg border border-slate-700 bg-slate-800 p-3 text-slate-300 hover:bg-slate-700"
              aria-label="Right arrow"
            >
              <ArrowRight size={20} />
            </button>

          </div>

        </div>

        {/* Additional Keys */}
        <div className="mt-5 grid grid-cols-3 gap-2">

          <button
            onClick={() => handleKey('Enter')}
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800 py-3 text-xs text-slate-300 hover:bg-slate-700"
          >
            <CornerDownLeft size={16} />
            Enter
          </button>

          <button
            onClick={() => handleKey('Backspace')}
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800 py-3 text-xs text-slate-300 hover:bg-slate-700"
          >
            <Delete size={16} />
            Backspace
          </button>

          <button
            onClick={() => handleKey('Delete')}
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800 py-3 text-xs text-slate-300 hover:bg-slate-700"
          >
            <Eraser size={16} />
            Delete
          </button>

        </div>

      </div>

      {/* Shortcuts */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

        <div className="flex items-center gap-2">
          <Command size={20} className="text-emerald-400" />
          <h3 className="font-semibold">Quick Shortcuts</h3>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">

          {shortcuts.map((shortcut) => (
            <button
              key={shortcut.label}
              onClick={() =>
                void handleShortcut(shortcut.label, shortcut.keys)
              }
              className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-4 text-sm font-medium text-slate-300 transition hover:border-emerald-500/40 hover:bg-slate-700 active:scale-95"
            >
              {shortcut.label}
            </button>
          ))}

        </div>

      </div>

      {/* Last Action */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
        <p className="text-xs text-slate-400">
          Last action:
          <span className="ml-2 font-medium text-emerald-400">
            {lastAction}
          </span>
        </p>

        {error && (
          <p className="mt-2 text-xs text-red-400">
            {error}
          </p>
        )}
      </div>

    </div>
  )
}

export default KeyboardPanel
