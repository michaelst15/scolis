export function getMarketingFlowPreset(workflow) {
  const name = String(workflow?.name || '').toLowerCase()
  if (name.includes('social') || name.includes('campaign')) return SOCIAL_FLOW
  if (name.includes('email')) return EMAIL_FLOW
  if (name.includes('blog')) return BLOG_FLOW
  if (name.includes('review') || name.includes('sentiment')) return REVIEW_FLOW
  return DEFAULT_MKT_FLOW
}

const DEFAULT_MKT_FLOW = {
  nodes: [
    { id: 'A', px: 12, py: 18, label: 'Webhook / Form Lead', type: 'trigger', icon: 'webhook' },
    { id: 'B', px: 28, py: 18, label: 'Filter & Validasi Email', type: 'process', icon: 'filter' },
    { id: 'C', px: 44, py: 18, label: 'Enrich Data', type: 'process', icon: 'users' },
    { id: 'D', px: 60, py: 18, label: 'AI Scoring', type: 'process', icon: 'brain' },
    { id: 'E', px: 60, py: 34, label: 'Score >= 70?', type: 'cond', icon: 'git-branch' },
    { id: 'F', px: 78, py: 34, label: 'Create / Update CRM', type: 'ok', icon: 'database' },
    { id: 'G', px: 40, py: 48, label: 'Simpan ke Nurture List', type: 'process', icon: 'list-plus' },
    { id: 'H', px: 78, py: 48, label: 'Notifikasi Sales Slack', type: 'notif', icon: 'bell-ring' },
    { id: 'I', px: 62, py: 62, label: 'Tambah ke Campaign', type: 'ok', icon: 'megaphone' },
  ],
  mobileGrid: {
    A: { c: 0, r: 0 },
    B: { c: 1, r: 0 },
    C: { c: 2, r: 0 },
    D: { c: 2, r: 1 },
    E: { c: 2, r: 2 },
    F: { c: 2, r: 3 },
    H: { c: 2, r: 4 },
    I: { c: 1, r: 5 },
    G: { c: 0, r: 3 },
  },
  edges: [
    { from: 'A', to: 'B', fp: 'right', tp: 'left' },
    { from: 'B', to: 'C', fp: 'right', tp: 'left' },
    { from: 'C', to: 'D', fp: 'right', tp: 'left' },
    { from: 'D', to: 'E', fp: 'bottom', tp: 'top' },
    { from: 'E', to: 'F', fp: 'bottomRight', tp: 'top', lbl: 'Ya' },
    { from: 'E', to: 'G', fp: 'bottomLeft', tp: 'top', lbl: 'Tidak' },
    { from: 'F', to: 'H', fp: 'bottom', tp: 'top' },
    { from: 'H', to: 'I', fp: 'bottom', tp: 'top' },
    { from: 'G', to: 'I', fp: 'right', tp: 'left', lbl: 'Nurture' },
  ],
  seq: [
    { from: 'A', to: 'B', log: 'Lead masuk dari form/webhook' },
    { from: 'B', to: 'C', log: 'Validasi email + deduplikasi' },
    { from: 'C', to: 'D', log: 'Enrich data lead' },
    { from: 'D', to: 'E', log: 'AI scoring lead' },
    { from: 'E', to: 'F', log: 'Skor tinggi — update CRM', br: 'Ya', skip: 'G' },
    { from: 'F', to: 'H', log: 'Notifikasi sales' },
    { from: 'H', to: 'I', log: 'Masukkan ke campaign' },
    { from: 'E', to: 'G', log: 'Skor rendah — nurture list', br: 'Tidak', skip: 'F' },
    { from: 'G', to: 'I', log: 'Nurture → campaign', br: 'Nurture' },
  ],
}

const SOCIAL_FLOW = {
  nodes: [
    { id: 'A', px: 14, py: 18, label: 'Ide Konten', type: 'trigger', icon: 'megaphone' },
    { id: 'B', px: 34, py: 18, label: 'AI Generate Copy', type: 'process', icon: 'brain' },
    { id: 'C', px: 54, py: 18, label: 'Image Gen', type: 'process', icon: 'image' },
    { id: 'D', px: 72, py: 18, label: 'Schedule', type: 'process', icon: 'calendar' },
    { id: 'E', px: 72, py: 34, label: 'Publish', type: 'ok', icon: 'send' },
    { id: 'F', px: 46, py: 48, label: 'Monitor CTR', type: 'process', icon: 'trending-up' },
    { id: 'G', px: 46, py: 62, label: 'Optimasi', type: 'process', icon: 'filter' },
  ],
  mobileGrid: {
    A: { c: 0, r: 0 },
    B: { c: 1, r: 0 },
    C: { c: 2, r: 0 },
    D: { c: 2, r: 1 },
    E: { c: 2, r: 2 },
    F: { c: 1, r: 3 },
    G: { c: 1, r: 4 },
  },
  edges: [
    { from: 'A', to: 'B', fp: 'right', tp: 'left' },
    { from: 'B', to: 'C', fp: 'right', tp: 'left' },
    { from: 'C', to: 'D', fp: 'right', tp: 'left' },
    { from: 'D', to: 'E', fp: 'bottom', tp: 'top' },
    { from: 'E', to: 'F', fp: 'left', tp: 'right' },
    { from: 'F', to: 'G', fp: 'bottom', tp: 'top' },
    { from: 'G', to: 'B', fp: 'top', tp: 'left', lbl: 'Iterasi' },
  ],
  seq: [
    { from: 'A', to: 'B', log: 'Ide konten dipilih' },
    { from: 'B', to: 'C', log: 'Generate copy & aset visual' },
    { from: 'C', to: 'D', log: 'Jadwalkan posting' },
    { from: 'D', to: 'E', log: 'Publish konten' },
    { from: 'E', to: 'F', log: 'Pantau CTR & engagement' },
    { from: 'F', to: 'G', log: 'Optimasi campaign' },
    { from: 'G', to: 'B', log: 'Iterasi konten', br: 'Iterasi' },
  ],
}

