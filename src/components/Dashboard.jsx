import { useEffect, useMemo, useRef, useState } from 'react'
import Workflow, { INITIAL_WORKFLOWS, WORKFLOWS_STORAGE_KEY } from './Workflow.jsx'
import WorkflowDokumen from './WorkflowDokumen.jsx'
import { getDokumenFlowPreset } from './dokumenFlowPresets.js'
import { getMarketingFlowPreset } from './marketingFlowPresets.js'
import { getSupportFlowPreset } from './supportFlowPresets.js'

const DAYS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']
const CHART_DATA = {
  all: { doc: [1200, 1350, 1180, 1420, 1580, 890, 1100], mkt: [820, 950, 880, 1020, 1150, 620, 780], sup: [2400, 2650, 2300, 2800, 3100, 1800, 2200] },
  doc: { doc: [1200, 1350, 1180, 1420, 1580, 890, 1100], mkt: [0, 0, 0, 0, 0, 0, 0], sup: [0, 0, 0, 0, 0, 0, 0] },
  mkt: { doc: [0, 0, 0, 0, 0, 0, 0], mkt: [820, 950, 880, 1020, 1150, 620, 780], sup: [0, 0, 0, 0, 0, 0, 0] },
  sup: { doc: [0, 0, 0, 0, 0, 0, 0], mkt: [0, 0, 0, 0, 0, 0, 0], sup: [2400, 2650, 2300, 2800, 3100, 1800, 2200] },
}

const WORKFLOWS = [
  { name: 'Invoice Processing', type: 'doc', status: 'running', ops: '1,247', uptime: '99.8%' },
  { name: 'Social Media Campaign', type: 'mkt', status: 'running', ops: '834', uptime: '99.5%' },
  { name: 'Customer Chat Agent', type: 'sup', status: 'running', ops: '3,891', uptime: '99.9%' },
  { name: 'Contract Analysis', type: 'doc', status: 'running', ops: '562', uptime: '98.7%' },
  { name: 'Email Sequence', type: 'mkt', status: 'paused', ops: '—', uptime: '—' },
  { name: 'Ticket Router', type: 'sup', status: 'running', ops: '2,104', uptime: '99.6%' },
]

const ACTIVITIES = [
  { icon: 'file-check', color: 'amber', text: 'Invoice INV-0847 berhasil diproses', time: '2m lalu' },
  { icon: 'send', color: 'blue', text: 'Kampanye "Flash Sale" diluncurkan', time: '8m lalu' },
  { icon: 'message-circle', color: 'green', text: 'AI Agent resolve tiket #4521', time: '12m lalu' },
  { icon: 'alert-triangle', color: 'red', text: 'Model embedding latency spike 2.1s', time: '18m lalu' },
  { icon: 'database', color: 'purple', text: 'Vector Store index updated (12k chunks)', time: '25m lalu' },
  { icon: 'user-plus', color: 'blue', text: '3 agent baru ditambahkan ke tim', time: '1j lalu' },
]

const INSIGHTS = [
  { emoji: '📈', text: 'Volume dokumen naik 12% dibanding minggu lalu. Pertimbangkan upgrade plan.', type: 'amber' },
  { emoji: '🎯', text: 'Kampanye email "Welcome Series" memiliki CTR tertinggi: 12.4%.', type: 'blue' },
  { emoji: '⚡', text: 'Avg respon time turun 0.3s setelah model update kemarin.', type: 'green' },
  { emoji: '🔍', text: 'Deteksi 23 anomali pada invoice bulan ini. 91% terkonfirmasi fraud.', type: 'red' },
]

const MODELS = [
  { name: 'GPT-4o (Chat)', acc: 96.8, lat: 1.2, color: '#a855f7' },
  { name: 'text-embedding-3 (Vector)', acc: 99.1, lat: 0.3, color: '#3b82f6' },
  { name: 'Whisper (Voice)', acc: 94.2, lat: 0.8, color: '#10b981' },
  { name: 'GPT-4o-mini (Fast)', acc: 92.5, lat: 0.4, color: '#f59e0b' },
]

const FEED_TEMPLATES = [
  { type: 'doc', msg: 'Invoice #{id} extracted — {n} fields — {ms}ms' },
  { type: 'doc', msg: 'Contract #{id} classified — type: {t} — confidence {c}%' },
  { type: 'mkt', msg: 'Content generated — "{t}" — {n} words — {ms}ms' },
  { type: 'mkt', msg: 'Campaign "{t}" — impression +{n} — CTR {c}%' },
  { type: 'sup', msg: 'Chat #{id} resolved — topic: {t} — {ms}s — AI' },
  { type: 'sup', msg: 'Ticket #{id} escalated — priority: {t} — agent: {n}' },
]

const TYPE_COLORS = { doc: '#F59E0B', mkt: '#3B82F6', sup: '#10B981' }
const TYPE_LABELS = { doc: 'DOC', mkt: 'MKT', sup: 'SUP' }

function MiniSpark({ data, color }) {
  const [ready, setReady] = useState(false)
  const max = Math.max(...data, 1)

  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 150)
    return () => window.clearTimeout(t)
  }, [])

  return (
    <div className="flex gap-[2px] mt-3 h-10 items-end">
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm transition-[height] duration-700 ease-out"
          style={{
            minWidth: 3,
            height: ready ? `${Math.max(8, (v / max) * 100)}%` : '0%',
            background: color,
            opacity: 0.3 + (v / max) * 0.7,
          }}
        />
      ))}
    </div>
  )
}

function formatFeedMessage(tmpl) {
  const msg = tmpl.msg
    .replace('{id}', String(Math.floor(Math.random() * 9000 + 1000)))
    .replace('{n}', String(Math.floor(Math.random() * 500 + 10)))
    .replace('{ms}', (Math.random() * 2 + 0.2).toFixed(1))
    .replace('{t}', ['Invoice', 'Contract', 'Welcome Series', 'Flash Sale', 'Login Issue', 'Payment', 'Refund', 'Onboarding'][Math.floor(Math.random() * 8)])
    .replace('{c}', (Math.random() * 10 + 88).toFixed(1))

  const now = new Date()
  const ts =
    now.getHours().toString().padStart(2, '0') +
    ':' +
    now.getMinutes().toString().padStart(2, '0') +
    ':' +
    now.getSeconds().toString().padStart(2, '0')

  return { msg, ts }
}

function makeId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()
  return String(Date.now()) + '-' + Math.random().toString(16).slice(2)
}

function getGreetingByHour(d = new Date()) {
  const h = d.getHours()
  if (h >= 4 && h < 11) return 'Selamat pagi'
  if (h >= 11 && h < 15) return 'Selamat siang'
  if (h >= 15 && h < 19) return 'Selamat sore'
  return 'Selamat malam'
}

