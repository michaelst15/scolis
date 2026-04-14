import { useEffect, useMemo } from 'react'

export default function MarketingTemplate({ mode = 'grid', onEdit }) {
  const items = useMemo(
    () => [
      { ico: 'webhook', bg: 'rgba(245,158,11,.12)', bc: 'rgba(245,158,11,.25)', ic: '#F59E0B', tx: '#FBBF24', label: 'Webhook / Form Lead' },
      { ico: 'filter', bg: 'rgba(59,130,246,.10)', bc: 'rgba(59,130,246,.20)', ic: '#3B82F6', tx: '#93C5FD', label: 'Filter & Validasi Email' },
      { ico: 'users', bg: 'rgba(59,130,246,.10)', bc: 'rgba(59,130,246,.20)', ic: '#3B82F6', tx: '#93C5FD', label: 'Enrich Data' },
      { ico: 'brain', bg: 'rgba(168,85,247,.12)', bc: 'rgba(168,85,247,.25)', ic: '#A855F7', tx: '#C4B5FD', label: 'AI Scoring' },
      { ico: 'git-branch', bg: 'rgba(168,85,247,.12)', bc: 'rgba(168,85,247,.25)', ic: '#A855F7', tx: '#C4B5FD', label: 'Score >= 70?' },
      { ico: 'database', bg: 'rgba(16,185,129,.10)', bc: 'rgba(16,185,129,.20)', ic: '#10B981', tx: '#6EE7B7', label: 'Create / Update CRM' },
      { key: 'nurture_list', ico: 'list-plus', bg: 'rgba(255,255,255,.05)', bc: 'rgba(255,255,255,.10)', ic: '#9CA3AF', tx: '#D1D5DB', label: 'Simpan ke Nurture List', needsUpload: true },
      { ico: 'bell-ring', bg: 'rgba(249,115,22,.12)', bc: 'rgba(249,115,22,.25)', ic: '#F97316', tx: '#FDBA74', label: 'Notifikasi Sales Slack' },
      { key: 'campaign', ico: 'megaphone', bg: 'rgba(6,182,212,.10)', bc: 'rgba(6,182,212,.20)', ic: '#06B6D4', tx: '#67E8F9', label: 'Tambah ke Campaign', needsUpload: true },
    ],
    [],
  )

  useEffect(() => {
    window.lucide?.createIcons?.()
  })

  if (mode === 'stack') {
    return (
      <div className="space-y-2">
        {items.map((n, idx) => (
          <button
            key={n.label}
            type="button"
            title={n.label}
            className="w-full flex items-center gap-2 bg-white/[.04] border border-white/10 rounded-xl px-3 py-2 text-left transition-all active:scale-[0.98] hover:bg-white/[.06] hover:border-white/20"
          >
            <span className="w-5 flex-shrink-0 text-[10px] text-gray-500 font-jetbrains">{String(idx + 1).padStart(2, '0')}</span>
            <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: n.bg, border: `1px solid ${n.bc}` }}>
              <i data-lucide={n.ico} className="w-4 h-4" style={{ color: n.ic }}></i>
            </span>
            <span className="text-[11px] font-medium leading-none" style={{ color: n.tx }}>
              {n.label}
            </span>
            {n.needsUpload ? (
              <span className="ml-auto flex items-center">
                <button
                  type="button"
                  title="Upload data acuan"
                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 flex items-center justify-center transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    onEdit?.(n)
                  }}
                >
                  <i data-lucide="pencil" className="w-3.5 h-3.5 text-gray-400"></i>
                </button>
              </span>
            ) : null}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {items.map((n) => (
        <button
          key={n.label}
          type="button"
          title={n.label}
          className="flex items-center gap-2 bg-white/[.04] border border-white/10 rounded-xl px-3 py-2 text-left transition-all active:scale-[0.98] hover:bg-white/[.06] hover:border-white/20 w-full"
        >
          <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: n.bg, border: `1px solid ${n.bc}` }}>
            <i data-lucide={n.ico} className="w-4 h-4" style={{ color: n.ic }}></i>
          </span>
          <span className="text-[11px] font-medium leading-none whitespace-nowrap" style={{ color: n.tx }}>
            {n.label}
          </span>
          {n.needsUpload ? (
            <span className="ml-auto flex items-center">
              <button
                type="button"
                title="Upload data acuan"
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 flex items-center justify-center transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit?.(n)
                }}
              >
                <i data-lucide="pencil" className="w-3.5 h-3.5 text-gray-400"></i>
              </button>
            </span>
          ) : null}
        </button>
      ))}
    </div>
  )
}
