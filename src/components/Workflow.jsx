import { useEffect, useMemo, useRef, useState } from 'react'
import DokumenTemplate from './DokumenTemplate.jsx'
import MarketingTemplate from './MarketingTemplate.jsx'
import SupportTemplate from './SupportTemplate.jsx'

const TYPE_COLORS = { doc: '#F59E0B', mkt: '#3B82F6', sup: '#10B981' }
const TYPE_LABELS = { doc: 'Dokumen', mkt: 'Marketing', sup: 'Support' }
const TYPE_ICONS = { doc: 'file-text', mkt: 'megaphone', sup: 'headphones' }

const NODE_COLORS = {
  'Input File': '#F59E0B',
  'OCR Extract': '#F59E0B',
  'AI Validate': '#A855F7',
  'DB Save': '#10B981',
  Notify: '#3B82F6',
  'Trigger Cron': '#3B82F6',
  'AI Generate': '#A855F7',
  'Image Gen': '#A855F7',
  Schedule: '#3B82F6',
  Post: '#10B981',
  Websocket: '#10B981',
  'NLP Parse': '#A855F7',
  'RAG Query': '#A855F7',
  'AI Respond': '#10B981',
  Log: '#6B7280',
  Upload: '#F59E0B',
  'Parse PDF': '#F59E0B',
  'Clause Detect': '#A855F7',
  'Risk Score': '#EF4444',
  Report: '#3B82F6',
  'New User': '#10B981',
  'Delay 1h': '#6B7280',
  'Email 1': '#3B82F6',
  'Delay 1d': '#6B7280',
  'Email 2': '#3B82F6',
  'Delay 3d': '#6B7280',
  'Email 3': '#3B82F6',
  Incoming: '#10B981',
  'AI Classify': '#A855F7',
  Priority: '#F59E0B',
  Route: '#3B82F6',
  Assign: '#10B981',
  'Keyword Research': '#3B82F6',
  Outline: '#F59E0B',
  'AI Draft': '#A855F7',
  'Human Review': '#6B7280',
  'SEO Optimize': '#10B981',
  Publish: '#10B981',
  'Upload KTP': '#F59E0B',
  OCR: '#F59E0B',
  'Face Match': '#A855F7',
  Liveness: '#A855F7',
  Decision: '#EF4444',
  'Crawl Reviews': '#3B82F6',
  Preprocess: '#F59E0B',
  'AI Sentiment': '#A855F7',
  Aggregate: '#10B981',
  Dashboard: '#10B981',
  'Fetch Docs': '#F59E0B',
  Chunk: '#F59E0B',
  Embed: '#A855F7',
  'Vector Upsert': '#10B981',
  'Input Doc': '#F59E0B',
  'Rule Engine': '#3B82F6',
  'AI Check': '#A855F7',
  'Flag Issues': '#EF4444',
  'Fetch Data': '#F59E0B',
  'Feature Eng': '#3B82F6',
  'ML Predict': '#A855F7',
  'High Risk?': '#EF4444',
  'Email/Slack': '#3B82F6',
  Input: '#F59E0B',
  'AI Process': '#A855F7',
  Output: '#10B981',
}

const NODE_ICONS = {
  'Input File': 'file-input',
  'OCR Extract': 'scan',
  'AI Validate': 'brain',
  'DB Save': 'database',
  Notify: 'bell',
  'Trigger Cron': 'clock',
  'AI Generate': 'sparkles',
  'Image Gen': 'image',
  Schedule: 'calendar',
  Post: 'send',
  Websocket: 'message-circle',
  'NLP Parse': 'text-cursor-input',
  'RAG Query': 'search',
  'AI Respond': 'message-square',
  Log: 'scroll-text',
  Upload: 'upload',
  'Parse PDF': 'file-search',
  'Clause Detect': 'scan-eye',
  'Risk Score': 'alert-triangle',
  Report: 'file-bar-chart',
  'New User': 'user-plus',
  Incoming: 'inbox',
  'AI Classify': 'tags',
  Priority: 'flag',
  Route: 'git-branch',
  Assign: 'user-check',
  'Keyword Research': 'search',
  Outline: 'list',
  'AI Draft': 'pen-tool',
  'Human Review': 'eye',
  'SEO Optimize': 'trending-up',
  Publish: 'globe',
  'Upload KTP': 'id-card',
  OCR: 'scan',
  'Face Match': 'scan-face',
  Liveness: 'user-check',
  Decision: 'check-circle',
  'Crawl Reviews': 'download',
  Preprocess: 'filter',
  'AI Sentiment': 'smile-plus',
  Aggregate: 'bar-chart-3',
  Dashboard: 'layout-dashboard',
  'Fetch Docs': 'folder-down',
  Chunk: 'scissors',
  Embed: 'box',
  'Vector Upsert': 'database',
  'Input Doc': 'file-text',
  'Rule Engine': 'shield',
  'AI Check': 'check-check',
  'Flag Issues': 'alert-circle',
  'Fetch Data': 'database',
  'Feature Eng': 'settings-2',
  'ML Predict': 'brain',
  'High Risk?': 'help-circle',
  'Email/Slack': 'mail',
  Input: 'file-input',
  'AI Process': 'brain',
  Output: 'send',
}

export const WORKFLOWS_STORAGE_KEY = 'mybing.workflows'

