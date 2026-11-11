
import { useCallback, useEffect, useState } from 'react'
import {
   Music2,
   Play,
   Pause,
   SkipBack,
   SkipForward,
   Volume2,
   VolumeX,
   Volume1,
   RefreshCw,
   Loader2,
} from 'lucide-react'

import {
   getVLCStatus,
   vlcPlayPause,
   vlcPrevious,
   vlcNext,
   vlcVolumeUp,
   vlcVolumeDown,
   vlcMute,
   type VLCStatus,
} from './vlc.api'

function VLCPanel() {
   const [status, setStatus] = useState<VLCStatus | null>(null)
   const [busyAction, setBusyAction] = useState<string | null>(null)
   const [error, setError] = useState('')

   const fetchStatus = useCallback(async () => {
      try {
         const data = await getVLCStatus()
         console.log('VLC raw volume:', data.volume)
         setStatus(data)
         setError('')
      } catch (err) {
         console.error('Failed to fetch VLC status:', err)
         setError('Unable to connect to VLC. Make sure VLC is running.')
      }
   }, [])

   // Fetch VLC status periodically.
   useEffect(() => {
      void fetchStatus()

      const interval = setInterval(() => {
         void fetchStatus()
      }, 1500)

      return () => clearInterval(interval)
   }, [fetchStatus])

   const sendCommand = async (
      action: string,
      command: () => Promise<unknown>,
   ) => {
      if (busyAction) return

      setBusyAction(action)
      setError('')

      try {
         await command()
         await fetchStatus()
      } catch (err) {
         console.error(`VLC ${action} failed:`, err)
         setError('Command failed. Check your VLC connection.')
      } finally {
         setBusyAction(null)
      }
   }

   const formatTime = (seconds: number) => {
      const safeSeconds = Math.max(0, seconds || 0)
      const minutes = Math.floor(safeSeconds / 60)
      const remainingSeconds = Math.floor(safeSeconds % 60)

      return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`
   }

   const metadata =
      status?.information?.category?.meta

   const trackTitle =
      metadata?.title ||
      metadata?.filename ||
      'No track information'

   const artist = metadata?.artist || 'Unknown artist'

   const isPlaying = status?.state === 'playing'
   const isMuted = (status?.volume ?? 0) === 0

   const volumePercent = Math.min(
      200,
      Math.max(0, Math.round((status?.volume ?? 0) / 2.56)),
   )

   const progressPercent =
      status && status.length > 0
         ? Math.min(100, (status.time / status.length) * 100)
         : 0

   return (
      <div className="space-y-5">

         {/* VLC status */}
         <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <Music2 size={20} className="text-orange-400" />
                  <h2 className="font-semibold">VLC Media Player</h2>
               </div>

               <button
                  onClick={() => void fetchStatus()}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                  title="Refresh status"
               >
                  <RefreshCw size={17} />
               </button>
            </div>

            <div className="mt-6 flex flex-col items-center text-center">
               <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500/20 to-slate-800 text-orange-400">
                  <Music2 size={42} />
               </div>

               <h3 className="mt-4 max-w-full truncate font-semibold">
                  {trackTitle}
               </h3>

               <p className="mt-1 max-w-full truncate text-xs text-slate-400">
                  {artist}
               </p>

               <span
                  className={`mt-3 rounded-full px-3 py-1 text-xs ${isPlaying
                     ? 'bg-emerald-500/10 text-emerald-400'
                     : 'bg-slate-800 text-slate-400'
                     }`}
               >
                  {status
                     ? status.state.charAt(0).toUpperCase() +
                     status.state.slice(1)
                     : 'Connecting...'}
               </span>
            </div>

            {/* Progress */}
            <div className="mt-7">
               <div className="h-1.5 overflow-hidden rounded-full bg-slate-700">
                  <div
                     className="h-full rounded-full bg-orange-400 transition-all duration-500"
                     style={{ width: `${progressPercent}%` }}
                  />
               </div>

               <div className="mt-2 flex justify-between text-xs tabular-nums text-slate-400">
                  <span>{formatTime(status?.time ?? 0)}</span>
                  <span>{formatTime(status?.length ?? 0)}</span>
               </div>
            </div>

            {/* Playback controls */}
            <div className="mt-7 flex items-center justify-center gap-7">
               <button
                  onClick={() => void sendCommand('previous', vlcPrevious)}
                  disabled={!!busyAction}
                  className="text-slate-300 transition hover:text-white disabled:opacity-40"
                  title="Previous"
               >
                  <SkipBack size={25} />
               </button>

               <button
                  onClick={() => void sendCommand('play-pause', vlcPlayPause)}
                  disabled={!!busyAction}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white transition hover:bg-orange-400 active:scale-95 disabled:opacity-50"
                  title="Play / Pause"
               >
                  {busyAction === 'play-pause' ? (
                     <Loader2 size={25} className="animate-spin" />
                  ) : isPlaying ? (
                     <Pause size={25} fill="currentColor" />
                  ) : (
                     <Play size={25} fill="currentColor" />
                  )}
               </button>

               <button
                  onClick={() => void sendCommand('next', vlcNext)}
                  disabled={!!busyAction}
                  className="text-slate-300 transition hover:text-white disabled:opacity-40"
                  title="Next"
               >
                  <SkipForward size={25} />
               </button>
            </div>
         </div>

         {/* VLC volume */}
         <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex items-center justify-between">
               <h3 className="font-semibold">VLC Volume</h3>
               <span className="text-xs tabular-nums text-slate-400">
                  {volumePercent}%
               </span>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
               <button
                  onClick={() => void sendCommand('mute', vlcMute)}
                  disabled={!!busyAction}
                  className="rounded-xl bg-slate-800 p-3 text-slate-300 transition hover:bg-slate-700 disabled:opacity-40"
                  title="Mute / Unmute"
               >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
               </button>

               <button
                  onClick={() => void sendCommand('volume-down', vlcVolumeDown)}
                  disabled={!!busyAction}
                  className="flex-1 rounded-xl bg-slate-800 py-3 text-sm text-slate-200 transition hover:bg-slate-700 disabled:opacity-40"
               >
                  Volume −
               </button>

               <button
                  onClick={() => void sendCommand('volume-up', vlcVolumeUp)}
                  disabled={!!busyAction}
                  className="flex-1 rounded-xl bg-slate-800 py-3 text-sm text-slate-200 transition hover:bg-slate-700 disabled:opacity-40"
               >
                  Volume +
               </button>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
               <Volume1 size={15} />
               <span>VLC's internal volume</span>
            </div>
         </div>

         {/* Error */}
         {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
               {error}
            </div>
         )}
      </div>
   )
}

export default VLCPanel
