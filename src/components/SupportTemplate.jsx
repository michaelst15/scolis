import { useEffect, useMemo } from 'react'

function Node({ ico, label, bg, bc, ic, tx }) {
  return (
    <div className="flex items-center gap-2 bg-white/[.04] border border-white/10 rounded-xl px-3 py-2">
      <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: bg, border: `1px solid ${bc}` }}>
        <i data-lucide={ico} className="w-4 h-4" style={{ color: ic }}></i>
      </span>
      <span className="text-[11px] font-medium leading-tight" style={{ color: tx }}>
        {label}
      </span>
    </div>
  )
}

export default function SupportTemplate() {
  const flow = useMemo(
    () => ({
      top: [
        { ico: 'message-circle', label: 'Customer Chat ke WhatsApp Bisnis', bg: 'rgba(16,185,129,.10)', bc: 'rgba(16,185,129,.20)', ic: '#10B981', tx: '#6EE7B7' },
        { ico: 'webhook', label: 'Webhook Node — Tangkap Pesan', bg: 'rgba(59,130,246,.10)', bc: 'rgba(59,130,246,.20)', ic: '#3B82F6', tx: '#93C5FD' },
        { ico: 'brain', label: 'AI Agent — Pahami Maksud', bg: 'rgba(168,85,247,.12)', bc: 'rgba(168,85,247,.25)', ic: '#A855F7', tx: '#C4B5FD' },
        { ico: 'git-branch', label: 'Apa jenis pertanyaan?', bg: 'rgba(245,158,11,.12)', bc: 'rgba(245,158,11,.25)', ic: '#F59E0B', tx: '#FBBF24' },
      ],
      branches: [
        { ico: 'table', label: 'Stok Produk — Cek Database (Google Sheets)', bg: 'rgba(59,130,246,.10)', bc: 'rgba(59,130,246,.20)', ic: '#3B82F6', tx: '#93C5FD' },
        { ico: 'tag', label: 'Harga — Ambil dari Price List', bg: 'rgba(245,158,11,.12)', bc: 'rgba(245,158,11,.25)', ic: '#F59E0B', tx: '#FBBF24' },
        { ico: 'book-open', label: 'Pengiriman — Jawab dari FAQ', bg: 'rgba(16,185,129,.10)', bc: 'rgba(16,185,129,.20)', ic: '#10B981', tx: '#6EE7B7' },
        { ico: 'send', label: 'Komplain — Escalate ke Human (Telegram)', bg: 'rgba(239,68,68,.10)', bc: 'rgba(239,68,68,.20)', ic: '#EF4444', tx: '#FCA5A5' },
      ],
      end: { ico: 'send', label: 'Kirim Balasan ke WhatsApp', bg: 'rgba(16,185,129,.10)', bc: 'rgba(16,185,129,.20)', ic: '#10B981', tx: '#6EE7B7' },
    }),
    [],
  )

  useEffect(() => {
    window.lucide?.createIcons?.()
  })

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {flow.top.map((n, idx) => (
          <div key={n.label} className="flex items-center gap-2 flex-shrink-0">
            <Node {...n} />
            {idx < flow.top.length - 1 ? <i data-lucide="chevron-right" className="w-4 h-4 text-gray-600 flex-shrink-0"></i> : null}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {flow.branches.map((n) => (
          <div key={n.label} className="flex items-center gap-2">
            <i data-lucide="corner-down-right" className="w-4 h-4 text-gray-600 flex-shrink-0"></i>
            <div className="flex-1">
              <Node {...n} />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <i data-lucide="arrow-down" className="w-4 h-4 text-gray-600 flex-shrink-0"></i>
        <div className="flex-1">
          <Node {...flow.end} />
        </div>
      </div>
    </div>
  )
}

