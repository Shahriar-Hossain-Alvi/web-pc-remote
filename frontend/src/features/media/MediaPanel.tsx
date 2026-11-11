
import { useState } from 'react'
import {
  Volume2,
  Volume1,
  VolumeX,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Music2,
  Loader2,
} from 'lucide-react'

import {
  playPauseMedia,
  previousMedia,
  nextMedia,
  volumeUp,
  volumeDown,
  toggleMute,
} from './media.api'

function MediaPanel() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [busyAction, setBusyAction] = useState<string | null>(null)
  const [error, setError] = useState('')

  const sendCommand = async (
    action: string,
    command: () => Promise<unknown>,
    onSuccess?: () => void,
  ) => {
    if (busyAction) return

    setBusyAction(action)
    setError('')

    try {
      await command()
      onSuccess?.()
    } catch (err) {
      console.error(err)
      setError('Command failed. Check your PC connection.')
    } finally {
      setBusyAction(null)
    }
  }

  return (
    <div className="space-y-5">

      {/* Player Information */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

        <div className="flex items-center gap-2">
          <Music2 size={20} className="text-emerald-400" />
          <h2 className="font-semibold">Media Controls</h2>
        </div>

        <div className="mt-6 flex flex-col items-center text-center">

          <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-slate-800 text-emerald-400">
            <Music2 size={42} />
          </div>

          <h3 className="mt-4 font-semibold">
            VLC Media Player
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            Control your PC media playback
          </p>

          <span className="mt-3 rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
            Windows media controls
          </span>

        </div>

        {/* Playback Buttons */}
        <div className="mt-8 flex items-center justify-center gap-7">

          <button
            onClick={() => void sendCommand(
              'previous',
              previousMedia,
            )}
            disabled={busyAction !== null}
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
            title="Previous"
          >
            <SkipBack size={24} />
          </button>

          <button
            onClick={() => void sendCommand(
              'play-pause',
              playPauseMedia,
              () => setIsPlaying((current) => !current),
            )}
            disabled={busyAction !== null}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-slate-950 transition hover:bg-emerald-400 active:scale-95 disabled:opacity-50"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {busyAction === 'play-pause' ? (
              <Loader2 size={24} className="animate-spin" />
            ) : isPlaying ? (
              <Pause size={26} fill="currentColor" />
            ) : (
              <Play size={26} fill="currentColor" />
            )}
          </button>

          <button
            onClick={() => void sendCommand(
              'next',
              nextMedia,
            )}
            disabled={busyAction !== null}
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
            title="Next"
          >
            <SkipForward size={24} />
          </button>

        </div>

      </div>

      {/* Volume Controls */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Volume</h3>

          <span className="text-xs text-slate-500">
            PC volume
          </span>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">

          <button
            onClick={() => void sendCommand(
              'mute',
              toggleMute,
              () => setIsMuted((current) => !current),
            )}
            disabled={busyAction !== null}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <VolumeX size={22} />
            ) : (
              <Volume2 size={22} />
            )}
          </button>

          <button
            onClick={() => void sendCommand('volume-down', volumeDown)}
            disabled={busyAction !== null}
            className="flex-1 rounded-lg border border-slate-700 px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-800 disabled:opacity-50"
          >
            <span className="flex items-center justify-center gap-2">
              <Volume1 size={17} />
              Volume −
            </span>
          </button>

          <button
            onClick={() => void sendCommand('volume-up', volumeUp)}
            disabled={busyAction !== null}
            className="flex-1 rounded-lg border border-slate-700 px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-800 disabled:opacity-50"
          >
            <span className="flex items-center justify-center gap-2">
              <Volume2 size={17} />
              Volume +
            </span>
          </button>

        </div>

      </div>

      {error && (
        <p className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-center text-sm text-red-400">
          {error}
        </p>
      )}

    </div>
  )
}

export default MediaPanel