export const INITIAL_WORKFLOWS = [
  {
    id: 1,
    name: 'Invoice Processing',
    type: 'doc',
    status: 'running',
    desc: 'Otomatis ekstrak data dari invoice PDF dan simpan ke database.',
    trigger: 'Webhook',
    ops: 12470,
    uptime: 99.8,
    avgTime: 1.2,
    nodes: ['Input File', 'OCR Extract', 'AI Validate', 'DB Save', 'Notify'],
    created: '2024-12-15',
    lastRun: '2m lalu',
  },
  {
    id: 2,
    name: 'Social Media Campaign',
    type: 'mkt',
    status: 'running',
    desc: 'Generate & jadwalkan konten media sosial otomatis dengan AI.',
    trigger: 'Schedule',
    ops: 8340,
    uptime: 99.5,
    avgTime: 3.4,
    nodes: ['Trigger Cron', 'AI Generate', 'Image Gen', 'Schedule', 'Post'],
    created: '2025-01-02',
    lastRun: '15m lalu',
  },
  {
    id: 3,
    name: 'Customer Chat Agent',
    type: 'sup',
    status: 'running',
    desc: 'AI chatbot yang menangani pertanyaan pelanggan 24/7.',
    trigger: 'Event',
    ops: 38910,
    uptime: 99.9,
    avgTime: 0.8,
    nodes: ['Websocket', 'NLP Parse', 'RAG Query', 'AI Respond', 'Log'],
    created: '2024-11-20',
    lastRun: 'Sekarang',
  },
  {
    id: 4,
    name: 'Contract Analysis',
    type: 'doc',
    status: 'running',
    desc: 'Analisis kontrak hukum, deteksi klausul berisiko & ringkasan otomatis.',
    trigger: 'File Upload',
    ops: 5620,
    uptime: 98.7,
    avgTime: 4.1,
    nodes: ['Upload', 'Parse PDF', 'Clause Detect', 'Risk Score', 'Report'],
    created: '2024-12-28',
    lastRun: '1j lalu',
  },
  {
    id: 5,
    name: 'Email Welcome Series',
    type: 'mkt',
    status: 'paused',
    desc: 'Seri email onboarding otomatis untuk pelanggan baru.',
    trigger: 'Event',
    ops: 4280,
    uptime: 99.2,
    avgTime: 1.5,
    nodes: ['New User', 'Delay 1h', 'Email 1', 'Delay 1d', 'Email 2', 'Delay 3d', 'Email 3'],
    created: '2025-01-05',
    lastRun: '2j lalu',
  },
  {
    id: 6,
    name: 'Ticket Router',
    type: 'sup',
    status: 'running',
    desc: 'Klasifikasi & routing tiket support ke tim yang tepat secara otomatis.',
    trigger: 'Webhook',
    ops: 21040,
    uptime: 99.6,
    avgTime: 0.3,
    nodes: ['Incoming', 'AI Classify', 'Priority', 'Route', 'Assign'],
    created: '2024-12-10',
    lastRun: '5m lalu',
  },
  {
    id: 7,
    name: 'Blog Content Pipeline',
    type: 'mkt',
    status: 'running',
    desc: 'Pipeline konten blog dari riset keyword hingga publish siap.',
    trigger: 'Manual',
    ops: 1890,
    uptime: 97.5,
    avgTime: 8.2,
    nodes: ['Keyword Research', 'Outline', 'AI Draft', 'Human Review', 'SEO Optimize', 'Publish'],
    created: '2025-01-10',
    lastRun: '6j lalu',
  },
  {
    id: 8,
    name: 'ID Verification',
    type: 'doc',
    status: 'error',
    desc: 'Verifikasi KTP/paspor menggunakan OCR + face matching.',
    trigger: 'Webhook',
    ops: 6720,
    uptime: 94.2,
    avgTime: 2.8,
    nodes: ['Upload KTP', 'OCR', 'Face Match', 'Liveness', 'Decision'],
    created: '2024-12-01',
    lastRun: '10m lalu',
  },
  {
    id: 9,
    name: 'Review Sentiment',
    type: 'mkt',
    status: 'paused',
    desc: 'Analisis sentimen review produk dari berbagai marketplace.',
    trigger: 'Schedule',
    ops: 3150,
    uptime: 99.0,
    avgTime: 1.1,
    nodes: ['Crawl Reviews', 'Preprocess', 'AI Sentiment', 'Aggregate', 'Dashboard'],
    created: '2025-01-08',
    lastRun: '1d lalu',
  },
  {
    id: 10,
    name: 'Knowledge Base Sync',
    type: 'sup',
    status: 'running',
    desc: 'Sinkronisasi FAQ & dokumentasi ke vector store untuk RAG.',
    trigger: 'Schedule',
    ops: 890,
    uptime: 99.8,
    avgTime: 12.5,
    nodes: ['Fetch Docs', 'Chunk', 'Embed', 'Vector Upsert', 'Notify'],
    created: '2024-12-20',
    lastRun: '4h lalu',
  },
  {
    id: 11,
    name: 'Compliance Checker',
    type: 'doc',
    status: 'running',
    desc: 'Cek kepatuhan dokumen terhadap regulasi OJK & KYC.',
    trigger: 'Webhook',
    ops: 2340,
    uptime: 99.4,
    avgTime: 3.6,
    nodes: ['Input Doc', 'Rule Engine', 'AI Check', 'Flag Issues', 'Report'],
    created: '2025-01-03',
    lastRun: '30m lalu',
  },
  {
    id: 12,
    name: 'Churn Prediction',
    type: 'sup',
    status: 'paused',
    desc: 'Prediksi pelanggan berisiko churn & trigger retensi otomatis.',
    trigger: 'Schedule',
    ops: 560,
    uptime: 98.1,
    avgTime: 5.2,
    nodes: ['Fetch Data', 'Feature Eng', 'ML Predict', 'High Risk?', 'Email/Slack'],
    created: '2025-01-12',
    lastRun: '3d lalu',
  },
]

function formatNum(n) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
  return String(n)
}

function statusMeta(status) {
  if (status === 'running')
    return { label: 'Running', dot: 'bg-green-400', cls: 'border-green-500/20 bg-green-500/10 text-green-300', pulse: true }
  if (status === 'paused')
    return { label: 'Paused', dot: 'bg-amber-400', cls: 'border-amber-500/20 bg-amber-500/10 text-amber-300', pulse: false }
  if (status === 'error')
    return { label: 'Error', dot: 'bg-red-400', cls: 'border-red-500/20 bg-red-500/10 text-red-300', pulse: true }
  return { label: 'Draft', dot: 'bg-gray-400', cls: 'border-white/10 bg-white/5 text-gray-400', pulse: false }
}

function makeId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()
  return String(Date.now()) + '-' + Math.random().toString(16).slice(2)
}

