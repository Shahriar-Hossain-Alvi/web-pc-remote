
import { useState } from 'react'
import {
  Volume2,
  Volume1,
  VolumeX,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  RotateCw,
  Music2,
} from 'lucide-react'

function MediaPanel() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(35)
  const [volume, setVolume] = useState(70)
  const [previousVolume, setPreviousVolume] = useState(70)

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60

    return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`
  }

  const currentTime = Math.floor((progress / 100) * 240)

  const handleVolumeChange = (value: number) => {
    if (value > 0) {
      setPreviousVolume(value)
    }

    setVolume(value)
  }

  const toggleMute = () => {
    if (volume > 0) {
      setPreviousVolume(volume)
      setVolume(0)
    } else {
      setVolume(previousVolume || 70)
    }
  }

  const changeProgress = (amount: number) => {
    setProgress((current) =>
      Math.max(0, Math.min(100, current + amount / 240 * 100))
    )
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

          <span className="mt-3 rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
            Demo mode · Not connected
          </span>

        </div>

        {/* Playback Progress */}
        <div className="mt-8">

          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer accent-emerald-500"
            aria-label="Playback progress"
          />

          <div className="mt-2 flex justify-between text-xs text-slate-400">
            <span>{formatTime(currentTime)}</span>
            <span>4:00</span>
          </div>

        </div>

        {/* Playback Buttons */}
        <div className="mt-6 flex items-center justify-center gap-5">

          <button
            onClick={() => changeProgress(-10)}
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
            title="Back 10 seconds"
          >
            <RotateCcw size={21} />
          </button>

          <button
            onClick={() => setProgress(0)}
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
            title="Previous"
          >
            <SkipBack size={22} />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-slate-950 transition hover:bg-emerald-400 active:scale-95"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause size={26} fill="currentColor" />
            ) : (
              <Play size={26} fill="currentColor" />
            )}
          </button>

          <button
            onClick={() => setProgress(100)}
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
            title="Next"
          >
            <SkipForward size={22} />
          </button>

          <button
            onClick={() => changeProgress(10)}
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
            title="Forward 10 seconds"
          >
            <RotateCw size={21} />
          </button>

        </div>

      </div>

      {/* Volume Controls */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Volume</h3>

          <span className="text-sm font-medium text-emerald-400">
            {volume}%
          </span>
        </div>

        <div className="mt-5 flex items-center gap-3">

          <button
            onClick={toggleMute}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
            title={volume === 0 ? 'Unmute' : 'Mute'}
          >
            {volume === 0 ? (
              <VolumeX size={21} />
            ) : volume < 50 ? (
              <Volume1 size={21} />
            ) : (
              <Volume2 size={21} />
            )}
          </button>

          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => handleVolumeChange(Number(e.target.value))}
            className="h-1.5 flex-1 cursor-pointer accent-emerald-500"
            aria-label="Volume"
          />

        </div>

        <div className="mt-4 flex items-center justify-between">

          <button
            onClick={() => handleVolumeChange(Math.max(0, volume - 5))}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800"
          >
            Volume −
          </button>

          <button
            onClick={() => handleVolumeChange(Math.min(100, volume + 5))}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800"
          >
            Volume +
          </button>

        </div>

      </div>

    </div>
  )
}

export default MediaPanel
