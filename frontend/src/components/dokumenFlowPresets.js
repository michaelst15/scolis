export function getDokumenFlowPreset(workflow) {
  const name = String(workflow?.name || '').toLowerCase()
  const base = name.includes('invoice')
    ? INVOICE_FLOW
    : name.includes('contract')
      ? CONTRACT_FLOW
      : name.includes('id verification') || name.includes('ktp')
        ? IDV_FLOW
        : name.includes('compliance')
          ? COMPLIANCE_FLOW
          : DEFAULT_DOKUMEN_FLOW

  return {
    ...base,
    nodes: (base.nodes || []).map((n) => ({
      ...n,
      icon: n.icon || DOKUMEN_ICON_BY_LABEL[n.label] || n.icon,
    })),
  }
}

const DOKUMEN_ICON_BY_LABEL = {
  'Trigger PO': 'webhook',
  'Ekstrak Data PO': 'file-search',
  'Cek Stok?': 'git-branch',
  'Buat Sales Order': 'database',
  'Notif Purchasing': 'bell-ring',
  'Buat Surat Jalan': 'truck',
  'Buat Faktur': 'file-text',
  'Payment Link': 'credit-card',
  'Kirim Invoice': 'send',
  'Webhook Listener': 'radio',
  'Pembayaran Diterima?': 'git-branch',
  'Update Paid': 'check-circle',
  'Cek Due Date': 'calendar-clock',
  'Kirim Reminder': 'alarm-clock',
  'Update DB & Konfirmasi': 'check-check',
}

const DEFAULT_DOKUMEN_FLOW = {
  nodes: [
    { id: 'A', px: 18, py: 16, label: 'Trigger PO', type: 'trigger', icon: 'webhook' },
    { id: 'B', px: 38, py: 16, label: 'Ekstrak Data PO', type: 'process', icon: 'file-search' },
    { id: 'C', px: 58, py: 16, label: 'Cek Stok?', type: 'cond', icon: 'git-branch' },
    { id: 'D', px: 58, py: 32, label: 'Buat Sales Order', type: 'process', icon: 'database' },
    { id: 'E', px: 32, py: 46, label: 'Notif Purchasing', type: 'notif', icon: 'bell-ring' },
    { id: 'F', px: 78, py: 46, label: 'Buat Faktur', type: 'process', icon: 'file-text' },
    { id: 'G', px: 78, py: 60, label: 'Payment Link', type: 'process', icon: 'credit-card' },
    { id: 'H', px: 78, py: 74, label: 'Kirim Invoice', type: 'notif', icon: 'send' },
    { id: 'I', px: 50, py: 88, label: 'Webhook Listener', type: 'process', icon: 'radio' },
  ],
  mobileGrid: {
    A: { c: 0, r: 0 },
    B: { c: 1, r: 0 },
    C: { c: 2, r: 0 },
    D: { c: 2, r: 1 },
    E: { c: 0, r: 2 },
    F: { c: 2, r: 2 },
    G: { c: 2, r: 3 },
    H: { c: 2, r: 4 },
    I: { c: 1, r: 5 },
  },
  edges: [
    { from: 'A', to: 'B', fp: 'right', tp: 'left' },
    { from: 'B', to: 'C', fp: 'right', tp: 'left' },
    { from: 'C', to: 'D', fp: 'bottomRight', tp: 'top', lbl: 'Stok' },
    { from: 'C', to: 'E', fp: 'bottomLeft', tp: 'top', lbl: 'Kurang' },
    { from: 'D', to: 'F', fp: 'bottomRight', tp: 'top' },
    { from: 'F', to: 'G', fp: 'bottom', tp: 'top' },
    { from: 'G', to: 'H', fp: 'bottom', tp: 'top' },
    { from: 'H', to: 'I', fp: 'bottom', tp: 'top' },
  ],
  seq: [
    { from: 'A', to: 'B', log: 'PO diterima' },
    { from: 'B', to: 'C', log: 'Ekstrak data PO' },
    { from: 'C', to: 'D', log: 'Stok cukup — buat sales order', br: 'Stok', skip: 'E' },
    { from: 'D', to: 'F', log: 'Generate faktur' },
    { from: 'F', to: 'G', log: 'Generate payment link' },
    { from: 'G', to: 'H', log: 'Kirim invoice ke customer' },
    { from: 'H', to: 'I', log: 'Listener tunggu pembayaran' },
    { from: 'C', to: 'E', log: 'Stok kurang — notif purchasing', br: 'Kurang', skip: 'D' },
  ],
}