const EMAIL_FLOW = {
  nodes: [
    { id: 'A', px: 16, py: 18, label: 'New User', type: 'trigger', icon: 'users' },
    { id: 'B', px: 36, py: 18, label: 'Delay 1h', type: 'process', icon: 'clock' },
    { id: 'C', px: 56, py: 18, label: 'Email 1', type: 'notif', icon: 'mail' },
    { id: 'D', px: 56, py: 34, label: 'Delay 1d', type: 'process', icon: 'clock' },
    { id: 'E', px: 56, py: 48, label: 'Email 2', type: 'notif', icon: 'mail' },
    { id: 'F', px: 56, py: 62, label: 'Delay 3d', type: 'process', icon: 'clock' },
    { id: 'G', px: 56, py: 76, label: 'Email 3', type: 'notif', icon: 'mail' },
  ],
  mobileGrid: {
    A: { c: 0, r: 0 },
    B: { c: 1, r: 0 },
    C: { c: 2, r: 0 },
    D: { c: 2, r: 1 },
    E: { c: 2, r: 2 },
    F: { c: 2, r: 3 },
    G: { c: 2, r: 4 },
  },
  edges: [
    { from: 'A', to: 'B', fp: 'right', tp: 'left' },
    { from: 'B', to: 'C', fp: 'right', tp: 'left' },
    { from: 'C', to: 'D', fp: 'bottom', tp: 'top' },
    { from: 'D', to: 'E', fp: 'bottom', tp: 'top' },
    { from: 'E', to: 'F', fp: 'bottom', tp: 'top' },
    { from: 'F', to: 'G', fp: 'bottom', tp: 'top' },
  ],
  seq: [
    { from: 'A', to: 'B', log: 'User baru masuk' },
    { from: 'B', to: 'C', log: 'Kirim email 1' },
    { from: 'C', to: 'D', log: 'Delay 1 hari' },
    { from: 'D', to: 'E', log: 'Kirim email 2' },
    { from: 'E', to: 'F', log: 'Delay 3 hari' },
    { from: 'F', to: 'G', log: 'Kirim email 3' },
  ],
}

const BLOG_FLOW = {
  nodes: [
    { id: 'A', px: 16, py: 18, label: 'Keyword Research', type: 'trigger', icon: 'search' },
    { id: 'B', px: 36, py: 18, label: 'Outline', type: 'process', icon: 'list' },
    { id: 'C', px: 56, py: 18, label: 'AI Draft', type: 'process', icon: 'pen-tool' },
    { id: 'D', px: 76, py: 18, label: 'Human Review', type: 'process', icon: 'eye' },
    { id: 'E', px: 76, py: 34, label: 'SEO Optimize', type: 'process', icon: 'trending-up' },
    { id: 'F', px: 76, py: 48, label: 'Publish', type: 'ok', icon: 'globe' },
  ],
  mobileGrid: {
    A: { c: 0, r: 0 },
    B: { c: 1, r: 0 },
    C: { c: 2, r: 0 },
    D: { c: 2, r: 1 },
    E: { c: 2, r: 2 },
    F: { c: 2, r: 3 },
  },
  edges: [
    { from: 'A', to: 'B', fp: 'right', tp: 'left' },
    { from: 'B', to: 'C', fp: 'right', tp: 'left' },
    { from: 'C', to: 'D', fp: 'right', tp: 'left' },
    { from: 'D', to: 'E', fp: 'bottom', tp: 'top' },
    { from: 'E', to: 'F', fp: 'bottom', tp: 'top' },
  ],
  seq: [
    { from: 'A', to: 'B', log: 'Riset keyword' },
    { from: 'B', to: 'C', log: 'Buat outline & draft' },
    { from: 'C', to: 'D', log: 'Review manusia' },
    { from: 'D', to: 'E', log: 'Optimasi SEO' },
    { from: 'E', to: 'F', log: 'Publish' },
  ],
}

const REVIEW_FLOW = {
  nodes: [
    { id: 'A', px: 16, py: 18, label: 'Crawl Reviews', type: 'trigger', icon: 'download' },
    { id: 'B', px: 36, py: 18, label: 'Preprocess', type: 'process', icon: 'filter' },
    { id: 'C', px: 56, py: 18, label: 'AI Sentiment', type: 'process', icon: 'smile-plus' },
    { id: 'D', px: 76, py: 18, label: 'Aggregate', type: 'process', icon: 'bar-chart-3' },
    { id: 'E', px: 76, py: 34, label: 'Dashboard', type: 'ok', icon: 'layout-dashboard' },
  ],
  mobileGrid: {
    A: { c: 0, r: 0 },
    B: { c: 1, r: 0 },
    C: { c: 2, r: 0 },
    D: { c: 2, r: 1 },
    E: { c: 2, r: 2 },
  },
  edges: [
    { from: 'A', to: 'B', fp: 'right', tp: 'left' },
    { from: 'B', to: 'C', fp: 'right', tp: 'left' },
    { from: 'C', to: 'D', fp: 'right', tp: 'left' },
    { from: 'D', to: 'E', fp: 'bottom', tp: 'top' },
  ],
  seq: [
    { from: 'A', to: 'B', log: 'Ambil review marketplace' },
    { from: 'B', to: 'C', log: 'Preprocess teks' },
    { from: 'C', to: 'D', log: 'Analisis sentiment AI' },
    { from: 'D', to: 'E', log: 'Update dashboard' },
  ],
}
