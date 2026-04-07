import { useEffect, useMemo, useState } from 'react'

export default function AuthModal({ open, mode, onModeChange, onClose, onToast }) {
  const [login, setLogin] = useState({ email: '', password: '' })
  const [register, setRegister] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')

  const title = useMemo(() => (mode === 'register' ? 'Daftar' : 'Masuk'), [mode])

  useEffect(() => {
    if (!open) return
    setError('')
    window.lucide?.createIcons?.()
  }, [open, mode])

  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  useEffect(() => {
    if (!open) return
    const t = window.setTimeout(() => {
      const first = document.getElementById(mode === 'register' ? 'auth-name' : 'auth-email')
      first?.focus?.()
    }, 0)
    return () => window.clearTimeout(t)
  }, [open, mode])

  if (!open) return null

  const submitLogin = (e) => {
    e.preventDefault()
    setError('')

    if (!login.email.trim() || !login.password) {
      setError('Email dan password wajib diisi.')
      return
    }

    onToast?.('Berhasil masuk (demo).')
    onClose?.()
  }

  const submitRegister = (e) => {
    e.preventDefault()
    setError('')

    if (!register.name.trim() || !register.email.trim() || !register.password || !register.confirmPassword) {
      setError('Nama, email, password, dan konfirmasi password wajib diisi.')
      return
    }
    if (register.password !== register.confirmPassword) {
      setError('Password dan konfirmasi password tidak sama.')
      return
    }

    onToast?.('Akun berhasil dibuat (demo). Silakan masuk.')
    onModeChange?.('login')
    setLogin({ email: register.email, password: '' })
    setRegister({ name: '', email: '', password: '', confirmPassword: '' })
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center px-4 py-8 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.()
      }}
    >
      <div className="w-full max-w-md glass-strong rounded-3xl border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.6)] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <i data-lucide="shield" className="w-5 h-5 text-black"></i>
            </div>
            <div>
              <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-amber-400">Scolis.ai</p>
              <h3 className="font-oswald font-light text-2xl leading-tight">{title}</h3>
            </div>
          </div>
          <button
            type="button"
            className="w-10 h-10 rounded-2xl glass hover:bg-white/10 transition-colors flex items-center justify-center"
            onClick={onClose}
            aria-label="Tutup"
          >
            <i data-lucide="x" className="w-5 h-5 text-gray-200"></i>
          </button>
        </div>

        <div className="px-6 pt-6">
          <div className="grid grid-cols-2 gap-2 glass rounded-2xl p-1 border border-white/10">
            <button
              type="button"
              onClick={() => onModeChange?.('login')}
              className={
                mode === 'login'
                  ? 'rounded-xl px-4 py-2.5 text-[13px] font-semibold bg-white/10 text-white'
                  : 'rounded-xl px-4 py-2.5 text-[13px] font-medium text-gray-400 hover:text-white transition-colors'
              }
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={() => onModeChange?.('register')}
              className={
                mode === 'register'
                  ? 'rounded-xl px-4 py-2.5 text-[13px] font-semibold bg-white/10 text-white'
                  : 'rounded-xl px-4 py-2.5 text-[13px] font-medium text-gray-400 hover:text-white transition-colors'
              }
            >
              Daftar
            </button>
          </div>
        </div>

        <div className="px-6 pb-7 pt-5">
          {error ? (
            <div className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-200">
              {error}
            </div>
          ) : null}

          {mode === 'login' ? (
            <form onSubmit={submitLogin} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-300 mb-2">Email</label>
                <input
                  id="auth-email"
                  type="email"
                  value={login.email}
                  onChange={(e) => setLogin((s) => ({ ...s, email: e.target.value }))}
                  placeholder="nama@perusahaan.com"
                  className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  autoComplete="email"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-300 mb-2">Password</label>
                <input
                  type="password"
                  value={login.password}
                  onChange={(e) => setLogin((s) => ({ ...s, password: e.target.value }))}
                  placeholder="Masukkan password"
                  className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm py-3.5 rounded-2xl transition-all hover:shadow-[0_0_35px_rgba(245,158,11,0.35)]"
              >
                Masuk
              </button>
            </form>
          ) : (
            <form onSubmit={submitRegister} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-300 mb-2">Nama</label>
                <input
                  id="auth-name"
                  type="text"
                  value={register.name}
                  onChange={(e) => setRegister((s) => ({ ...s, name: e.target.value }))}
                  placeholder="Nama lengkap"
                  className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  autoComplete="name"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={register.email}
                  onChange={(e) => setRegister((s) => ({ ...s, email: e.target.value }))}
                  placeholder="nama@perusahaan.com"
                  className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  autoComplete="email"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-300 mb-2">Password</label>
                <input
                  type="password"
                  value={register.password}
                  onChange={(e) => setRegister((s) => ({ ...s, password: e.target.value }))}
                  placeholder="Buat password"
                  className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  autoComplete="new-password"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-300 mb-2">Konfirmasi Password</label>
                <input
                  type="password"
                  value={register.confirmPassword}
                  onChange={(e) => setRegister((s) => ({ ...s, confirmPassword: e.target.value }))}
                  placeholder="Ulangi password"
                  className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  autoComplete="new-password"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm py-3.5 rounded-2xl transition-all hover:shadow-[0_0_35px_rgba(245,158,11,0.35)]"
              >
                Daftar
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
