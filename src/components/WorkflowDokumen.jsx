import { useEffect, useMemo, useRef, useState } from 'react'

const NS = 'http://www.w3.org/2000/svg'
const TYPE_COLORS = { trigger: '#00d4aa', process: '#e89830', cond: '#ff6040', notif: '#ff3870', ok: '#30d868' }
const TYPE_ICONS = { trigger: 'zap', process: 'settings', cond: 'git-branch', notif: 'bell', ok: 'check-circle' }

const NODES = [
  { id: 'A', px: 22, py: 15, label: 'Trigger: PO dari Pelanggan', type: 'trigger' },
  { id: 'B', px: 36, py: 15, label: 'Ekstrak Data PO', type: 'process' },
  { id: 'C', px: 50, py: 15, label: 'Cek Stok?', type: 'cond' },
  { id: 'D', px: 62, py: 26, label: 'Buat Sales Order', type: 'process' },
  { id: 'E', px: 36, py: 26, label: 'Notif Tim Purchasing', type: 'notif' },
  { id: 'F', px: 74, py: 26, label: 'Buat Surat Jalan', type: 'process' },
  { id: 'G', px: 74, py: 36, label: 'Buat Faktur/Invoice', type: 'process' },
  { id: 'H', px: 62, py: 36, label: 'Buat Payment Link', type: 'process' },
  { id: 'I', px: 50, py: 36, label: 'Kirim Invoice & Link', type: 'process' },
  { id: 'J', px: 36, py: 56, label: 'Webhook Listener', type: 'process' },
  { id: 'K', px: 42, py: 70, label: 'Pembayaran Diterima?', type: 'cond' },
  { id: 'L', px: 25, py: 84, label: "Update Status 'Paid'", type: 'ok' },
  { id: 'M', px: 58, py: 84, label: 'Cek Due Date', type: 'cond' },
  { id: 'N', px: 58, py: 92, label: 'Kirim Reminder Otomatis', type: 'notif' },
  { id: 'O', px: 25, py: 92, label: 'Update DB & Konfirmasi', type: 'ok' },
]

const EDGES = [
  { from: 'A', to: 'B', fp: 'right', tp: 'left' },
  { from: 'B', to: 'C', fp: 'right', tp: 'left' },
  { from: 'C', to: 'D', fp: 'bottomRight', tp: 'top', lbl: 'Stok Tersedia' },
  { from: 'C', to: 'E', fp: 'bottomLeft', tp: 'top', lbl: 'Stok Kurang' },
  { from: 'D', to: 'F', fp: 'right', tp: 'left' },
  { from: 'F', to: 'G', fp: 'bottom', tp: 'top' },
  { from: 'G', to: 'H', fp: 'left', tp: 'right' },
  { from: 'H', to: 'I', fp: 'left', tp: 'right' },
  { from: 'I', to: 'J', fp: 'left', tp: 'right' },
  { from: 'J', to: 'K', fp: 'bottom', tp: 'top' },
  { from: 'K', to: 'L', fp: 'bottomLeft', tp: 'top', lbl: 'Ya' },
  { from: 'K', to: 'M', fp: 'bottomRight', tp: 'top', lbl: 'Tidak' },
  { from: 'M', to: 'N', fp: 'bottom', tp: 'top', lbl: 'Lewat Due Date' },
  { from: 'N', to: 'J', fp: 'loop', tp: 'loop' },
  { from: 'L', to: 'O', fp: 'bottom', tp: 'top' },
]

const SEQ = [
  { from: 'A', to: 'B', log: 'PO diterima dari pelanggan' },
  { from: 'B', to: 'C', log: 'Mengekstrak data PO' },
  { from: 'C', to: 'D', log: 'Stok tersedia — buat Sales Order', br: 'Stok Tersedia', skip: 'E' },
  { from: 'D', to: 'F', log: 'Buat Surat Jalan & update stok' },
  { from: 'F', to: 'G', log: 'Buat Faktur / Invoice' },
  { from: 'G', to: 'H', log: 'Buat payment link Stripe/Midtrans' },
  { from: 'H', to: 'I', log: 'Kirim invoice & link ke customer' },
  { from: 'I', to: 'J', log: 'Webhook listener tunggu pembayaran' },
  { from: 'J', to: 'K', log: 'Memeriksa status pembayaran' },
  { from: 'K', to: 'M', log: 'Pembayaran belum diterima', br: 'Tidak', skip: 'L' },
  { from: 'M', to: 'N', log: 'Lewat due date — kirim reminder', br: 'Lewat Due Date' },
  { from: 'N', to: 'J', log: 'Reminder terkirim, tunggu ulang' },
  { from: 'J', to: 'K', log: 'Cek pembayaran (percobaan 2)' },
  { from: 'K', to: 'L', log: 'Pembayaran diterima!', br: 'Ya', skip: 'M' },
  { from: 'L', to: 'O', log: 'Update database & kirim konfirmasi' },
]