const INVOICE_FLOW = {
  nodes: [
    { id: 'A', px: 18, py: 18, label: 'Upload Invoice (PDF)', type: 'trigger', icon: 'file-text' },
    { id: 'B', px: 36, py: 18, label: 'OCR Ekstrak Field', type: 'process', icon: 'file-search' },
    { id: 'C', px: 56, py: 18, label: 'Validasi Data', type: 'process', icon: 'git-branch' },
    { id: 'D', px: 56, py: 34, label: 'Valid?', type: 'cond', icon: 'git-branch' },
    { id: 'E', px: 80, py: 34, label: 'Simpan ke DB', type: 'ok', icon: 'database' },
    { id: 'F', px: 80, py: 48, label: 'Email ke Finance', type: 'notif', icon: 'send' },
    { id: 'G', px: 32, py: 48, label: 'Minta Revisi', type: 'notif', icon: 'bell-ring' },
  ],
  mobileGrid: {
    A: { c: 0, r: 0 },
    B: { c: 1, r: 0 },
    C: { c: 2, r: 0 },
    D: { c: 2, r: 1 },
    E: { c: 2, r: 2 },
    F: { c: 2, r: 3 },
    G: { c: 0, r: 2 },
  },
  edges: [
    { from: 'A', to: 'B', fp: 'right', tp: 'left' },
    { from: 'B', to: 'C', fp: 'right', tp: 'left' },
    { from: 'C', to: 'D', fp: 'bottom', tp: 'top' },
    { from: 'D', to: 'E', fp: 'bottomRight', tp: 'top', lbl: 'Valid' },
    { from: 'D', to: 'G', fp: 'bottomLeft', tp: 'top', lbl: 'Tidak' },
    { from: 'G', to: 'C', fp: 'top', tp: 'left', lbl: 'Revisi' },
    { from: 'E', to: 'F', fp: 'bottom', tp: 'top' },
  ],
  seq: [
    { from: 'A', to: 'B', log: 'Invoice masuk (PDF)' },
    { from: 'B', to: 'C', log: 'OCR ekstrak field invoice' },
    { from: 'C', to: 'D', log: 'Validasi AI untuk invoice' },
    { from: 'D', to: 'E', log: 'Valid — simpan ke DB', br: 'Valid', skip: 'G' },
    { from: 'E', to: 'F', log: 'Kirim email ke finance' },
    { from: 'D', to: 'G', log: 'Tidak valid — minta revisi', br: 'Tidak', skip: 'E' },
    { from: 'G', to: 'C', log: 'Revisi diterima — validasi ulang', br: 'Revisi' },
    { from: 'C', to: 'D', log: 'Validasi ulang' },
    { from: 'D', to: 'E', log: 'Valid — simpan ke DB', br: 'Valid', skip: 'G' },
    { from: 'E', to: 'F', log: 'Email terkirim' },
  ],
}

const CONTRACT_FLOW = {
  nodes: [
    { id: 'A', px: 18, py: 18, label: 'Upload Kontrak (PDF)', type: 'trigger', icon: 'file-text' },
    { id: 'B', px: 38, py: 18, label: 'Parse PDF', type: 'process', icon: 'file-search' },
    { id: 'C', px: 58, py: 18, label: 'Deteksi Klausul', type: 'process', icon: 'database' },
    { id: 'D', px: 58, py: 34, label: 'High Risk?', type: 'cond', icon: 'git-branch' },
    { id: 'E', px: 32, py: 48, label: 'Alert Legal', type: 'notif', icon: 'bell-ring' },
    { id: 'F', px: 72, py: 48, label: 'Generate Ringkasan', type: 'ok', icon: 'check-check' },
    { id: 'G', px: 72, py: 62, label: 'Simpan Arsip', type: 'ok', icon: 'check-circle' },
  ],
  mobileGrid: {
    A: { c: 0, r: 0 },
    B: { c: 1, r: 0 },
    C: { c: 2, r: 0 },
    D: { c: 2, r: 1 },
    E: { c: 0, r: 2 },
    F: { c: 2, r: 2 },
    G: { c: 2, r: 3 },
  },
  edges: [
    { from: 'A', to: 'B', fp: 'right', tp: 'left' },
    { from: 'B', to: 'C', fp: 'right', tp: 'left' },
    { from: 'C', to: 'D', fp: 'bottom', tp: 'top' },
    { from: 'D', to: 'E', fp: 'bottomLeft', tp: 'top', lbl: 'Ya' },
    { from: 'D', to: 'F', fp: 'bottomRight', tp: 'top', lbl: 'Tidak' },
    { from: 'E', to: 'F', fp: 'right', tp: 'left' },
    { from: 'F', to: 'G', fp: 'bottom', tp: 'top' },
  ],
  seq: [
    { from: 'A', to: 'B', log: 'Kontrak diterima (PDF)' },
    { from: 'B', to: 'C', log: 'Parse dokumen & normalisasi teks' },
    { from: 'C', to: 'D', log: 'Deteksi klausul berisiko' },
    { from: 'D', to: 'E', log: 'Risiko tinggi — alert legal', br: 'Ya', skip: 'F' },
    { from: 'E', to: 'F', log: 'Legal review, lanjut ringkasan' },
    { from: 'F', to: 'G', log: 'Simpan arsip & laporan' },
  ],
}

