
import { useRef, useState, useEffect } from 'react'
import {
  Mouse,
  MousePointer2,
  ArrowUp,
  ArrowDown,
  Move,
  Hand,
  Crosshair,
} from 'lucide-react'

import {
  clickMouse,
  doubleClickMouse,
  scrollMouse,
  mouseDown,
  mouseUp,
  connectMouseSocket,
  centerMouse,
} from './touchpad.api'

function TouchpadPanel() {
  const [dragMode, setDragMode] = useState(false)
  const [lastAction, setLastAction] = useState('Ready')
  const [error, setError] = useState('')
  const mouseSocket = useRef<WebSocket | null>(null)
  const continuousScrollTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const scrollRequestInProgress = useRef(false)

  const lastPosition = useRef<{ x: number; y: number } | null>(null)
  const dragging = useRef(false)

  // useEffect(() => {
  //   const socket = connectMouseSocket()

  //   mouseSocket.current = socket

  //   socket.onopen = () => {
  //     console.log('Mouse WebSocket connected')
  //   }

  //   socket.onclose = () => {
  //     console.log('Mouse WebSocket disconnected')
  //   }

  //   socket.onerror = (error) => {
  //     console.error('Mouse WebSocket error:', error)
  //   }

  //   return () => {
  //     stopContinuousScroll()
  //     socket.close()
  //     mouseSocket.current = null
  //   }
  // }, [])

  useEffect(() => {
    let socket: WebSocket | null = null
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null
    let isUnmounted = false

    const connect = () => {
      if (isUnmounted) return

      socket = connectMouseSocket()
      mouseSocket.current = socket

      socket.onopen = () => {
        console.log('Mouse WebSocket connected')
      }

      socket.onclose = () => {
        console.log('Mouse WebSocket disconnected. Reconnecting...')

        if (!isUnmounted) {
          reconnectTimer = setTimeout(connect, 1000)
        }
      }

      socket.onerror = (error) => {
        console.error('Mouse WebSocket error:', error)
        socket?.close()
      }
    }

    connect()

    return () => {
      isUnmounted = true

      if (reconnectTimer !== null) {
        clearTimeout(reconnectTimer)
      }

      stopContinuousScroll()

      socket?.close()
      mouseSocket.current = null
    }
  }, [])

  const sendAction = async (
    action: string,
    operation: () => Promise<unknown>,
  ) => {
    try {
      setError('')
      await operation()
      setLastAction(action)
    } catch (err) {
      console.error(err)
      setError('Command failed. Check your PC connection.')
    }
  }

  const handlePointerDown = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)

    lastPosition.current = {
      x: event.clientX,
      y: event.clientY,
    }

    if (dragMode && !dragging.current) {
      dragging.current = true
      void sendAction('Dragging', mouseDown)
    }
  }

  const handlePointerMove = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (!lastPosition.current) return

    const dx = event.clientX - lastPosition.current.x
    const dy = event.clientY - lastPosition.current.y

    lastPosition.current = {
      x: event.clientX,
      y: event.clientY,
    }

    const socket = mouseSocket.current

    if (!socket || socket.readyState !== WebSocket.OPEN) {
      return
    }

    socket.send(
      JSON.stringify({
        dx: Math.round(dx * 2),
        dy: Math.round(dy * 2),
      }),
    )
  }

  const handlePointerUp = () => {
    lastPosition.current = null

    if (dragging.current) {
      dragging.current = false
      void sendAction('Drag released', mouseUp)
    }
  }

  const handlePointerCancel = () => {
    handlePointerUp()
  }

  const stopContinuousScroll = () => {
    if (continuousScrollTimer.current !== null) {
      clearInterval(continuousScrollTimer.current)
      continuousScrollTimer.current = null
    }
  }

  const startContinuousScroll = (direction: 'up' | 'down') => {
    stopContinuousScroll()

    const amount = direction === 'up' ? 30 : -30

    setError('')
    setLastAction(
      direction === 'up' ? 'Continuous scroll up' : 'Continuous scroll down',
    )

    const performScroll = async () => {
      if (scrollRequestInProgress.current) return

      scrollRequestInProgress.current = true

      try {
        await scrollMouse(amount)
      } catch (err) {
        console.error(err)
        setError('Scrolling failed. Check your PC connection.')
        stopContinuousScroll()
      } finally {
        scrollRequestInProgress.current = false
      }
    }

    void performScroll()

    continuousScrollTimer.current = setInterval(() => {
      void performScroll()
    }, 120)
  }

  return (
    <div className="space-y-5">

      {/* Touchpad */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mouse size={20} className="text-emerald-400" />
            <h2 className="font-semibold">Touchpad</h2>
          </div>

          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
            Live mode
          </span>
        </div>

        {/* Touch Area */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onLostPointerCapture={handlePointerCancel}
          onClick={() => {
            if (!dragMode) {
              void sendAction('Touchpad tap · Left click', () =>
                clickMouse('left'),
              )
            }
          }}
          className="mt-5 flex h-96 touch-none select-none flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-700 bg-slate-950 text-slate-400 transition active:border-emerald-500/50 active:bg-slate-900"
        >
          <MousePointer2 size={36} className="text-emerald-400" />

          <p className="font-medium text-slate-300">
            Touchpad Area
          </p>

          <p className="text-center text-xs">
            Move your finger here to control the mouse
          </p>

          {dragMode && (
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
              Drag mode enabled
            </span>
          )}
        </div>

        {/* Last Action */}
        <p className="mt-3 text-center text-xs text-slate-500">
          Last action: {lastAction}
        </p>

        {error && (
          <p className="mt-2 text-center text-xs text-red-400">
            {error}
          </p>
        )}

        {/* Mouse Buttons */}
        <div className="mt-5 grid grid-cols-2 gap-3">

          <button
            onClick={() =>
              void sendAction('Left click', () => clickMouse('left'))
            }
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 py-4 text-sm font-medium transition hover:bg-slate-700 active:scale-95"
          >
            <MousePointer2 size={17} />
            Left Click
          </button>

          <button
            onClick={() =>
              void sendAction('Right click', () => clickMouse('right'))
            }
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 py-4 text-sm font-medium transition hover:bg-slate-700 active:scale-95"
          >
            <Mouse size={17} />
            Right Click
          </button>

        </div>

        {/* Double Click */}
        <button
          onClick={() =>
            void sendAction('Double click', doubleClickMouse)
          }
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 py-3 text-sm text-slate-300 transition hover:bg-slate-800 active:scale-95"
        >
          <MousePointer2 size={17} />
          Double Click
        </button>

        <button
          onClick={() =>
            void sendAction('Mouse moved to center', centerMouse)
          }
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 py-3 text-sm font-medium text-emerald-400 transition hover:bg-emerald-500/20 active:scale-95"
        >
          <Crosshair size={17} />
          Center Mouse
        </button>
      </div>

      {/* Scroll Controls */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

        <div className="flex items-center gap-2">
          <Move size={20} className="text-emerald-400" />
          <h3 className="font-semibold">Scrolling</h3>
        </div>

        <p className="mt-1 text-xs text-slate-400">
          Scroll vertically using the buttons
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            onClick={() =>
              void sendAction('Scroll up', () => scrollMouse(5))
            }
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 py-4 text-sm transition hover:bg-slate-700 active:scale-95"
          >
            <ArrowUp size={18} />
            Scroll Up
          </button>

          <button
            onClick={() =>
              void sendAction('Scroll down', () => scrollMouse(-5))
            }
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 py-4 text-sm transition hover:bg-slate-700 active:scale-95"
          >
            <ArrowDown size={18} />
            Scroll Down
          </button>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <button
            onPointerDown={(event) => {
              event.preventDefault()
              event.currentTarget.setPointerCapture(event.pointerId)
              startContinuousScroll('up')
            }}
            onPointerUp={stopContinuousScroll}
            onPointerCancel={stopContinuousScroll}
            onLostPointerCapture={stopContinuousScroll}
            onContextMenu={(event) => event.preventDefault()}
            className="flex touch-none items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 py-4 text-sm text-emerald-400 transition active:bg-emerald-500/20 select-none"
          >
            <ArrowUp size={18} />
            Hold to Scroll Up
          </button>

          <button
            onPointerDown={(event) => {
              event.preventDefault()
              event.currentTarget.setPointerCapture(event.pointerId)
              startContinuousScroll('down')
            }}
            onPointerUp={stopContinuousScroll}
            onPointerCancel={stopContinuousScroll}
            onLostPointerCapture={stopContinuousScroll}
            onContextMenu={(event) => event.preventDefault()}
            className="flex touch-none items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 py-4 text-sm text-emerald-400 transition active:bg-emerald-500/20 select-none"
          >
            <ArrowDown size={18} />
            Hold to Scroll Down
          </button>
        </div>

      </div>

      {/* Drag Mode */}
      <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 p-4">

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <Hand size={20} />
          </div>

          <div>
            <h3 className="text-sm font-medium">Drag Mode</h3>
            <p className="mt-1 text-xs text-slate-400">
              Hold and move to drag items
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (dragging.current) {
              dragging.current = false
              void sendAction('Drag released', mouseUp)
            }

            setDragMode((previous) => !previous)
            setLastAction(
              dragMode ? 'Drag mode disabled' : 'Drag mode enabled',
            )
          }}
          className={`relative h-7 w-12 rounded-full transition-colors ${dragMode ? 'bg-emerald-500' : 'bg-slate-700'
            }`}
          aria-label="Toggle drag mode"
          aria-pressed={dragMode}
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform ${dragMode ? '-translate-x-5' : 'translate-x-0'
              }`}
          />
        </button>

      </div>

    </div>
  )
}

export default TouchpadPanel
