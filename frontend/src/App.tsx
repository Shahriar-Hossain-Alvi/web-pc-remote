
import { useEffect, useState } from 'react'
import {
  Keyboard,
  Monitor,
  Mouse,
  Music2,
  Wifi,
  WifiOff,
  TrafficCone
} from 'lucide-react'
import MediaPanel from './features/media/MediaPanel'
import TouchpadPanel from './features/touchpad/TouchpadPanel'
import KeyboardPanel from './features/keyboard/KeyboardPanel'
import { checkBackendHealth } from './lib/api'
import VLCPanel from './features/vlc/VLCPanel'

type Tab = 'media' | 'vlc' | 'touchpad' | 'keyboard'

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('vlc')
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const result = await checkBackendHealth();
        setIsConnected(result.status === 'healthy');
      } catch (error) {
        console.error('Backend connection failed:', error);
        setIsConnected(false);
      }
    };

    checkConnection();

    const intervalId = setInterval(checkConnection, 5000);

    return () => clearInterval(intervalId);
  }, []);


  const tabs = [
    {
      id: 'vlc' as Tab,
      label: 'VLC',
      icon: TrafficCone,
    },
    {
      id: 'touchpad' as Tab,
      label: 'Touchpad',
      icon: Mouse,
    },
    {
      id: 'media' as Tab,
      label: 'Media',
      icon: Music2,
    },
    {
      id: 'keyboard' as Tab,
      label: 'Keyboard',
      icon: Keyboard,
    }
  ]

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto min-h-screen max-w-lg px-4 py-5">

        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
              <Monitor size={23} />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight">
                PC Remote
              </h1>
              <p className="text-xs text-slate-400">
                Local network controller
              </p>
            </div>
          </div>

          {/* Connection Status */}
          <div
            className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium ${isConnected
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
              : 'border-slate-700 bg-slate-800 text-slate-400'
              }`}
          >
            {isConnected ? (
              <Wifi size={14} />
            ) : (
              <WifiOff size={14} />
            )}

            {isConnected ? 'Connected' : 'Disconnected'}
          </div>
        </header>

        {/* PC Information */}
        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-slate-400">
              <Monitor size={24} />
            </div>

            <div className="flex-1">
              <h2 className="font-semibold">My Windows PC</h2>
              <p
                className={`mt-1 text-xs ${isConnected ? 'text-emerald-400' : 'text-red-400'
                  }`}
              >
                {isConnected ? 'Connected' : 'Disconnected'}
              </p>
            </div>
          </div>
        </section>

        {/* Navigation */}
        <nav className="mt-8 grid grid-cols-4 gap-2 rounded-xl bg-slate-900 p-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center gap-1.5 rounded-lg py-3 text-sm font-medium transition-colors ${isActive
                  ? 'bg-emerald-500 text-slate-950'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
              >
                <Icon size={20} />
                {tab.label}
              </button>
            )
          })}
        </nav>

        {/* Main Content */}
        <section className="mt-6">
          {activeTab === 'vlc' && <VLCPanel />}

          {activeTab === 'touchpad' && <TouchpadPanel />}

          {activeTab === 'media' && <MediaPanel />}

          {activeTab === 'keyboard' && <KeyboardPanel />}


        </section>

        {/* Footer */}
        <footer className="mt-10 border-t border-slate-800 pt-4 text-center">
          <p className="text-xs text-slate-500">
            PC Remote · Local Network
          </p>
        </footer>

      </div>
    </main>
  )
}

export default App