function edgeKey(from, to) {
  return from + '→' + to
}

function nodeSizeFromRect(rect) {
  const nw = 36
  const nh = 36
  return { nw, nh }
}

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v))
}

function calcPositions(rect, nw, nh) {
  const minPy = 4
  const maxPy = 95
  const minY = 3
  const maxY = 96
  const byId = {}
  const isMobile = rect.width < 520
  const cx = rect.width / 2
  const cy = rect.height / 2
  const spreadX = isMobile ? 0.9 : 0.95
  const spreadY = isMobile ? 0.98 : 1.0
  const padX = Math.max(12, Math.round(nw * 0.1))
  const padY = Math.max(12, Math.round(nh * 0.4))

  const clampX = (x) => clamp(x, nw / 2 + padX, rect.width - nw / 2 - padX)
  const clampY = (y) => clamp(y, nh / 2 + padY, rect.height - nh / 2 - padY)
  const tmp = []

  NODES.forEach((n) => {
    let px = n.px
    let py = n.py
    if (isMobile) {
      // Compact horizontal layout, increase vertical spacing
      if (px > 50) px = 50 + (px - 50) * 0.85
      if (px < 50) px = 50 - (50 - px) * 0.85
      py = 4 + (py - 4) * 1.02
      if (n.id === 'J') py += 4
      if (n.id === 'G' || n.id === 'H' || n.id === 'I') py -= 2
    }
    let x = (px / 100) * rect.width
    let y = minY + ((py - minPy) / (maxPy - minPy)) * (maxY - minY)
    y = (y / 100) * rect.height
    x = cx + (x - cx) * spreadX
    y = cy + (y - cy) * spreadY
    x = clampX(x)
    y = clampY(y)
    tmp.push({ id: n.id, x, y, type: n.type })
  })

  if (isMobile) {
    const minDx = nw * 1.65
    const minDy = nh * 1.35
    for (let pass = 0; pass < 6; pass++) {
      for (let i = 0; i < tmp.length; i++) {
        for (let j = i + 1; j < tmp.length; j++) {
          const a = tmp[i]
          const b = tmp[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          if (Math.abs(dx) < minDx && Math.abs(dy) < minDy) {
            const pushX = (minDx - Math.abs(dx)) / 2 + 1
            const sx = dx >= 0 ? 1 : -1
            a.x = clampX(a.x + sx * pushX)
            b.x = clampX(b.x - sx * pushX)

            if (Math.abs(a.x - b.x) < minDx * 0.85) {
              const pushY = (minDy - Math.abs(dy)) / 2.2 + 0.5
              const sy = dy >= 0 ? 1 : -1
              a.y = clampY(a.y + sy * pushY)
              b.y = clampY(b.y - sy * pushY)
            }
          }
        }
      }
    }
  }

  tmp.forEach((p) => {
    byId[p.id] = { x: p.x, y: p.y, type: p.type }
  })
  return byId
}

function gp(pos, nw, nh, p) {
  const hw = nw / 2
  const hh = nh / 2
  switch (p) {
    case 'bottom':
      return { x: pos.x, y: pos.y + hh }
    case 'bottomLeft':
      return { x: pos.x - hw * 0.35, y: pos.y + hh }
    case 'bottomRight':
      return { x: pos.x + hw * 0.35, y: pos.y + hh }
    case 'right':
      return { x: pos.x + hw, y: pos.y }
    case 'left':
      return { x: pos.x - hw, y: pos.y }
    case 'top':
      return { x: pos.x, y: pos.y - hh }
    default:
      return { x: pos.x, y: pos.y }
  }
}

function laneOffset(edge, isMobile) {
  if (!isMobile) return 0
  const k = edgeKey(edge.from, edge.to)
  const map = {
    [edgeKey('C', 'D')]: 14,
    [edgeKey('C', 'E')]: -14,
    [edgeKey('F', 'G')]: 8,
    [edgeKey('I', 'J')]: -10,
    [edgeKey('J', 'K')]: -6,
    [edgeKey('K', 'L')]: -14,
    [edgeKey('K', 'M')]: 14,
    [edgeKey('M', 'N')]: 10,
    [edgeKey('L', 'O')]: -8,
  }
  return map[k] ?? 0
}

function makePD(edge, posById, nw, nh, isMobile) {
  const a = gp(posById[edge.from], nw, nh, edge.fp)
  const b = gp(posById[edge.to], nw, nh, edge.tp)
  const lane = laneOffset(edge, isMobile)
  const isH = (edge.fp === 'right' && edge.tp === 'left') || (edge.fp === 'left' && edge.tp === 'right')
  if (isH) {
    if (Math.abs(a.y - b.y) < 1) return `M${a.x},${a.y}L${b.x},${b.y}`
    const mx = (a.x + b.x) / 2 + lane
    return `M${a.x},${a.y}L${mx},${a.y}L${mx},${b.y}L${b.x},${b.y}`
  }
  const isV = (edge.fp === 'bottom' && edge.tp === 'top')
  if (isV) {
    if (!lane) return `M${a.x},${a.y}L${b.x},${b.y}`
    const vx = a.x + lane
    return `M${a.x},${a.y}L${vx},${a.y}L${vx},${b.y}L${b.x},${b.y}`
  }
  const my = (a.y + b.y) / 2
  if (!lane) return `M${a.x},${a.y}L${a.x},${my}L${b.x},${my}L${b.x},${b.y}`
  const vx = a.x + lane
  return `M${a.x},${a.y}L${vx},${a.y}L${vx},${my}L${b.x},${my}L${b.x},${b.y}`
}

function makeLoopPD(posById, nw, rectWidth, isMobile) {
  const n = posById.N
  const j = posById.J
  const ax = n.x + nw / 2
  const ay = n.y
  const bx = j.x + nw / 2
  const by = j.y
  const off = isMobile ? Math.min(26, Math.max(14, nw * 0.75)) : Math.min(32, Math.max(18, nw))
  const loopX = Math.min(ax, bx) - off
  return `M${ax},${ay}L${loopX},${ay}L${loopX},${by}L${bx},${by}`
}

function labelPos(edge, posById, nw, nh) {
  if (edge.from === 'M' && edge.to === 'N') {
    const a = gp(posById[edge.from], nw, nh, edge.fp)
    const b = gp(posById[edge.to], nw, nh, edge.tp)
    return { x: a.x - 55, y: (a.y + b.y) / 2 }
  }
  const adjust = {
    [edgeKey('C', 'D')]: { ox: 0, oy: -16 },
    [edgeKey('C', 'E')]: { ox: -10, oy: -10 },
    [edgeKey('K', 'L')]: { ox: -20, oy: -10 },
    [edgeKey('K', 'M')]: { ox: 20, oy: -10 },
  }
  const a = gp(posById[edge.from], nw, nh, edge.fp)
  const b = gp(posById[edge.to], nw, nh, edge.tp)
  const mx = (a.x + b.x) / 2
  const my = (a.y + b.y) / 2
  let ox = 0
  let oy = 0
  if (edge.fp === 'right' || edge.fp === 'left') {
    oy = -11
  } else if (edge.fp === 'bottomLeft') {
    ox = -12
    oy = -4
  } else if (edge.fp === 'bottomRight') {
    ox = 12
    oy = -4
  } else {
    ox = 18
  }
  const k = edgeKey(edge.from, edge.to)
  const a2 = adjust[k]
  if (a2) {
    ox += a2.ox
    oy += a2.oy
  }
  return { x: mx + ox, y: my + oy }
}

export default function WorkflowDokumen({ title = 'n8n Flow — PO Processing' }) {
  const containerRef = useRef(null)
  const svgRef = useRef(null)
  const pathRefMap = useRef({})
  const nodeRefMap = useRef({})
  const genRef = useRef(0)
  const [layout, setLayout] = useState(null)
  const [loopN, setLoopN] = useState(0)
  const [logs, setLogs] = useState([])
  const [nodeStatus, setNodeStatus] = useState({})
  const [edgeStatus, setEdgeStatus] = useState({})
  const [labelStatus, setLabelStatus] = useState({})
  const [activityExpanded, setActivityExpanded] = useState(false)
  const [nodeTip, setNodeTip] = useState(null)
  const tipTimerRef = useRef(null)

  const computed = useMemo(() => {
    if (!layout) return null
    const posById = calcPositions(layout.rect, layout.nw, layout.nh)
    const paths = {}
    const labels = {}
    EDGES.forEach((e) => {
      const k = edgeKey(e.from, e.to)
      paths[k] = e.fp === 'loop' ? makeLoopPD(posById, layout.nw, layout.rect.width, layout.isMobile) : makePD(e, posById, layout.nw, layout.nh, layout.isMobile)
      if (e.lbl && e.fp !== 'loop') labels[k] = labelPos(e, posById, layout.nw, layout.nh)
    })
    return { posById, paths, labels }
  }, [layout])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      const rect = el.getBoundingClientRect()
      const isMobile = rect.width < 520
      const { nw, nh } = nodeSizeFromRect(rect)
      setLayout({ rect, nw, nh, isMobile })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    window.lucide?.createIcons?.()
  })

  useEffect(() => {
    return () => {
      if (tipTimerRef.current) window.clearTimeout(tipTimerRef.current)
    }
  }, [])

  const computeTipPos = (id) => {
    const el = nodeRefMap.current[id]
    if (!el) return null
    const r = el.getBoundingClientRect()
    const midX = r.left + r.width / 2
    const topY = r.top - 10
    const bottomY = r.bottom + 10
    const useTop = topY > 42
    return { x: midX, y: useTop ? topY : bottomY, place: useTop ? 'top' : 'bottom' }
  }

  const showNodeTip = (id, persist = false) => {
    const n = NODES.find((x) => x.id === id)
    if (!n) return
    const pos = computeTipPos(id)
    if (!pos) return
    setNodeTip({ id, label: n.label, ...pos })
    if (!persist) return
    if (tipTimerRef.current) window.clearTimeout(tipTimerRef.current)
    tipTimerRef.current = window.setTimeout(() => setNodeTip(null), 2500)
  }

  const hideNodeTip = (id) => {
    setNodeTip((prev) => {
      if (!prev) return prev
      if (id && prev.id !== id) return prev
      return null
    })
  }

  useEffect(() => {
    if (!nodeTip) return
    const onReflow = () => {
      const pos = computeTipPos(nodeTip.id)
      if (!pos) return
      setNodeTip((prev) => (prev ? { ...prev, ...pos } : prev))
    }
    window.addEventListener('resize', onReflow)
    window.addEventListener('scroll', onReflow, true)
    return () => {
      window.removeEventListener('resize', onReflow)
      window.removeEventListener('scroll', onReflow, true)
    }
  }, [nodeTip])

  useEffect(() => {
    if (!computed || !svgRef.current) return

    const wait = (ms) => new Promise((r) => window.setTimeout(r, ms))
    const resetAll = () => {
      setNodeStatus({})
      setEdgeStatus({})
      setLabelStatus({})
      setLogs([])
      setNodeTip(null)
    }

    const addLog = (text, br) => {
      setLogs((prev) => {
        const idx = prev.length + 1
        const next = [...prev, { idx, text, br }]
        return next.slice(-40)
      })
    }

    const animTok = (from, to) => {
      const svgEl = svgRef.current
      const pe = pathRefMap.current[edgeKey(from, to)]
      if (!svgEl || !pe) return Promise.resolve()
      const len = pe.getTotalLength()
      const col = TYPE_COLORS[computed.posById[from]?.type] || TYPE_COLORS.process
      const dur = Math.max(200, len / 0.04)
      const g = document.createElementNS(NS, 'g')
      svgEl.appendChild(g)

      const trails = []
      for (let i = 0; i < 5; i++) {
        const c = document.createElementNS(NS, 'circle')
        c.setAttribute('r', String(Math.max(0.3, 1.8 - i * 0.25)))
        c.setAttribute('fill', col)
        c.setAttribute('opacity', '0')
        g.appendChild(c)
        trails.push(c)
      }

      const gw = document.createElementNS(NS, 'circle')
      gw.setAttribute('r', '7')
      gw.setAttribute('fill', col)
      gw.setAttribute('opacity', '.1')
      gw.setAttribute('filter', 'url(#gl)')
      g.appendChild(gw)

      const cr = document.createElementNS(NS, 'circle')
      cr.setAttribute('r', '2.5')
      cr.setAttribute('fill', '#fff')
      g.appendChild(cr)

      const cd = document.createElementNS(NS, 'circle')
      cd.setAttribute('r', '1.8')
      cd.setAttribute('fill', col)
      g.appendChild(cd)

      const t0 = performance.now()
      const mg = genRef.current

      return new Promise((res) => {
        const tick = (now) => {
          if (mg !== genRef.current) {
            g.remove()
            res()
            return
          }
          const p = Math.min((now - t0) / dur, 1)
          const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2
          const pt = pe.getPointAtLength(e * len)
          cr.setAttribute('cx', pt.x)
          cr.setAttribute('cy', pt.y)
          cd.setAttribute('cx', pt.x)
          cd.setAttribute('cy', pt.y)
          gw.setAttribute('cx', pt.x)
          gw.setAttribute('cy', pt.y)
          trails.forEach((c, i) => {
            const tp = Math.max(0, e - (i + 1) * 0.03)
            const tpt = pe.getPointAtLength(tp * len)
            c.setAttribute('cx', tpt.x)
            c.setAttribute('cy', tpt.y)
            c.setAttribute('opacity', String(Math.max(0, 0.28 - i * 0.05)))
          })
          if (p < 1) requestAnimationFrame(tick)
          else {
            g.remove()
            res()
          }
        }
        requestAnimationFrame(tick)
      })
    }

    const celebrate = () => {
      const svgEl = svgRef.current
      const o = computed.posById.O
      if (!svgEl || !o) return
      const cols = Object.values(TYPE_COLORS)
      const ps = []
      for (let i = 0; i < 20; i++) {
        const a = (Math.PI * 2) / 20 * i + (Math.random() - 0.5) * 0.5
        const s = 1 + Math.random() * 3
        const c = cols[Math.floor(Math.random() * cols.length)]
        const el = document.createElementNS(NS, 'circle')
        el.setAttribute('r', String(0.8 + Math.random() * 1.5))
        el.setAttribute('fill', c)
        el.setAttribute('opacity', '1')
        svgEl.appendChild(el)
        ps.push({ el, x: o.x, y: o.y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 1.5, l: 1, d: 0.014 + Math.random() * 0.016 })
      }
      const mg = genRef.current
      const tick = () => {
        if (mg !== genRef.current) {
          ps.forEach((p) => p.el.remove())
          return
        }
        let alive = false
        ps.forEach((p) => {
          if (p.l <= 0) {
            p.el.remove()
            return
          }
          alive = true
          p.x += p.vx
          p.y += p.vy
          p.vy += 0.05
          p.l -= p.d
          p.el.setAttribute('cx', p.x)
          p.el.setAttribute('cy', p.y)
          p.el.setAttribute('opacity', String(Math.max(0, p.l)))
        })
        if (alive) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }

    const run = async () => {
      while (true) {
        genRef.current += 1
        const mg = genRef.current
        setLoopN((v) => v + 1)
        resetAll()
        await wait(400)
        if (mg !== genRef.current) return
        for (let i = 0; i < SEQ.length; i++) {
          if (mg !== genRef.current) return
          const s = SEQ[i]
          const k = edgeKey(s.from, s.to)
          setEdgeStatus((prev) => ({ ...prev, [k]: 'lit' }))
          if (computed.labels[k]) setLabelStatus((prev) => ({ ...prev, [k]: 'lit' }))
          if (s.skip) {
            const skipK = edgeKey(s.from, s.skip)
            setEdgeStatus((prev) => ({ ...prev, [skipK]: 'dim' }))
            if (computed.labels[skipK]) setLabelStatus((prev) => ({ ...prev, [skipK]: 'dim' }))
            setNodeStatus((prev) => ({ ...prev, [s.skip]: 'dim' }))
          }
          setNodeStatus((prev) => ({ ...prev, [s.from]: 'active' }))
          addLog(s.log, s.br)
          await animTok(s.from, s.to)
          if (mg !== genRef.current) return
          setEdgeStatus((prev) => ({ ...prev, [k]: 'visited' }))
          setNodeStatus((prev) => ({ ...prev, [s.from]: 'done', [s.to]: 'active' }))
          await wait(280)
        }
        if (mg !== genRef.current) return
        setNodeStatus((prev) => ({ ...prev, O: 'done' }))
        celebrate()
        await wait(1800)
      }
    }

    run()
    return () => {
      genRef.current += 1
      setNodeStatus({})
      setEdgeStatus({})
      setLabelStatus({})
      setLogs([])
    }
  }, [computed])

  return (
    <div className="w-full relative flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold text-gray-200">{title}</div>
        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-jetbrains">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          Auto
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative rounded-2xl border border-white/10 overflow-hidden h-[72dvh] max-h-[800px] min-h-[480px]"
        style={{
          background: '#0d0f18',
          backgroundImage: 'radial-gradient(circle,#1a1d2e 1px,transparent 1px)',
          backgroundSize: '14px 14px',
        }}
      >
          <svg ref={svgRef} className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <filter id="gl">
                <feGaussianBlur stdDeviation="3" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="eg">
                <feGaussianBlur stdDeviation="2" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {computed
              ? EDGES.map((e) => {
                  const k = edgeKey(e.from, e.to)
                  const state = edgeStatus[k] || 'idle'
                  const col = TYPE_COLORS[computed.posById[e.from]?.type] || '#262b42'
                  const stroke = state === 'dim' ? 'rgba(239,68,68,0.75)' : state === 'lit' ? col : state === 'visited' ? col + '35' : '#262b42'
                  const opacity = state === 'dim' ? 0.65 : 1
                  const strokeWidth = state === 'lit' ? 2 : 1.5
                  return (
                    <path
                      key={k}
                      ref={(el) => {
                        if (el) pathRefMap.current[k] = el
                      }}
                      d={computed.paths[k]}
                      fill="none"
                      stroke={stroke}
                      strokeWidth={strokeWidth}
                      opacity={opacity}
                      strokeDasharray={state === 'dim' ? '4 4' : undefined}
                      strokeLinecap="round"
                      filter={state === 'lit' ? 'url(#eg)' : undefined}
                    />
                  )
                })
              : null}
          </svg>

          {computed && layout && !layout.isMobile
            ? EDGES.filter((e) => e.lbl && e.fp !== 'loop').map((e) => {
                const k = edgeKey(e.from, e.to)
                const p = computed.labels[k]
                const st = labelStatus[k] || 'idle'
                return (
                  <div key={k} className="absolute z-30 pointer-events-none" style={{ left: p.x, top: p.y, transform: 'translate(-50%,-50%)' }}>
                    <span
                      className={
                        'text-[10px] font-semibold px-2 py-0.5 rounded-md border border-white/10 bg-[#0d0f18]/90 text-gray-500 ' +
                        (st === 'lit' ? 'text-orange-400 border-orange-500/40 bg-orange-500/10 shadow-[0_0_8px_rgba(251,191,36,0.2)]' : '') +
                        (st === 'dim' ? 'opacity-40' : '')
                      }
                    >
                      {e.lbl}
                    </span>
                  </div>
                )
              })
            : null}

          {computed
            ? NODES.map((n) => {
                const pos = computed.posById[n.id]
                const st = nodeStatus[n.id] || 'idle'
                const c = TYPE_COLORS[n.type] || TYPE_COLORS.process
                const icon = TYPE_ICONS[n.type] || 'settings'
                const shadow =
                  st === 'active'
                    ? `0 0 10px ${c}55, 0 0 22px ${c}22`
                    : st === 'done' || st === 'visited'
                      ? `0 0 5px ${c}22`
                      : 'none'
                const opacity = st === 'dim' ? 0.35 : 1
                const dimCol = '#EF4444'
                return (
                  <div
                    key={n.id}
                    ref={(el) => {
                      if (el) nodeRefMap.current[n.id] = el
                    }}
                    className={
                      'absolute z-20 w-9 h-9 rounded-xl border border-[#262b42] transition-[opacity,box-shadow,border-color,background] duration-300 flex items-center justify-center ' +
                      (st === 'active' ? 'animate-pulse-subtle' : '')
                    }
                    style={{
                      left: pos.x - 18,
                      top: pos.y - 18,
                      borderColor:
                        st === 'dim'
                          ? dimCol
                          : st === 'active'
                            ? c
                            : st === 'done' || st === 'visited'
                              ? c + '44'
                              : '#262b42',
                      boxShadow: st === 'dim' ? '0 0 0 1px rgba(239,68,68,0.25), 0 0 12px rgba(239,68,68,0.12)' : shadow,
                      opacity,
                      background: st === 'dim' ? 'rgba(239,68,68,0.08)' : st === 'active' ? '#1e2235' : st === 'done' || st === 'visited' ? '#141721' : '#161924',
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={n.label}
                    onMouseEnter={() => showNodeTip(n.id)}
                    onMouseLeave={() => hideNodeTip(n.id)}
                    onFocus={() => showNodeTip(n.id)}
                    onBlur={() => hideNodeTip(n.id)}
                    onClick={(e) => {
                      e.stopPropagation()
                      setNodeTip((prev) => (prev?.id === n.id ? null : prev))
                      window.setTimeout(() => showNodeTip(n.id, true), 0)
                    }}
                    onKeyDown={(e) => {
                      if (e.key !== 'Enter' && e.key !== ' ') return
                      e.preventDefault()
                      setNodeTip((prev) => (prev?.id === n.id ? null : prev))
                      window.setTimeout(() => showNodeTip(n.id, true), 0)
                    }}
                  >
                    <i data-lucide={icon} className="w-4 h-4" style={{ color: st === 'dim' ? dimCol : c }}></i>
                  </div>
                )
              })
            : null}
      </div>

      {nodeTip ? (
        <div
          className="fixed z-[80] px-3 py-2 rounded-xl glass-strong border border-white/10 text-white text-[11px] shadow-[0_10px_35px_rgba(0,0,0,0.45)] pointer-events-none max-w-[260px]"
          style={{
            left: nodeTip.x,
            top: nodeTip.y,
            transform: nodeTip.place === 'top' ? 'translate(-50%,-100%)' : 'translate(-50%,0)',
          }}
        >
          {nodeTip.label}
        </div>
      ) : null}

      <div
        className={
          'md:absolute md:bottom-3 md:right-3 z-30 glass-strong rounded-2xl border border-white/10 overflow-hidden shadow-[0_18px_55px_rgba(0,0,0,0.55)] flex flex-col transition-[width,height] duration-200 ' +
          (activityExpanded ? 'w-full md:w-[280px] h-[260px]' : 'w-full md:w-[180px] h-[130px]')
        }
      >
        <div className="px-2.5 py-1.5 border-b border-white/10 flex items-center justify-between">
          <span className="text-[9px] font-semibold tracking-wider uppercase text-gray-500">Aktivitas</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-jetbrains text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">#{loopN || 1}</span>
            <button
              type="button"
              onClick={() => setActivityExpanded((v) => !v)}
              className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              aria-label={activityExpanded ? 'Perkecil aktivitas' : 'Perbesar aktivitas'}
            >
              <i data-lucide={activityExpanded ? 'minimize-2' : 'maximize-2'} className="w-3.5 h-3.5 text-gray-400"></i>
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-0 py-0.5">
          {logs.length ? (
            logs.map((l) => (
              <div key={l.idx} className="px-2.5 py-0.5 flex items-start gap-2 text-[8px] text-gray-500 font-jetbrains min-w-0">
                <span className="text-gray-600 w-4 flex-shrink-0">{String(l.idx).padStart(2, '0')}</span>
                <span className="flex-1 min-w-0 break-words">
                  {l.text}
                  {l.br ? (
                    <span
                      className={
                        'ml-1.5 text-[8px] font-semibold px-1.5 rounded border ' +
                        (l.br === 'Ya' || l.br === 'Stok Tersedia'
                          ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                          : l.br === 'Tidak' || l.br === 'Stok Kurang'
                            ? 'border-pink-500/20 bg-pink-500/10 text-pink-400'
                            : 'border-orange-500/20 bg-orange-500/10 text-orange-400')
                      }
                    >
                      {l.br === 'Stok Tersedia' ? 'Stok' : l.br === 'Stok Kurang' ? 'Kurang' : l.br === 'Lewat Due Date' ? 'Due' : l.br}
                    </span>
                  ) : null}
                </span>
              </div>
            ))
          ) : (
            <div className="px-2.5 py-2 text-[8px] text-gray-600">Menjalankan workflow…</div>
          )}
        </div>
      </div>
    </div>
  )
}