function buildLogs(w) {
  const now = new Date()
  const statuses = ['success', 'success', 'success', 'success', 'success', 'success', 'success', 'success', 'success', 'error']
  return statuses.map((s, i) => {
    const t = new Date(now.getTime() - i * (Math.random() * 300000 + 60000))
    const ts =
      t.getHours().toString().padStart(2, '0') +
      ':' +
      t.getMinutes().toString().padStart(2, '0') +
      ':' +
      t.getSeconds().toString().padStart(2, '0')
    const dur = (Math.random() * (w.avgTime * 0.5) + w.avgTime * 0.7).toFixed(1)
    const runId = Math.floor(Math.random() * 9000 + 1000)
    return { id: makeId(), ts, status: s, dur, runId, nodes: w.nodes.length }
  })
}

function NodePills({ nodes }) {
  const maxShow = 5
  const shown = nodes.slice(0, maxShow)

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {shown.map((n, i) => {
        const c = NODE_COLORS[n] || '#6B7280'
        return (
          <div key={n + i} className="flex items-center gap-1">
            {i > 0 ? <i data-lucide="chevron-right" className="w-3 h-3 text-gray-600 flex-shrink-0"></i> : null}
            <span className="text-[9px] font-medium px-2 py-1 rounded-md flex items-center gap-1" style={{ background: c + '10', border: '1px solid ' + c + '20', color: c }}>
              {n}
            </span>
          </div>
        )
      })}
      {nodes.length > maxShow ? <span className="text-[9px] text-gray-500 pl-1">+{nodes.length - maxShow}</span> : null}
    </div>
  )
}

function ToastStack({ toasts, onDismiss }) {
  return (
    <div className="fixed bottom-6 right-6 z-[120] space-y-2">
      {toasts.map((t) => (
        <div key={t.id} className="animate-fade-in-up glass-strong rounded-xl px-4 py-3 flex items-center gap-2.5 min-w-[280px]">
          <i data-lucide={t.icon} className="w-4 h-4 flex-shrink-0" style={{ color: t.color }}></i>
          <span className="text-xs text-gray-200 flex-1">{t.msg}</span>
          <button type="button" onClick={() => onDismiss(t.id)} className="text-gray-500 hover:text-white transition-colors" aria-label="Tutup toast">
            <i data-lucide="x" className="w-3.5 h-3.5"></i>
          </button>
        </div>
      ))}
    </div>
  )
}