function getDateLabel(d = new Date()) {
  return d.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

export default function Dashboard({ onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeNav, setActiveNav] = useState('overview')
  const [chartType, setChartType] = useState('all')
  const [animateBars, setAnimateBars] = useState(false)
  const [feedItems, setFeedItems] = useState([])
  const [mobileUserTipOpen, setMobileUserTipOpen] = useState(false)
  const [greeting, setGreeting] = useState(() => getGreetingByHour())
  const [dateLabel, setDateLabel] = useState(() => getDateLabel())
  const [workflows, setWorkflows] = useState(() => {
    try {
      const raw = window.localStorage.getItem(WORKFLOWS_STORAGE_KEY)
      if (!raw) return INITIAL_WORKFLOWS
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    } catch {}
    return INITIAL_WORKFLOWS
  })
  const [docSelectedId, setDocSelectedId] = useState(null)
  const [mktSelectedId, setMktSelectedId] = useState(null)
  const [supSelectedId, setSupSelectedId] = useState(null)

  const mainChartRef = useRef(null)
  const donutRef = useRef(null)

  useEffect(() => {
    const tick = () => {
      setGreeting(getGreetingByHour())
      setDateLabel(getDateLabel())
    }
    tick()
    const t = window.setInterval(tick, 60_000)
    return () => window.clearInterval(t)
  }, [])

  useEffect(() => {
    if (!sidebarOpen) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [sidebarOpen])

  useEffect(() => {
    const t = window.setTimeout(() => setAnimateBars(true), 250)
    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => {
    window.lucide?.createIcons?.()
  }, [sidebarOpen, activeNav, chartType, animateBars])

  useEffect(() => {
    try {
      window.localStorage.setItem(WORKFLOWS_STORAGE_KEY, JSON.stringify(workflows))
    } catch {}
  }, [workflows])

  useEffect(() => {
    if (!mobileUserTipOpen) return
    const t = window.setTimeout(() => setMobileUserTipOpen(false), 2500)
    return () => window.clearTimeout(t)
  }, [mobileUserTipOpen])

  useEffect(() => {
    const firstBurst = Array.from({ length: 8 }).map(() => {
      const tmpl = FEED_TEMPLATES[Math.floor(Math.random() * FEED_TEMPLATES.length)]
      const { msg, ts } = formatFeedMessage(tmpl)
      return { id: makeId(), type: tmpl.type, msg, ts }
    })
    setFeedItems(firstBurst)

    const timer = window.setInterval(() => {
      const tmpl = FEED_TEMPLATES[Math.floor(Math.random() * FEED_TEMPLATES.length)]
      const { msg, ts } = formatFeedMessage(tmpl)
      setFeedItems((prev) => {
        const next = [{ id: makeId(), type: tmpl.type, msg, ts }, ...prev]
        return next.slice(0, 50)
      })
    }, 1800 + Math.random() * 1200)

    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (activeNav !== 'overview') return
    const cv = mainChartRef.current
    if (!cv) return

    const drawMainChart = () => {
      const ctx = cv.getContext('2d')
      if (!ctx) return

      const dpr = window.devicePixelRatio || 1
      const rect = cv.getBoundingClientRect()
      cv.width = Math.max(1, Math.floor(rect.width * dpr))
      cv.height = Math.max(1, Math.floor(rect.height * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const W = rect.width
      const H = rect.height
      ctx.clearRect(0, 0, W, H)

      const data = CHART_DATA[chartType] || CHART_DATA.all
      const allVals = [...data.doc, ...data.mkt, ...data.sup]
      const maxVal = Math.max(...allVals, 100)

      const pad = { top: 10, right: 10, bottom: 30, left: 45 }
      const chartW = W - pad.left - pad.right
      const chartH = H - pad.top - pad.bottom

      ctx.strokeStyle = 'rgba(255,255,255,0.04)'
      ctx.lineWidth = 1
      for (let i = 0; i <= 4; i++) {
        const y = pad.top + (chartH / 4) * i
        ctx.beginPath()
        ctx.moveTo(pad.left, y)
        ctx.lineTo(W - pad.right, y)
        ctx.stroke()

        const val = Math.round(maxVal - (maxVal / 4) * i)
        ctx.fillStyle = 'rgba(255,255,255,0.2)'
        ctx.font = '10px "JetBrains Mono", monospace'
        ctx.textAlign = 'right'
        ctx.fillText(val >= 1000 ? (val / 1000).toFixed(1) + 'k' : String(val), pad.left - 8, y + 3)
      }

      DAYS.forEach((d, i) => {
        const x = pad.left + (chartW / (DAYS.length - 1)) * i
        ctx.fillStyle = 'rgba(255,255,255,0.25)'
        ctx.font = '10px "JetBrains Mono", monospace'
        ctx.textAlign = 'center'
        ctx.fillText(d, x, H - 8)
      })

      const drawLine = (series, color, fillAlpha) => {
        const points = series.map((v, i) => ({
          x: pad.left + (chartW / (series.length - 1)) * i,
          y: pad.top + chartH - (v / maxVal) * chartH,
        }))

        ctx.beginPath()
        ctx.moveTo(points[0].x, pad.top + chartH)
        points.forEach((p) => ctx.lineTo(p.x, p.y))
        ctx.lineTo(points[points.length - 1].x, pad.top + chartH)
        ctx.closePath()

        const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + chartH)
        const rgbaTop = color.replace('rgb', 'rgba').replace(')', `,${fillAlpha})`)
        const rgbaBot = color.replace('rgb', 'rgba').replace(')', ',0)')
        grad.addColorStop(0, rgbaTop)
        grad.addColorStop(1, rgbaBot)
        ctx.fillStyle = grad
        ctx.fill()

        ctx.beginPath()
        points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)))
        ctx.strokeStyle = color
        ctx.lineWidth = 2
        ctx.lineJoin = 'round'
        ctx.stroke()

        points.forEach((p) => {
          ctx.beginPath()
          ctx.arc(p.x, p.y, 3, 0, Math.PI * 2)
          ctx.fillStyle = color
          ctx.fill()
          ctx.beginPath()
          ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2)
          ctx.fillStyle = '#050816'
          ctx.fill()
        })
      }

      drawLine(data.sup, 'rgb(16,185,129)', 0.08)
      drawLine(data.mkt, 'rgb(59,130,246)', 0.08)
      drawLine(data.doc, 'rgb(245,158,11)', 0.1)
    }

    const t = window.setTimeout(drawMainChart, 0)
    window.addEventListener('resize', drawMainChart)
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('resize', drawMainChart)
    }
  }, [chartType, activeNav])

  useEffect(() => {
    if (activeNav !== 'overview') return
    const cv = donutRef.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    cv.width = 140 * dpr
    cv.height = 140 * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const cx = 70
    const cy = 70
    const outerR = 58
    const innerR = 38
    const slices = [
      { val: 42, color: '#F59E0B' },
      { val: 31, color: '#3B82F6' },
      { val: 27, color: '#10B981' },
    ]
    let angle = -Math.PI / 2
    ctx.clearRect(0, 0, 140, 140)

    slices.forEach((s) => {
      const sweep = (s.val / 100) * Math.PI * 2
      ctx.beginPath()
      ctx.arc(cx, cy, outerR, angle, angle + sweep)
      ctx.arc(cx, cy, innerR, angle + sweep, angle, true)
      ctx.closePath()
      ctx.fillStyle = s.color
      ctx.globalAlpha = 0.85
      ctx.fill()
      ctx.globalAlpha = 1

      ctx.beginPath()
      ctx.arc(cx, cy, outerR, angle + sweep - 0.02, angle + sweep + 0.02)
      ctx.arc(cx, cy, innerR, angle + sweep + 0.02, angle + sweep - 0.02, true)
      ctx.fillStyle = '#050816'
      ctx.fill()

      angle += sweep
    })

    ctx.fillStyle = '#fff'
    ctx.font = 'bold 18px "Oswald", sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('12.8k', cx, cy - 4)
    ctx.fillStyle = 'rgba(255,255,255,0.35)'
    ctx.font = '9px Inter, sans-serif'
    ctx.fillText('total ops', cx, cy + 12)
  }, [activeNav])

  const navItems = [
    { id: 'overview', label: 'Overview', icon: 'layout-dashboard' },
    { id: 'workflow', label: 'Workflow', icon: 'workflow', badge: '12' },
    { id: 'dokumen', label: 'Dokumen', icon: 'file-text' },
    { id: 'marketing', label: 'Marketing', icon: 'megaphone' },
    { id: 'support', label: 'Support', icon: 'headphones' },
  ]

  return (
    <div className="w-full overflow-hidden text-white" style={{ background: '#050816', height: '100dvh', minHeight: '100vh' }}>
      <div className="flex h-full">
        {sidebarOpen ? (
          <button
            type="button"
            className="lg:hidden fixed inset-0 z-[90] bg-black/60"
            onClick={() => setSidebarOpen(false)}
            aria-label="Tutup sidebar"
          />
        ) : null}
        <aside
          className={
            sidebarOpen
              ? 'fixed inset-y-0 left-0 z-[100] w-[82vw] max-w-[280px] h-full flex flex-col glass-sidebar anim-up lg:static lg:z-auto lg:w-[240px] lg:max-w-none lg:min-w-[240px]'
              : 'hidden lg:flex w-[240px] min-w-[240px] h-full flex-col glass-sidebar anim-up'
          }
        >
          <div className="px-5 py-5 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center flex-shrink-0">
                <i data-lucide="brain" className="w-5 h-5 text-black"></i>
              </div>
              <div>
                <span className="font-oswald font-500 text-lg tracking-tight">
                  MyBing<span className="text-amber-400">.ai</span>
                </span>
                <p className="text-[9px] text-gray-500 font-medium tracking-wider uppercase -mt-0.5">Dashboard</p>
              </div>
            </div>
            <button
              type="button"
              className="lg:hidden text-gray-400 hover:text-white transition-colors"
              onClick={() => setSidebarOpen(false)}
              aria-label="Tutup sidebar"
            >
              <i data-lucide="x" className="w-5 h-5"></i>
            </button>
          </div>

          <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
            <p className="text-[9px] font-semibold tracking-[.2em] uppercase text-gray-600 px-3 mb-2">Utama</p>
            {navItems.map((it) => (
              <button
                key={it.id}
                type="button"
                onClick={() => {
                  setActiveNav(it.id)
                  setSidebarOpen(false)
                }}
                className={
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ' +
                  (activeNav === it.id ? 'bg-amber-500/10 border-r-2 border-amber-500' : 'hover:bg-white/5')
                }
              >
                <i
                  data-lucide={it.icon}
                  className={
                    'w-[18px] h-[18px] ' + (activeNav === it.id ? 'text-amber-400' : 'text-gray-400')
                  }
                ></i>
                <span className={'text-[13px] font-medium ' + (activeNav === it.id ? 'text-amber-100' : 'text-gray-300')}>
                  {it.label}
                </span>
                {it.badge ? (
                  <span className="ml-auto text-[10px] bg-amber-500/15 text-amber-400 px-1.5 py-0.5 rounded-md font-jetbrains">{it.badge}</span>
                ) : null}
              </button>
            ))}

            <p className="text-[9px] font-semibold tracking-[.2em] uppercase text-gray-600 px-3 mb-2 mt-6">Analytics</p>
            <button
              type="button"
              onClick={() => {
                setActiveNav('reports')
                setSidebarOpen(false)
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors"
            >
              <i data-lucide="bar-chart-3" className="w-[18px] h-[18px] text-gray-400"></i>
              <span className="text-[13px] text-gray-300 font-medium">Laporan</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveNav('activity')
                setSidebarOpen(false)
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors"
            >
              <i data-lucide="activity" className="w-[18px] h-[18px] text-gray-400"></i>
              <span className="text-[13px] text-gray-300 font-medium">Aktivitas Log</span>
            </button>

            <p className="text-[9px] font-semibold tracking-[.2em] uppercase text-gray-600 px-3 mb-2 mt-6">System</p>
            <button
              type="button"
              onClick={() => {
                setActiveNav('integrations')
                setSidebarOpen(false)
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors"
            >
              <i data-lucide="plug" className="w-[18px] h-[18px] text-gray-400"></i>
              <span className="text-[13px] text-gray-300 font-medium">Integrasi</span>
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveNav('settings')
                setSidebarOpen(false)
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors"
            >
              <i data-lucide="settings" className="w-[18px] h-[18px] text-gray-400"></i>
              <span className="text-[13px] text-gray-300 font-medium">Pengaturan</span>
            </button>
          </nav>

          <div className="px-4 pb-4">
            <div className="glass rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-semibold tracking-wider uppercase text-gray-400">API Usage</span>
                <span className="text-[10px] font-jetbrains text-amber-400">73%</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-[width] duration-700 ease-out"
                  style={{ width: animateBars ? '73%' : '0%' }}
                ></div>
              </div>
              <p className="text-[10px] text-gray-500 mt-2">7,340 / 10,000 requests</p>
            </div>
          </div>
        </aside>

        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <header className="glass-strong relative z-20 flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/5 anim-up">
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="lg:hidden text-gray-400 hover:text-white transition-colors"
                onClick={() => setSidebarOpen((v) => !v)}
                aria-label="Toggle sidebar"
              >
                <i data-lucide="menu" className="w-5 h-5"></i>
              </button>
              <div className="relative hidden sm:block">
                <i data-lucide="search" className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2"></i>
                <input
                  type="text"
                  placeholder="Cari workflow, dokumen, atau..."
                  className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 w-[300px] focus:outline-none focus:border-amber-500/30 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-[11px] text-gray-400">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                Semua sistem aktif
              </div>
              <button type="button" className="relative" title="Notifikasi">
                <i data-lucide="bell" className="w-[18px] h-[18px] text-gray-400 hover:text-white transition-colors"></i>
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500"></span>
              </button>
              <div className="w-px h-5 bg-white/10 hidden sm:block"></div>
              <div className="sm:hidden relative">
                <button
                  type="button"
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-black text-xs font-bold"
                  onClick={() => setMobileUserTipOpen((v) => !v)}
                  aria-label="Info pengguna"
                >
                  RA
                </button>
                {mobileUserTipOpen ? (
                  <div className="absolute z-[200] top-full right-0 mt-2 px-3 py-2 rounded-xl glass-strong text-white text-[11px] whitespace-nowrap shadow-[0_10px_35px_rgba(0,0,0,0.45)] pointer-events-none">
                    Rizki Aditya
                  </div>
                ) : null}
              </div>
              <div className="hidden sm:flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-black text-xs font-bold">
                  RA
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-medium">Rizki Aditya</p>
                  <p className="text-[10px] text-gray-500">Admin</p>
                </div>
              </div>
              <button
                type="button"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                onClick={onLogout}
                aria-label="Keluar"
              >
                <i data-lucide="log-out" className="w-4 h-4 text-gray-400"></i>
              </button>
            </div>
          </header>

          <main
            className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-5"
            style={{
              background:
                'radial-gradient(ellipse at 30% 0%, rgba(245,158,11,0.03) 0%, transparent 50%),radial-gradient(ellipse at 80% 100%, rgba(139,92,246,0.03) 0%, transparent 50%)',
            }}
          >
            {activeNav === 'workflow' ? (
              <Workflow workflows={workflows} setWorkflows={setWorkflows} />
            ) : activeNav === 'overview' ? (
              <>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 anim-up">
              <div>
                <h1 className="font-oswald font-light text-2xl tracking-tight">{greeting}, Rizki</h1>
                <p className="text-gray-500 text-xs mt-0.5">{dateLabel} — Berikut ringkasan operasional Anda hari ini.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass rounded-2xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <i data-lucide="file-text" className="w-[18px] h-[18px] text-amber-400"></i>
                  </div>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1 border border-green-500/20 bg-green-500/10 text-green-300">
                    <i data-lucide="trending-up" className="w-3 h-3"></i>+12%
                  </span>
                </div>
                <p className="stat-num font-oswald text-2xl font-light">8,472</p>
                <p className="text-[10px] text-gray-500 mt-0.5">Dokumen diproses</p>
                <MiniSpark data={[65, 78, 55, 90, 85, 40, 62]} color="#F59E0B" />
              </div>

              <div className="glass rounded-2xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <i data-lucide="megaphone" className="w-[18px] h-[18px] text-blue-400"></i>
                  </div>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1 border border-green-500/20 bg-green-500/10 text-green-300">
                    <i data-lucide="trending-up" className="w-3 h-3"></i>+24%
                  </span>
                </div>
                <p className="stat-num font-oswald text-2xl font-light">1,284</p>
                <p className="text-[10px] text-gray-500 mt-0.5">Konten AI digenerate</p>
                <MiniSpark data={[40, 55, 38, 65, 72, 30, 48]} color="#3B82F6" />
              </div>

              <div className="glass rounded-2xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                    <i data-lucide="headphones" className="w-[18px] h-[18px] text-green-400"></i>
                  </div>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1 border border-green-500/20 bg-green-500/10 text-green-300">
                    <i data-lucide="trending-up" className="w-3 h-3"></i>+8%
                  </span>
                </div>
                <p className="stat-num font-oswald text-2xl font-light">
                  94.7<span className="text-lg">%</span>
                </p>
                <p className="text-[10px] text-gray-500 mt-0.5">Resolusi AI support</p>
                <MiniSpark data={[91, 93, 90, 95, 94, 88, 92]} color="#10B981" />
              </div>

              <div className="glass rounded-2xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                    <i data-lucide="zap" className="w-[18px] h-[18px] text-purple-400"></i>
                  </div>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1 border border-amber-500/20 bg-amber-500/10 text-amber-300">
                    <i data-lucide="minus" className="w-3 h-3"></i>Stabil
                  </span>
                </div>
                <p className="stat-num font-oswald text-2xl font-light">
                  1.2<span className="text-lg">s</span>
                </p>
                <p className="text-[10px] text-gray-500 mt-0.5">Avg respon time</p>
                <MiniSpark data={[1.4, 1.1, 1.5, 1.0, 1.2, 1.6, 1.2]} color="#a855f7" />
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              <div className="xl:col-span-2 glass rounded-2xl p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                  <div>
                    <h3 className="text-sm font-semibold">Performa AI Harian</h3>
                    <p className="text-[10px] text-gray-500 mt-0.5">7 hari terakhir — total 52,847 operasi</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: 'all', label: 'Semua' },
                      { id: 'doc', label: 'Dokumen' },
                      { id: 'mkt', label: 'Marketing' },
                      { id: 'sup', label: 'Support' },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setChartType(t.id)}
                        className={
                          'text-[10px] font-medium px-3 py-1.5 rounded-lg border transition-colors ' +
                          (chartType === t.id ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'border-white/10 text-gray-400 hover:text-white hover:bg-white/5')
                        }
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
                <canvas ref={mainChartRef} height={220} className="w-full"></canvas>
                <div className="flex items-center justify-center gap-5 mt-4 text-[10px] text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ background: '#F59E0B' }}></span>Dokumen
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ background: '#3B82F6' }}></span>Marketing
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ background: '#10B981' }}></span>Support
                  </span>
                </div>
              </div>

              <div className="glass rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold">Workflow Aktif</h3>
                    <p className="text-[10px] text-gray-500 mt-0.5">12 workflow berjalan</p>
                  </div>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-md border border-green-500/20 bg-green-500/10 text-green-300">Live</span>
                </div>
                <div className="space-y-2.5">
                  {WORKFLOWS.map((w) => {
                    const c = TYPE_COLORS[w.type]
                    const running = w.status === 'running'
                    return (
                      <div
                        key={w.name}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[.03] transition-colors cursor-pointer group"
                      >
                        <div className="w-1 h-8 rounded-full flex-shrink-0" style={{ background: c }}></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate group-hover:text-white transition-colors text-gray-200">
                            {w.name}
                          </p>
                          <p className="text-[10px] text-gray-500">
                            {w.ops} ops · uptime {w.uptime}
                          </p>
                        </div>
                        {running ? (
                          <span className="text-[9px] font-medium px-1.5 py-0.5 rounded flex items-center gap-1 border border-green-500/20 bg-green-500/10 text-green-300">
                            <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse"></span>Running
                          </span>
                        ) : (
                          <span className="text-[9px] font-medium px-1.5 py-0.5 rounded border border-amber-500/20 bg-amber-500/10 text-amber-300">
                            Paused
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              <div className="glass rounded-2xl p-5">
                <h3 className="text-sm font-semibold mb-1">Distribusi Penggunaan</h3>
                <p className="text-[10px] text-gray-500 mb-4">Berdasarkan jenis solusi</p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                  <canvas ref={donutRef} width={140} height={140} className="flex-shrink-0"></canvas>
                  <div className="space-y-3 text-xs w-full">
                    {[
                      { label: 'Dokumen', v: '42%', c: '#F59E0B' },
                      { label: 'Marketing', v: '31%', c: '#3B82F6' },
                      { label: 'Support', v: '27%', c: '#10B981' },
                    ].map((r) => (
                      <div key={r.label} className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: r.c }}></span>
                        <span className="text-gray-300">{r.label}</span>
                        <span className="ml-auto font-jetbrains text-gray-400">{r.v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="glass rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold">Aktivitas Terbaru</h3>
                  <button type="button" className="text-[10px] text-amber-400 hover:text-amber-300 transition-colors font-medium">
                    Lihat Semua
                  </button>
                </div>
                <div className="space-y-3">
                  {ACTIVITIES.map((a, idx) => {
                    const colorMap = {
                      amber: '#F59E0B',
                      blue: '#3B82F6',
                      green: '#10B981',
                      red: '#EF4444',
                      purple: '#A855F7',
                    }
                    const c = colorMap[a.color]
                    return (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5" style={{ background: c + '15', border: '1px solid ' + c + '25' }}>
                          <i data-lucide={a.icon} className="w-3.5 h-3.5" style={{ color: c }}></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] text-gray-300 leading-relaxed">{a.text}</p>
                          <p className="text-[10px] text-gray-600">{a.time}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="glass rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/15 border border-purple-500/20 flex items-center justify-center">
                    <i data-lucide="sparkles" className="w-4 h-4 text-purple-400"></i>
                  </div>
                  <h3 className="text-sm font-semibold">AI Insights</h3>
                </div>
                <div className="space-y-3">
                  {INSIGHTS.map((ins, idx) => {
                    const border = {
                      amber: 'border-amber-500/20',
                      blue: 'border-blue-500/20',
                      green: 'border-green-500/20',
                      red: 'border-red-500/20',
                    }[ins.type]
                    return (
                      <div key={idx} className={'p-3 rounded-xl bg-white/[.02] border ' + border + ' hover:bg-white/[.04] transition-colors cursor-pointer'}>
                        <p className="text-[11px] text-gray-300 leading-relaxed">
                          <span className="mr-1">{ins.emoji}</span>
                          {ins.text}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 pb-4">
              <div className="glass rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                    <h3 className="text-sm font-semibold">Live Data Feed</h3>
                  </div>
                  <span className="text-[10px] text-gray-500 font-jetbrains">{feedItems.length} events</span>
                </div>
                <div className="space-y-1.5 max-h-[200px] overflow-y-auto font-jetbrains text-[11px]">
                  {feedItems.map((row) => {
                    const c = TYPE_COLORS[row.type]
                    return (
                      <div key={row.id} className="flex items-center gap-2 py-1 px-2 rounded-lg hover:bg-white/[.03] transition-colors">
                        <span className="text-[9px] font-bold px-1 py-0.5 rounded flex-shrink-0" style={{ background: c + '18', color: c, border: '1px solid ' + c + '25' }}>
                          {TYPE_LABELS[row.type]}
                        </span>
                        <span className="text-gray-400 truncate flex-1">{row.msg}</span>
                        <span className="text-gray-600 flex-shrink-0">{row.ts}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="glass rounded-2xl p-5">
                <h3 className="text-sm font-semibold mb-1">Model Performance</h3>
                <p className="text-[10px] text-gray-500 mb-4">Akurasi & latency model AI</p>
                <div className="space-y-4">
                  {MODELS.map((m) => (
                    <div key={m.name}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] text-gray-300 font-medium">{m.name}</span>
                        <div className="flex items-center gap-3 text-[10px] font-jetbrains">
                          <span className="text-gray-400">
                            Acc: <span style={{ color: m.color }}>{m.acc}%</span>
                          </span>
                          <span className="text-gray-400">
                            Lat: <span style={{ color: m.color }}>{m.lat}s</span>
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1.5 h-1.5">
                        <div className="flex-1 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-[width] duration-700 ease-out" style={{ width: animateBars ? m.acc + '%' : '0%', background: m.color }}></div>
                        </div>
                        <div className="w-16 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-[width] duration-700 ease-out"
                            style={{ width: animateBars ? Math.max(5, 100 - (m.lat / 2) * 100) + '%' : '0%', background: m.color, opacity: 0.6 }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
              </>
            ) : activeNav === 'reports' ? (
              <ReportsView workflows={workflows} />
            ) : activeNav === 'activity' ? (
              <ActivityLogView
                items={feedItems}
                onClear={() => {
                  setFeedItems([])
                }}
              />
            ) : activeNav === 'integrations' ? (
              <IntegrationsView />
            ) : activeNav === 'settings' ? (
              <SettingsView />
            ) : activeNav === 'dokumen' ? (
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 anim-up">
                  <div>
                    <h1 className="font-oswald font-light text-2xl tracking-tight">Dokumen</h1>
                    <p className="text-gray-500 text-xs mt-0.5">Workflow dokumen yang sudah dibuat akan muncul di sini.</p>
                  </div>
                </div>

                <DokumenWorkflows workflows={workflows} selectedId={docSelectedId} onSelect={setDocSelectedId} />
              </div>
            ) : activeNav === 'marketing' ? (
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 anim-up">
                  <div>
                    <h1 className="font-oswald font-light text-2xl tracking-tight">Marketing</h1>
                    <p className="text-gray-500 text-xs mt-0.5">Workflow marketing yang sudah dibuat akan muncul di sini.</p>
                  </div>
                </div>

                <MarketingWorkflows workflows={workflows} selectedId={mktSelectedId} onSelect={setMktSelectedId} />
              </div>
            ) : activeNav === 'support' ? (
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 anim-up">
                  <div>
                    <h1 className="font-oswald font-light text-2xl tracking-tight">Support</h1>
                    <p className="text-gray-500 text-xs mt-0.5">Workflow support yang sudah dibuat akan muncul di sini.</p>
                  </div>
                </div>

                <SupportWorkflows workflows={workflows} selectedId={supSelectedId} onSelect={setSupSelectedId} />
              </div>
            ) : (
              <div className="glass rounded-2xl p-6 text-sm text-gray-400">
                Menu ini masih dalam pengembangan.
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

function ReportsView({ workflows }) {
  const [range, setRange] = useState('30d')
  const [type, setType] = useState('all')
  const trendRef = useRef(null)
  const donutRef = useRef(null)

  const parsed = useMemo(() => {
    const toNum = (v) => {
      const s = String(v ?? '').replace(/,/g, '')
      const n = Number(s)
      return Number.isFinite(n) ? n : 0
    }
    return (workflows || []).map((w) => ({
      ...w,
      opsN: toNum(w.ops),
      uptimeN: toNum(w.uptime),
      avgTimeN: toNum(w.avgTime),
    }))
  }, [workflows])

  const filtered = useMemo(() => {
    if (type === 'all') return parsed
    return parsed.filter((w) => w.type === type)
  }, [parsed, type])

  const totals = useMemo(() => {
    const sum = (arr) => arr.reduce((a, b) => a + b, 0)
    const ops = sum(filtered.map((w) => w.opsN))
    const avgTime = filtered.length ? sum(filtered.map((w) => w.avgTimeN)) / filtered.length : 0
    const uptime = filtered.length ? sum(filtered.map((w) => w.uptimeN)) / filtered.length : 0
    const errors = filtered.filter((w) => w.status === 'error').length
    const running = filtered.filter((w) => w.status === 'running').length
    return { ops, avgTime, uptime, errors, running }
  }, [filtered])

  const dist = useMemo(() => {
    const sum = (arr) => arr.reduce((a, b) => a + b, 0)
    const by = { doc: 0, mkt: 0, sup: 0 }
    parsed.forEach((w) => {
      if (!by[w.type]) return
      by[w.type] += w.opsN
    })
    const total = sum(Object.values(by))
    return { by, total: total || 1 }
  }, [parsed])

  const top = useMemo(() => {
    return [...filtered].sort((a, b) => b.opsN - a.opsN).slice(0, 8)
  }, [filtered])

  useEffect(() => {
    window.lucide?.createIcons?.()
  }, [range, type])

  useEffect(() => {
    const cv = trendRef.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const r = cv.getBoundingClientRect()
    cv.width = Math.max(1, Math.floor(r.width * dpr))
    cv.height = Math.max(1, Math.floor(220 * dpr))
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const w = r.width
    const h = 220
    const padL = 36
    const padR = 16
    const padT = 14
    const padB = 24
    ctx.clearRect(0, 0, w, h)

    const count = range === '7d' ? 7 : range === '90d' ? 14 : 10
    const seedStr = `${range}:${type}:${Math.round(totals.ops)}`
    let seed = 0
    for (let i = 0; i < seedStr.length; i++) seed = (seed * 31 + seedStr.charCodeAt(i)) | 0
    const rnd = () => {
      seed ^= seed << 13
      seed ^= seed >>> 17
      seed ^= seed << 5
      return ((seed >>> 0) % 1000) / 1000
    }
    const base = Math.max(80, totals.ops / (range === '7d' ? 7 : range === '90d' ? 90 : 30))
    const series = Array.from({ length: count }).map(() => base * (0.7 + rnd() * 0.6))

    const maxV = Math.max(...series, 1)
    const minV = Math.min(...series, 0)
    const innerW = w - padL - padR
    const innerH = h - padT - padB
    const xAt = (i) => padL + (i / (count - 1)) * innerW
    const yAt = (v) => padT + (1 - (v - minV) / (maxV - minV || 1)) * innerH

    ctx.strokeStyle = 'rgba(255,255,255,0.08)'
    ctx.lineWidth = 1
    for (let i = 0; i <= 4; i++) {
      const y = padT + (i / 4) * innerH
      ctx.beginPath()
      ctx.moveTo(padL, y)
      ctx.lineTo(w - padR, y)
      ctx.stroke()
    }

    const c = type === 'doc' ? '#F59E0B' : type === 'mkt' ? '#3B82F6' : type === 'sup' ? '#10B981' : '#a855f7'

    ctx.beginPath()
    series.forEach((v, i) => {
      const x = xAt(i)
      const y = yAt(v)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.strokeStyle = c
    ctx.lineWidth = 2
    ctx.stroke()

    ctx.lineTo(xAt(count - 1), padT + innerH)
    ctx.lineTo(xAt(0), padT + innerH)
    ctx.closePath()
    ctx.fillStyle = c + '1A'
    ctx.fill()

    ctx.fillStyle = 'rgba(255,255,255,0.35)'
    ctx.font = '10px Inter, sans-serif'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.fillText('0', 10, padT + innerH)
    ctx.fillText(Math.round(maxV).toLocaleString('id-ID'), 10, padT + 6)
  }, [range, type, totals.ops])

  useEffect(() => {
    const cv = donutRef.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    cv.width = 150 * dpr
    cv.height = 150 * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const cx = 75
    const cy = 75
    const outerR = 60
    const innerR = 40
    const slices = [
      { val: dist.by.doc, color: '#F59E0B' },
      { val: dist.by.mkt, color: '#3B82F6' },
      { val: dist.by.sup, color: '#10B981' },
    ]
    const total = dist.total || 1
    let angle = -Math.PI / 2
    ctx.clearRect(0, 0, 150, 150)

    slices.forEach((s) => {
      const sweep = (s.val / total) * Math.PI * 2
      ctx.beginPath()
      ctx.arc(cx, cy, outerR, angle, angle + sweep)
      ctx.arc(cx, cy, innerR, angle + sweep, angle, true)
      ctx.closePath()
      ctx.fillStyle = s.color
      ctx.globalAlpha = 0.85
      ctx.fill()
      ctx.globalAlpha = 1
      angle += sweep
    })

    ctx.fillStyle = '#fff'
    ctx.font = 'bold 18px "Oswald", sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(Math.round(dist.total / 1000).toString() + 'k', cx, cy - 4)
    ctx.fillStyle = 'rgba(255,255,255,0.35)'
    ctx.font = '9px Inter, sans-serif'
    ctx.fillText('ops', cx, cy + 12)
  }, [dist])

  const exportCsv = () => {
    const rows = [
      ['name', 'type', 'status', 'ops', 'uptime', 'avgTime', 'created', 'lastRun'],
      ...filtered.map((w) => [w.name, w.type, w.status, String(w.opsN), String(w.uptimeN), String(w.avgTimeN), String(w.created ?? ''), String(w.lastRun ?? '')]),
    ]
    const csv = rows
      .map((r) =>
        r
          .map((c) => {
            const s = String(c ?? '')
            const esc = s.replace(/"/g, '""')
            return `"${esc}"`
          })
          .join(','),
      )
      .join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `laporan-${type}-${range}.csv`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const fmt = (n) => {
    const v = Number(n) || 0
    if (v >= 1_000_000) return (v / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
    if (v >= 1_000) return (v / 1_000).toFixed(1).replace(/\.0$/, '') + 'k'
    return Math.round(v).toLocaleString('id-ID')
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 anim-up">
        <div>
          <h1 className="font-oswald font-light text-2xl tracking-tight">Laporan</h1>
          <p className="text-gray-500 text-xs mt-0.5">Ringkasan performa workflow dan penggunaan AI.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[11px] text-gray-300 focus:outline-none focus:border-amber-500/30 appearance-none cursor-pointer"
          >
            <option value="7d">7 hari</option>
            <option value="30d">30 hari</option>
            <option value="90d">90 hari</option>
          </select>
          <button
            type="button"
            onClick={exportCsv}
            className="flex items-center gap-2 glass text-xs font-medium px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/[.06] transition-all"
          >
            <i data-lucide="download" className="w-4 h-4"></i> Export CSV
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap anim-up">
        {[
          { id: 'all', label: 'Semua' },
          { id: 'doc', label: 'Dokumen' },
          { id: 'mkt', label: 'Marketing' },
          { id: 'sup', label: 'Support' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setType(t.id)}
            className={
              'text-[10px] font-medium px-3 py-1.5 rounded-lg border transition-colors ' +
              (type === t.id ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'border-white/10 text-gray-400 hover:text-white hover:bg-white/5')
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <i data-lucide="layers" className="w-[18px] h-[18px] text-purple-400"></i>
            </div>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-md border border-white/10 bg-white/5 text-gray-400">{range.toUpperCase()}</span>
          </div>
          <p className="stat-num font-oswald text-2xl font-light">{fmt(totals.ops)}</p>
          <p className="text-[10px] text-gray-500 mt-0.5">Total operasi</p>
        </div>

        <div className="glass rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <i data-lucide="shield-check" className="w-[18px] h-[18px] text-green-400"></i>
            </div>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-md border border-green-500/20 bg-green-500/10 text-green-300">{totals.running} running</span>
          </div>
          <p className="stat-num font-oswald text-2xl font-light">
            {totals.uptime.toFixed(1)}
            <span className="text-lg">%</span>
          </p>
          <p className="text-[10px] text-gray-500 mt-0.5">Rata-rata uptime</p>
        </div>

        <div className="glass rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <i data-lucide="clock" className="w-[18px] h-[18px] text-amber-400"></i>
            </div>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-md border border-white/10 bg-white/5 text-gray-400">avg</span>
          </div>
          <p className="stat-num font-oswald text-2xl font-light">
            {totals.avgTime.toFixed(1)}
            <span className="text-lg">s</span>
          </p>
          <p className="text-[10px] text-gray-500 mt-0.5">Avg response</p>
        </div>

        <div className="glass rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <i data-lucide="alert-triangle" className="w-[18px] h-[18px] text-red-400"></i>
            </div>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-md border border-red-500/20 bg-red-500/10 text-red-300">{totals.errors} error</span>
          </div>
          <p className="stat-num font-oswald text-2xl font-light">{totals.errors}</p>
          <p className="text-[10px] text-gray-500 mt-0.5">Workflow bermasalah</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold">Trend Operasi</h3>
              <p className="text-[10px] text-gray-500 mt-0.5">Estimasi berdasarkan konfigurasi workflow</p>
            </div>
            <span className="text-[10px] text-gray-500 font-jetbrains">{type.toUpperCase()}</span>
          </div>
          <canvas ref={trendRef} height={220} className="w-full"></canvas>
        </div>

        <div className="glass rounded-2xl p-5">
          <h3 className="text-sm font-semibold mb-1">Distribusi Ops</h3>
          <p className="text-[10px] text-gray-500 mb-4">Dokumen vs Marketing vs Support</p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <canvas ref={donutRef} width={150} height={150} className="flex-shrink-0"></canvas>
            <div className="space-y-3 text-xs w-full">
              {[
                { label: 'Dokumen', v: dist.by.doc, c: '#F59E0B' },
                { label: 'Marketing', v: dist.by.mkt, c: '#3B82F6' },
                { label: 'Support', v: dist.by.sup, c: '#10B981' },
              ].map((r) => (
                <div key={r.label} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: r.c }}></span>
                  <span className="text-gray-300">{r.label}</span>
                  <span className="ml-auto font-jetbrains text-gray-400">{fmt(r.v)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold">Workflow Teratas</h3>
            <p className="text-[10px] text-gray-500 mt-0.5">Berdasarkan total operasi</p>
          </div>
          <span className="text-[10px] text-gray-500">{filtered.length} workflow</span>
        </div>
        <div className="space-y-2">
          {top.length ? (
            top.map((w) => {
              const c = TYPE_COLORS[w.type] || '#9CA3AF'
              const ok = w.status === 'running'
              return (
                <div key={String(w.id)} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[.03] transition-colors">
                  <div className="w-1 h-8 rounded-full flex-shrink-0" style={{ background: c }}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate text-gray-200">{w.name}</p>
                    <p className="text-[10px] text-gray-500">
                      {fmt(w.opsN)} ops · {w.avgTimeN.toFixed(1)}s · {w.uptimeN.toFixed(1)}%
                    </p>
                  </div>
                  <span className={'text-[9px] font-medium px-2 py-0.5 rounded-md border ' + (ok ? 'border-green-500/20 bg-green-500/10 text-green-300' : 'border-amber-500/20 bg-amber-500/10 text-amber-300')}>
                    {ok ? 'Running' : w.status === 'error' ? 'Error' : 'Paused'}
                  </span>
                </div>
              )
            })
          ) : (
            <div className="text-xs text-gray-500">Tidak ada data untuk filter ini.</div>
          )}
        </div>
      </div>
    </div>
  )
}

function ActivityLogView({ items, onClear }) {
  const [type, setType] = useState('all')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (items || []).filter((it) => {
      if (type !== 'all' && it.type !== type) return false
      if (!q) return true
      return String(it.msg || '').toLowerCase().includes(q)
    })
  }, [items, type, query])

  const stats = useMemo(() => {
    const total = (items || []).length
    const by = { doc: 0, mkt: 0, sup: 0 }
    const err = (items || []).filter((it) => String(it.msg || '').toLowerCase().includes('error') || String(it.msg || '').toLowerCase().includes('spike')).length
    ;(items || []).forEach((it) => {
      if (by[it.type] != null) by[it.type] += 1
    })
    return { total, by, err }
  }, [items])

  useEffect(() => {
    window.lucide?.createIcons?.()
  }, [type, query, items?.length])

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 anim-up">
        <div>
          <h1 className="font-oswald font-light text-2xl tracking-tight">Aktivitas Log</h1>
          <p className="text-gray-500 text-xs mt-0.5">Log event realtime dari Dokumen, Marketing, dan Support.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClear}
            className="flex items-center gap-2 glass text-xs font-medium px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/[.06] transition-all"
            title="Hapus log"
          >
            <i data-lucide="trash-2" className="w-4 h-4"></i> Clear
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <i data-lucide="activity" className="w-[18px] h-[18px] text-blue-400"></i>
            </div>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-md border border-white/10 bg-white/5 text-gray-400">realtime</span>
          </div>
          <p className="stat-num font-oswald text-2xl font-light">{stats.total}</p>
          <p className="text-[10px] text-gray-500 mt-0.5">Total event</p>
        </div>

        <div className="glass rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <i data-lucide="file-text" className="w-[18px] h-[18px] text-amber-400"></i>
            </div>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-md border border-amber-500/20 bg-amber-500/10 text-amber-300">DOC</span>
          </div>
          <p className="stat-num font-oswald text-2xl font-light">{stats.by.doc}</p>
          <p className="text-[10px] text-gray-500 mt-0.5">Event dokumen</p>
        </div>

        <div className="glass rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <i data-lucide="headphones" className="w-[18px] h-[18px] text-emerald-400"></i>
            </div>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-md border border-emerald-500/20 bg-emerald-500/10 text-emerald-300">SUP</span>
          </div>
          <p className="stat-num font-oswald text-2xl font-light">{stats.by.sup}</p>
          <p className="text-[10px] text-gray-500 mt-0.5">Event support</p>
        </div>

        <div className="glass rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <i data-lucide="alert-triangle" className="w-[18px] h-[18px] text-red-400"></i>
            </div>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-md border border-red-500/20 bg-red-500/10 text-red-300">alert</span>
          </div>
          <p className="stat-num font-oswald text-2xl font-light">{stats.err}</p>
          <p className="text-[10px] text-gray-500 mt-0.5">Terdeteksi error/spike</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 anim-up">
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { id: 'all', label: `Semua (${filtered.length})` },
            { id: 'doc', label: `Dokumen (${(items || []).filter((i) => i.type === 'doc').length})` },
            { id: 'mkt', label: `Marketing (${(items || []).filter((i) => i.type === 'mkt').length})` },
            { id: 'sup', label: `Support (${(items || []).filter((i) => i.type === 'sup').length})` },
          ].map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setType(b.id)}
              className={
                'text-[10px] font-medium px-3 py-1.5 rounded-lg border transition-colors ' +
                (type === b.id ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'border-white/10 text-gray-400 hover:text-white hover:bg-white/5')
              }
            >
              {b.label}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-[320px]">
          <i data-lucide="search" className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2"></i>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Cari log..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/30 transition-all"
          />
        </div>
      </div>

      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">Log</h3>
          <span className="text-[10px] text-gray-500 font-jetbrains">{filtered.length} baris</span>
        </div>
        <div className="space-y-1.5 max-h-[520px] overflow-y-auto font-jetbrains text-[11px]">
          {filtered.length ? (
            filtered.map((row) => {
              const c = TYPE_COLORS[row.type] || '#9CA3AF'
              const tag = TYPE_LABELS[row.type] || row.type?.toUpperCase?.() || 'LOG'
              const isAlert = String(row.msg || '').toLowerCase().includes('error') || String(row.msg || '').toLowerCase().includes('spike')
              return (
                <div key={row.id} className="flex items-center gap-2 py-2 px-2 rounded-lg hover:bg-white/[.03] transition-colors">
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0" style={{ background: c + '18', color: c, border: '1px solid ' + c + '25' }}>
                    {tag}
                  </span>
                  <span className={'w-1.5 h-1.5 rounded-full flex-shrink-0 ' + (isAlert ? 'bg-red-400' : 'bg-white/20')}></span>
                  <span className="text-gray-300 flex-1 min-w-0 break-words">{row.msg}</span>
                  <span className="text-gray-600 flex-shrink-0">{row.ts}</span>
                </div>
              )
            })
          ) : (
            <div className="text-xs text-gray-500">Belum ada aktivitas.</div>
          )}
        </div>
      </div>
    </div>
  )
}

function IntegrationsView() {
  const [tab, setTab] = useState('channels')
  const [query, setQuery] = useState('')
  const [connected, setConnected] = useState(() => {
    try {
      const raw = window.localStorage.getItem('integrations:connected:v1')
      if (!raw) return {}
      const parsed = JSON.parse(raw)
      if (parsed && typeof parsed === 'object') return parsed
    } catch {}
    return {}
  })

  const items = useMemo(
    () => ({
      channels: [
        { id: 'whatsapp', name: 'WhatsApp Business', desc: 'Kanal chat pelanggan (Cloud API / provider).', icon: 'message-circle', c: '#10B981' },
        { id: 'telegram', name: 'Telegram', desc: 'Notifikasi internal & eskalasi ke human.', icon: 'send', c: '#3B82F6' },
        { id: 'email', name: 'Email (SMTP)', desc: 'Kirim invoice, notifikasi, dan report.', icon: 'mail', c: '#F59E0B' },
        { id: 'slack', name: 'Slack', desc: 'Alert campaign & notifikasi tim.', icon: 'hash', c: '#a855f7' },
      ],
      data: [
        { id: 'google_sheets', name: 'Google Sheets', desc: 'Lookup stok, price list, dan data referensi.', icon: 'table', c: '#10B981' },
        { id: 'drive', name: 'Google Drive', desc: 'Simpan file hasil proses & arsip dokumen.', icon: 'folder', c: '#3B82F6' },
        { id: 'webhook', name: 'Webhook (HTTP)', desc: 'Integrasi ke sistem eksternal via HTTP.', icon: 'webhook', c: '#F59E0B' },
        { id: 'database', name: 'Database', desc: 'Simpan transaksi, log, dan data workflow.', icon: 'database', c: '#06B6D4' },
      ],
      ai: [
        { id: 'openai', name: 'OpenAI', desc: 'Chat/vision untuk workflow AI.', icon: 'brain', c: '#a855f7' },
        { id: 'ollama', name: 'Ollama', desc: 'Model lokal untuk inference.', icon: 'cpu', c: '#3B82F6' },
        { id: 'vector', name: 'Vector Store', desc: 'RAG: embedding + pencarian dokumen.', icon: 'layers', c: '#10B981' },
      ],
    }),
    [],
  )

  const list = useMemo(() => {
    const arr = items[tab] || []
    const q = query.trim().toLowerCase()
    if (!q) return arr
    return arr.filter((it) => it.name.toLowerCase().includes(q) || it.desc.toLowerCase().includes(q))
  }, [items, tab, query])

  useEffect(() => {
    window.lucide?.createIcons?.()
  }, [tab, query, connected])

  const toggle = (id) => {
    setConnected((prev) => {
      const next = { ...prev, [id]: !prev[id] }
      try {
        window.localStorage.setItem('integrations:connected:v1', JSON.stringify(next))
      } catch {}
      return next
    })
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 anim-up">
        <div>
          <h1 className="font-oswald font-light text-2xl tracking-tight">Integrasi</h1>
          <p className="text-gray-500 text-xs mt-0.5">Kelola koneksi kanal, sumber data, dan penyedia AI.</p>
        </div>
        <div className="relative w-full sm:w-[320px]">
          <i data-lucide="search" className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2"></i>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Cari integrasi..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/30 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap anim-up">
        {[
          { id: 'channels', label: 'Channel', icon: 'message-circle' },
          { id: 'data', label: 'Data', icon: 'database' },
          { id: 'ai', label: 'AI', icon: 'brain' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={
              'text-[10px] font-medium px-3 py-1.5 rounded-lg border transition-colors inline-flex items-center gap-1.5 ' +
              (tab === t.id ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'border-white/10 text-gray-400 hover:text-white hover:bg-white/5')
            }
          >
            <i data-lucide={t.icon} className="w-3.5 h-3.5"></i>
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {list.length ? (
          list.map((it) => {
            const on = !!connected[it.id]
            return (
              <div key={it.id} className="glass rounded-2xl p-5 border border-white/10">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: it.c + '12', border: '1px solid ' + it.c + '20' }}>
                      <i data-lucide={it.icon} className="w-5 h-5" style={{ color: it.c }}></i>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-100 truncate">{it.name}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">{it.desc}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggle(it.id)}
                    className={
                      'text-[10px] font-medium px-3 py-1.5 rounded-lg border transition-colors flex-shrink-0 ' +
                      (on ? 'border-green-500/20 bg-green-500/10 text-green-300 hover:bg-green-500/15' : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10')
                    }
                  >
                    {on ? 'Connected' : 'Connect'}
                  </button>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] text-gray-500">
                    <span className="flex items-center gap-1">
                      <span className={'w-1.5 h-1.5 rounded-full ' + (on ? 'bg-green-400' : 'bg-white/20')}></span>
                      {on ? 'Aktif' : 'Belum tersambung'}
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span className="hidden sm:inline">Mode: {tab.toUpperCase()}</span>
                  </div>
                  <button
                    type="button"
                    className="text-[10px] text-amber-400 hover:text-amber-300 transition-colors font-medium inline-flex items-center gap-1"
                    onClick={() => toggle(it.id)}
                  >
                    <i data-lucide="pencil" className="w-3.5 h-3.5"></i>
                    Konfigurasi
                  </button>
                </div>
              </div>
            )
          })
        ) : (
          <div className="glass rounded-2xl p-6 text-sm text-gray-400 col-span-full">Tidak ada integrasi ditemukan.</div>
        )}
      </div>
    </div>
  )
}

function SettingsView() {
  const [prefs, setPrefs] = useState(() => {
    try {
      const raw = window.localStorage.getItem('settings:prefs:v1')
      if (!raw) return null
      const parsed = JSON.parse(raw)
      if (parsed && typeof parsed === 'object') return parsed
    } catch {}
    return null
  })

  const [companyName, setCompanyName] = useState(prefs?.companyName || 'MyBing.ai')
  const [timezone, setTimezone] = useState(prefs?.timezone || 'Asia/Jakarta')
  const [theme, setTheme] = useState(prefs?.theme || 'dark')
  const [autoRun, setAutoRun] = useState(prefs?.autoRun ?? true)
  const [emailReports, setEmailReports] = useState(prefs?.emailReports ?? true)
  const [errorAlerts, setErrorAlerts] = useState(prefs?.errorAlerts ?? true)
  const [retention, setRetention] = useState(prefs?.retention || '30d')
  const [savedTip, setSavedTip] = useState(false)

  useEffect(() => {
    window.lucide?.createIcons?.()
  }, [savedTip])

  const save = () => {
    const next = { companyName, timezone, theme, autoRun, emailReports, errorAlerts, retention }
    try {
      window.localStorage.setItem('settings:prefs:v1', JSON.stringify(next))
    } catch {}
    setSavedTip(true)
    window.setTimeout(() => setSavedTip(false), 2000)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 anim-up">
        <div>
          <h1 className="font-oswald font-light text-2xl tracking-tight">Pengaturan</h1>
          <p className="text-gray-500 text-xs mt-0.5">Preferensi aplikasi, notifikasi, dan data.</p>
        </div>
        <div className="flex items-center gap-2">
          {savedTip ? (
            <span className="text-[10px] font-medium px-2.5 py-1 rounded-lg border border-green-500/20 bg-green-500/10 text-green-300 inline-flex items-center gap-1.5">
              <i data-lucide="check-circle" className="w-4 h-4"></i> Tersimpan
            </span>
          ) : null}
          <button
            type="button"
            onClick={save}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs px-4 py-2 rounded-xl transition-all hover:shadow-[0_0_25px_rgba(245,158,11,.3)]"
          >
            <i data-lucide="save" className="w-4 h-4"></i> Simpan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 space-y-4">
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold">Umum</h3>
                <p className="text-[10px] text-gray-500 mt-0.5">Identitas aplikasi dan regional</p>
              </div>
              <i data-lucide="settings" className="w-5 h-5 text-gray-500"></i>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-semibold tracking-wider uppercase text-gray-400 mb-1.5 block">Nama Workspace</label>
                <input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  type="text"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/30 transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold tracking-wider uppercase text-gray-400 mb-1.5 block">Timezone</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-gray-300 focus:outline-none focus:border-amber-500/30 appearance-none cursor-pointer"
                >
                  <option>Asia/Jakarta</option>
                  <option>Asia/Singapore</option>
                  <option>UTC</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-semibold tracking-wider uppercase text-gray-400 mb-1.5 block">Tema</label>
                <div className="flex items-center gap-2">
                  {[
                    { id: 'dark', label: 'Dark' },
                    { id: 'dim', label: 'Dim' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTheme(t.id)}
                      className={
                        'text-[10px] font-medium px-3 py-2 rounded-xl border transition-colors ' +
                        (theme === t.id ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'border-white/10 text-gray-400 hover:text-white hover:bg-white/5')
                      }
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-semibold tracking-wider uppercase text-gray-400 mb-1.5 block">Retensi Log</label>
                <select
                  value={retention}
                  onChange={(e) => setRetention(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-gray-300 focus:outline-none focus:border-amber-500/30 appearance-none cursor-pointer"
                >
                  <option value="7d">7 hari</option>
                  <option value="30d">30 hari</option>
                  <option value="90d">90 hari</option>
                </select>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold">Otomasi</h3>
                <p className="text-[10px] text-gray-500 mt-0.5">Perilaku auto-run dan rekomendasi</p>
              </div>
              <i data-lucide="zap" className="w-5 h-5 text-gray-500"></i>
            </div>
            <div className="space-y-3">
              <ToggleRow
                label="Jalankan workflow otomatis"
                desc="Workflow berjalan otomatis sesuai konfigurasi."
                value={autoRun}
                onChange={setAutoRun}
              />
              <ToggleRow
                label="Kirim laporan via email"
                desc="Kirim ringkasan harian/mingguan ke email admin."
                value={emailReports}
                onChange={setEmailReports}
              />
              <ToggleRow
                label="Alert saat error/spike"
                desc="Notifikasi jika ada error atau latency spike."
                value={errorAlerts}
                onChange={setErrorAlerts}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold">Akun</h3>
                <p className="text-[10px] text-gray-500 mt-0.5">Profil dan akses</p>
              </div>
              <i data-lucide="user" className="w-5 h-5 text-gray-500"></i>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-black text-xs font-bold">
                RA
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-200 truncate">Rizki Aditya</p>
                <p className="text-[10px] text-gray-500 truncate">Admin</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <button type="button" className="w-full glass text-xs font-medium py-2.5 rounded-xl text-gray-300 hover:bg-white/[.06] transition-all">
                Ganti Password
              </button>
              <button type="button" className="w-full glass text-xs font-medium py-2.5 rounded-xl text-gray-300 hover:bg-white/[.06] transition-all">
                Kelola Role
              </button>
            </div>
          </div>

          <div className="glass rounded-2xl p-5 border border-red-500/15">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-red-300">Zona Berbahaya</h3>
                <p className="text-[10px] text-gray-500 mt-0.5">Aksi yang mempengaruhi data</p>
              </div>
              <i data-lucide="alert-triangle" className="w-5 h-5 text-red-400"></i>
            </div>
            <button
              type="button"
              onClick={() => {
                try {
                  window.localStorage.removeItem('templateNodeConfig:v1')
                  window.localStorage.removeItem(WORKFLOWS_STORAGE_KEY)
                  window.localStorage.removeItem('integrations:connected:v1')
                } catch {}
                setSavedTip(true)
                window.setTimeout(() => setSavedTip(false), 2000)
              }}
              className="w-full text-xs font-semibold py-2.5 rounded-xl border border-red-500/25 bg-red-500/10 text-red-300 hover:bg-red-500/15 transition-all"
            >
              Reset Data Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ToggleRow({ label, desc, value, onChange }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-200">{label}</p>
        <p className="text-[10px] text-gray-500 mt-0.5">{desc}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange?.(!value)}
        className={
          'w-12 h-7 rounded-full border transition-colors relative flex-shrink-0 ' +
          (value ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-white/5 border-white/10')
        }
        aria-label={label}
      >
        <span
          className={'absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full transition-[left,background] ' + (value ? 'left-6 bg-emerald-400' : 'left-1 bg-gray-500')}
        ></span>
      </button>
    </div>
  )
}

function DokumenWorkflows({ workflows, selectedId, onSelect }) {
  const docs = useMemo(() => workflows.filter((w) => w.type === 'doc'), [workflows])
  const selected = useMemo(() => docs.find((w) => w.id === selectedId) || docs[0] || null, [docs, selectedId])
  const preset = useMemo(() => (selected ? getDokumenFlowPreset(selected) : null), [selected])

  useEffect(() => {
    if (!selected) return
    if (selectedId === selected.id) return
    onSelect?.(selected.id)
  }, [selected, selectedId, onSelect])

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-4">
      <div className="glass rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">Daftar Workflow</h3>
          <span className="text-[10px] text-gray-500">{docs.length}</span>
        </div>
        {docs.length ? (
          <div className="space-y-2">
            {docs.map((w) => (
              <button
                key={w.id}
                type="button"
                onClick={() => onSelect?.(w.id)}
                className={
                  'w-full text-left rounded-xl px-3 py-2 border transition-colors ' +
                  (selected?.id === w.id ? 'bg-amber-500/10 border-amber-500/30' : 'bg-white/[.02] border-white/10 hover:bg-white/[.04]')
                }
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <i data-lucide="file-text" className="w-4 h-4 text-amber-400"></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate text-gray-200">{w.name}</p>
                    <p className="text-[10px] text-gray-500 truncate">{w.trigger ?? '—'} · dibuat {w.created ?? '—'}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-xs text-gray-500">
            Belum ada workflow dokumen. Buat dulu dari menu Workflow dengan kategori Dokumen.
          </div>
        )}
      </div>

      <div className="glass rounded-2xl p-5">
        {selected ? (
          <WorkflowDokumen title={selected.name} {...(preset || {})} />
        ) : (
          <div className="text-sm text-gray-500">Pilih workflow dokumen untuk melihat detail flow.</div>
        )}
      </div>
    </div>
  )
}

function MarketingWorkflows({ workflows, selectedId, onSelect }) {
  const mkts = useMemo(() => workflows.filter((w) => w.type === 'mkt'), [workflows])
  const selected = useMemo(() => mkts.find((w) => w.id === selectedId) || mkts[0] || null, [mkts, selectedId])
  const preset = useMemo(() => (selected ? getMarketingFlowPreset(selected) : null), [selected])

  useEffect(() => {
    if (!selected) return
    if (selectedId === selected.id) return
    onSelect?.(selected.id)
  }, [selected, selectedId, onSelect])

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-4">
      <div className="glass rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">Daftar Workflow</h3>
          <span className="text-[10px] text-gray-500">{mkts.length}</span>
        </div>
        {mkts.length ? (
          <div className="space-y-2">
            {mkts.map((w) => (
              <button
                key={w.id}
                type="button"
                onClick={() => onSelect?.(w.id)}
                className={
                  'w-full text-left rounded-xl px-3 py-2 border transition-colors ' +
                  (selected?.id === w.id ? 'bg-blue-500/10 border-blue-500/30' : 'bg-white/[.02] border-white/10 hover:bg-white/[.04]')
                }
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <i data-lucide="megaphone" className="w-4 h-4 text-blue-400"></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate text-gray-200">{w.name}</p>
                    <p className="text-[10px] text-gray-500 truncate">{w.trigger ?? '—'} · dibuat {w.created ?? '—'}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-xs text-gray-500">Belum ada workflow marketing. Buat dulu dari menu Workflow dengan kategori Marketing.</div>
        )}
      </div>

      <div className="glass rounded-2xl p-5">
        {selected ? (
          <WorkflowDokumen title={selected.name} {...(preset || {})} />
        ) : (
          <div className="text-sm text-gray-500">Pilih workflow marketing untuk melihat proses.</div>
        )}
      </div>
    </div>
  )
}

function SupportWorkflows({ workflows, selectedId, onSelect }) {
  const sups = useMemo(() => workflows.filter((w) => w.type === 'sup'), [workflows])
  const selected = useMemo(() => sups.find((w) => w.id === selectedId) || sups[0] || null, [sups, selectedId])
  const preset = useMemo(() => (selected ? getSupportFlowPreset(selected) : null), [selected])

  useEffect(() => {
    if (!selected) return
    if (selectedId === selected.id) return
    onSelect?.(selected.id)
  }, [selected, selectedId, onSelect])

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-4">
      <div className="glass rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">Daftar Workflow</h3>
          <span className="text-[10px] text-gray-500">{sups.length}</span>
        </div>
        {sups.length ? (
          <div className="space-y-2">
            {sups.map((w) => (
              <button
                key={w.id}
                type="button"
                onClick={() => onSelect?.(w.id)}
                className={
                  'w-full text-left rounded-xl px-3 py-2 border transition-colors ' +
                  (selected?.id === w.id ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/[.02] border-white/10 hover:bg-white/[.04]')
                }
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <i data-lucide="headphones" className="w-4 h-4 text-emerald-400"></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate text-gray-200">{w.name}</p>
                    <p className="text-[10px] text-gray-500 truncate">{w.trigger ?? '—'} · dibuat {w.created ?? '—'}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-xs text-gray-500">Belum ada workflow support. Buat dulu dari menu Workflow dengan kategori Support.</div>
        )}
      </div>

      <div className="glass rounded-2xl p-5">
        {selected ? (
          <WorkflowDokumen title={selected.name} {...(preset || {})} />
        ) : (
          <div className="text-sm text-gray-500">Pilih workflow support untuk melihat proses.</div>
        )}
      </div>
    </div>
  )
}
