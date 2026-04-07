import { useEffect, useRef } from 'react'

export default function AnimasiSection() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const cv = canvasRef.current
    if (!cv) return

    const cx = cv.getContext('2d')
    if (!cx) return

    const W = cv.width
    const H = cv.height
    let t = 0
    let mx = -999
    let my = -999
    let mIn = false
    let rafId = 0

    const onMouseMove = (e) => {
      const r = cv.getBoundingClientRect()
      mx = (e.clientX - r.left) * (W / r.width)
      my = (e.clientY - r.top) * (H / r.height)
      mIn = true
    }

    const onMouseLeave = () => {
      mIn = false
      mx = -999
      my = -999
    }

    cv.addEventListener('mousemove', onMouseMove)
    cv.addEventListener('mouseleave', onMouseLeave)

    const COL = {
      trigger: { bg: '#22c55e', glow: 'rgba(34,197,94,', text: '#fff' },
      storage: { bg: '#3b82f6', glow: 'rgba(59,130,246,', text: '#fff' },
      ai: { bg: '#a855f7', glow: 'rgba(168,85,247,', text: '#fff' },
      process: { bg: '#f59e0b', glow: 'rgba(245,158,11,', text: '#000' },
      memory: { bg: '#06b6d4', glow: 'rgba(6,182,212,', text: '#000' },
      tool: { bg: '#64748b', glow: 'rgba(100,116,139,', text: '#fff' },
    }

    const NW = 156
    const NH = 52
    const R = 12

    function makeNodes() {
      const LX = 80
      const RX = 620
      return [
        {
          id: 0,
          x: LX,
          y: 40,
          w: NW,
          h: NH,
          type: 'trigger',
          label: 'Google Drive',
          sub: 'Trigger',
          icon: 'drive',
          ports: [{ s: 'bottom', p: 0.5 }],
        },
        {
          id: 1,
          x: LX,
          y: 140,
          w: NW,
          h: NH,
          type: 'tool',
          label: 'Google Drive',
          sub: 'Download',
          icon: 'download',
          ports: [
            { s: 'top', p: 0.5 },
            { s: 'bottom', p: 0.5 },
          ],
        },
        {
          id: 2,
          x: LX + 10,
          y: 240,
          w: NW,
          h: NH,
          type: 'process',
          label: 'Edit Fields',
          sub: 'v1',
          icon: 'edit',
          ports: [
            { s: 'top', p: 0.5 },
            { s: 'bottom', p: 0.5 },
          ],
        },
        {
          id: 3,
          x: LX + 50,
          y: 340,
          w: NW + 20,
          h: NH + 4,
          type: 'process',
          label: 'Recursive Character',
          sub: 'Text Splitter',
          icon: 'split',
          ports: [
            { s: 'top', p: 0.5 },
            { s: 'right', p: 0.5 },
            { s: 'bottom', p: 0.35 },
            { s: 'bottom', p: 0.65 },
          ],
        },
        {
          id: 4,
          x: LX + 320,
          y: 300,
          w: NW,
          h: NH,
          type: 'ai',
          label: 'Embeddings',
          sub: 'OpenAI',
          icon: 'embed',
          ports: [
            { s: 'left', p: 0.5 },
            { s: 'right', p: 0.5 },
          ],
        },
        {
          id: 5,
          x: LX + 320,
          y: 200,
          w: NW,
          h: NH,
          type: 'tool',
          label: 'Default Data',
          sub: 'Loader',
          icon: 'loader',
          ports: [
            { s: 'bottom', p: 0.5 },
            { s: 'right', p: 0.5 },
          ],
        },
        {
          id: 6,
          x: LX + 320,
          y: 400,
          w: NW,
          h: NH,
          type: 'storage',
          label: 'Simple Vector',
          sub: 'Store',
          icon: 'vector',
          ports: [
            { s: 'left', p: 0.5 },
            { s: 'top', p: 0.5 },
          ],
        },
        {
          id: 7,
          x: RX,
          y: 40,
          w: NW,
          h: NH,
          type: 'trigger',
          label: 'When Chat Msg',
          sub: 'Received',
          icon: 'chat',
          ports: [{ s: 'bottom', p: 0.5 }],
        },
        {
          id: 8,
          x: RX - 10,
          y: 155,
          w: NW + 20,
          h: NH + 8,
          type: 'ai',
          label: 'AI Agent',
          sub: '',
          icon: 'agent',
          ports: [
            { s: 'top', p: 0.5 },
            { s: 'bottom', p: 0.5 },
            { s: 'right', p: 0.3 },
            { s: 'right', p: 0.7 },
          ],
        },
        {
          id: 9,
          x: RX + 230,
          y: 100,
          w: NW,
          h: NH,
          type: 'ai',
          label: 'OpenAI Chat',
          sub: 'Model',
          icon: 'openai',
          ports: [{ s: 'left', p: 0.5 }],
        },
        {
          id: 10,
          x: RX + 230,
          y: 200,
          w: NW,
          h: NH,
          type: 'memory',
          label: 'Simple Memory',
          sub: '',
          icon: 'memory',
          ports: [{ s: 'left', p: 0.5 }],
        },
        {
          id: 11,
          x: RX + 230,
          y: 340,
          w: NW,
          h: NH,
          type: 'storage',
          label: 'Simple Vector',
          sub: 'Store',
          icon: 'vector',
          ports: [
            { s: 'left', p: 0.5 },
            { s: 'top', p: 0.5 },
          ],
        },
        {
          id: 12,
          x: RX + 230,
          y: 440,
          w: NW,
          h: NH,
          type: 'tool',
          label: 'Retrieval QA',
          sub: 'Chain',
          icon: 'qa',
          ports: [
            { s: 'top', p: 0.5 },
            { s: 'left', p: 0.5 },
          ],
        },
        {
          id: 13,
          x: RX - 30,
          y: 530,
          w: NW + 40,
          h: NH,
          type: 'trigger',
          label: 'Chat Response',
          sub: 'Output',
          icon: 'output',
          ports: [{ s: 'top', p: 0.5 }],
        },
      ]
    }

    const rawNodes = makeNodes()
    const nodes = rawNodes.map((n, i) => ({
      ...n,
      bx: n.x + n.w / 2,
      by: n.y + n.h / 2,
      px: n.x,
      py: n.y,
      hovered: false,
      phase: i * 0.6,
      enterDelay: i * 0.08,
    }))

    const edges = [
      [0, 0, 1, 0],
      [1, 1, 2, 0],
      [2, 1, 3, 0],
      [3, 1, 4, 0],
      [3, 2, 5, 0],
      [5, 1, 4, 0],
      [4, 1, 6, 0],
      [3, 3, 6, 0],
      [7, 0, 8, 0],
      [8, 2, 9, 0],
      [8, 3, 10, 0],
      [8, 1, 12, 1],
      [11, 1, 12, 0],
      [12, 1, 13, 0],
      [8, 1, 13, 0],
    ]

    function portPos(node, port) {
      const nx = node.px
      const ny = node.py
      const nw = node.w
      const nh = node.h
      switch (port.s) {
        case 'top':
          return { x: nx + nw * port.p, y: ny }
        case 'bottom':
          return { x: nx + nw * port.p, y: ny + nh }
        case 'left':
          return { x: nx, y: ny + nh * port.p }
        case 'right':
          return { x: nx + nw, y: ny + nh * port.p }
      }
    }

    class FP {
      constructor(ei) {
        this.ei = ei
        this.t = Math.random()
        this.spd = 0.003 + Math.random() * 0.004
        this.sz = 1.5 + Math.random() * 1.5
      }
      update() {
        this.t += this.spd
        if (this.t > 1) this.t -= 1
      }
      draw() {}
    }

    const fps = []
    edges.forEach((_, i) => {
      for (let j = 0; j < 3; j++) fps.push(new FP(i))
    })

    const amb = Array.from({ length: 40 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      s: Math.random() + 0.3,
      a: Math.random() * 0.06 + 0.02,
    }))

    function drawIcon(x, y, s, type) {
      cx.save()
      cx.strokeStyle = '#fff'
      cx.fillStyle = '#fff'
      cx.lineWidth = 1.5
      cx.lineCap = 'round'
      cx.lineJoin = 'round'

      switch (type) {
        case 'drive':
          cx.beginPath()
          cx.moveTo(x, y - s * 0.6)
          cx.lineTo(x - s * 0.55, y + s * 0.4)
          cx.lineTo(x + s * 0.55, y + s * 0.4)
          cx.closePath()
          cx.stroke()
          cx.beginPath()
          cx.moveTo(x, y - s * 0.2)
          cx.lineTo(x - s * 0.3, y + s * 0.4)
          cx.lineTo(x + s * 0.3, y + s * 0.4)
          cx.closePath()
          cx.globalAlpha = 0.3
          cx.fill()
          cx.globalAlpha = 1
          break
        case 'download':
          cx.beginPath()
          cx.moveTo(x, y - s * 0.5)
          cx.lineTo(x, y + s * 0.3)
          cx.stroke()
          cx.beginPath()
          cx.moveTo(x - s * 0.35, y)
          cx.lineTo(x, y + s * 0.4)
          cx.lineTo(x + s * 0.35, y)
          cx.stroke()
          cx.beginPath()
          cx.moveTo(x - s * 0.4, y + s * 0.5)
          cx.lineTo(x + s * 0.4, y + s * 0.5)
          cx.stroke()
          break
        case 'edit':
          cx.save()
          cx.translate(x, y)
          cx.rotate(-Math.PI / 6)
          cx.strokeRect(-s * 0.15, -s * 0.55, s * 0.3, s * 0.7)
          cx.beginPath()
          cx.moveTo(-s * 0.15, s * 0.15)
          cx.lineTo(-s * 0.35, s * 0.55)
          cx.lineTo(s * 0.35, s * 0.55)
          cx.lineTo(s * 0.15, s * 0.15)
          cx.closePath()
          cx.globalAlpha = 0.3
          cx.fill()
          cx.globalAlpha = 1
          cx.restore()
          break
        case 'split':
          cx.beginPath()
          cx.moveTo(x, y - s * 0.5)
          cx.lineTo(x, y + s * 0.1)
          cx.stroke()
          cx.beginPath()
          cx.moveTo(x, y + s * 0.1)
          cx.lineTo(x - s * 0.4, y + s * 0.5)
          cx.stroke()
          cx.beginPath()
          cx.moveTo(x, y + s * 0.1)
          cx.lineTo(x + s * 0.4, y + s * 0.5)
          cx.stroke()
          cx.beginPath()
          cx.arc(x - s * 0.4, y + s * 0.5, 2, 0, Math.PI * 2)
          cx.fill()
          cx.beginPath()
          cx.arc(x + s * 0.4, y + s * 0.5, 2, 0, Math.PI * 2)
          cx.fill()
          break
        case 'embed':
          for (let r = -1; r <= 1; r++)
            for (let c2 = -1; c2 <= 1; c2++) {
              cx.beginPath()
              cx.arc(x + c2 * s * 0.28, y + r * s * 0.28, 1.8, 0, Math.PI * 2)
              cx.fill()
            }
          cx.strokeStyle = 'rgba(255,255,255,0.3)'
          cx.strokeRect(x - s * 0.42, y - s * 0.42, s * 0.84, s * 0.84)
          break
        case 'loader':
          for (let i = 0; i < 3; i++) {
            const ly = y - s * 0.3 + i * s * 0.3
            const lw = [0.7, 0.9, 0.5][i]
            cx.beginPath()
            cx.moveTo(x - s * 0.35 * lw, ly)
            cx.lineTo(x + s * 0.35 * lw, ly)
            cx.stroke()
          }
          break
        case 'vector':
          cx.beginPath()
          cx.ellipse(x, y - s * 0.3, s * 0.4, s * 0.15, 0, 0, Math.PI * 2)
          cx.stroke()
          cx.beginPath()
          cx.moveTo(x - s * 0.4, y - s * 0.3)
          cx.lineTo(x - s * 0.4, y + s * 0.2)
          cx.stroke()
          cx.beginPath()
          cx.moveTo(x + s * 0.4, y - s * 0.3)
          cx.lineTo(x + s * 0.4, y + s * 0.2)
          cx.stroke()
          cx.beginPath()
          cx.ellipse(x, y + s * 0.2, s * 0.4, s * 0.15, 0, 0, Math.PI * 2)
          cx.stroke()
          break
        case 'chat':
          cx.beginPath()
          cx.roundRect(x - s * 0.45, y - s * 0.4, s * 0.9, s * 0.6, s * 0.12)
          cx.stroke()
          cx.beginPath()
          cx.moveTo(x - s * 0.1, y + s * 0.2)
          cx.lineTo(x - s * 0.25, y + s * 0.45)
          cx.lineTo(x + s * 0.15, y + s * 0.2)
          cx.stroke()
          break
        case 'agent':
          cx.beginPath()
          cx.roundRect(x - s * 0.35, y - s * 0.15, s * 0.7, s * 0.5, s * 0.1)
          cx.stroke()
          cx.beginPath()
          cx.arc(x - s * 0.18, y + s * 0.05, s * 0.08, 0, Math.PI * 2)
          cx.fill()
          cx.beginPath()
          cx.arc(x + s * 0.18, y + s * 0.05, s * 0.08, 0, Math.PI * 2)
          cx.fill()
          cx.beginPath()
          cx.moveTo(x, y - s * 0.15)
          cx.lineTo(x, y - s * 0.45)
          cx.stroke()
          cx.beginPath()
          cx.arc(x, y - s * 0.5, s * 0.08, 0, Math.PI * 2)
          cx.stroke()
          break
        case 'openai':
          cx.beginPath()
          for (let i = 0; i < Math.PI * 3; i += 0.1) {
            const r2 = s * 0.08 + i * s * 0.08
            const px2 = x + Math.cos(i) * r2
            const py2 = y + Math.sin(i) * r2
            i === 0 ? cx.moveTo(px2, py2) : cx.lineTo(px2, py2)
          }
          cx.stroke()
          break
        case 'memory':
          cx.beginPath()
          cx.arc(x - s * 0.15, y, s * 0.28, Math.PI * 0.8, Math.PI * 2.2)
          cx.stroke()
          cx.beginPath()
          cx.arc(x + s * 0.15, y, s * 0.28, Math.PI * 0.8, Math.PI * 2.2)
          cx.stroke()
          for (let i = 0; i < 4; i++) {
            const a2 = (i / 4) * Math.PI * 2 + t * 0.5
            cx.beginPath()
            cx.arc(x + Math.cos(a2) * s * 0.15, y + Math.sin(a2) * s * 0.22, 1.2, 0, Math.PI * 2)
            cx.fill()
          }
          break
        case 'qa':
          cx.font = `bold ${s * 0.9}px Inter`
          cx.textAlign = 'center'
          cx.textBaseline = 'middle'
          cx.fillText('?', x, y)
          break
        case 'output':
          cx.beginPath()
          cx.moveTo(x - s * 0.35, y)
          cx.lineTo(x + s * 0.15, y)
          cx.stroke()
          cx.beginPath()
          cx.moveTo(x - 0.05 * s, y - s * 0.25)
          cx.lineTo(x + s * 0.3, y)
          cx.lineTo(x - 0.05 * s, y + s * 0.25)
          cx.stroke()
          break
      }
      cx.restore()
    }

    function drawNode(n) {
      const elapsed = Math.max(0, t - n.enterDelay)
      if (elapsed <= 0) return
      const enter = Math.min(1, elapsed / 0.5)
      const ease = 1 - Math.pow(1 - enter, 3)

      const x = n.px
      const y = n.py
      const w = n.w
      const h = n.h
      const c = COL[n.type]

      const floatX = Math.sin(t * 0.6 + n.phase) * 3
      const floatY = Math.cos(t * 0.45 + n.phase) * 4

      let dx = 0
      let dy = 0
      if (mIn) {
        const ddx = x + w / 2 - mx
        const ddy = y + h / 2 - my
        const dd = Math.sqrt(ddx * ddx + ddy * ddy)
        if (dd < 160 && dd > 0) {
          const f = ((160 - dd) / 160) * 10
          dx = (ddx / dd) * f
          dy = (ddy / dd) * f
        }
      }

      cx.save()
      cx.globalAlpha = ease
      cx.translate(dx, dy)
      cx.translate(floatX * ease, floatY * ease)

      cx.shadowColor = c.glow + '0.2)'
      cx.shadowBlur = n.hovered ? 30 : 15
      cx.shadowOffsetY = 4

      cx.fillStyle = '#161b22'
      cx.beginPath()
      cx.roundRect(x, y, w, h, R)
      cx.fill()
      cx.shadowColor = 'transparent'

      cx.strokeStyle = n.hovered ? c.glow + '0.6)' : c.glow + '0.2)'
      cx.lineWidth = n.hovered ? 1.8 : 1
      cx.beginPath()
      cx.roundRect(x, y, w, h, R)
      cx.stroke()

      cx.fillStyle = c.bg
      cx.beginPath()
      cx.roundRect(x, y, 4, h, [R, 0, 0, R])
      cx.fill()

      const iconX = x + 26
      const iconY = y + h / 2
      drawIcon(iconX, iconY, 12, n.icon)

      cx.fillStyle = '#e6edf3'
      cx.font = '500 11px Inter, sans-serif'
      cx.textAlign = 'left'
      cx.textBaseline = 'middle'
      const textX = x + 46
      if (n.sub) {
        cx.fillText(n.label, textX, y + h / 2 - 7)
        cx.fillStyle = '#7d8590'
        cx.font = '400 9.5px Inter, sans-serif'
        cx.fillText(n.sub, textX, y + h / 2 + 8)
      } else {
        cx.fillText(n.label, textX, y + h / 2)
      }

      if (n.hovered) {
        const hg = cx.createLinearGradient(x, y, x + w, y)
        hg.addColorStop(0, c.glow + '0.06)')
        hg.addColorStop(1, c.glow + '0)')
        cx.fillStyle = hg
        cx.beginPath()
        cx.roundRect(x, y, w, h, R)
        cx.fill()
      }

      cx.restore()

      n.ports.forEach((p) => {
        const pp = portPos({ px: x + dx + floatX * ease, py: y + dy + floatY * ease, w, h }, p)
        cx.fillStyle = c.bg
        cx.globalAlpha = ease * (n.hovered ? 1 : 0.5)
        cx.beginPath()
        cx.arc(pp.x, pp.y, n.hovered ? 4 : 3, 0, Math.PI * 2)
        cx.fill()
        if (n.hovered) {
          const pg = cx.createRadialGradient(pp.x, pp.y, 0, pp.x, pp.y, 10)
          pg.addColorStop(0, c.glow + '0.4)')
          pg.addColorStop(1, c.glow + '0)')
          cx.fillStyle = pg
          cx.beginPath()
          cx.arc(pp.x, pp.y, 10, 0, Math.PI * 2)
          cx.fill()
        }
        cx.globalAlpha = 1
      })

      const hmx = mx - (x + dx + floatX * ease)
      const hmy = my - (y + dy + floatY * ease)
      n.hovered = mIn && hmx >= -10 && hmx <= w + 10 && hmy >= -10 && hmy <= h + 10
    }

    function bezierPoint(p0, p1, p2, p3, tt) {
      const mt = 1 - tt
      return mt * mt * mt * p0 + 3 * mt * mt * tt * p1 + 3 * mt * tt * tt * p2 + tt * tt * tt * p3
    }

    function bezierPos(from, c1, c2, to, tt) {
      return {
        x: bezierPoint(from.x, c1.x, c2.x, to.x, tt),
        y: bezierPoint(from.y, c1.y, c2.y, to.y, tt),
      }
    }

    FP.prototype.draw = function () {
      const e = edges[this.ei]
      const fn = nodes[e[0]]
      const tn = nodes[e[2]]
      const elapsed = Math.max(0, t - Math.max(fn.enterDelay, tn.enterDelay) - 0.3)
      if (elapsed <= 0) return

      const fp = fn.ports[e[1]]
      const tp = tn.ports[e[3]]
      const from = portPos({ px: fn.px, py: fn.py, w: fn.w, h: fn.h }, fp)
      const to = portPos({ px: tn.px, py: tn.py, w: tn.w, h: tn.h }, tp)

      let c1x
      let c1y
      let c2x
      let c2y
      const curv = 50
      if (fp.s === 'right' || fp.s === 'left') {
        const d = fp.s === 'right' ? 1 : -1
        c1x = from.x + d * curv
        c1y = from.y
        const d2 = tp.s === 'left' ? -1 : tp.s === 'right' ? 1 : 0
        c2x = to.x + d2 * curv
        c2y = to.y
      } else {
        const d = fp.s === 'bottom' ? 1 : -1
        c1x = from.x
        c1y = from.y + d * curv
        const d2 = tp.s === 'top' ? -1 : tp.s === 'bottom' ? 1 : 0
        c2x = to.x
        c2y = to.y + d2 * curv
      }

      const pos = bezierPos(from, { x: c1x, y: c1y }, { x: c2x, y: c2y }, to, this.t)
      const a = Math.sin(this.t * Math.PI)
      const c = COL[tn.type]

      cx.save()
      cx.globalAlpha = Math.min(1, elapsed / 0.4)

      const g = cx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, this.sz * 5)
      g.addColorStop(0, c.glow + a * 0.7 + ')')
      g.addColorStop(1, c.glow + '0)')
      cx.fillStyle = g
      cx.beginPath()
      cx.arc(pos.x, pos.y, this.sz * 5, 0, Math.PI * 2)
      cx.fill()

      cx.fillStyle = c.bg
      cx.globalAlpha = a * Math.min(1, elapsed / 0.4)
      cx.beginPath()
      cx.arc(pos.x, pos.y, this.sz, 0, Math.PI * 2)
      cx.fill()

      cx.restore()
    }

    function drawEdge(e) {
      const fn = nodes[e[0]]
      const tn = nodes[e[2]]
      const elapsed = Math.max(0, t - Math.max(fn.enterDelay, tn.enterDelay) - 0.3)
      if (elapsed <= 0) return
      const alpha = Math.min(1, elapsed / 0.4)

      const fp = fn.ports[e[1]]
      const tp = tn.ports[e[3]]
      const from = portPos({ px: fn.px, py: fn.py, w: fn.w, h: fn.h }, fp)
      const to = portPos({ px: tn.px, py: tn.py, w: tn.w, h: tn.h }, tp)

      let c1x
      let c1y
      let c2x
      let c2y
      const curvature = 50

      if (fp.s === 'right' || fp.s === 'left') {
        const dir = fp.s === 'right' ? 1 : -1
        c1x = from.x + dir * curvature
        c1y = from.y
        const dir2 = tp.s === 'left' ? -1 : tp.s === 'right' ? 1 : 0
        c2x = to.x + dir2 * curvature
        c2y = to.y
      } else {
        const dir = fp.s === 'bottom' ? 1 : -1
        c1x = from.x
        c1y = from.y + dir * curvature
        const dir2 = tp.s === 'top' ? -1 : tp.s === 'bottom' ? 1 : 0
        c2x = to.x
        c2y = to.y + dir2 * curvature
      }

      cx.save()
      cx.globalAlpha = alpha

      const grad = cx.createLinearGradient(from.x, from.y, to.x, to.y)
      grad.addColorStop(0, COL[fn.type].glow + '0.25)')
      grad.addColorStop(0.5, 'rgba(255,255,255,0.08)')
      grad.addColorStop(1, COL[tn.type].glow + '0.25)')
      cx.strokeStyle = grad
      cx.lineWidth = 1.5
      cx.beginPath()
      cx.moveTo(from.x, from.y)
      cx.bezierCurveTo(c1x, c1y, c2x, c2y, to.x, to.y)
      cx.stroke()

      cx.setLineDash([3, 10])
      cx.lineDashOffset = -t * 35
      cx.strokeStyle = 'rgba(255,255,255,0.06)'
      cx.lineWidth = 1
      cx.beginPath()
      cx.moveTo(from.x, from.y)
      cx.bezierCurveTo(c1x, c1y, c2x, c2y, to.x, to.y)
      cx.stroke()
      cx.setLineDash([])

      const at = 0.92
      const ax = bezierPoint(from.x, c1x, c2x, to.x, at)
      const ay = bezierPoint(from.y, c1y, c2y, to.y, at)
      const ax2 = bezierPoint(from.x, c1x, c2x, to.x, at + 0.02)
      const ay2 = bezierPoint(from.y, c1y, c2y, to.y, at + 0.02)
      const angle = Math.atan2(ay2 - ay, ax2 - ax)
      const aSize = 6

      cx.fillStyle = COL[tn.type].glow + '0.5)'
      cx.beginPath()
      cx.moveTo(to.x, to.y)
      cx.lineTo(to.x - Math.cos(angle - 0.35) * aSize, to.y - Math.sin(angle - 0.35) * aSize)
      cx.lineTo(to.x - Math.cos(angle + 0.35) * aSize, to.y - Math.sin(angle + 0.35) * aSize)
      cx.closePath()
      cx.fill()

      cx.restore()
    }

    function drawFlowLabels() {
      cx.save()
      cx.globalAlpha = Math.min(1, Math.max(0, t - 0.2) / 0.5)
      cx.fillStyle = 'rgba(255,255,255,0.08)'
      cx.font = '600 13px "JetBrains Mono", monospace'
      cx.textAlign = 'left'
      cx.fillText('FILE PROCESSING', 85, 28)
      cx.restore()

      cx.save()
      cx.globalAlpha = Math.min(1, Math.max(0, t - 0.2) / 0.5)
      cx.fillStyle = 'rgba(255,255,255,0.08)'
      cx.font = '600 13px "JetBrains Mono", monospace'
      cx.textAlign = 'left'
      cx.fillText('CHAT AGENT', 625, 28)
      cx.restore()

      cx.save()
      cx.globalAlpha = 0.06
      cx.strokeStyle = '#fff'
      cx.lineWidth = 1
      cx.setLineDash([4, 8])
      cx.beginPath()
      cx.moveTo(W / 2, 15)
      cx.lineTo(W / 2, H - 15)
      cx.stroke()
      cx.setLineDash([])
      cx.restore()
    }

    function frame() {
      t += 0.016
      cx.clearRect(0, 0, W, H)

      amb.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = W
        if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H
        if (p.y > H) p.y = 0
        cx.fillStyle = `rgba(255,255,255,${p.a})`
        cx.beginPath()
        cx.arc(p.x, p.y, p.s, 0, Math.PI * 2)
        cx.fill()
      })

      drawFlowLabels()
      edges.forEach((e) => drawEdge(e))
      fps.forEach((p) => {
        p.update()
        p.draw()
      })
      nodes.forEach((n) => drawNode(n))

      rafId = window.requestAnimationFrame(frame)
    }

    frame()

    return () => {
      window.cancelAnimationFrame(rafId)
      cv.removeEventListener('mousemove', onMouseMove)
      cv.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      ></div>
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[180px]"></div>
      <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-emerald-600/5 rounded-full blur-[150px]"></div>

      <div className="relative z-10 flex flex-col items-center gap-6 px-6 anim">
        <div className="text-center mb-2">
          <p className="text-[10px] font-semibold tracking-[0.3em] uppercase mb-2 text-emerald-400">
            RAG Pipeline Workflow
          </p>
          <h2 className="font-light text-2xl md:text-3xl tracking-tight">
            File Processing <span className="text-gray-500 mx-2">&amp;</span>{' '}
            <span className="text-violet-400">Chat Agent</span>
          </h2>
        </div>

        <canvas ref={canvasRef} width={1100} height={680} className="max-w-full h-auto" style={{ cursor: 'default' }} />

        <div className="flex flex-wrap justify-center gap-5 text-[11px] text-gray-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded" style={{ background: '#22c55e' }}></span>Trigger
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded" style={{ background: '#3b82f6' }}></span>Storage
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded" style={{ background: '#a855f7' }}></span>AI / LLM
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded" style={{ background: '#f59e0b' }}></span>Processing
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded" style={{ background: '#06b6d4' }}></span>Memory
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded" style={{ background: '#64748b' }}></span>Tool
          </span>
        </div>
      </div>
    </section>
  )
}