export default function Workflow({ workflows: workflowsProp, setWorkflows: setWorkflowsProp }) {
  const [internalWorkflows, setInternalWorkflows] = useState(() => {
    try {
      const raw = window.localStorage.getItem(WORKFLOWS_STORAGE_KEY)
      if (!raw) return INITIAL_WORKFLOWS
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    } catch {}
    return INITIAL_WORKFLOWS
  })
  const workflows = workflowsProp ?? internalWorkflows
  const setWorkflows = setWorkflowsProp ?? setInternalWorkflows
  const [filter, setFilter] = useState('all')
  const [view, setView] = useState('grid')
  const [sort, setSort] = useState('recent')
  const [query, setQuery] = useState('')
  const [detailId, setDetailId] = useState(null)

  const [createOpen, setCreateOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [newCat, setNewCat] = useState('doc')
  const nameInputRef = useRef(null)
  const [templateEdit, setTemplateEdit] = useState(null)
  const [templateDraft, setTemplateDraft] = useState({})
  const [templateFileName, setTemplateFileName] = useState('')
  const [templateCfg, setTemplateCfg] = useState(() => {
    try {
      const raw = window.localStorage.getItem('templateNodeConfig:v1')
      if (!raw) return {}
      const parsed = JSON.parse(raw)
      if (parsed && typeof parsed === 'object') return parsed
    } catch {}
    return {}
  })

  const [toasts, setToasts] = useState([])

  const showToast = (msg, tone = 'amber') => {
    const map = {
      amber: { color: '#F59E0B', icon: 'check-circle' },
      green: { color: '#10B981', icon: 'check-circle' },
      red: { color: '#EF4444', icon: 'trash-2' },
      blue: { color: '#3B82F6', icon: 'info' },
    }
    const meta = map[tone] || map.amber
    const id = makeId()
    setToasts((prev) => [...prev, { id, msg, ...meta }])
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }

  const safeView = view === 'list' ? 'list' : 'grid'

  useEffect(() => {
    const raf = window.requestAnimationFrame(() => {
      window.lucide?.createIcons?.()
    })
    return () => window.cancelAnimationFrame(raf)
  }, [safeView, filter, sort, query, detailId, createOpen, importOpen, templateEdit])

  useEffect(() => {
    try {
      window.localStorage.setItem(WORKFLOWS_STORAGE_KEY, JSON.stringify(workflows))
    } catch {}
  }, [workflows])

  useEffect(() => {
    if (!createOpen) return
    const t = window.setTimeout(() => nameInputRef.current?.focus?.(), 0)
    return () => window.clearTimeout(t)
  }, [createOpen])

  const filtered = useMemo(() => {
    let list = [...workflows]
    if (filter !== 'all') list = list.filter((w) => w.type === filter)
    const q = query.trim().toLowerCase()
    if (q) list = list.filter((w) => w.name.toLowerCase().includes(q) || w.desc.toLowerCase().includes(q))

    if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name))
    if (sort === 'ops') list.sort((a, b) => b.ops - a.ops)
    if (sort === 'status') {
      const order = { error: 0, running: 1, paused: 2, draft: 3 }
      list.sort((a, b) => (order[a.status] ?? 9) - (order[b.status] ?? 9))
    }
    if (sort === 'recent') {
      list.sort((a, b) => String(b.created).localeCompare(String(a.created)) || (b.id > a.id ? 1 : -1))
    }
    return list
  }, [workflows, filter, query, sort])

  const stats = useMemo(() => {
    const running = workflows.filter((w) => w.status === 'running').length
    const paused = workflows.filter((w) => w.status === 'paused').length
    const error = workflows.filter((w) => w.status === 'error').length
    const draft = workflows.filter((w) => w.status === 'draft').length
    return { running, paused, error, draft, total: workflows.length }
  }, [workflows])

  const current = useMemo(() => workflows.find((w) => w.id === detailId) || null, [workflows, detailId])
  const logs = useMemo(() => (current ? buildLogs(current) : []), [current])

  const toggleWorkflow = (id) => {
    setWorkflows((prev) =>
      prev.map((w) => {
        if (w.id !== id) return w
        if (w.status === 'running') {
          showToast(`"${w.name}" dijeda`, 'amber')
          return { ...w, status: 'paused' }
        }
        if (w.status === 'paused') {
          showToast(`"${w.name}" dilanjutkan`, 'green')
          return { ...w, status: 'running' }
        }
        if (w.status === 'error') {
          showToast(`"${w.name}" di-retry`, 'green')
          return { ...w, status: 'running' }
        }
        return w
      }),
    )
  }

  const deleteWorkflow = (id) => {
    const w = workflows.find((x) => x.id === id)
    if (!w) return
    setWorkflows((prev) => prev.filter((x) => x.id !== id))
    showToast(`"${w.name}" dihapus`, 'red')
    if (detailId === id) setDetailId(null)
  }

  const createWorkflow = () => {
    const name = newName.trim()
    if (!name) return
    const newWf = {
      id: Date.now(),
      name,
      type: newCat,
      status: 'draft',
      desc: 'Workflow baru yang dibuat oleh pengguna.',
      trigger: 'Manual',
      ops: 0,
      uptime: 0,
      avgTime: 0,
      nodes: ['Input', 'AI Process', 'Output'],
      created: new Date().toISOString().split('T')[0],
      lastRun: 'Belum',
    }
    setWorkflows((prev) => [newWf, ...prev])
    setCreateOpen(false)
    setNewName('')
    setNewCat('doc')
    showToast(`Workflow "${name}" berhasil dibuat`, 'green')
  }

  const templateSchema = (cat, key) => {
    const k = String(key || '')
    if (cat === 'doc') {
      if (k === 'po_source') {
        return [
          { name: 'channel', label: 'Sumber PO', type: 'select', options: ['Email', 'WhatsApp', 'Upload Manual', 'API'] },
          { name: 'sample', label: 'Contoh PO (file)', type: 'file' },
          { name: 'note', label: 'Catatan', type: 'textarea', placeholder: 'Contoh: format PO, aturan validasi, dsb.' },
        ]
      }
      if (k === 'po_extract') {
        return [
          { name: 'fields', label: 'Field yang diekstrak', type: 'textarea', placeholder: 'Contoh: nomor PO, tanggal, nama customer, item, qty, harga, alamat' },
          { name: 'sample', label: 'File contoh', type: 'file' },
        ]
      }
    }
    if (cat === 'mkt') {
      if (k === 'nurture_list') {
        return [
          { name: 'listName', label: 'Nama Nurture List', type: 'text', placeholder: 'Contoh: Lead - April' },
          { name: 'contacts', label: 'Kontak (CSV)', type: 'file' },
          { name: 'tags', label: 'Tag', type: 'text', placeholder: 'Contoh: webinar, promo, hot-lead' },
        ]
      }
      if (k === 'campaign') {
        return [
          { name: 'campaignName', label: 'Nama Campaign', type: 'text', placeholder: 'Contoh: Promo Lebaran' },
          { name: 'channel', label: 'Channel', type: 'select', options: ['Instagram', 'TikTok', 'Email', 'Google Ads'] },
          { name: 'brief', label: 'Brief / Asset (file)', type: 'file' },
          { name: 'objective', label: 'Objective', type: 'textarea', placeholder: 'Contoh: traffic ke landing page, leads, conversion' },
        ]
      }
    }
    if (cat === 'sup') {
      if (k === 'stock_sheet') {
        return [
          { name: 'sheetUrl', label: 'Google Sheets URL', type: 'url', placeholder: 'https://docs.google.com/...' },
          { name: 'sheetTab', label: 'Nama Sheet/Tab', type: 'text', placeholder: 'Contoh: Stok' },
          { name: 'skuColumn', label: 'Kolom SKU', type: 'text', placeholder: 'Contoh: sku' },
          { name: 'stockColumn', label: 'Kolom Stok', type: 'text', placeholder: 'Contoh: stock' },
        ]
      }
      if (k === 'price_list') {
        return [
          { name: 'currency', label: 'Mata Uang', type: 'select', options: ['IDR', 'USD'] },
          { name: 'priceFile', label: 'Price List (file)', type: 'file' },
        ]
      }
      if (k === 'shipping_faq') {
        return [
          { name: 'faqFile', label: 'FAQ Pengiriman (file)', type: 'file' },
          { name: 'fallback', label: 'Jawaban fallback', type: 'textarea', placeholder: 'Jawaban default jika tidak ditemukan di FAQ' },
        ]
      }
    }
    return []
  }

  const openTemplateEdit = (cat, node) => {
    const key = node?.key || node?.label
    const label = node?.label || 'Node'
    const schema = templateSchema(cat, key)
    const cfgKey = `${cat}:${key}`
    setTemplateFileName('')
    setTemplateDraft(templateCfg[cfgKey] || {})
    setTemplateEdit({ cat, key, label, schema })
  }

  const saveTemplateEdit = () => {
    if (!templateEdit) return
    const cfgKey = `${templateEdit.cat}:${templateEdit.key}`
    const next = { ...templateCfg, [cfgKey]: { ...templateDraft, fileName: templateFileName || templateDraft.fileName || '' } }
    setTemplateCfg(next)
    try {
      window.localStorage.setItem('templateNodeConfig:v1', JSON.stringify(next))
    } catch {}
    showToast(`Tersimpan: ${templateEdit.label}`, 'green')
    setTemplateEdit(null)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 anim-up">
        <div>
          <h1 className="font-oswald font-light text-2xl tracking-tight">Workflow Manager</h1>
          <p className="text-gray-500 text-xs mt-0.5">Kelola dan pantau semua workflow AI dalam satu tempat.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setImportOpen(true)}
            className="flex items-center gap-2 glass text-xs font-medium px-4 py-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/[.06] transition-all"
          >
            <i data-lucide="upload" className="w-4 h-4"></i> Import
          </button>
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs px-4 py-2.5 rounded-xl transition-all hover:shadow-[0_0_25px_rgba(245,158,11,.3)] hover:scale-[1.02]"
          >
            <i data-lucide="plus" className="w-4 h-4"></i> Buat Workflow
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 anim-up">
        <div className="glass rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
            <i data-lucide="play" className="w-4 h-4 text-green-400"></i>
          </div>
          <div>
            <p className="stat-num font-oswald text-xl font-light">{stats.running}</p>
            <p className="text-[10px] text-gray-500">Berjalan</p>
          </div>
        </div>
        <div className="glass rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <i data-lucide="pause" className="w-4 h-4 text-amber-400"></i>
          </div>
          <div>
            <p className="stat-num font-oswald text-xl font-light">{stats.paused}</p>
            <p className="text-[10px] text-gray-500">Dijeda</p>
          </div>
        </div>
        <div className="glass rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <i data-lucide="alert-circle" className="w-4 h-4 text-red-400"></i>
          </div>
          <div>
            <p className="stat-num font-oswald text-xl font-light">{stats.error}</p>
            <p className="text-[10px] text-gray-500">Error</p>
          </div>
        </div>
        <div className="glass rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <i data-lucide="file-plus" className="w-4 h-4 text-blue-400"></i>
          </div>
          <div>
            <p className="stat-num font-oswald text-xl font-light">{stats.draft}</p>
            <p className="text-[10px] text-gray-500">Draft</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 anim-up">
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { id: 'all', label: `Semua (${stats.total})` },
            { id: 'doc', label: `Dokumen (${workflows.filter((w) => w.type === 'doc').length})`, dot: 'bg-amber-400' },
            { id: 'mkt', label: `Marketing (${workflows.filter((w) => w.type === 'mkt').length})`, dot: 'bg-blue-400' },
            { id: 'sup', label: `Support (${workflows.filter((w) => w.type === 'sup').length})`, dot: 'bg-green-400' },
          ].map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setFilter(b.id)}
              className={
                'text-[11px] font-medium px-3 py-1.5 rounded-lg border transition-colors ' +
                (filter === b.id ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'border-white/10 text-gray-400 hover:text-white hover:bg-white/5')
              }
            >
              {b.dot ? <span className={'inline-block w-1.5 h-1.5 rounded-full mr-1.5 ' + b.dot}></span> : null}
              {b.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative hidden sm:block">
            <i data-lucide="search" className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2"></i>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Cari workflow..."
              className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 w-[240px] focus:outline-none focus:border-amber-500/30 transition-all"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-[11px] text-gray-300 focus:outline-none focus:border-amber-500/30 appearance-none cursor-pointer"
          >
            <option value="recent">Terbaru</option>
            <option value="name">Nama A-Z</option>
            <option value="ops">Terbanyak Ops</option>
            <option value="status">Status</option>
          </select>
          <div className="flex items-center bg-white/5 rounded-lg border border-white/10 p-0.5">
            <button
              type="button"
              onClick={() => setView('grid')}
              className={'rounded-md p-1.5 transition-colors ' + (safeView === 'grid' ? 'bg-white/10 text-white' : 'text-gray-500 hover:bg-white/5')}
              aria-label="Grid"
              title="Grid"
            >
              <i data-lucide="grid-3x3" className="w-3.5 h-3.5"></i>
            </button>
            <button
              type="button"
              onClick={() => setView('list')}
              className={'rounded-md p-1.5 transition-colors ' + (safeView === 'list' ? 'bg-white/10 text-white' : 'text-gray-500 hover:bg-white/5')}
              aria-label="List"
              title="List"
            >
              <i data-lucide="list" className="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>
      </div>

      {detailId && current ? (
        <div className="anim-up">
          <button
            type="button"
            onClick={() => setDetailId(null)}
            className="flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-white transition-colors mb-4"
          >
            <i data-lucide="arrow-left" className="w-4 h-4"></i> Kembali ke Workflow
          </button>

          <div className="glass rounded-2xl p-6 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: TYPE_COLORS[current.type] + '12', border: '1px solid ' + TYPE_COLORS[current.type] + '20' }}>
                  <i data-lucide={TYPE_ICONS[current.type]} className="w-6 h-6" style={{ color: TYPE_COLORS[current.type] }}></i>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-oswald font-light text-xl">{current.name}</h2>
                    {(() => {
                      const sm = statusMeta(current.status)
                      return (
                        <span className={'text-[9px] font-medium px-2 py-0.5 rounded-md inline-flex items-center gap-1 border ' + sm.cls}>
                          <span className={'w-1.5 h-1.5 rounded-full ' + sm.dot + (sm.pulse ? ' animate-pulse' : '')}></span>
                          {sm.label}
                        </span>
                      )
                    })()}
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {TYPE_LABELS[current.type]} · Dibuat {current.created}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {current.status === 'running' ? (
                  <button
                    type="button"
                    onClick={() => toggleWorkflow(current.id)}
                    className="flex items-center gap-1.5 text-[11px] font-medium px-4 py-2 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-all"
                  >
                    <i data-lucide="pause" className="w-3.5 h-3.5"></i>Pause
                  </button>
                ) : null}
                {current.status === 'paused' ? (
                  <button
                    type="button"
                    onClick={() => toggleWorkflow(current.id)}
                    className="flex items-center gap-1.5 text-[11px] font-medium px-4 py-2 rounded-xl border border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-all"
                  >
                    <i data-lucide="play" className="w-3.5 h-3.5"></i>Resume
                  </button>
                ) : null}
                {current.status === 'error' ? (
                  <button
                    type="button"
                    onClick={() => toggleWorkflow(current.id)}
                    className="flex items-center gap-1.5 text-[11px] font-medium px-4 py-2 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                  >
                    <i data-lucide="rotate-cw" className="w-3.5 h-3.5"></i>Retry
                  </button>
                ) : null}
                <button type="button" className="flex items-center gap-1.5 text-[11px] font-medium px-4 py-2 rounded-xl glass text-gray-300 hover:bg-white/[.06] transition-all">
                  <i data-lucide="pencil" className="w-3.5 h-3.5"></i>Edit
                </button>
                <button
                  type="button"
                  onClick={() => deleteWorkflow(current.id)}
                  className="w-9 h-9 rounded-xl bg-white/5 hover:bg-red-500/15 flex items-center justify-center transition-colors"
                  aria-label="Hapus workflow"
                >
                  <i data-lucide="trash-2" className="w-4 h-4 text-gray-400 hover:text-red-400"></i>
                </button>
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed mb-6">{current.desc}</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <div className="bg-white/[.03] rounded-xl p-3 text-center">
                <p className="stat-num font-oswald text-lg">{formatNum(current.ops)}</p>
                <p className="text-[10px] text-gray-500">Total Operasi</p>
              </div>
              <div className="bg-white/[.03] rounded-xl p-3 text-center">
                <p className="stat-num font-oswald text-lg">{current.avgTime}s</p>
                <p className="text-[10px] text-gray-500">Avg Response</p>
              </div>
              <div className="bg-white/[.03] rounded-xl p-3 text-center">
                <p className="stat-num font-oswald text-lg">{current.uptime}%</p>
                <p className="text-[10px] text-gray-500">Uptime</p>
              </div>
              <div className="bg-white/[.03] rounded-xl p-3 text-center">
                <p className="stat-num font-oswald text-lg">{current.lastRun}</p>
                <p className="text-[10px] text-gray-500">Terakhir Dijalankan</p>
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-semibold tracking-wider uppercase text-gray-400 mb-4">Pipeline Nodes ({current.nodes.length})</h4>
              <div className="flex items-start gap-0 overflow-x-auto pb-4">
                {current.nodes.map((n, i) => {
                  const c = NODE_COLORS[n] || '#6B7280'
                  const icon = NODE_ICONS[n] || 'circle'
                  const isRunning = current.status === 'running'
                  return (
                    <div key={n + i} className="flex items-center gap-2">
                      <div className="flex flex-col items-center">
                        <div
                          className={'w-11 h-11 rounded-xl flex items-center justify-center ' + (isRunning ? 'node-glow' : '')}
                          style={{ background: c + '15', border: '1.5px solid ' + c + '30' }}
                        >
                          <i data-lucide={icon} className="w-5 h-5" style={{ color: c }}></i>
                        </div>
                        <span className="text-[8px] text-gray-500 mt-1.5 text-center max-w-[60px] leading-tight">{n}</span>
                      </div>
                      {i < current.nodes.length - 1 ? (
                        <div className="w-6 flex-shrink-0 mt-[-14px] h-[2px] bg-gradient-to-r from-white/10 via-white/20 to-white/10 bg-[length:200%_100%] animate-[flowLine_2s_linear_infinite]"></div>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold">Execution Log</h4>
              <span className="text-[10px] text-gray-500 font-jetbrains">10 run terakhir</span>
            </div>
            <div className="space-y-1.5 font-jetbrains text-[10px]">
              {logs.map((row) => {
                const ok = row.status === 'success'
                const sc = ok ? '#4ade80' : '#f87171'
                return (
                  <div key={row.id} className="flex items-center gap-3 py-1.5 px-2 rounded-lg hover:bg-white/[.03] transition-colors">
                    <span className="text-gray-600">{row.ts}</span>
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: sc }}></span>
                    <span className="text-gray-300 flex-1">
                      Run #{row.runId} — {row.nodes} nodes — {row.dur}s
                    </span>
                    <span style={{ color: sc }} className="font-medium uppercase">
                      {row.status}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      ) : safeView === 'grid' ? (
        <div key="grid" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.length ? (
            filtered.map((w, idx) => {
              const c = TYPE_COLORS[w.type]
              const badge = statusMeta(w.status)
              return (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setDetailId(w.id)}
                  className={'glass rounded-2xl p-5 text-left cursor-pointer transition-all border border-white/10 hover:border-white/20 hover:-translate-y-[1px] hover:shadow-[0_4px_24px_rgba(0,0,0,.25)] anim-up'}
                  style={{ animationDelay: `${Math.min(idx + 2, 9) * 0.05}s` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: c + '12', border: '1px solid ' + c + '20' }}>
                        <i data-lucide={TYPE_ICONS[w.type]} className="w-[18px] h-[18px]" style={{ color: c }}></i>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-white leading-tight">{w.name}</h3>
                        <span className="text-[10px] text-gray-500">
                          {TYPE_LABELS[w.type]} · {w.trigger}
                        </span>
                      </div>
                    </div>
                    <span className={'text-[9px] font-medium px-2 py-0.5 rounded-md inline-flex items-center gap-1 border ' + badge.cls}>
                      <span className={'w-1.5 h-1.5 rounded-full ' + badge.dot + (badge.pulse ? ' animate-pulse' : '')}></span>
                      {badge.label}
                    </span>
                  </div>

                  <p
                    className="text-[11px] text-gray-400 leading-relaxed mb-4"
                    style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                  >
                    {w.desc}
                  </p>
                  <div className="mb-4">
                    <NodePills nodes={w.nodes} />
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <div className="flex items-center gap-4 text-[10px] text-gray-500">
                      <span className="flex items-center gap-1">
                        <i data-lucide="activity" className="w-3 h-3"></i>
                        {formatNum(w.ops)} ops
                      </span>
                      <span className="flex items-center gap-1">
                        <i data-lucide="clock" className="w-3 h-3"></i>
                        {w.avgTime}s
                      </span>
                      <span className="flex items-center gap-1">
                        <i data-lucide="shield-check" className="w-3 h-3"></i>
                        {w.uptime}%
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {w.status === 'running' ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleWorkflow(w.id)
                          }}
                          className="w-7 h-7 rounded-lg bg-white/5 hover:bg-amber-500/15 flex items-center justify-center transition-colors"
                          title="Pause"
                          aria-label="Pause"
                        >
                          <i data-lucide="pause" className="w-3.5 h-3.5 text-gray-400 hover:text-amber-400"></i>
                        </button>
                      ) : null}
                      {w.status === 'paused' ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleWorkflow(w.id)
                          }}
                          className="w-7 h-7 rounded-lg bg-white/5 hover:bg-green-500/15 flex items-center justify-center transition-colors"
                          title="Resume"
                          aria-label="Resume"
                        >
                          <i data-lucide="play" className="w-3.5 h-3.5 text-gray-400 hover:text-green-400"></i>
                        </button>
                      ) : null}
                      {w.status === 'error' ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleWorkflow(w.id)
                          }}
                          className="w-7 h-7 rounded-lg bg-white/5 hover:bg-red-500/15 flex items-center justify-center transition-colors"
                          title="Retry"
                          aria-label="Retry"
                        >
                          <i data-lucide="rotate-cw" className="w-3.5 h-3.5 text-gray-400 hover:text-red-400"></i>
                        </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteWorkflow(w.id)
                        }}
                        className="w-7 h-7 rounded-lg bg-white/5 hover:bg-red-500/15 flex items-center justify-center transition-colors"
                        title="Hapus"
                        aria-label="Hapus"
                      >
                        <i data-lucide="trash-2" className="w-3.5 h-3.5 text-gray-400 hover:text-red-400"></i>
                      </button>
                    </div>
                  </div>
                </button>
              )
            })
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-16">
              <i data-lucide="search-x" className="w-10 h-10 text-gray-600 mb-3"></i>
              <p className="text-sm text-gray-500">Tidak ada workflow ditemukan</p>
            </div>
          )}
        </div>
      ) : (
        <div key="list" className="space-y-2">
          {filtered.length ? (
            filtered.map((w, idx) => {
              const c = TYPE_COLORS[w.type]
              const badge = statusMeta(w.status)
              return (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setDetailId(w.id)}
                  className="glass rounded-xl px-4 py-3 flex items-center gap-4 cursor-pointer transition-all border border-white/10 hover:border-white/20 hover:shadow-[0_4px_24px_rgba(0,0,0,.25)] anim-up w-full text-left"
                  style={{ animationDelay: `${Math.min(idx + 2, 9) * 0.05}s` }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: c + '12', border: '1px solid ' + c + '20' }}>
                    <i data-lucide={TYPE_ICONS[w.type]} className="w-4 h-4" style={{ color: c }}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-semibold truncate">{w.name}</h3>
                      <span className={'text-[9px] font-medium px-2 py-0.5 rounded-md inline-flex items-center gap-1 border ' + badge.cls}>
                        <span className={'w-1.5 h-1.5 rounded-full ' + badge.dot + (badge.pulse ? ' animate-pulse' : '')}></span>
                        {badge.label}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 truncate">{w.desc}</p>
                  </div>
                  <div className="hidden md:flex items-center gap-5 text-[10px] text-gray-500 flex-shrink-0">
                    <span className="flex items-center gap-1 w-16 justify-end">
                      <i data-lucide="activity" className="w-3 h-3"></i>
                      {formatNum(w.ops)}
                    </span>
                    <span className="flex items-center gap-1 w-12 justify-end">
                      <i data-lucide="clock" className="w-3 h-3"></i>
                      {w.avgTime}s
                    </span>
                    <span className="flex items-center gap-1 w-16 justify-end">
                      <i data-lucide="shield-check" className="w-3 h-3"></i>
                      {w.uptime}%
                    </span>
                    <span className="text-gray-600 w-20 justify-end text-right">{w.lastRun}</span>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {w.status === 'running' ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleWorkflow(w.id)
                        }}
                        className="w-7 h-7 rounded-lg bg-white/5 hover:bg-amber-500/15 flex items-center justify-center transition-colors"
                        aria-label="Pause"
                      >
                        <i data-lucide="pause" className="w-3.5 h-3.5 text-gray-400"></i>
                      </button>
                    ) : null}
                    {w.status === 'paused' ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleWorkflow(w.id)
                        }}
                        className="w-7 h-7 rounded-lg bg-white/5 hover:bg-green-500/15 flex items-center justify-center transition-colors"
                        aria-label="Resume"
                      >
                        <i data-lucide="play" className="w-3.5 h-3.5 text-gray-400"></i>
                      </button>
                    ) : null}
                    {w.status === 'error' ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleWorkflow(w.id)
                        }}
                        className="w-7 h-7 rounded-lg bg-white/5 hover:bg-red-500/15 flex items-center justify-center transition-colors"
                        aria-label="Retry"
                      >
                        <i data-lucide="rotate-cw" className="w-3.5 h-3.5 text-gray-400"></i>
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteWorkflow(w.id)
                      }}
                      className="w-7 h-7 rounded-lg bg-white/5 hover:bg-red-500/15 flex items-center justify-center transition-colors"
                      aria-label="Hapus"
                    >
                      <i data-lucide="trash-2" className="w-3.5 h-3.5 text-gray-400"></i>
                    </button>
                  </div>
                </button>
              )
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <i data-lucide="search-x" className="w-10 h-10 text-gray-600 mb-3"></i>
              <p className="text-sm text-gray-500">Tidak ada workflow ditemukan</p>
            </div>
          )}
        </div>
      )}

      {createOpen ? (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div className="relative w-full max-w-lg max-h-[calc(100dvh-2rem)] overflow-y-auto glass-strong rounded-2xl p-5 sm:p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-oswald font-light text-xl">Buat Workflow Baru</h2>
                <p className="text-[10px] text-gray-500 mt-0.5">Konfigurasi workflow AI Anda</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCreateOpen(false)
                  setNewName('')
                  setNewCat('doc')
                }}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                aria-label="Tutup"
              >
                <i data-lucide="x" className="w-4 h-4 text-gray-400"></i>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-semibold tracking-wider uppercase text-gray-400 mb-1.5 block">Nama Workflow</label>
                <input
                  ref={nameInputRef}
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  type="text"
                  placeholder="cth: Invoice Auto-Processor"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/30 transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold tracking-wider uppercase text-gray-400 mb-1.5 block">Kategori</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'doc', label: 'Dokumen', icon: 'file-text', c: '#F59E0B' },
                    { id: 'mkt', label: 'Marketing', icon: 'megaphone', c: '#3B82F6' },
                    { id: 'sup', label: 'Support', icon: 'headphones', c: '#10B981' },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setNewCat(c.id)}
                      className={
                        'flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ' +
                        (newCat === c.id ? 'bg-white/[.02]' : 'bg-white/[.02] hover:bg-white/[.04]') +
                        (newCat === c.id ? '' : '')
                      }
                      style={
                        newCat === c.id
                          ? { borderColor: c.c + '4D', background: c.c + '1A' }
                          : { borderColor: 'rgba(255,255,255,0.10)' }
                      }
                    >
                      <i data-lucide={c.icon} className="w-5 h-5" style={{ color: newCat === c.id ? c.c : '#9ca3af' }}></i>
                      <span className="text-[10px] font-medium" style={{ color: newCat === c.id ? c.c : '#9ca3af' }}>
                        {c.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold tracking-wider uppercase text-gray-400 mb-2 block">Template Node</label>
                {newCat === 'doc' ? (
                  <DokumenTemplate mode="stack" onEdit={(n) => openTemplateEdit('doc', n)} />
                ) : newCat === 'mkt' ? (
                  <MarketingTemplate mode="stack" onEdit={(n) => openTemplateEdit('mkt', n)} />
                ) : newCat === 'sup' ? (
                  <SupportTemplate mode="stack" onEdit={(n) => openTemplateEdit('sup', n)} />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: 'Input', icon: 'file-input', c: '#F59E0B' },
                      { label: 'AI Process', icon: 'brain', c: '#A855F7' },
                      { label: 'Condition', icon: 'git-branch', c: '#3B82F6' },
                      { label: 'DB Lookup', icon: 'database', c: '#10B981' },
                      { label: 'Output', icon: 'send', c: '#06b6d4' },
                      { label: 'Email', icon: 'mail', c: '#EF4444' },
                    ].map((n) => (
                      <span
                        key={n.label}
                        className="text-[10px] font-medium px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 cursor-pointer flex items-center gap-1.5 hover:bg-white/10 transition-colors"
                      >
                        <i data-lucide={n.icon} className="w-3 h-3" style={{ color: n.c }}></i>
                        {n.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setCreateOpen(false)
                    setNewName('')
                    setNewCat('doc')
                  }}
                  className="flex-1 text-xs font-medium py-2.5 rounded-xl border border-white/10 text-gray-400 hover:bg-white/5 transition-all"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={createWorkflow}
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs py-2.5 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(245,158,11,.3)]"
                >
                  Buat Workflow
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {templateEdit ? (
        <div className="fixed inset-0 z-[115] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => {
              setTemplateEdit(null)
            }}
          ></div>
          <div className="relative w-full max-w-lg max-h-[calc(100dvh-2rem)] overflow-y-auto glass-strong rounded-2xl p-5 sm:p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-oswald font-light text-xl">Edit Data Node</h2>
                <p className="text-[10px] text-gray-500 mt-0.5">{templateEdit.label}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setTemplateEdit(null)
                }}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                aria-label="Tutup"
              >
                <i data-lucide="x" className="w-4 h-4 text-gray-400"></i>
              </button>
            </div>

            {templateEdit.schema.length ? (
              <div className="space-y-3">
                {templateEdit.schema.map((f) => (
                  <div key={f.name}>
                    <label className="text-[10px] font-semibold tracking-wider uppercase text-gray-400 mb-1.5 block">{f.label}</label>
                    {f.type === 'textarea' ? (
                      <textarea
                        value={templateDraft[f.name] || ''}
                        onChange={(e) => setTemplateDraft((p) => ({ ...p, [f.name]: e.target.value }))}
                        placeholder={f.placeholder || ''}
                        rows={4}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/30 transition-all resize-none"
                      />
                    ) : f.type === 'select' ? (
                      <select
                        value={templateDraft[f.name] || (f.options?.[0] ?? '')}
                        onChange={(e) => setTemplateDraft((p) => ({ ...p, [f.name]: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-gray-300 focus:outline-none focus:border-amber-500/30 appearance-none cursor-pointer"
                      >
                        {(f.options || []).map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    ) : f.type === 'file' ? (
                      <div className="space-y-2">
                        <input
                          type="file"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            setTemplateFileName(file?.name || '')
                          }}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-gray-300 focus:outline-none focus:border-amber-500/30 transition-all"
                        />
                        <div className="text-[10px] text-gray-500">
                          {templateFileName || templateDraft.fileName ? `File: ${templateFileName || templateDraft.fileName}` : 'Belum ada file dipilih'}
                        </div>
                      </div>
                    ) : (
                      <input
                        value={templateDraft[f.name] || ''}
                        onChange={(e) => setTemplateDraft((p) => ({ ...p, [f.name]: e.target.value }))}
                        type={f.type === 'url' ? 'url' : 'text'}
                        placeholder={f.placeholder || ''}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/30 transition-all"
                      />
                    )}
                  </div>
                ))}

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTemplateEdit(null)
                    }}
                    className="flex-1 text-xs font-medium py-2.5 rounded-xl border border-white/10 text-gray-400 hover:bg-white/5 transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={saveTemplateEdit}
                    className="flex-1 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs py-2.5 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(245,158,11,.3)]"
                  >
                    Simpan
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-xs text-gray-500">
                Node ini tidak membutuhkan data acuan tambahan.
              </div>
            )}
          </div>
        </div>
      ) : null}

      {importOpen ? (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div className="relative w-full max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto glass-strong rounded-2xl p-5 sm:p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-oswald font-light text-xl">Import Workflow</h2>
              <button type="button" onClick={() => setImportOpen(false)} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors" aria-label="Tutup">
                <i data-lucide="x" className="w-4 h-4 text-gray-400"></i>
              </button>
            </div>
            <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-amber-500/30 transition-colors cursor-pointer">
              <i data-lucide="upload-cloud" className="w-10 h-10 text-gray-500 mx-auto mb-3"></i>
              <p className="text-xs text-gray-300 font-medium">Drag & drop file JSON</p>
              <p className="text-[10px] text-gray-500 mt-1">atau klik untuk browse</p>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <button type="button" onClick={() => setImportOpen(false)} className="flex-1 text-xs font-medium py-2.5 rounded-xl border border-white/10 text-gray-400 hover:bg-white/5 transition-all">
                Batal
              </button>
              <button type="button" className="flex-1 glass text-xs font-medium py-2.5 rounded-xl text-gray-300 hover:bg-white/[.06] transition-all">
                Upload
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <ToastStack
        toasts={toasts}
        onDismiss={(id) => {
          setToasts((prev) => prev.filter((t) => t.id !== id))
        }}
      />
    </div>
  )
}
