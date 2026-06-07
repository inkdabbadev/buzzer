import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-10 text-center">
        {/* Brand */}
        <div className="space-y-3">
          <div className="text-7xl">⚡</div>
          <h1 className="text-6xl font-black text-white tracking-tight">Buzzer</h1>
          <p className="text-gray-400 text-lg">Real-time buzzer system for live events</p>
        </div>

        {/* CTAs */}
        <div className="space-y-3">
          <Link
            href="/host"
            className="flex items-center justify-center gap-3 w-full py-5 rounded-2xl
              bg-violet-600 hover:bg-violet-500 active:scale-[0.98] text-white font-bold text-xl
              transition-all shadow-[0_0_40px_rgba(124,58,237,0.4)] hover:shadow-[0_0_60px_rgba(124,58,237,0.6)]"
          >
            <span>🎙</span> Create Host Session
          </Link>

          <Link
            href="/join"
            className="flex items-center justify-center gap-3 w-full py-5 rounded-2xl
              bg-gray-800 hover:bg-gray-700 active:scale-[0.98] text-white font-bold text-xl
              transition-all border border-gray-700"
          >
            <span>🔑</span> Join a Session
          </Link>
        </div>

        <p className="text-gray-700 text-sm">
          Supports up to 30+ participants on the same network
        </p>
      </div>
    </main>
  )
}
