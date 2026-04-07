import { useEffect, useRef, useState } from 'react'
import AnimasiSection from './components/AnimasiSection.jsx'
import AuthModal from './components/AuthModal.jsx'

const FOOTER_IMAGES = Object.entries(
  import.meta.glob('./image/*.{png,jpg,jpeg,svg,webp,gif}', { eager: true, import: 'default' }),
).map(([path, url]) => ({
  url,
  alt: (path.split('/').pop() || 'image').replace(/\.(png|jpe?g|svg|webp|gif)$/i, ''),
}))

export default function App() {
  const toastTimeoutRef = useRef(null)
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login')

  const initIcons = () => {
    if (window.lucide?.createIcons) window.lucide.createIcons()
  }

  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth' })
  }

  const toggleMobile = () => {
    const menu = document.getElementById('mobileMenu')
    if (!menu) return
    menu.classList.toggle('open')
  }

  const switchTab = (tab) => {
    document.querySelectorAll('.tab-content').forEach((el) => el.classList.add('hidden'))
    document.querySelectorAll('.tab-btn').forEach((btn) => {
      btn.classList.remove('tab-active')
      btn.classList.add('border-white/10', 'text-gray-400')
    })

    const content = document.getElementById('content-' + tab)
    if (content) content.classList.remove('hidden')

    const activeBtn = document.getElementById('tab-' + tab)
    if (activeBtn) {
      activeBtn.classList.add('tab-active')
      activeBtn.classList.remove('border-white/10', 'text-gray-400')
    }

    initIcons()
  }

  const showToast = (msg) => {
    const toast = document.getElementById('toast')
    const msgEl = document.getElementById('toastMsg')
    if (!toast || !msgEl) return

    msgEl.textContent = msg
    toast.classList.add('show')

    if (toastTimeoutRef.current) window.clearTimeout(toastTimeoutRef.current)
    toastTimeoutRef.current = window.setTimeout(() => {
      toast.classList.remove('show')
      toastTimeoutRef.current = null
    }, 3500)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const name = document.getElementById('nameInput')?.value ?? ''
    showToast('Terima kasih, ' + name + '! Tim kami akan menghubungi Anda dalam 24 jam.')
    e.target.reset()

    const select = document.getElementById('solutionSelect')
    if (select) select.style.color = ''
  }

  useEffect(() => {
    initIcons()

    const onScroll = () => {
      const bar = document.getElementById('progressBar')
      if (!bar) return
      const denom = document.documentElement.scrollHeight - window.innerHeight
      const scrolled = denom > 0 ? (window.scrollY / denom) * 100 : 0
      bar.style.width = scrolled + '%'
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' },
    )

    document.querySelectorAll('.scroll-reveal').forEach((el) => revealObserver.observe(el))

    const counterTimers = new Set()
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return

          const el = entry.target
          const target = parseInt(el.dataset.count ?? '0', 10)
          let current = 0
          const increment = target / 60

          const timer = window.setInterval(() => {
            current += increment
            if (current >= target) {
              current = target
              window.clearInterval(timer)
              counterTimers.delete(timer)
            }

            el.textContent = Math.floor(current).toLocaleString('id-ID')
            if (target === 99) el.textContent = Math.floor(current) + '%'
            if (target === 85) el.textContent = Math.floor(current) + '%'
            if (target === 10) el.textContent = Math.floor(current) + 'Jt+'
            if (target === 500) el.textContent = Math.floor(current) + '+'
          }, 25)

          counterTimers.add(timer)
          counterObserver.unobserve(el)
        })
      },
      { threshold: 0.5 },
    )

    document.querySelectorAll('[data-count]').forEach((el) => counterObserver.observe(el))

    const solutionSelect = document.getElementById('solutionSelect')
    const onSelectChange = () => {
      solutionSelect.style.color = '#fff'
    }
    if (solutionSelect) solutionSelect.addEventListener('change', onSelectChange)

    return () => {
      window.removeEventListener('scroll', onScroll)
      revealObserver.disconnect()
      counterObserver.disconnect()

      if (solutionSelect) solutionSelect.removeEventListener('change', onSelectChange)
      counterTimers.forEach((t) => window.clearInterval(t))

      if (toastTimeoutRef.current) window.clearTimeout(toastTimeoutRef.current)
    }
  }, [])

  return (
    <>

<div className="progress-bar" id="progressBar" style={{ width: '0%' }}></div>
<div className="toast glass-strong rounded-xl px-6 py-4 flex items-center gap-3" id="toast">
    <i data-lucide="check-circle" className="w-5 h-5 text-green-400"></i>
    <span className="text-sm font-medium" id="toastMsg">Pesan terkirim!</span>
</div>
<AuthModal
  open={authOpen}
  mode={authMode}
  onModeChange={setAuthMode}
  onClose={() => setAuthOpen(false)}
  onToast={showToast}
/>
<nav className="fixed top-3 sm:top-4 inset-x-0 z-50 animate-blur-in px-4 sm:px-6">
    <div className="mx-auto w-[92%] max-w-[520px] md:w-full md:max-w-6xl glass-strong rounded-full px-4 sm:px-6 py-3 grid grid-cols-[auto_1fr_auto] items-center gap-3 min-w-0">
        <a href="#" className="flex items-center gap-2 min-w-0 justify-self-start">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <i data-lucide="brain" className="w-5 h-5 text-black"></i>
            </div>
            <span className="font-oswald font-500 text-lg sm:text-xl tracking-tight truncate max-w-[60vw] sm:max-w-none">
              Scolis<span className="text-amber-400">.ai</span>
            </span>
        </a>
        <div className="hidden md:flex items-center gap-8 justify-self-center">
            <a href="#solusi" className="text-[13px] font-medium tracking-wide text-gray-300 hover:text-white transition-colors">Solusi</a>
            <a href="#fitur" className="text-[13px] font-medium tracking-wide text-gray-300 hover:text-white transition-colors">Fitur</a>
            <a href="#proses" className="text-[13px] font-medium tracking-wide text-gray-300 hover:text-white transition-colors">Cara Kerja</a>
            <a href="#statistik" className="text-[13px] font-medium tracking-wide text-gray-300 hover:text-white transition-colors">Keunggulan</a>
            <a href="#kontak" className="text-[13px] font-medium tracking-wide text-gray-300 hover:text-white transition-colors">Kontak</a>
        </div>
        <div className="hidden md:flex items-center gap-3 justify-self-end">
            <button
              type="button"
              className="text-[13px] font-medium text-gray-300 hover:text-white px-4 py-2 transition-colors"
              onClick={() => {
                setAuthMode('login')
                setAuthOpen(true)
              }}
            >
              Masuk
            </button>
            <button className="bg-amber-500 hover:bg-amber-400 text-black text-[13px] font-semibold px-5 py-2.5 rounded-full transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]">
                Mulai Gratis
            </button>
        </div>
        <button type="button" className="md:hidden text-white justify-self-end" onClick={toggleMobile} aria-label="Buka menu">
            <i data-lucide="menu" className="w-6 h-6"></i>
        </button>
    </div>
</nav>
<div className="mobile-menu fixed inset-0 z-[60] bg-[#0a0f26]/98 backdrop-blur-xl flex flex-col overflow-y-auto overscroll-contain" id="mobileMenu">
    <div className="flex items-center justify-between px-5 sm:px-6 py-5">
        <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <i data-lucide="brain" className="w-5 h-5 text-black"></i>
            </div>
            <span className="font-oswald font-500 text-lg sm:text-xl">Scolis<span className="text-amber-400">.ai</span></span>
        </div>
        <button type="button" onClick={toggleMobile} className="text-white" aria-label="Tutup menu"><i data-lucide="x" className="w-6 h-6"></i></button>
    </div>
    <div className="flex flex-col items-center flex-1 justify-start gap-6 px-6 pt-6 pb-10 w-full max-w-sm mx-auto">
        <a href="#solusi" onClick={toggleMobile} className="text-xl sm:text-2xl font-oswald font-light tracking-wide text-gray-300 hover:text-amber-400 transition-colors">Solusi</a>
        <a href="#fitur" onClick={toggleMobile} className="text-xl sm:text-2xl font-oswald font-light tracking-wide text-gray-300 hover:text-amber-400 transition-colors">Fitur</a>
        <a href="#proses" onClick={toggleMobile} className="text-xl sm:text-2xl font-oswald font-light tracking-wide text-gray-300 hover:text-amber-400 transition-colors">Cara Kerja</a>
        <a href="#statistik" onClick={toggleMobile} className="text-xl sm:text-2xl font-oswald font-light tracking-wide text-gray-300 hover:text-amber-400 transition-colors">Keunggulan</a>
        <a href="#kontak" onClick={toggleMobile} className="text-xl sm:text-2xl font-oswald font-light tracking-wide text-gray-300 hover:text-amber-400 transition-colors">Kontak</a>
        <div className="flex flex-col items-center gap-3 mt-2 w-full">
            <button
              type="button"
              className="w-full text-gray-300 hover:text-white px-8 py-3 rounded-full text-lg transition-colors"
              onClick={() => {
                toggleMobile()
                setAuthMode('login')
                setAuthOpen(true)
              }}
            >
              Masuk
            </button>
            <button className="w-full bg-amber-500 text-black font-semibold px-8 py-3 rounded-full text-lg">Mulai Gratis</button>
        </div>
    </div>
</div>
<section className="relative min-h-screen flex items-center justify-center pt-20 pb-10 noise-overlay overflow-hidden">
    <div className="absolute inset-0 grid-bg"></div>
    <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[150px] animate-float"></div>
    <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-amber-500/15 rounded-full blur-[120px] animate-float" style={{ animationDelay: '2s' }}></div>
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: '4s' }}></div>
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] hidden lg:block">
        <div className="absolute inset-0" style={{ animation: 'orbit 8s linear infinite' }}>
            <div className="w-2 h-2 rounded-full bg-amber-400/80"></div>
        </div>
        <div className="absolute inset-0" style={{ animation: 'orbit2 12s linear infinite' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400/60"></div>
        </div>
        <div className="absolute inset-0" style={{ animation: 'orbit3 16s linear infinite' }}>
            <div className="w-1 h-1 rounded-full bg-purple-400/50"></div>
        </div>
    </div>
    <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <div className="animate-fade-in-up inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8 mt-10 md:mt-8 lg:mt-10">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-[11px] font-semibold tracking-widest uppercase text-gray-300">Platform AI Terdepan di Indonesia</span>
        </div>
        <h1 className="font-oswald font-light text-5xl md:text-7xl lg:text-[6rem] tracking-tight leading-[1.05] mb-6 animate-fade-in-up delay-200">
            Otomatisasi Bisnis<br />
            <span className="gradient-text font-normal">dengan Kecerdasan</span><br />
            Buatan
        </h1>
        <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up delay-400">
            Tingkatkan efisiensi operasional hingga <span className="text-white font-medium">10x lipat</span> dengan solusi AI yang dirancang khusus untuk dokumen, marketing, dan customer support bisnis Anda.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-500">
            <button onClick={() => scrollToSection('solusi')} className="group bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm px-8 py-4 rounded-full transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(245,158,11,0.4)] flex items-center gap-2">
                Jelajahi Solusi
                <i data-lucide="arrow-right" className="w-4 h-4 group-hover:translate-x-1 transition-transform"></i>
            </button>
            <button onClick={() => scrollToSection('kontak')} className="glass hover:bg-white/10 text-white font-medium text-sm px-8 py-4 rounded-full transition-all flex items-center gap-2">
                <i data-lucide="play-circle" className="w-4 h-4 text-amber-400"></i>
                Lihat Demo
            </button>
        </div>
        <div className="mt-16 animate-fade-in-up delay-700">
            <p className="text-[11px] font-semibold tracking-widest uppercase text-gray-500 mb-6">Dipercaya oleh perusahaan terkemuka</p>
            <div className="flex items-center justify-center gap-8 md:gap-12 flex-wrap opacity-40">
                <span className="font-oswald text-xl font-light tracking-wide">TelkomGroup</span>
                <span className="font-oswald text-xl font-light tracking-wide">BankMandiri</span>
                <span className="font-oswald text-xl font-light tracking-wide">Tokopedia</span>
                <span className="font-oswald text-xl font-light tracking-wide">Bukalapak</span>
                <span className="font-oswald text-xl font-light tracking-wide">Gojek</span>
            </div>
        </div>
    </div>
</section>
<section id="solusi" className="relative py-24 md:py-32">
    <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 scroll-reveal">
            <span className="text-[11px] font-semibold tracking-widest uppercase text-amber-400 mb-4 block">Solusi Kami</span>
            <h2 className="font-oswald font-light text-4xl md:text-5xl tracking-tight mb-4">
                Tiga Pilar <span className="gradient-text">Otomasi AI</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
                Setiap solusi dirancang untuk mengatasi tantangan bisnis spesifik dengan teknologi AI mutakhir.
            </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="solution-card glass rounded-3xl p-8 card-hover scroll-reveal relative z-10" style={{ '--card-color': '#F59E0B', '--card-glow': 'rgba(245,158,11,0.08)' }}>
                <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6">
                        <i data-lucide="file-text" className="w-7 h-7 text-amber-400"></i>
                    </div>
                    <h3 className="font-oswald font-light text-2xl mb-3">Automasi Dokumen</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6">
                        Ekstrak, analisis, dan proses dokumen secara otomatis menggunakan AI. Dari kontrak hingga invoice — semuanya tanpa intervensi manual.
                    </p>
                    <ul className="space-y-3 mb-8">
                        <li className="flex items-center gap-3 text-sm text-gray-300">
                            <i data-lucide="check" className="w-4 h-4 text-amber-400 flex-shrink-0"></i>
                            OCR cerdas dengan akurasi 99.2%
                        </li>
                        <li className="flex items-center gap-3 text-sm text-gray-300">
                            <i data-lucide="check" className="w-4 h-4 text-amber-400 flex-shrink-0"></i>
                            Klasifikasi dokumen otomatis
                        </li>
                        <li className="flex items-center gap-3 text-sm text-gray-300">
                            <i data-lucide="check" className="w-4 h-4 text-amber-400 flex-shrink-0"></i>
                            Ekstraksi data terstruktur
                        </li>
                        <li className="flex items-center gap-3 text-sm text-gray-300">
                            <i data-lucide="check" className="w-4 h-4 text-amber-400 flex-shrink-0"></i>
                            Validasi & verifikasi otomatis
                        </li>
                    </ul>
                    <button onClick={() => scrollToSection('fitur')} className="group flex items-center gap-2 text-amber-400 text-sm font-medium hover:text-amber-300 transition-colors">
                        Pelajari Lebih Lanjut
                        <i data-lucide="arrow-right" className="w-4 h-4 group-hover:translate-x-1 transition-transform"></i>
                    </button>
                </div>
            </div>
            <div className="solution-card glass rounded-3xl p-8 card-hover scroll-reveal relative z-10" style={{ '--card-color': '#3B82F6', '--card-glow': 'rgba(59,130,246,0.08)', animationDelay: '0.15s' }}>
                <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
                        <i data-lucide="megaphone" className="w-7 h-7 text-blue-400"></i>
                    </div>
                    <h3 className="font-oswald font-light text-2xl mb-3">Automasi Marketing</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6">
                        Buat kampanye, konten, dan strategi marketing yang dipersonalisasi secara instan. AI yang memahami audiens Anda.
                    </p>
                    <ul className="space-y-3 mb-8">
                        <li className="flex items-center gap-3 text-sm text-gray-300">
                            <i data-lucide="check" className="w-4 h-4 text-blue-400 flex-shrink-0"></i>
                            Pembuatan konten AI multi-bahasa
                        </li>
                        <li className="flex items-center gap-3 text-sm text-gray-300">
                            <i data-lucide="check" className="w-4 h-4 text-blue-400 flex-shrink-0"></i>
                            Segmentasi audiens otomatis
                        </li>
                        <li className="flex items-center gap-3 text-sm text-gray-300">
                            <i data-lucide="check" className="w-4 h-4 text-blue-400 flex-shrink-0"></i>
                            A/B testing prediktif
                        </li>
                        <li className="flex items-center gap-3 text-sm text-gray-300">
                            <i data-lucide="check" className="w-4 h-4 text-blue-400 flex-shrink-0"></i>
                            Analisis sentimen real-time
                        </li>
                    </ul>
                    <button onClick={() => scrollToSection('fitur')} className="group flex items-center gap-2 text-blue-400 text-sm font-medium hover:text-blue-300 transition-colors">
                        Pelajari Lebih Lanjut
                        <i data-lucide="arrow-right" className="w-4 h-4 group-hover:translate-x-1 transition-transform"></i>
                    </button>
                </div>
            </div>
            <div className="solution-card glass rounded-3xl p-8 card-hover scroll-reveal relative z-10" style={{ '--card-color': '#10B981', '--card-glow': 'rgba(16,185,129,0.08)', animationDelay: '0.3s' }}>
                <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-6">
                        <i data-lucide="headphones" className="w-7 h-7 text-green-400"></i>
                    </div>
                    <h3 className="font-oswald font-light text-2xl mb-3">Automasi Support</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6">
                        Agent AI yang siap melayani 24/7 dengan pemahaman konteks mendalam. Respon cepat, akurat, dan empatik.
                    </p>
                    <ul className="space-y-3 mb-8">
                        <li className="flex items-center gap-3 text-sm text-gray-300">
                            <i data-lucide="check" className="w-4 h-4 text-green-400 flex-shrink-0"></i>
                            Chatbot AI kontekstual 24/7
                        </li>
                        <li className="flex items-center gap-3 text-sm text-gray-300">
                            <i data-lucide="check" className="w-4 h-4 text-green-400 flex-shrink-0"></i>
                            Routing tiket cerdas
                        </li>
                        <li className="flex items-center gap-3 text-sm text-gray-300">
                            <i data-lucide="check" className="w-4 h-4 text-green-400 flex-shrink-0"></i>
                            Analisis keluhan otomatis
                        </li>
                        <li className="flex items-center gap-3 text-sm text-gray-300">
                            <i data-lucide="check" className="w-4 h-4 text-green-400 flex-shrink-0"></i>
                            Self-service knowledge base
                        </li>
                    </ul>
                    <button onClick={() => scrollToSection('fitur')} className="group flex items-center gap-2 text-green-400 text-sm font-medium hover:text-green-300 transition-colors">
                        Pelajari Lebih Lanjut
                        <i data-lucide="arrow-right" className="w-4 h-4 group-hover:translate-x-1 transition-transform"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</section>
<section id="fitur" className="relative py-24 md:py-32">
    <div className="absolute inset-0 grid-bg opacity-50"></div>
    <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="text-center mb-12 scroll-reveal">
            <span className="text-[11px] font-semibold tracking-widest uppercase text-amber-400 mb-4 block">Fitur Detail</span>
            <h2 className="font-oswald font-light text-4xl md:text-5xl tracking-tight mb-4">
                Jelajahi <span className="gradient-text">Setiap Fitur</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
                Klik tab di bawah untuk melihat detail fitur dari masing-masing solusi AI kami.
            </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3 mb-12 scroll-reveal">
            <button onClick={() => switchTab('dokumen')} id="tab-dokumen" className="tab-btn tab-active flex items-center gap-2 px-5 py-2.5 rounded-full border border-transparent text-sm font-medium transition-all">
                <i data-lucide="file-text" className="w-4 h-4"></i> Dokumen
            </button>
            <button onClick={() => switchTab('marketing')} id="tab-marketing" className="tab-btn flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 text-gray-400 text-sm font-medium transition-all hover:text-white hover:bg-white/5">
                <i data-lucide="megaphone" className="w-4 h-4"></i> Marketing
            </button>
            <button onClick={() => switchTab('support')} id="tab-support" className="tab-btn flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 text-gray-400 text-sm font-medium transition-all hover:text-white hover:bg-white/5">
                <i data-lucide="headphones" className="w-4 h-4"></i> Support
            </button>
        </div>
        <div className="relative">
            <div id="content-dokumen" className="tab-content">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                    <div>
                        <h3 className="font-oswald font-light text-3xl mb-6 gradient-text">Automasi Dokumen Cerdas</h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-8">
                            Proses ribuan dokumen dalam hitungan menit. Sistem kami menggunakan kombinasi Computer Vision, NLP, dan Machine Learning untuk memahami, mengekstrak, dan mengorganisir data dari berbagai format dokumen.
                        </p>
                        <div className="space-y-5">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <i data-lucide="scan-eye" className="w-5 h-5 text-amber-400"></i>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold mb-1">Smart OCR</h4>
                                    <p className="text-gray-400 text-xs leading-relaxed">Membaca teks dari gambar, PDF, dan dokumen scan dengan akurasi tinggi, termasuk tulisan tangan.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <i data-lucide="tags" className="w-5 h-5 text-amber-400"></i>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold mb-1">Auto-Classification</h4>
                                    <p className="text-gray-400 text-xs leading-relaxed">Klasifikasi otomatis berdasarkan jenis: invoice, kontrak, KTP, NPWP, dan ratusan tipe lainnya.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <i data-lucide="database" className="w-5 h-5 text-amber-400"></i>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold mb-1">Data Extraction</h4>
                                    <p className="text-gray-400 text-xs leading-relaxed">Ekstraksi data ke format terstruktur (JSON, CSV, Excel) siap integrasi ke ERP/CRM Anda.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <i data-lucide="shield-check" className="w-5 h-5 text-amber-400"></i>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold mb-1">Validasi & Compliance</h4>
                                    <p className="text-gray-400 text-xs leading-relaxed">Verifikasi otomatis terhadap aturan bisnis dan regulasi. Deteksi anomali dan fraud secara real-time.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="glass rounded-3xl p-6 relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500/50 via-amber-400 to-amber-500/50"></div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold tracking-wider uppercase text-amber-400">Document Processing</span>
                                    <span className="text-[10px] text-green-400 flex items-center gap-1"><i data-lucide="circle-check" className="w-3 h-3"></i> Active</span>
                                </div>
                                <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                                            <i data-lucide="file-text" className="w-4 h-4 text-amber-400"></i>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium">Invoice_2024_0847.pdf</p>
                                            <p className="text-[10px] text-gray-500">2.4 MB • Uploaded 3s ago</p>
                                        </div>
                                        <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">Processed</span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[11px]"><span className="text-gray-500">Nomor Invoice</span><span className="text-white font-medium">INV-2024-0847</span></div>
                                        <div className="flex justify-between text-[11px]"><span className="text-gray-500">Tanggal</span><span className="text-white font-medium">15 Jan 2025</span></div>
                                        <div className="flex justify-between text-[11px]"><span className="text-gray-500">Vendor</span><span className="text-white font-medium">PT Global Teknologi</span></div>
                                        <div className="flex justify-between text-[11px]"><span className="text-gray-500">Total</span><span className="text-amber-400 font-semibold">Rp 45.750.000</span></div>
                                    </div>
                                </div>
                                <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                            <i data-lucide="file-scan" className="w-4 h-4 text-blue-400"></i>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium">Contract_Agreement.pdf</p>
                                            <p className="text-[10px] text-gray-500">8.1 MB • Processing...</p>
                                        </div>
                                        <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">Scanning</span>
                                    </div>
                                    <div className="w-full bg-white/5 rounded-full h-1.5">
                                        <div className="bg-gradient-to-r from-amber-500 to-amber-400 h-1.5 rounded-full" style={{ width: '72%', transition: 'width 1s' }}></div>
                                    </div>
                                    <p className="text-[10px] text-gray-500 mt-2">72% — Ekstraksi klausul berlangsung...</p>
                                </div>
                                <div className="flex items-center justify-between text-[10px] text-gray-500 pt-2">
                                    <span>Diproses hari ini: <span className="text-white font-medium">1,247 dokumen</span></span>
                                    <span>Akurasi: <span className="text-green-400 font-medium">99.2%</span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="content-marketing" className="tab-content hidden">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                    <div>
                        <h3 className="font-oswald font-light text-3xl mb-6 gradient-text-blue">Automasi Marketing Pintar</h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-8">
                            Hasilkan konten berkualitas tinggi, analisis tren pasar, dan optimalkan kampanye secara otomatis. AI marketing yang benar-benar memahami target audiens Anda.
                        </p>
                        <div className="space-y-5">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <i data-lucide="pen-tool" className="w-5 h-5 text-blue-400"></i>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold mb-1">AI Content Generator</h4>
                                    <p className="text-gray-400 text-xs leading-relaxed">Buat copy iklan, artikel blog, email, dan social media post dalam hitungan detik dengan tone yang konsisten.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <i data-lucide="users" className="w-5 h-5 text-blue-400"></i>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold mb-1">Smart Segmentation</h4>
                                    <p className="text-gray-400 text-xs leading-relaxed">Segmentasi audiens otomatis berdasarkan perilaku, preferensi, dan data demografis menggunakan ML clustering.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <i data-lucide="bar-chart-3" className="w-5 h-5 text-blue-400"></i>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold mb-1">Predictive Analytics</h4>
                                    <p className="text-gray-400 text-xs leading-relaxed">Prediksi performa kampanye sebelum diluncurkan. Optimasi budget dan channel secara data-driven.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <i data-lucide="message-square-heart" className="w-5 h-5 text-blue-400"></i>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold mb-1">Sentiment Analysis</h4>
                                    <p className="text-gray-400 text-xs leading-relaxed">Pantau sentimen brand di media sosial dan review platform secara real-time dengan NLP berbahasa Indonesia.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="glass rounded-3xl p-6 relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/50 via-blue-400 to-blue-500/50"></div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold tracking-wider uppercase text-blue-400">Campaign Dashboard</span>
                                    <span className="text-[10px] text-green-400 flex items-center gap-1"><i data-lucide="trending-up" className="w-3 h-3"></i> +47%</span>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                                        <p className="text-lg font-semibold text-white">2.4M</p>
                                        <p className="text-[10px] text-gray-500">Impressions</p>
                                    </div>
                                    <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                                        <p className="text-lg font-semibold text-blue-400">8.7%</p>
                                        <p className="text-[10px] text-gray-500">CTR</p>
                                    </div>
                                    <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                                        <p className="text-lg font-semibold text-green-400">3.2x</p>
                                        <p className="text-[10px] text-gray-500">ROAS</p>
                                    </div>
                                </div>
                                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <i data-lucide="sparkles" className="w-4 h-4 text-blue-400"></i>
                                        <span className="text-[10px] font-semibold tracking-wider uppercase text-blue-400">AI Generated Copy</span>
                                    </div>
                                    <p className="text-xs text-gray-300 leading-relaxed italic">"Transformasi digital bisnis Anda dimulai di sini. Solusi AI Scolis.ai membantu 500+ perusahaan meningkatkan efisiensi hingga 10x lipat. Gabung sekarang!"</p>
                                    <div className="flex items-center gap-2 mt-3">
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">LinkedIn</span>
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">Instagram</span>
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">Email</span>
                                    </div>
                                </div>
                                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                    <span className="text-[10px] font-semibold tracking-wider uppercase text-gray-400 mb-3 block">Sentimen Brand Hari Ini</span>
                                    <div className="flex gap-2 h-3 rounded-full overflow-hidden">
                                        <div className="bg-green-500 rounded-l-full" style={{ width: '68%' }}></div>
                                        <div className="bg-yellow-500" style={{ width: '22%' }}></div>
                                        <div className="bg-red-500 rounded-r-full" style={{ width: '10%' }}></div>
                                    </div>
                                    <div className="flex justify-between text-[10px] text-gray-500 mt-2">
                                        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>Positif 68%</span>
                                        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>Netral 22%</span>
                                        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>Negatif 10%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="content-support" className="tab-content hidden">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                    <div>
                        <h3 className="font-oswald font-light text-3xl mb-6 gradient-text-green">Automasi Support Cerdas</h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-8">
                            Agent AI yang memahami konteks percakapan, emosi pelanggan, dan memberikan solusi tepat. Mengurangi beban tim support secara drastis.
                        </p>
                        <div className="space-y-5">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <i data-lucide="bot" className="w-5 h-5 text-green-400"></i>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold mb-1">Conversational AI</h4>
                                    <p className="text-gray-400 text-xs leading-relaxed">Chatbot dengan memori konteks panjang yang memahami nuansa bahasa Indonesia dan mampu menangani multi-turn conversation.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <i data-lucide="git-branch" className="w-5 h-5 text-green-400"></i>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold mb-1">Smart Routing</h4>
                                    <p className="text-gray-400 text-xs leading-relaxed">Routing tiket otomatis ke agen yang tepat berdasarkan topik, urgensi, dan keahlian agent.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <i data-lucide="brain" className="w-5 h-5 text-green-400"></i>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold mb-1">Emotion Detection</h4>
                                    <p className="text-gray-400 text-xs leading-relaxed">Deteksi emosi pelanggan secara real-time. Eskalasi otomatis saat terdeteksi frustrasi atau kemarahan.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <i data-lucide="book-open" className="w-5 h-5 text-green-400"></i>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold mb-1">Auto Knowledge Base</h4>
                                    <p className="text-gray-400 text-xs leading-relaxed">Otomatis buat dan update knowledge base dari percakapan. Self-service portal yang terus belajar dan berkembang.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="glass rounded-3xl p-6 relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500/50 via-green-400 to-green-500/50"></div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold tracking-wider uppercase text-green-400">Live Support</span>
                                    <span className="text-[10px] text-green-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span> Online</span>
                                </div>
                                <div className="bg-white/5 rounded-2xl p-4 border border-white/5 space-y-3 max-h-[320px] overflow-y-auto">
                                    <div className="flex justify-end">
                                        <div className="bg-green-500/10 border border-green-500/20 rounded-2xl rounded-tr-md px-4 py-2.5 max-w-[80%]">
                                            <p className="text-xs text-gray-200">Saya sudah transfer tapi status pesanan masih pending, tolong cek</p>
                                            <p className="text-[10px] text-gray-500 mt-1 text-right">14:32</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 items-end">
                                        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                            <i data-lucide="bot" className="w-3 h-3 text-green-400"></i>
                                        </div>
                                        <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-md px-4 py-2.5">
                                            <p className="text-xs text-gray-200">Baik, saya akan cek pembayaran Anda. Mohon tunggu sebentar... 🔄</p>
                                            <p className="text-[10px] text-gray-500 mt-1">14:32</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 items-end">
                                        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                            <i data-lucide="bot" className="w-3 h-3 text-green-400"></i>
                                        </div>
                                        <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-md px-4 py-2.5 max-w-[80%]">
                                            <p className="text-xs text-gray-200">Saya sudah menemukan transfer Anda sebesar <span className="text-green-400 font-medium">Rp 2.450.000</span> via BCA. Status sudah saya update menjadi ✅ <span className="text-green-400 font-medium">Diproses</span>. Estimasi pengiriman 1-2 hari kerja.</p>
                                            <p className="text-[10px] text-gray-500 mt-1">14:33 • Resolved by AI</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <div className="bg-green-500/10 border border-green-500/20 rounded-2xl rounded-tr-md px-4 py-2.5 max-w-[80%]">
                                            <p className="text-xs text-gray-200">Wah cepat banget, terima kasih! 👍</p>
                                            <p className="text-[10px] text-gray-500 mt-1 text-right">14:33</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-[10px] text-gray-500">
                                    <span>Direspons dalam: <span className="text-green-400 font-medium">1.2 detik</span></span>
                                    <span>Resolusi: <span className="text-green-400 font-medium">94.7%</span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
<AnimasiSection />
<section id="proses" className="relative py-24 md:py-32 overflow-hidden">
    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[150px]"></div>
    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[120px]"></div>
    <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 scroll-reveal">
            <span className="text-[11px] font-semibold tracking-widest uppercase text-amber-400 mb-4 block">Cara Kerja</span>
            <h2 className="font-oswald font-light text-4xl md:text-5xl tracking-tight mb-4">
                Empat Langkah <span className="gradient-text">Mudah</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
                Integrasi solusi AI ke bisnis Anda tidak pernah semudah ini.
            </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="scroll-reveal relative glass rounded-3xl p-6 card-hover text-center group">
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-amber-500 text-black text-xs font-bold flex items-center justify-center">01</div>
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                    <i data-lucide="message-circle" className="w-7 h-7 text-amber-400"></i>
                </div>
                <h4 className="font-oswald font-light text-lg mb-2">Konsultasi</h4>
                <p className="text-gray-400 text-xs leading-relaxed">Diskusi kebutuhan bisnis Anda dan identifikasi area yang bisa diotomasi.</p>
            </div>
            <div className="scroll-reveal relative glass rounded-3xl p-6 card-hover text-center group" style={{ transitionDelay: '0.1s' }}>
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-amber-500 text-black text-xs font-bold flex items-center justify-center">02</div>
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                    <i data-lucide="settings" className="w-7 h-7 text-amber-400"></i>
                </div>
                <h4 className="font-oswald font-light text-lg mb-2">Konfigurasi</h4>
                <p className="text-gray-400 text-xs leading-relaxed">Setup dan kustomisasi solusi AI sesuai workflow dan sistem yang sudah ada.</p>
            </div>
            <div className="scroll-reveal relative glass rounded-3xl p-6 card-hover text-center group" style={{ transitionDelay: '0.2s' }}>
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-amber-500 text-black text-xs font-bold flex items-center justify-center">03</div>
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                    <i data-lucide="rocket" className="w-7 h-7 text-amber-400"></i>
                </div>
                <h4 className="font-oswald font-light text-lg mb-2">Peluncuran</h4>
                <p className="text-gray-400 text-xs leading-relaxed">Go-live dengan dukungan penuh dari tim kami. Training tim Anda termasuk.</p>
            </div>
            <div className="scroll-reveal relative glass rounded-3xl p-6 card-hover text-center group" style={{ transitionDelay: '0.3s' }}>
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-amber-500 text-black text-xs font-bold flex items-center justify-center">04</div>
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                    <i data-lucide="trending-up" className="w-7 h-7 text-amber-400"></i>
                </div>
                <h4 className="font-oswald font-light text-lg mb-2">Optimasi</h4>
                <p className="text-gray-400 text-xs leading-relaxed">Monitoring performa dan continuous improvement berbasis data AI.</p>
            </div>
        </div>
    </div>
</section>
<section id="statistik" className="relative py-24 md:py-32">
    <div className="absolute inset-0 grid-bg opacity-30"></div>
    <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 scroll-reveal">
            <span className="text-[11px] font-semibold tracking-widest uppercase text-amber-400 mb-4 block">Keunggulan</span>
            <h2 className="font-oswald font-light text-4xl md:text-5xl tracking-tight mb-4">
                Angka yang <span className="gradient-text">Berbicara</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
                Hasil nyata yang telah dirasakan oleh ratusan perusahaan yang menggunakan Scolis.ai.
            </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="scroll-reveal glass rounded-3xl p-6 text-center card-hover">
                <p className="stat-number font-oswald text-4xl md:text-5xl font-light mb-2" data-count="500">0</p>
                <p className="text-[11px] font-semibold tracking-widest uppercase text-amber-400 mb-1">Perusahaan</p>
                <p className="text-gray-500 text-xs">Aktif menggunakan Scolis.ai</p>
            </div>
            <div className="scroll-reveal glass rounded-3xl p-6 text-center card-hover" style={{ transitionDelay: '0.1s' }}>
                <p className="stat-number font-oswald text-4xl md:text-5xl font-light mb-2" data-count="10">0</p>
                <p className="text-[11px] font-semibold tracking-widest uppercase text-amber-400 mb-1">Juta Dokumen</p>
                <p className="text-gray-500 text-xs">Diproses per bulan</p>
            </div>
            <div className="scroll-reveal glass rounded-3xl p-6 text-center card-hover" style={{ transitionDelay: '0.2s' }}>
                <p className="stat-number font-oswald text-4xl md:text-5xl font-light mb-2" data-count="99">0</p>
                <p className="text-[11px] font-semibold tracking-widest uppercase text-amber-400 mb-1">Persen</p>
                <p className="text-gray-500 text-xs">Akurasi rata-rata</p>
            </div>
            <div className="scroll-reveal glass rounded-3xl p-6 text-center card-hover" style={{ transitionDelay: '0.3s' }}>
                <p className="stat-number font-oswald text-4xl md:text-5xl font-light mb-2" data-count="85">0</p>
                <p className="text-[11px] font-semibold tracking-widest uppercase text-amber-400 mb-1">Persen</p>
                <p className="text-gray-500 text-xs">Pengurangan biaya ops</p>
            </div>
        </div>
        <div className="scroll-reveal glass rounded-3xl p-6 md:p-8 overflow-x-auto">
            <h3 className="font-oswald font-light text-xl mb-6 text-center">Perbandingan: Sebelum vs Sesudah Scolis.ai</h3>
            <table className="w-full min-w-[500px]">
                <thead>
                    <tr className="border-b border-white/10">
                        <th className="text-left text-xs font-semibold tracking-wider uppercase text-gray-400 pb-4 pr-4">Metrik</th>
                        <th className="text-center text-xs font-semibold tracking-wider uppercase text-red-400 pb-4 px-4">Tanpa AI</th>
                        <th className="text-center text-xs font-semibold tracking-wider uppercase text-green-400 pb-4 pl-4">Dengan Scolis.ai</th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    <tr className="border-b border-white/5">
                        <td className="py-4 pr-4 text-gray-300">Proses dokumen</td>
                        <td className="py-4 px-4 text-center text-red-400">15-30 menit</td>
                        <td className="py-4 pl-4 text-center text-green-400 font-medium">&lt; 10 detik</td>
                    </tr>
                    <tr className="border-b border-white/5">
                        <td className="py-4 pr-4 text-gray-300">Pembuatan konten marketing</td>
                        <td className="py-4 px-4 text-center text-red-400">2-4 jam</td>
                        <td className="py-4 pl-4 text-center text-green-400 font-medium">&lt; 2 menit</td>
                    </tr>
                    <tr className="border-b border-white/5">
                        <td className="py-4 pr-4 text-gray-300">Respon customer support</td>
                        <td className="py-4 px-4 text-center text-red-400">2-24 jam</td>
                        <td className="py-4 pl-4 text-center text-green-400 font-medium">&lt; 3 detik</td>
                    </tr>
                    <tr className="border-b border-white/5">
                        <td className="py-4 pr-4 text-gray-300">Error rate</td>
                        <td className="py-4 px-4 text-center text-red-400">5-12%</td>
                        <td className="py-4 pl-4 text-center text-green-400 font-medium">&lt; 0.8%</td>
                    </tr>
                    <tr>
                        <td className="py-4 pr-4 text-gray-300">Biaya operasional</td>
                        <td className="py-4 px-4 text-center text-red-400">100%</td>
                        <td className="py-4 pl-4 text-center text-green-400 font-medium">15-30%</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</section>
<section className="relative py-24 md:py-32">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[150px]"></div>
    <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 scroll-reveal">
            <span className="text-[11px] font-semibold tracking-widest uppercase text-amber-400 mb-4 block">Testimoni</span>
            <h2 className="font-oswald font-light text-4xl md:text-5xl tracking-tight mb-4">
                Apa Kata <span className="gradient-text">Mereka</span>
            </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="scroll-reveal glass rounded-3xl p-6 card-hover">
                <div className="flex items-center gap-1 mb-4">
                    <i data-lucide="star" className="w-4 h-4 text-amber-400 fill-amber-400"></i>
                    <i data-lucide="star" className="w-4 h-4 text-amber-400 fill-amber-400"></i>
                    <i data-lucide="star" className="w-4 h-4 text-amber-400 fill-amber-400"></i>
                    <i data-lucide="star" className="w-4 h-4 text-amber-400 fill-amber-400"></i>
                    <i data-lucide="star" className="w-4 h-4 text-amber-400 fill-amber-400"></i>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed mb-6">
                    "Automasi dokumen Scolis.ai mengubah operasional kami total. Proses KYC yang biasa 3 hari sekarang selesai dalam 15 menit. ROI tercapai dalam 2 bulan pertama."
                </p>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-black font-bold text-sm">AS</div>
                    <div>
                        <p className="text-sm font-medium">Andi Susanto</p>
                        <p className="text-[11px] text-gray-500">CTO, Bank Digital Nusantara</p>
                    </div>
                </div>
            </div>
            <div className="scroll-reveal glass rounded-3xl p-6 card-hover" style={{ transitionDelay: '0.1s' }}>
                <div className="flex items-center gap-1 mb-4">
                    <i data-lucide="star" className="w-4 h-4 text-amber-400 fill-amber-400"></i>
                    <i data-lucide="star" className="w-4 h-4 text-amber-400 fill-amber-400"></i>
                    <i data-lucide="star" className="w-4 h-4 text-amber-400 fill-amber-400"></i>
                    <i data-lucide="star" className="w-4 h-4 text-amber-400 fill-amber-400"></i>
                    <i data-lucide="star" className="w-4 h-4 text-amber-400 fill-amber-400"></i>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed mb-6">
                    "Tim marketing kami sekarang 5x lebih produktif. AI content generator Scolis.ai menghasilkan copy yang konsisten dan convert rate naik 47%. Game changer!"
                </p>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">RP</div>
                    <div>
                        <p className="text-sm font-medium">Rina Pratiwi</p>
                        <p className="text-[11px] text-gray-500">VP Marketing, E-Commerce Maju</p>
                    </div>
                </div>
            </div>
            <div className="scroll-reveal glass rounded-3xl p-6 card-hover" style={{ transitionDelay: '0.2s' }}>
                <div className="flex items-center gap-1 mb-4">
                    <i data-lucide="star" className="w-4 h-4 text-amber-400 fill-amber-400"></i>
                    <i data-lucide="star" className="w-4 h-4 text-amber-400 fill-amber-400"></i>
                    <i data-lucide="star" className="w-4 h-4 text-amber-400 fill-amber-400"></i>
                    <i data-lucide="star" className="w-4 h-4 text-amber-400 fill-amber-400"></i>
                    <i data-lucide="star" className="w-4 h-4 text-amber-400 fill-amber-400"></i>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed mb-6">
                    "CSAT kami naik dari 72% ke 96% setelah implementasi AI support. Yang paling impresif, 94% tiket terselesaikan tanpa eskalasi ke agent manusia."
                </p>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-black font-bold text-sm">BH</div>
                    <div>
                        <p className="text-sm font-medium">Budi Hartono</p>
                        <p className="text-[11px] text-gray-500">Head of CX, Telekom Provider</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
<section className="relative py-24 md:py-32">
    <div className="absolute inset-0 grid-bg opacity-30"></div>
    <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="text-center mb-16 scroll-reveal">
            <span className="text-[11px] font-semibold tracking-widest uppercase text-amber-400 mb-4 block">Harga</span>
            <h2 className="font-oswald font-light text-4xl md:text-5xl tracking-tight mb-4">
                Paket untuk <span className="gradient-text">Setiap Skala</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
                Mulai gratis, upgrade kapan saja sesuai kebutuhan.
            </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="scroll-reveal glass rounded-3xl p-8 card-hover flex flex-col">
                <span className="text-[11px] font-semibold tracking-widest uppercase text-gray-400 mb-2">Starter</span>
                <div className="mb-6">
                    <span className="font-oswald text-4xl font-light">Gratis</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                    <li className="flex items-center gap-2 text-sm text-gray-300"><i data-lucide="check" className="w-4 h-4 text-gray-500"></i>100 dokumen/bulan</li>
                    <li className="flex items-center gap-2 text-sm text-gray-300"><i data-lucide="check" className="w-4 h-4 text-gray-500"></i>10 konten AI/bulan</li>
                    <li className="flex items-center gap-2 text-sm text-gray-300"><i data-lucide="check" className="w-4 h-4 text-gray-500"></i>500 chat AI/bulan</li>
                    <li className="flex items-center gap-2 text-sm text-gray-500"><i data-lucide="x" className="w-4 h-4 text-gray-600"></i>API Access</li>
                    <li className="flex items-center gap-2 text-sm text-gray-500"><i data-lucide="x" className="w-4 h-4 text-gray-600"></i>Custom Model</li>
                </ul>
                <button className="w-full glass hover:bg-white/10 text-white font-medium text-sm py-3 rounded-full transition-all">
                    Mulai Gratis
                </button>
            </div>
            <div className="scroll-reveal relative glass rounded-3xl p-8 card-hover flex flex-col border-amber-500/30" style={{ transitionDelay: '0.1s' }}>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-amber-500 text-black text-[10px] font-bold tracking-wider uppercase">
                    Populer
                </div>
                <span className="text-[11px] font-semibold tracking-widest uppercase text-amber-400 mb-2">Professional</span>
                <div className="mb-6">
                    <span className="font-oswald text-4xl font-light">Rp 2.9jt</span>
                    <span className="text-gray-500 text-sm">/bulan</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                    <li className="flex items-center gap-2 text-sm text-gray-300"><i data-lucide="check" className="w-4 h-4 text-amber-400"></i>10,000 dokumen/bulan</li>
                    <li className="flex items-center gap-2 text-sm text-gray-300"><i data-lucide="check" className="w-4 h-4 text-amber-400"></i>Unlimited konten AI</li>
                    <li className="flex items-center gap-2 text-sm text-gray-300"><i data-lucide="check" className="w-4 h-4 text-amber-400"></i>Unlimited chat AI</li>
                    <li className="flex items-center gap-2 text-sm text-gray-300"><i data-lucide="check" className="w-4 h-4 text-amber-400"></i>API Access</li>
                    <li className="flex items-center gap-2 text-sm text-gray-500"><i data-lucide="x" className="w-4 h-4 text-gray-600"></i>Custom Model</li>
                </ul>
                <button className="w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm py-3 rounded-full transition-all hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]">
                    Pilih Pro
                </button>
            </div>
            <div className="scroll-reveal glass rounded-3xl p-8 card-hover flex flex-col" style={{ transitionDelay: '0.2s' }}>
                <span className="text-[11px] font-semibold tracking-widest uppercase text-gray-400 mb-2">Enterprise</span>
                <div className="mb-6">
                    <span className="font-oswald text-4xl font-light">Custom</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                    <li className="flex items-center gap-2 text-sm text-gray-300"><i data-lucide="check" className="w-4 h-4 text-green-400"></i>Unlimited semua fitur</li>
                    <li className="flex items-center gap-2 text-sm text-gray-300"><i data-lucide="check" className="w-4 h-4 text-green-400"></i>Custom AI Model</li>
                    <li className="flex items-center gap-2 text-sm text-gray-300"><i data-lucide="check" className="w-4 h-4 text-green-400"></i>On-premise deployment</li>
                    <li className="flex items-center gap-2 text-sm text-gray-300"><i data-lucide="check" className="w-4 h-4 text-green-400"></i>Dedicated support 24/7</li>
                    <li className="flex items-center gap-2 text-sm text-gray-300"><i data-lucide="check" className="w-4 h-4 text-green-400"></i>SLA 99.99%</li>
                </ul>
                <button className="w-full glass hover:bg-white/10 text-white font-medium text-sm py-3 rounded-full transition-all">
                    Hubungi Sales
                </button>
            </div>
        </div>
    </div>
</section>
<section id="kontak" className="relative py-24 md:py-32">
    <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/15 rounded-full blur-[200px]"></div>
    </div>
    <div className="relative z-10 max-w-4xl mx-auto px-6">
        <div className="glass-strong rounded-3xl p-8 md:p-12 text-center scroll-reveal">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
                <i data-lucide="zap" className="w-8 h-8 text-amber-400"></i>
            </div>
            <h2 className="font-oswald font-light text-3xl md:text-5xl tracking-tight mb-4">
                Siap Transformasi <span className="gradient-text">dengan AI?</span>
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto text-sm leading-relaxed mb-10">
                Jadwalkan demo gratis dan lihat langsung bagaimana Scolis.ai dapat mengubah operasional bisnis Anda.
            </p>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <input type="text" id="nameInput" placeholder="Nama Anda" required
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:bg-white/10 transition-all" />
                    <input type="email" id="emailInput" placeholder="Email kerja" required
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:bg-white/10 transition-all" />
                </div>
                <select id="solutionSelect" defaultValue=""
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-400 focus:outline-none focus:border-amber-500/50 focus:bg-white/10 transition-all appearance-none cursor-pointer">
                    <option value="" disabled>Pilih solusi yang diminati</option>
                    <option value="dokumen">Automasi Dokumen</option>
                    <option value="marketing">Automasi Marketing</option>
                    <option value="support">Automasi Support</option>
                    <option value="semua">Semua Solusi</option>
                </select>
                <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm py-3.5 rounded-xl transition-all hover:shadow-[0_0_40px_rgba(245,158,11,0.4)] hover:scale-[1.02] flex items-center justify-center gap-2">
                    <i data-lucide="calendar" className="w-4 h-4"></i>
                    Jadwalkan Demo Gratis
                </button>
            </form>
            <p className="text-[11px] text-gray-500 mt-4">Gratis • Tanpa komitmen • Respon dalam 24 jam</p>
        </div>
    </div>
</section>
<footer className="relative border-t border-white/5 pt-16 pb-8">
    <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                        <i data-lucide="brain" className="w-5 h-5 text-black"></i>
                    </div>
                    <span className="font-oswald font-500 text-xl">Scolis<span className="text-amber-400">.ai</span></span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed mb-4">
                    Platform solusi kecerdasan buatan terdepan untuk transformasi digital bisnis Indonesia.
                </p>
                {FOOTER_IMAGES.length ? (
                    <div className="flex flex-wrap items-center gap-4 mb-5">
                        {FOOTER_IMAGES.map((img) => (
                            <img
                                key={img.url}
                                src={img.url}
                                alt={img.alt}
                                className="h-7 w-auto object-contain opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all"
                                loading="lazy"
                                decoding="async"
                            />
                        ))}
                    </div>
                ) : null}
            </div>
            <div>
                <h5 className="text-xs font-semibold tracking-wider uppercase text-gray-300 mb-4">Solusi</h5>
                <ul className="space-y-2.5">
                    <li><a href="#solusi" className="text-xs text-gray-500 hover:text-amber-400 transition-colors">Automasi Dokumen</a></li>
                    <li><a href="#solusi" className="text-xs text-gray-500 hover:text-amber-400 transition-colors">Automasi Marketing</a></li>
                    <li><a href="#solusi" className="text-xs text-gray-500 hover:text-amber-400 transition-colors">Automasi Support</a></li>
                    <li><a href="#" className="text-xs text-gray-500 hover:text-amber-400 transition-colors">API Documentation</a></li>
                </ul>
            </div>
            <div>
                <h5 className="text-xs font-semibold tracking-wider uppercase text-gray-300 mb-4">Perusahaan</h5>
                <ul className="space-y-2.5">
                    <li><a href="#" className="text-xs text-gray-500 hover:text-amber-400 transition-colors">Tentang Kami</a></li>
                    <li><a href="#" className="text-xs text-gray-500 hover:text-amber-400 transition-colors">Karir</a></li>
                    <li><a href="#" className="text-xs text-gray-500 hover:text-amber-400 transition-colors">Blog</a></li>
                    <li><a href="#kontak" className="text-xs text-gray-500 hover:text-amber-400 transition-colors">Kontak</a></li>
                </ul>
            </div>
            <div>
                <h5 className="text-xs font-semibold tracking-wider uppercase text-gray-300 mb-4">Legal</h5>
                <ul className="space-y-2.5">
                    <li><a href="#" className="text-xs text-gray-500 hover:text-amber-400 transition-colors">Privacy Policy</a></li>
                    <li><a href="#" className="text-xs text-gray-500 hover:text-amber-400 transition-colors">Terms of Service</a></li>
                    <li><a href="#" className="text-xs text-gray-500 hover:text-amber-400 transition-colors">Keamanan Data</a></li>
                    <li><a href="#" className="text-xs text-gray-500 hover:text-amber-400 transition-colors">SLA</a></li>
                </ul>
            </div>
        </div>
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[11px] text-gray-600">© 2025 Scolis.ai. All rights reserved.</p>
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                <span className="text-[11px] text-gray-500">Semua sistem operasional</span>
            </div>
        </div>
    </div>
</footer>
    </>
  )
}