const IDV_FLOW = {
  nodes: [
    { id: 'A', px: 18, py: 18, label: 'Upload KTP', type: 'trigger', icon: 'file-text' },
    { id: 'B', px: 38, py: 18, label: 'OCR KTP', type: 'process', icon: 'file-search' },
    { id: 'C', px: 58, py: 18, label: 'Face Match', type: 'process', icon: 'git-branch' },
    { id: 'D', px: 78, py: 18, label: 'Liveness', type: 'process', icon: 'calendar-clock' },
    { id: 'E', px: 58, py: 34, label: 'Lulus?', type: 'cond', icon: 'git-branch' },
    { id: 'F', px: 78, py: 48, label: 'Verifikasi', type: 'ok', icon: 'check-circle' },
    { id: 'G', px: 32, py: 48, label: 'Manual Review', type: 'notif', icon: 'bell-ring' },
  ],
  mobileGrid: {
    A: { c: 0, r: 0 },
    B: { c: 1, r: 0 },
    C: { c: 2, r: 0 },
    D: { c: 2, r: 1 },
    E: { c: 2, r: 2 },
    F: { c: 2, r: 3 },
    G: { c: 0, r: 3 },
  },
  edges: [
    { from: 'A', to: 'B', fp: 'right', tp: 'left' },
    { from: 'B', to: 'C', fp: 'right', tp: 'left' },
    { from: 'C', to: 'D', fp: 'right', tp: 'left' },
    { from: 'D', to: 'E', fp: 'bottom', tp: 'top' },
    { from: 'E', to: 'F', fp: 'bottomRight', tp: 'top', lbl: 'Ya' },
    { from: 'E', to: 'G', fp: 'bottomLeft', tp: 'top', lbl: 'Tidak' },
  ],
  seq: [
    { from: 'A', to: 'B', log: 'KTP diupload' },
    { from: 'B', to: 'C', log: 'OCR ekstrak data identitas' },
    { from: 'C', to: 'D', log: 'Face match dengan selfie' },
    { from: 'D', to: 'E', log: 'Liveness check' },
    { from: 'E', to: 'F', log: 'Lulus — verifikasi berhasil', br: 'Ya', skip: 'G' },
    { from: 'E', to: 'G', log: 'Tidak lulus — eskalasi manual', br: 'Tidak', skip: 'F' },
  ],
}

const COMPLIANCE_FLOW = {
  nodes: [
    { id: 'A', px: 18, py: 18, label: 'Upload Dokumen', type: 'trigger', icon: 'file-text' },
    { id: 'B', px: 38, py: 18, label: 'Ekstrak Teks', type: 'process', icon: 'file-search' },
    { id: 'C', px: 58, py: 18, label: 'Rule Engine', type: 'process', icon: 'database' },
    { id: 'D', px: 58, py: 34, label: 'Ada Pelanggaran?', type: 'cond', icon: 'git-branch' },
    { id: 'E', px: 32, py: 48, label: 'Kirim Report', type: 'notif', icon: 'send' },
    { id: 'F', px: 78, py: 48, label: 'Approve', type: 'ok', icon: 'check-circle' },
  ],
  mobileGrid: {
    A: { c: 0, r: 0 },
    B: { c: 1, r: 0 },
    C: { c: 2, r: 0 },
    D: { c: 2, r: 1 },
    E: { c: 0, r: 2 },
    F: { c: 2, r: 2 },
  },
  edges: [
    { from: 'A', to: 'B', fp: 'right', tp: 'left' },
    { from: 'B', to: 'C', fp: 'right', tp: 'left' },
    { from: 'C', to: 'D', fp: 'bottom', tp: 'top' },
    { from: 'D', to: 'E', fp: 'bottomLeft', tp: 'top', lbl: 'Ya' },
    { from: 'D', to: 'F', fp: 'bottomRight', tp: 'top', lbl: 'Tidak' },
    { from: 'E', to: 'F', fp: 'right', tp: 'left' },
  ],
  seq: [
    { from: 'A', to: 'B', log: 'Dokumen masuk' },
    { from: 'B', to: 'C', log: 'Ekstraksi teks & normalisasi' },
    { from: 'C', to: 'D', log: 'Cek compliance rules' },
    { from: 'D', to: 'E', log: 'Ada pelanggaran — kirim report', br: 'Ya', skip: 'F' },
    { from: 'E', to: 'F', log: 'Tindak lanjut, approve/hold' },
  ],
}
