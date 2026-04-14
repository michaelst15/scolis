export function getSupportFlowPreset(workflow) {
  const name = String(workflow?.name || '').toLowerCase()
  if (name.includes('ticket')) return TICKET_FLOW
  if (name.includes('churn')) return CHURN_FLOW
  return CHAT_AGENT_FLOW
}

const CHAT_AGENT_FLOW = {
  nodes: [
    { id: 'A', px: 14, py: 16, label: 'Customer Chat ke WhatsApp Bisnis', type: 'trigger', icon: 'message-circle' },
    { id: 'B', px: 34, py: 16, label: 'Webhook Node — Tangkap Pesan', type: 'process', icon: 'webhook' },
    { id: 'C', px: 54, py: 16, label: 'AI Agent — Pahami Maksud', type: 'process', icon: 'brain' },
    { id: 'D', px: 70, py: 30, label: 'Apa jenis pertanyaan?', type: 'cond', icon: 'git-branch' },
    { id: 'E', px: 22, py: 46, label: 'Stok Produk — Cek Database (Google Sheets)', type: 'process', icon: 'table' },
    { id: 'F', px: 50, py: 46, label: 'Harga — Ambil dari Price List', type: 'process', icon: 'tag' },
    { id: 'G', px: 78, py: 46, label: 'Pengiriman — Jawab dari FAQ', type: 'process', icon: 'book-open' },
    { id: 'H', px: 50, py: 62, label: 'Komplain — Escalate ke Human (Telegram)', type: 'notif', icon: 'send' },
    { id: 'I', px: 50, py: 78, label: 'Kirim Balasan ke WhatsApp', type: 'ok', icon: 'send' },
  ],
  mobileGrid: {
    A: { c: 0, r: 0 },
    B: { c: 1, r: 0 },
    C: { c: 2, r: 0 },
    D: { c: 2, r: 1 },
    E: { c: 0, r: 2 },
    F: { c: 1, r: 2 },
    G: { c: 2, r: 2 },
    H: { c: 1, r: 3 },
    I: { c: 1, r: 4 },
  },
  edges: [
    { from: 'A', to: 'B', fp: 'right', tp: 'left' },
    { from: 'B', to: 'C', fp: 'right', tp: 'left' },
    { from: 'C', to: 'D', fp: 'bottomRight', tp: 'top' },
    { from: 'D', to: 'E', fp: 'bottomLeft', tp: 'top', lbl: 'Stok Produk' },
    { from: 'D', to: 'F', fp: 'bottom', tp: 'top', lbl: 'Harga' },
    { from: 'D', to: 'G', fp: 'bottomRight', tp: 'top', lbl: 'Pengiriman' },
    { from: 'D', to: 'H', fp: 'bottom', tp: 'top', lbl: 'Komplain' },
    { from: 'E', to: 'I', fp: 'right', tp: 'left' },
    { from: 'F', to: 'I', fp: 'right', tp: 'left' },
    { from: 'G', to: 'I', fp: 'left', tp: 'right' },
    { from: 'H', to: 'I', fp: 'bottom', tp: 'top' },
  ],
  seq: [
    { from: 'A', to: 'B', log: 'Chat masuk dari WhatsApp' },
    { from: 'B', to: 'C', log: 'Webhook menangkap pesan' },
    { from: 'C', to: 'D', log: 'AI memahami maksud' },
    { from: 'D', to: 'E', log: 'Cek stok di Google Sheets', br: 'Stok Produk', skip: 'F' },
    { from: 'E', to: 'I', log: 'Kirim balasan stok' },
    { from: 'D', to: 'F', log: 'Ambil harga dari price list', br: 'Harga', skip: 'G' },
    { from: 'F', to: 'I', log: 'Kirim balasan harga' },
    { from: 'D', to: 'G', log: 'Jawab dari FAQ pengiriman', br: 'Pengiriman', skip: 'H' },
    { from: 'G', to: 'I', log: 'Kirim balasan pengiriman' },
    { from: 'D', to: 'H', log: 'Komplain — eskalasi ke human', br: 'Komplain', skip: 'E' },
    { from: 'H', to: 'I', log: 'Kirim konfirmasi ke customer' },
  ],
}

const TICKET_FLOW = {
  nodes: [
    { id: 'A', px: 14, py: 16, label: 'Incoming Ticket', type: 'trigger', icon: 'inbox' },
    { id: 'B', px: 34, py: 16, label: 'AI Classify', type: 'process', icon: 'tags' },
    { id: 'C', px: 54, py: 16, label: 'Priority', type: 'cond', icon: 'flag' },
    { id: 'D', px: 74, py: 16, label: 'Route', type: 'process', icon: 'git-branch' },
    { id: 'E', px: 74, py: 32, label: 'Assign', type: 'ok', icon: 'user-check' },
    { id: 'F', px: 46, py: 46, label: 'AI Respond (Jika bisa)', type: 'process', icon: 'message-square' },
    { id: 'G', px: 46, py: 62, label: 'Log', type: 'ok', icon: 'scroll-text' },
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
  ],
  seq: [
    { from: 'A', to: 'B', log: 'Tiket masuk' },
    { from: 'B', to: 'C', log: 'Klasifikasi AI + ekstraksi intent' },
    { from: 'C', to: 'D', log: 'Tentukan routing tim' },
    { from: 'D', to: 'E', log: 'Assign agent' },
    { from: 'E', to: 'F', log: 'Auto-reply jika memungkinkan' },
    { from: 'F', to: 'G', log: 'Simpan log & SLA' },
  ],
}

const CHURN_FLOW = {
  nodes: [
    { id: 'A', px: 14, py: 16, label: 'Fetch Data', type: 'trigger', icon: 'database' },
    { id: 'B', px: 36, py: 16, label: 'Feature Eng', type: 'process', icon: 'settings-2' },
    { id: 'C', px: 58, py: 16, label: 'ML Predict', type: 'process', icon: 'brain' },
    { id: 'D', px: 58, py: 32, label: 'High Risk?', type: 'cond', icon: 'help-circle' },
    { id: 'E', px: 78, py: 48, label: 'Email/Slack', type: 'notif', icon: 'mail' },
    { id: 'F', px: 40, py: 48, label: 'Do Nothing', type: 'ok', icon: 'check-circle' },
  ],
  mobileGrid: {
    A: { c: 0, r: 0 },
    B: { c: 1, r: 0 },
    C: { c: 2, r: 0 },
    D: { c: 2, r: 1 },
    E: { c: 2, r: 2 },
    F: { c: 0, r: 2 },
  },
  edges: [
    { from: 'A', to: 'B', fp: 'right', tp: 'left' },
    { from: 'B', to: 'C', fp: 'right', tp: 'left' },
    { from: 'C', to: 'D', fp: 'bottom', tp: 'top' },
    { from: 'D', to: 'E', fp: 'bottomRight', tp: 'top', lbl: 'Ya' },
    { from: 'D', to: 'F', fp: 'bottomLeft', tp: 'top', lbl: 'Tidak' },
  ],
  seq: [
    { from: 'A', to: 'B', log: 'Ambil data customer' },
    { from: 'B', to: 'C', log: 'Feature engineering' },
    { from: 'C', to: 'D', log: 'Prediksi churn' },
    { from: 'D', to: 'E', log: 'High risk — kirim alert', br: 'Ya', skip: 'F' },
    { from: 'D', to: 'F', log: 'Risk rendah', br: 'Tidak', skip: 'E' },
  ],
}

