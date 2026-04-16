import { useEffect, useMemo, useState } from 'react'

export default function AuthModal({ open, mode, onModeChange, onClose, onToast, onLoginSuccess }) {
  const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/+$/, '')
  const [login, setLogin] = useState({ email: '', password: '' })
  const [register, setRegister] = useState({ name: '', email: '', otp: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [errorTone, setErrorTone] = useState('red')
  const [submitting, setSubmitting] = useState(false)
  const [otpState, setOtpState] = useState({ status: 'idle', sending: false, verifying: false })
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showRegisterPassword, setShowRegisterPassword] = useState(false)
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false)

  const title = useMemo(() => (mode === 'register' ? 'Daftar' : 'Masuk'), [mode])

  useEffect(() => {
    if (!open) return
    setError('')
    setErrorTone('red')
    setSubmitting(false)
    setOtpState({ status: 'idle', sending: false, verifying: false })
    setShowLoginPassword(false)
    setShowRegisterPassword(false)
    setShowRegisterConfirmPassword(false)
    window.lucide?.createIcons?.()
  }, [open, mode])

  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const t = window.setTimeout(() => {
      const first = document.getElementById(mode === 'register' ? 'auth-name' : 'auth-email')
      first?.focus?.()
    }, 0)
    return () => window.clearTimeout(t)
  }, [open, mode])

  if (!open) return null

  const setErrorMsg = (msg, tone = 'red') => {
    setError(msg)
    setErrorTone(tone)
  }

  const requestOtp = async () => {
    setErrorMsg('', 'red')
    if (!register.email.trim()) {
      setErrorMsg('Email wajib diisi untuk kirim OTP.', 'red')
      return
    }
    setOtpState((s) => ({ ...s, sending: true }))
    try {
      const res = await fetch(`${API_BASE}/api/auth/otp/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: register.email.trim() }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        const msg = data?.message || 'Gagal mengirim OTP.'
        const tone = res.status === 409 || String(msg).toLowerCase().includes('sudah terdaftar') ? 'amber' : 'red'
        setErrorMsg(msg, tone)
        return
      }
      onToast?.('OTP terkirim ke email. Silakan cek inbox/spam.', { tone: 'amber', icon: 'mail', kind: 'register' })
      setOtpState({ status: 'sent', sending: false, verifying: false })
    } catch {
      setErrorMsg('Tidak dapat terhubung ke backend (cek http://localhost:8080/api/health).', 'red')
    } finally {
      setOtpState((s) => ({ ...s, sending: false }))
    }
  }

  const verifyOtp = async () => {
    setErrorMsg('', 'red')
    if (!register.email.trim() || !register.otp.trim()) {
      setErrorMsg('Email dan OTP wajib diisi.', 'red')
      return
    }
    if (!/^[0-9]{6}$/.test(register.otp.trim())) {
      setErrorMsg('OTP harus 6 digit angka.', 'red')
      return
    }
    setOtpState((s) => ({ ...s, verifying: true }))
    try {
      const res = await fetch(`${API_BASE}/api/auth/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: register.email.trim(), code: register.otp.trim() }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setErrorMsg(data?.message || 'OTP tidak valid.', 'red')
        return
      }
      onToast?.('Email berhasil diverifikasi.', { tone: 'amber', icon: 'check-circle', kind: 'otp' })
      setOtpState({ status: 'verified', sending: false, verifying: false })
    } catch {
      setErrorMsg('Tidak dapat terhubung ke backend (cek http://localhost:8080/api/health).', 'red')
    } finally {
      setOtpState((s) => ({ ...s, verifying: false }))
    }
  }

  const submitLogin = async (e) => {
    e.preventDefault()
    setErrorMsg('', 'red')

    if (!login.email.trim() || !login.password) {
      setErrorMsg('Email dan password wajib diisi.', 'red')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: login.email.trim(),
          password: login.password,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setErrorMsg(data?.message || 'Gagal masuk.', 'red')
        return
      }

      const session = {
        token: data?.accessToken || '',
        user: data?.user || null,
      }
      if (!session.token || !session.user) {
        setErrorMsg('Respon login tidak valid.', 'red')
        return
      }

      const role = session.user.role === 'ADMIN' ? 'ADMIN' : 'USER'
      onToast?.(`Berhasil masuk, ${session.user.fullName} (${role})`, { tone: role === 'ADMIN' ? 'amber' : 'green', icon: 'check-circle', kind: 'login' })
      onLoginSuccess?.(session)
      onClose?.()
    } catch {
      setErrorMsg('Tidak dapat terhubung ke backend (cek http://localhost:8080/api/health).', 'red')
    } finally {
      setSubmitting(false)
    }
  }

  const submitRegister = async (e) => {
    e.preventDefault()
    setErrorMsg('', 'red')

    if (!register.name.trim() || !register.email.trim() || !register.password || !register.confirmPassword) {
      setErrorMsg('Nama, email, password, dan konfirmasi password wajib diisi.', 'red')
      return
    }
    if (otpState.status !== 'verified') {
      setErrorMsg('Silakan verifikasi email dengan OTP terlebih dahulu.', 'amber')
      return
    }
    if (register.password !== register.confirmPassword) {
      setErrorMsg('Password dan konfirmasi password tidak sama.', 'red')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: register.name.trim(),
          email: register.email.trim(),
          password: register.password,
          otpCode: register.otp.trim(),
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        const msg = data?.message || 'Gagal daftar.'
        const tone = res.status === 409 || String(msg).toLowerCase().includes('sudah terdaftar') ? 'amber' : 'red'
        setErrorMsg(msg, tone)
        return
      }
      onToast?.('Akun Berhasil Dibuat', { tone: 'amber', icon: 'user-plus', kind: 'register' })
      onModeChange?.('login')
      setLogin({ email: register.email, password: '' })
      setRegister({ name: '', email: '', otp: '', password: '', confirmPassword: '' })
      setOtpState({ status: 'idle', sending: false, verifying: false })
    } catch {
      setErrorMsg('Tidak dapat terhubung ke backend (cek http://localhost:8080/api/health).', 'red')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center px-4 py-8 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="w-full max-w-md md:max-w-2xl glass-strong rounded-3xl border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.6)] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <i data-lucide="shield" className="w-5 h-5 text-black"></i>
            </div>
            <div>
              <p className="font-oswald font-500 text-lg leading-none">
                MyBing<span className="text-amber-400">.ai</span>
              </p>
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

        <div className="px-6 md:px-8 pt-6">
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

        <div className="px-6 md:px-8 pb-7 pt-5">
          {error ? (
            <div
              className={
                'mb-4 rounded-2xl border px-4 py-3 text-xs ' +
                (errorTone === 'amber'
                  ? 'border-amber-500/25 bg-amber-500/10 text-amber-200'
                  : errorTone === 'blue'
                    ? 'border-blue-500/25 bg-blue-500/10 text-blue-200'
                    : 'border-red-500/20 bg-red-500/10 text-red-200')
              }
            >
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
                <div className="relative">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    value={login.password}
                    onChange={(e) => setLogin((s) => ({ ...s, password: e.target.value }))}
                    placeholder="Masukkan password"
                    className="w-full rounded-2xl bg-white/5 border border-white/10 pl-4 pr-12 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl glass hover:bg-white/10 transition-colors flex items-center justify-center"
                    onClick={() => setShowLoginPassword((v) => !v)}
                    aria-label={showLoginPassword ? 'Sembunyikan password' : 'Lihat password'}
                  >
                    <i data-lucide={showLoginPassword ? 'eye-off' : 'eye'} className="w-4 h-4 text-gray-200"></i>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm py-3.5 rounded-2xl transition-all hover:shadow-[0_0_35px_rgba(245,158,11,0.35)]"
              >
                {submitting ? 'Memproses...' : 'Masuk'}
              </button>
            </form>
          ) : (
            <form onSubmit={submitRegister} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    onChange={(e) => {
                      const v = e.target.value
                      setRegister((s) => ({ ...s, email: v, otp: '' }))
                      setOtpState({ status: 'idle', sending: false, verifying: false })
                    }}
                    placeholder="nama@perusahaan.com"
                    className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                    autoComplete="email"
                  />
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={requestOtp}
                      disabled={otpState.sending || otpState.status === 'verified' || !register.email.trim()}
                      className={
                        'text-[11px] font-semibold px-3 py-2 rounded-xl border transition-colors ' +
                        (otpState.status === 'verified'
                          ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                          : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10')
                      }
                    >
                      {otpState.status === 'verified' ? 'Terverifikasi' : otpState.sending ? 'Mengirim...' : 'Verifikasi'}
                    </button>
                    <span className="text-[10px] text-gray-500">OTP akan dikirim ke email ini.</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs text-gray-300 mb-2">Kode OTP</label>
                  <div className="flex items-center gap-2">
                    <input
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      value={register.otp}
                      onChange={(e) => setRegister((s) => ({ ...s, otp: e.target.value.replace(/\\D/g, '').slice(0, 6) }))}
                      placeholder="6 digit"
                      className="flex-1 rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                      autoComplete="one-time-code"
                      disabled={otpState.status === 'idle'}
                    />
                    <button
                      type="button"
                      onClick={verifyOtp}
                      disabled={otpState.verifying || otpState.status !== 'sent' || register.otp.trim().length !== 6}
                      className="text-[11px] font-semibold px-3 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black transition-all disabled:opacity-50 disabled:hover:bg-amber-500"
                    >
                      {otpState.verifying ? 'Cek...' : 'Cek OTP'}
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1.5">Masukkan OTP setelah klik Verifikasi.</p>
                </div>

                <div>
                  <label className="block text-xs text-gray-300 mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showRegisterPassword ? 'text' : 'password'}
                      value={register.password}
                      onChange={(e) => setRegister((s) => ({ ...s, password: e.target.value }))}
                      placeholder="Buat password"
                      className="w-full rounded-2xl bg-white/5 border border-white/10 pl-4 pr-12 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl glass hover:bg-white/10 transition-colors flex items-center justify-center"
                      onClick={() => setShowRegisterPassword((v) => !v)}
                      aria-label={showRegisterPassword ? 'Sembunyikan password' : 'Lihat password'}
                    >
                      <i data-lucide={showRegisterPassword ? 'eye-off' : 'eye'} className="w-4 h-4 text-gray-200"></i>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-300 mb-2">Konfirmasi Password</label>
                  <div className="relative">
                    <input
                      type={showRegisterConfirmPassword ? 'text' : 'password'}
                      value={register.confirmPassword}
                      onChange={(e) => setRegister((s) => ({ ...s, confirmPassword: e.target.value }))}
                      placeholder="Ulangi password"
                      className="w-full rounded-2xl bg-white/5 border border-white/10 pl-4 pr-12 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl glass hover:bg-white/10 transition-colors flex items-center justify-center"
                      onClick={() => setShowRegisterConfirmPassword((v) => !v)}
                      aria-label={showRegisterConfirmPassword ? 'Sembunyikan password' : 'Lihat password'}
                    >
                      <i data-lucide={showRegisterConfirmPassword ? 'eye-off' : 'eye'} className="w-4 h-4 text-gray-200"></i>
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm py-3.5 rounded-2xl transition-all hover:shadow-[0_0_35px_rgba(245,158,11,0.35)]"
              >
                {submitting ? 'Memproses...' : 'Daftar'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
