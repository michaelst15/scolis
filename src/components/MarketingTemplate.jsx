import { useEffect, useMemo } from 'react'

export default function MarketingTemplate() {
  const items = useMemo(
    () => [
      { ico: 'webhook', bg: 'rgba(245,158,11,.12)', bc: 'rgba(245,158,11,.25)', ic: '#F59E0B', tx: '#FBBF24', label: 'Webhook / Form Lead' },
      { ico: 'filter', bg: 'rgba(59,130,246,.10)', bc: 'rgba(59,130,246,.20)', ic: '#3B82F6', tx: '#93C5FD', label: 'Filter & Validasi Email' },
      { ico: 'users', bg: 'rgba(59,130,246,.10)', bc: 'rgba(59,130,246,.20)', ic: '#3B82F6', tx: '#93C5FD', label: 'Enrich Data' },
      { ico: 'brain', bg: 'rgba(168,85,247,.12)', bc: 'rgba(168,85,247,.25)', ic: '#A855F7', tx: '#C4B5FD', label: 'AI Scoring' },
      { ico: 'git-branch', bg: 'rgba(168,85,247,.12)', bc: 'rgba(168,85,247,.25)', ic: '#A855F7', tx: '#C4B5FD', label: 'Score >= 70?' },
      { ico: 'database', bg: 'rgba(16,185,129,.10)', bc: 'rgba(16,185,129,.20)', ic: '#10B981', tx: '#6EE7B7', label: 'Create / Update CRM' },
      { ico: 'list-plus', bg: 'rgba(255,255,255,.05)', bc: 'rgba(255,255,255,.10)', ic: '#9CA3AF', tx: '#D1D5DB', label: 'Simpan ke Nurture List' },
      { ico: 'bell-ring', bg: 'rgba(249,115,22,.12)', bc: 'rgba(249,115,22,.25)', ic: '#F97316', tx: '#FDBA74', label: 'Notifikasi Sales Slack' },
      { ico: 'megaphone', bg: 'rgba(6,182,212,.10)', bc: 'rgba(6,182,212,.20)', ic: '#06B6D4', tx: '#67E8F9', label: 'Tambah ke Campaign' },
    ],
    [],
  )

  useEffect(() => {
    window.lucide?.createIcons?.()
  })

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((n) => (
        <button
          key={n.label}
          type="button"
          className="flex items-center gap-2 bg-white/[.04] border border-white/10 rounded-xl px-3 py-2 text-left transition-all active:scale-[0.98] hover:bg-white/[.06] hover:border-white/20"
        >
          <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: n.bg, border: `1px solid ${n.bc}` }}>
            <i data-lucide={n.ico} className="w-4 h-4" style={{ color: n.ic }}></i>
          </span>
          <span className="text-[11px] font-medium leading-none whitespace-nowrap" style={{ color: n.tx }}>
            {n.label}
          </span>
        </button>
      ))}
    </div>
  )
}

