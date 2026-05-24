/* ═══════════════════════════════════════════════════════════════
   SOUMISSIONS TOITURE PRO — Application Logic
═══════════════════════════════════════════════════════════════ */

'use strict';

/* ─── Constants ──────────────────────────────────────────────── */
const TPS_RATE = 0.05;
const TVQ_RATE = 0.09975;

const MANUFACTURER_WARRANTIES = {
  IKO: '25 ans limité (IKO Dynasty / Cambridge)',
  CertainTeed: '50 ans limité SureStart PLUS™',
  BP: '40 ans limité BP Mystique 42',
  'Owens Corning': '50 ans limité TruDefinition®',
  GAF: '50 ans limité Timberline HD®',
  Soprema: '20 ans membrane SOPRALENE',
};

const WORK_TYPES = {
  remplacement: 'Remplacement complet de toiture',
  reparation: 'Réparation partielle de toiture',
  plate: 'Toiture plate (membrane)',
  bardeau: 'Bardeau asphalte',
};

const DEFAULT_MATERIALS = {
  remplacement: [
    { desc: 'Bardeaux asphalte architectural 30 ans', qty: 25, unit: 'sq', price: 120 },
    { desc: 'Membrane sous-couche synthétique', qty: 25, unit: 'sq', price: 18 },
    { desc: 'Membrane auto-adhésive (rives & noues)', qty: 4, unit: 'sq', price: 85 },
    { desc: 'Ventilation de faîte (ridge vent)', qty: 30, unit: 'pi', price: 8 },
    { desc: 'Solin aluminium (cheminée, murs, évent)', qty: 1, unit: 'for', price: 320 },
    { desc: 'Clous à toiture galvanisés', qty: 6, unit: 'bte', price: 35 },
    { desc: 'Contreplaqué 5/8 OSB (si requis)', qty: 0, unit: 'feuille', price: 48 },
  ],
  reparation: [
    { desc: 'Bardeaux asphalte assortis (remplacement)', qty: 2, unit: 'bte', price: 65 },
    { desc: 'Membrane auto-adhésive Ice & Water', qty: 1, unit: 'sq', price: 85 },
    { desc: 'Solin de réparation aluminium', qty: 1, unit: 'for', price: 150 },
    { desc: 'Calfeutrant polyuréthane extérieur', qty: 2, unit: 'tube', price: 18 },
    { desc: 'Clous à toiture galvanisés', qty: 1, unit: 'bte', price: 35 },
  ],
  plate: [
    { desc: 'Membrane EPDM 60 mil ou TPO 60 mil', qty: 20, unit: 'sq', price: 185 },
    { desc: 'Isolant polyiso 2 po', qty: 20, unit: 'sq', price: 95 },
    { desc: 'Membrane pare-vapeur', qty: 20, unit: 'sq', price: 22 },
    { desc: 'Drain de toit avec natte de drainage', qty: 2, unit: 'un.', price: 280 },
    { desc: 'Solins métalliques périmètre / parapet', qty: 60, unit: 'pi', price: 14 },
    { desc: 'Colle et fixations spéciales (toiture plate)', qty: 1, unit: 'for', price: 450 },
  ],
  bardeau: [
    { desc: 'Bardeaux asphalte architectural IKO Cambridge 40', qty: 25, unit: 'sq', price: 145 },
    { desc: 'Membrane sous-couche synthétique Hi-Dry 30#', qty: 25, unit: 'sq', price: 18 },
    { desc: 'Ice & Water Shield (rive de toit 2 rangées)', qty: 5, unit: 'sq', price: 85 },
    { desc: 'Bardeaux de faîte', qty: 8, unit: 'bte', price: 55 },
    { desc: 'Solin aluminium peint (cheminée, murs)', qty: 1, unit: 'for', price: 300 },
    { desc: 'Ventilation passive (turbines ou ridge vent)', qty: 3, unit: 'un.', price: 90 },
    { desc: 'Clous à toiture galvanisés 1-3/4 po', qty: 6, unit: 'bte', price: 35 },
  ],
};

const DEFAULT_LABOR = {
  remplacement: [
    { desc: 'Dépose et évacuation ancienne toiture', qty: 1, unit: 'for', price: 1400 },
    { desc: 'Installation membrane et bardeaux', qty: 25, unit: 'sq', price: 85 },
    { desc: 'Installation solin et ventilation', qty: 1, unit: 'for', price: 650 },
    { desc: 'Nettoyage et disposition des débris', qty: 1, unit: 'for', price: 250 },
  ],
  reparation: [
    { desc: 'Dépose bardeaux endommagés', qty: 1, unit: 'for', price: 250 },
    { desc: 'Réparation charpente si nécessaire', qty: 0, unit: 'h', price: 95 },
    { desc: 'Pose bardeaux de remplacement', qty: 1, unit: 'for', price: 380 },
    { desc: 'Scellement solins et calfeutrage', qty: 1, unit: 'for', price: 200 },
  ],
  plate: [
    { desc: 'Dépose membrane existante et nettoyage', qty: 1, unit: 'for', price: 1200 },
    { desc: 'Installation isolant et pare-vapeur', qty: 20, unit: 'sq', price: 45 },
    { desc: 'Installation membrane (soudage/colle)', qty: 20, unit: 'sq', price: 110 },
    { desc: 'Installation solins périmètre', qty: 1, unit: 'for', price: 750 },
    { desc: 'Test d\'étanchéité et finition', qty: 1, unit: 'for', price: 350 },
  ],
  bardeau: [
    { desc: 'Dépose bardeaux et nettoyage', qty: 1, unit: 'for', price: 1200 },
    { desc: 'Inspection et réparation de la charpente', qty: 1, unit: 'for', price: 400 },
    { desc: 'Installation membranes et bardeaux', qty: 25, unit: 'sq', price: 90 },
    { desc: 'Installation faîte, solins, ventilation', qty: 1, unit: 'for', price: 700 },
    { desc: 'Nettoyage final du chantier', qty: 1, unit: 'for', price: 250 },
  ],
};

const DEFAULT_EXCLUSIONS = {
  remplacement: [
    'Réparation ou remplacement de la charpente (si requis)',
    'Traitement de la moisissure ou des champignons',
    'Travaux de peinture ou de finition intérieure',
    'Isolation supplémentaire non prévue',
    'Réparation des gouttières et descentes pluviales',
    'Permis de construction (à la charge du client)',
    'Travaux de maçonnerie ou de cheminée',
    'Déblaiement des accès obstrués',
    'Bacs à fleurs, climatiseurs ou antennes sur le toit',
  ],
  reparation: [
    'Remplacement complet de la toiture',
    'Travaux de charpente non identifiés',
    'Remplacement des gouttières',
    'Permis de construction',
    'Traitement de la moisissure',
    'Isolation supplémentaire',
  ],
  plate: [
    'Réparation de la structure portante',
    'Travaux de drainage intérieur',
    'Imperméabilisation des fondations',
    'Isolation thermique supplémentaire non prévue',
    'Permis de construction',
    'Traitement de la moisissure',
    'Installation de puits de lumière',
    'Accès difficile non identifié lors de la visite',
  ],
  bardeau: [
    'Réparation de la charpente au-delà du diagnostic',
    'Remplacement des gouttières et descentes',
    'Travaux de maçonnerie (cheminée)',
    'Traitement de la moisissure',
    'Isolation supplémentaire',
    'Permis de construction',
    'Dépose de panneaux solaires',
    'Calfeutrage de fenêtres de toit (Velux)',
  ],
};

/* ─── State ──────────────────────────────────────────────────── */
let state = {
  quoteNumber: null,
  workType: 'remplacement',
  materials: [],
  labor: [],
  exclusions: [],
  customExclusions: [],
};
let saveTimer = null;
let dirtyFlag = false;

/* ─── DOM refs ───────────────────────────────────────────────── */
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

/* ═══════════════════════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  loadCompanyFromStorage();
  initQuoteNumber();
  setWorkType('remplacement', false);
  loadQuoteFromStorage();
  bindEvents();
  setStatus('saved');
  setupAutoSave();
});

/* ─── Quote Number ───────────────────────────────────────────── */
function initQuoteNumber() {
  const year = new Date().getFullYear();
  const stored = localStorage.getItem('rtp_lastQuoteNumber');
  if (!stored) {
    state.quoteNumber = `${year}-001`;
  } else {
    const [y, seq] = stored.split('-');
    if (parseInt(y) < year) {
      state.quoteNumber = `${year}-001`;
    } else {
      state.quoteNumber = stored;
    }
  }
  $('quoteNumberBadge').textContent = `N° ${state.quoteNumber}`;
}

function incrementQuoteNumber() {
  const [year, seq] = state.quoteNumber.split('-');
  const next = String(parseInt(seq) + 1).padStart(3, '0');
  state.quoteNumber = `${year}-${next}`;
  localStorage.setItem('rtp_lastQuoteNumber', state.quoteNumber);
  $('quoteNumberBadge').textContent = `N° ${state.quoteNumber}`;
}

/* ─── Company ────────────────────────────────────────────────── */
function loadCompanyFromStorage() {
  const data = localStorage.getItem('rtp_company');
  if (!data) return;
  try {
    const co = JSON.parse(data);
    $('companyName').value  = co.name  || '';
    $('companyPhone').value = co.phone || '';
    $('companyEmail').value = co.email || '';
    $('companyRBQ').value   = co.rbq   || '';
  } catch(e) {}
}

function saveCompanyToStorage() {
  const co = {
    name:  $('companyName').value,
    phone: $('companyPhone').value,
    email: $('companyEmail').value,
    rbq:   $('companyRBQ').value,
  };
  localStorage.setItem('rtp_company', JSON.stringify(co));
  $('companySavedBadge').style.opacity = '1';
  setTimeout(() => { $('companySavedBadge').style.opacity = '.5'; }, 1000);
}

/* ─── Work Type ──────────────────────────────────────────────── */
function setWorkType(type, reload = true) {
  state.workType = type;
  $$('#workTypeTabs .tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.type === type);
  });
  if (reload) {
    state.materials = DEFAULT_MATERIALS[type].map(m => ({ ...m, id: uid() }));
    state.labor = DEFAULT_LABOR[type].map(l => ({ ...l, id: uid() }));
    state.exclusions = DEFAULT_EXCLUSIONS[type].map(e => ({ text: e, checked: true, custom: false, id: uid() }));
    state.customExclusions = [];
    renderMaterials();
    renderLabor();
    renderExclusions();
    calcTotals();
  }
}

/* ─── Rows rendering ─────────────────────────────────────────── */
function renderMaterials() {
  const tbody = $('materialsTbody');
  tbody.innerHTML = '';
  state.materials.forEach(row => tbody.appendChild(createRow(row, 'mat')));
  updateSubtotals();
}

function renderLabor() {
  const tbody = $('laborTbody');
  tbody.innerHTML = '';
  state.labor.forEach(row => tbody.appendChild(createRow(row, 'lab')));
  updateSubtotals();
}

function createRow(row, prefix) {
  const tr = document.createElement('tr');
  const units = ['pi²','sq','bte','for','h','pi','m','un.','feuille','tube','rouleau','sac'];
  tr.innerHTML = `
    <td><input type="text" value="${esc(row.desc)}" data-field="desc" data-id="${row.id}" data-prefix="${prefix}" class="item-input"/></td>
    <td><input type="number" value="${row.qty}" min="0" step="any" data-field="qty" data-id="${row.id}" data-prefix="${prefix}" class="item-input"/></td>
    <td>
      <select data-field="unit" data-id="${row.id}" data-prefix="${prefix}" class="item-input">
        ${units.map(u => `<option ${u===row.unit?'selected':''}>${u}</option>`).join('')}
      </select>
    </td>
    <td><input type="number" value="${row.price}" min="0" step="0.01" data-field="price" data-id="${row.id}" data-prefix="${prefix}" class="item-input"/></td>
    <td class="col-total" id="total-${row.id}">${formatCAD(row.qty * row.price)}</td>
    <td><button class="btn-icon-del" data-del="${row.id}" data-prefix="${prefix}" title="Supprimer">×</button></td>
  `;
  return tr;
}

function esc(str) {
  return String(str||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
}

/* ─── Item input events ──────────────────────────────────────── */
document.addEventListener('input', e => {
  const el = e.target;
  if (!el.classList.contains('item-input')) return;
  const { field, id, prefix } = el.dataset;
  const arr = prefix === 'mat' ? state.materials : state.labor;
  const row = arr.find(r => r.id === id);
  if (!row) return;
  if (field === 'qty' || field === 'price') {
    row[field] = parseFloat(el.value) || 0;
  } else {
    row[field] = el.value;
  }
  const total = (row.qty || 0) * (row.price || 0);
  const cell = document.getElementById('total-' + id);
  if (cell) cell.textContent = formatCAD(total);
  updateSubtotals();
  markDirty();
});

document.addEventListener('click', e => {
  const btn = e.target.closest('[data-del]');
  if (!btn) return;
  const { del: id, prefix } = btn.dataset;
  if (prefix === 'mat') {
    state.materials = state.materials.filter(r => r.id !== id);
    renderMaterials();
  } else {
    state.labor = state.labor.filter(r => r.id !== id);
    renderLabor();
  }
  markDirty();
});

function addMaterialRow() {
  state.materials.push({ id: uid(), desc: '', qty: 1, unit: 'un.', price: 0 });
  renderMaterials();
  markDirty();
}

function addLaborRow() {
  state.labor.push({ id: uid(), desc: '', qty: 1, unit: 'for', price: 0 });
  renderLabor();
  markDirty();
}

/* ─── Exclusions ─────────────────────────────────────────────── */
function renderExclusions() {
  const grid = $('exclusionsGrid');
  grid.innerHTML = '';
  const all = [
    ...state.exclusions,
    ...state.customExclusions,
  ];
  all.forEach(excl => {
    const div = document.createElement('div');
    div.className = `exclusion-item${excl.checked ? ' checked' : ''}`;
    div.dataset.id = excl.id;
    div.innerHTML = `
      <div class="excl-checkbox">${excl.checked ? '✓' : ''}</div>
      <span class="excl-label">${esc(excl.text)}</span>
      ${excl.custom ? `<button class="btn-icon-del" data-excl-del="${excl.id}" title="Supprimer" style="margin-left:auto">×</button>` : ''}
    `;
    div.addEventListener('click', ev => {
      if (ev.target.closest('[data-excl-del]')) return;
      excl.checked = !excl.checked;
      renderExclusions();
      markDirty();
    });
    const delBtn = div.querySelector('[data-excl-del]');
    if (delBtn) {
      delBtn.addEventListener('click', ev => {
        ev.stopPropagation();
        state.customExclusions = state.customExclusions.filter(ex => ex.id !== excl.id);
        renderExclusions();
        markDirty();
      });
    }
    grid.appendChild(div);
  });
}

function addCustomExclusion() {
  const input = $('customExclusionInput');
  const text = input.value.trim();
  if (!text) return;
  state.customExclusions.push({ id: uid(), text, checked: true, custom: true });
  input.value = '';
  renderExclusions();
  markDirty();
}

/* ─── Totals ─────────────────────────────────────────────────── */
function updateSubtotals() {
  const matSub = state.materials.reduce((sum, r) => sum + (r.qty||0)*(r.price||0), 0);
  const labSub = state.labor.reduce((sum, r) => sum + (r.qty||0)*(r.price||0), 0);
  $('materialsSubtotal').textContent = formatCAD(matSub);
  $('laborSubtotal').textContent = formatCAD(labSub);
  calcTotals();
}

function calcTotals() {
  const matSub = state.materials.reduce((sum, r) => sum + (r.qty||0)*(r.price||0), 0);
  const labSub = state.labor.reduce((sum, r) => sum + (r.qty||0)*(r.price||0), 0);
  const beforeTax = matSub + labSub;

  $('totalMaterials').textContent = formatCAD(matSub);
  $('totalLabor').textContent = formatCAD(labSub);
  $('subtotalBeforeTax').textContent = formatCAD(beforeTax);

  // Discount
  const dtype = $('discountType').value;
  let discountAmt = 0;
  if (dtype !== 'none') {
    const val = parseFloat($('discountValue').value) || 0;
    if (dtype === 'percent') discountAmt = beforeTax * (val / 100);
    else discountAmt = val;
    discountAmt = Math.min(discountAmt, beforeTax);
  }

  const discountRow = $('discountRow');
  const afterDiscountRow = $('afterDiscountRow');
  if (discountAmt > 0) {
    const reason = $('discountReason').value;
    $('discountLabel').textContent = dtype === 'percent'
      ? `Escompte ${parseFloat($('discountValue').value)||0}%${reason ? ' — '+reason : ''}`
      : `Escompte${reason ? ' — '+reason : ''}`;
    $('discountAmount').textContent = `-${formatCAD(discountAmt)}`;
    discountRow.style.display = '';
    afterDiscountRow.style.display = '';
  } else {
    discountRow.style.display = 'none';
    afterDiscountRow.style.display = 'none';
  }

  const taxable = beforeTax - discountAmt;
  $('subtotalAfterDiscount').textContent = formatCAD(taxable);

  const tps = taxable * TPS_RATE;
  const tvq = taxable * TVQ_RATE;
  const grand = taxable + tps + tvq;

  $('tps').textContent = formatCAD(tps);
  $('tvq').textContent = formatCAD(tvq);
  $('grandTotal').textContent = formatCAD(grand);
}

/* ─── Manufacturer warranty ──────────────────────────────────── */
function updateManufacturerWarranty() {
  const m = $('manufacturer').value;
  $('manufacturerWarranty').value = m ? MANUFACTURER_WARRANTIES[m] || '' : '';
}

/* ─── Events binding ─────────────────────────────────────────── */
function bindEvents() {
  // Company fields
  ['companyName','companyPhone','companyEmail','companyRBQ'].forEach(id => {
    $(id).addEventListener('input', () => { saveCompanyToStorage(); markDirty(); });
  });

  // Work type tabs
  $$('#workTypeTabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => setWorkType(btn.dataset.type));
  });

  // Add rows
  $('btnAddMaterial').addEventListener('click', addMaterialRow);
  $('btnAddLabor').addEventListener('click', addLaborRow);

  // Discount
  $('discountType').addEventListener('change', () => {
    const v = $('discountType').value;
    $('discountValueField').style.display = v === 'none' ? 'none' : '';
    $('discountReasonField').style.display = v === 'none' ? 'none' : '';
    if (v === 'percent') $('discountValueLabel').textContent = 'Pourcentage (%)';
    else $('discountValueLabel').textContent = 'Montant ($)';
    calcTotals(); markDirty();
  });
  $('discountValue').addEventListener('input', () => { calcTotals(); markDirty(); });
  $('discountReason').addEventListener('input', () => { calcTotals(); markDirty(); });

  // Manufacturer
  $('manufacturer').addEventListener('change', () => { updateManufacturerWarranty(); markDirty(); });

  // Other fields
  ['superficie','startDate','duration','clientName','clientPhone','clientEmail','clientAddress',
   'laborWarranty','paymentMode','quoteValidity','notes'].forEach(id => {
    $(id).addEventListener('input', () => markDirty());
  });

  // Exclusions add
  $('btnAddExclusion').addEventListener('click', addCustomExclusion);
  $('customExclusionInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); addCustomExclusion(); }
  });

  // New quote
  $('btnNewQuote').addEventListener('click', () => {
    showModal(
      'Nouvelle soumission',
      'Créer une nouvelle soumission ? Les informations du formulaire actuel seront effacées (mais les infos de votre entreprise seront conservées).',
      () => {
        incrementQuoteNumber();
        resetQuote();
        setWorkType('remplacement', true);
        setStatus('saved');
      }
    );
  });

  // Clear all
  $('btnClearAll').addEventListener('click', () => {
    showModal(
      'Effacer tout',
      'Effacer toutes les données, y compris les informations de l\'entreprise et réinitialiser le compteur de soumissions ?',
      () => {
        localStorage.clear();
        location.reload();
      }
    );
  });

  // PDF
  $('btnDownloadPDF').addEventListener('click', generatePDF);

  // Modal
  $('modalCancel').addEventListener('click', () => closeModal());
  $('modalOverlay').addEventListener('click', e => {
    if (e.target === $('modalOverlay')) closeModal();
  });
}

/* ─── Auto-save ──────────────────────────────────────────────── */
function setupAutoSave() {
  const fields = document.querySelectorAll('input, select, textarea');
  fields.forEach(f => {
    f.addEventListener('input', () => markDirty());
    f.addEventListener('change', () => markDirty());
  });
}

function markDirty() {
  dirtyFlag = true;
  setStatus('unsaved');
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    saveQuoteToStorage();
    setStatus('saved');
    dirtyFlag = false;
  }, 1500);
}

function setStatus(s) {
  const el = $('statusIndicator');
  el.className = 'status-indicator ' + s;
  $('statusText').textContent = s === 'saved' ? 'Sauvegardé automatiquement' : 'Modifications non sauvegardées…';
}

/* ─── Storage ────────────────────────────────────────────────── */
function saveQuoteToStorage() {
  const snapshot = {
    quoteNumber: state.quoteNumber,
    workType: state.workType,
    materials: state.materials,
    labor: state.labor,
    exclusions: state.exclusions,
    customExclusions: state.customExclusions,
    fields: {
      clientName: $('clientName').value,
      clientPhone: $('clientPhone').value,
      clientEmail: $('clientEmail').value,
      clientAddress: $('clientAddress').value,
      superficie: $('superficie').value,
      startDate: $('startDate').value,
      duration: $('duration').value,
      discountType: $('discountType').value,
      discountValue: $('discountValue').value,
      discountReason: $('discountReason').value,
      laborWarranty: $('laborWarranty').value,
      manufacturer: $('manufacturer').value,
      manufacturerWarranty: $('manufacturerWarranty').value,
      paymentMode: $('paymentMode').value,
      quoteValidity: $('quoteValidity').value,
      notes: $('notes').value,
    }
  };
  localStorage.setItem('rtp_quote', JSON.stringify(snapshot));
}

function loadQuoteFromStorage() {
  const raw = localStorage.getItem('rtp_quote');
  if (!raw) {
    // Fresh start — load defaults
    state.materials = DEFAULT_MATERIALS.remplacement.map(m => ({ ...m, id: uid() }));
    state.labor = DEFAULT_LABOR.remplacement.map(l => ({ ...l, id: uid() }));
    state.exclusions = DEFAULT_EXCLUSIONS.remplacement.map(e => ({ text: e, checked: true, custom: false, id: uid() }));
    renderMaterials();
    renderLabor();
    renderExclusions();
    return;
  }
  try {
    const snap = JSON.parse(raw);
    if (snap.quoteNumber) {
      state.quoteNumber = snap.quoteNumber;
      $('quoteNumberBadge').textContent = `N° ${snap.quoteNumber}`;
      localStorage.setItem('rtp_lastQuoteNumber', snap.quoteNumber);
    }
    state.workType = snap.workType || 'remplacement';
    state.materials = snap.materials || [];
    state.labor = snap.labor || [];
    state.exclusions = snap.exclusions || [];
    state.customExclusions = snap.customExclusions || [];

    $$('#workTypeTabs .tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.type === state.workType);
    });

    const f = snap.fields || {};
    $('clientName').value    = f.clientName || '';
    $('clientPhone').value   = f.clientPhone || '';
    $('clientEmail').value   = f.clientEmail || '';
    $('clientAddress').value = f.clientAddress || '';
    $('superficie').value    = f.superficie || '';
    $('startDate').value     = f.startDate || '';
    $('duration').value      = f.duration || '';
    $('discountType').value  = f.discountType || 'none';
    $('discountValue').value = f.discountValue || '';
    $('discountReason').value = f.discountReason || '';
    $('laborWarranty').value = f.laborWarranty || '5 ans';
    $('manufacturer').value  = f.manufacturer || '';
    $('manufacturerWarranty').value = f.manufacturerWarranty || '';
    $('paymentMode').value   = f.paymentMode || '';
    $('quoteValidity').value = f.quoteValidity || '30 jours';
    $('notes').value         = f.notes || '';

    // Restore discount visibility
    const dtype = $('discountType').value;
    $('discountValueField').style.display = dtype === 'none' ? 'none' : '';
    $('discountReasonField').style.display = dtype === 'none' ? 'none' : '';
    if (dtype === 'percent') $('discountValueLabel').textContent = 'Pourcentage (%)';
    else if (dtype === 'fixed') $('discountValueLabel').textContent = 'Montant ($)';

    renderMaterials();
    renderLabor();
    renderExclusions();
    calcTotals();
  } catch(e) {
    console.warn('Could not restore quote:', e);
  }
}

function resetQuote() {
  state.materials = [];
  state.labor = [];
  state.exclusions = [];
  state.customExclusions = [];
  ['clientName','clientPhone','clientEmail','clientAddress',
   'superficie','startDate','duration','discountValue','discountReason','notes'].forEach(id => {
    $(id).value = '';
  });
  $('discountType').value = 'none';
  $('discountValueField').style.display = 'none';
  $('discountReasonField').style.display = 'none';
  $('laborWarranty').value = '5 ans';
  $('manufacturer').value = '';
  $('manufacturerWarranty').value = '';
  $('paymentMode').value = $('paymentMode').options[0].value;
  $('quoteValidity').value = '30 jours';
  saveQuoteToStorage();
}

/* ─── Modal ──────────────────────────────────────────────────── */
let modalCallback = null;
function showModal(title, msg, onConfirm) {
  $('modalTitle').textContent = title;
  $('modalMessage').textContent = msg;
  modalCallback = onConfirm;
  $('modalOverlay').classList.add('open');
  $('modalConfirm').onclick = () => { closeModal(); if (modalCallback) modalCallback(); };
}
function closeModal() { $('modalOverlay').classList.remove('open'); }

/* ─── PDF Generation ─────────────────────────────────────────── */
function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: 'letter', putOnlyUsedFonts: true });

  const PAGE_W = 216;
  const PAGE_H = 279;
  const MARGIN = 15;
  const CONTENT_W = PAGE_W - 2 * MARGIN;
  let y = MARGIN;

  // Collect values
  const coName   = $('companyName').value || 'Votre Entreprise';
  const coPhone  = $('companyPhone').value;
  const coEmail  = $('companyEmail').value;
  const coRBQ    = $('companyRBQ').value;
  const clName   = $('clientName').value || '—';
  const clPhone  = $('clientPhone').value;
  const clEmail  = $('clientEmail').value;
  const clAddr   = $('clientAddress').value;
  const supf     = $('superficie').value;
  const startD   = $('startDate').value;
  const dur      = $('duration').value;
  const labWar   = $('laborWarranty').value;
  const mfr      = $('manufacturer').value;
  const mfrWar   = $('manufacturerWarranty').value;
  const pay      = $('paymentMode').value;
  const valid    = $('quoteValidity').value;
  const notesV   = $('notes').value;
  const today    = new Date().toLocaleDateString('fr-CA');

  // ── Header band
  doc.setFillColor(26, 61, 110);
  doc.rect(0, 0, PAGE_W, 38, 'F');

  // Logo placeholder
  doc.setDrawColor(255,255,255);
  doc.setLineWidth(.4);
  doc.roundedRect(MARGIN, 6, 26, 26, 2, 2, 'S');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(255,255,255);
  doc.text('LOGO', MARGIN + 13, 22, { align: 'center' });

  // Company name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text(coName, MARGIN + 32, 16);

  // Company details
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(180, 200, 230);
  let coLine = [coPhone, coEmail, coRBQ ? `RBQ: ${coRBQ}` : null].filter(Boolean).join('  |  ');
  doc.text(coLine, MARGIN + 32, 23);

  // Quote number
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255,255,255);
  doc.text(`N° ${state.quoteNumber}`, PAGE_W - MARGIN, 14, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(180,200,230);
  doc.text(`Date : ${today}`, PAGE_W - MARGIN, 20, { align: 'right' });
  doc.text(`Valide : ${valid}`, PAGE_W - MARGIN, 26, { align: 'right' });

  y = 44;

  // ── Work type band
  doc.setFillColor(37, 99, 235);
  doc.rect(MARGIN, y, CONTENT_W, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255,255,255);
  doc.text(`TYPE DE TRAVAUX : ${WORK_TYPES[state.workType].toUpperCase()}`, MARGIN + 4, y + 5.5);
  if (supf) doc.text(`Superficie : ${supf} pi²`, PAGE_W - MARGIN - 4, y + 5.5, { align: 'right' });
  y += 12;

  // ── Client & project info
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(26, 61, 110);
  doc.text('INFORMATIONS DU CLIENT', MARGIN, y);
  y += 4;
  doc.setDrawColor(200, 210, 225);
  doc.setLineWidth(.3);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 5;

  const clientInfo = [
    ['Client', clName],
    ...(clPhone ? [['Téléphone', clPhone]] : []),
    ...(clEmail ? [['Courriel', clEmail]] : []),
    ...(clAddr  ? [['Adresse des travaux', clAddr]] : []),
    ...(startD  ? [['Date de début', new Date(startD).toLocaleDateString('fr-CA')]] : []),
    ...(dur     ? [['Durée estimée', dur]] : []),
  ];
  doc.setFontSize(8);
  const half = Math.ceil(clientInfo.length / 2);
  clientInfo.slice(0, half).forEach((pair, i) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 110, 130);
    doc.text(pair[0] + ' :', MARGIN, y + i * 5.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 30, 30);
    doc.text(pair[1], MARGIN + 40, y + i * 5.5);
  });
  clientInfo.slice(half).forEach((pair, i) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 110, 130);
    doc.text(pair[0] + ' :', MARGIN + CONTENT_W / 2 + 5, y + i * 5.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 30, 30);
    doc.text(pair[1], MARGIN + CONTENT_W / 2 + 45, y + i * 5.5, { maxWidth: 55 });
  });
  y += Math.ceil(clientInfo.length / 2) * 5.5 + 6;

  // ── Materials table
  y = pdfTable(doc, y, MARGIN, CONTENT_W, PAGE_H,
    'MATÉRIAUX',
    state.materials,
    'Sous-total matériaux'
  );

  // ── Labor table
  y = pdfTable(doc, y, MARGIN, CONTENT_W, PAGE_H,
    'MAIN-D\'ŒUVRE',
    state.labor,
    'Sous-total main-d\'œuvre'
  );

  // ── Totals
  y += 2;
  const matSub = state.materials.reduce((s, r) => s + r.qty * r.price, 0);
  const labSub = state.labor.reduce((s, r) => s + r.qty * r.price, 0);
  const beforeTax = matSub + labSub;
  const dtype = $('discountType').value;
  let discAmt = 0;
  if (dtype !== 'none') {
    const dv = parseFloat($('discountValue').value) || 0;
    discAmt = dtype === 'percent' ? beforeTax * (dv / 100) : dv;
    discAmt = Math.min(discAmt, beforeTax);
  }
  const taxable = beforeTax - discAmt;
  const tps = taxable * TPS_RATE;
  const tvq = taxable * TVQ_RATE;
  const grand = taxable + tps + tvq;

  const totalsRows = [
    ['Sous-total matériaux', matSub, false, false],
    ['Sous-total main-d\'œuvre', labSub, false, false],
    ['Sous-total avant taxes', beforeTax, true, false],
    ...(discAmt > 0 ? [[`Escompte${$('discountReason').value ? ' — ' + $('discountReason').value : ''}`, -discAmt, false, false]] : []),
    ...(discAmt > 0 ? [['Sous-total après escompte', taxable, true, false]] : []),
    ['TPS (5 %)', tps, false, false],
    ['TVQ (9,975 %)', tvq, false, false],
    ['TOTAL TTC', grand, false, true],
  ];

  // Totals box
  if (y + totalsRows.length * 7 + 8 > PAGE_H - 20) {
    doc.addPage(); y = MARGIN;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(26, 61, 110);
  doc.text('RÉSUMÉ DES COÛTS', MARGIN, y);
  y += 4;
  doc.setLineWidth(.3);
  doc.setDrawColor(200,210,225);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 4;

  const totalsX = PAGE_W - MARGIN - 80;
  totalsRows.forEach(([label, val, bold, grand]) => {
    if (grand) {
      doc.setFillColor(26, 61, 110);
      doc.rect(totalsX - 4, y - 4, 80 + 4, 10, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
    } else if (bold) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(26, 61, 110);
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(val < 0 ? 180 : 60, val < 0 ? 40 : 60, val < 0 ? 40 : 60);
    }
    doc.text(label, totalsX, y + (grand ? 2 : 0));
    const formatted = (val < 0 ? '-' : '') + formatCAD(Math.abs(val));
    doc.text(formatted, PAGE_W - MARGIN, y + (grand ? 2 : 0), { align: 'right' });
    y += grand ? 10 : 6.5;
  });

  y += 6;

  // ── Warranty cards
  if (y + 28 > PAGE_H - 20) { doc.addPage(); y = MARGIN; }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(26, 61, 110);
  doc.text('GARANTIES', MARGIN, y);
  y += 4;
  doc.setDrawColor(200,210,225);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 5;

  const cardW = (CONTENT_W - 8) / 2;
  // Card 1 — Labour
  doc.setFillColor(239, 246, 255);
  doc.roundedRect(MARGIN, y, cardW, 22, 2, 2, 'F');
  doc.setFillColor(37, 99, 235);
  doc.roundedRect(MARGIN, y, cardW, 7, 2, 2, 'F');
  doc.rect(MARGIN, y + 4, cardW, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255,255,255);
  doc.text('🛡  GARANTIE MAIN-D\'ŒUVRE', MARGIN + 3, y + 5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(26, 61, 110);
  doc.text(labWar, MARGIN + cardW / 2, y + 16, { align: 'center' });

  // Card 2 — Fabricant
  const c2x = MARGIN + cardW + 8;
  doc.setFillColor(240, 253, 244);
  doc.roundedRect(c2x, y, cardW, 22, 2, 2, 'F');
  doc.setFillColor(22, 163, 74);
  doc.roundedRect(c2x, y, cardW, 7, 2, 2, 'F');
  doc.rect(c2x, y + 4, cardW, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255,255,255);
  doc.text(`🏭  GARANTIE FABRICANT${mfr ? ' — ' + mfr : ''}`, c2x + 3, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(22, 163, 74);
  doc.text(mfrWar || (mfr ? 'Voir documentation fabricant' : 'Non spécifié'), c2x + cardW / 2, y + 16, { align: 'center', maxWidth: cardW - 6 });
  y += 28;

  // Payment
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 110, 130);
  doc.text('MODE DE PAIEMENT :', MARGIN, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 30, 30);
  doc.text(pay, MARGIN + 46, y);
  y += 8;

  // ── Exclusions
  const checkedExcl = [
    ...state.exclusions.filter(e => e.checked),
    ...state.customExclusions.filter(e => e.checked),
  ];
  if (checkedExcl.length > 0) {
    if (y + 20 > PAGE_H - 30) { doc.addPage(); y = MARGIN; }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(26, 61, 110);
    doc.text('EXCLUSIONS (non inclus dans la soumission)', MARGIN, y);
    y += 4;
    doc.setLineWidth(.3);
    doc.setDrawColor(200,210,225);
    doc.line(MARGIN, y, PAGE_W - MARGIN, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(60, 60, 60);
    checkedExcl.forEach(e => {
      if (y > PAGE_H - 30) { doc.addPage(); y = MARGIN; }
      doc.text('•  ' + e.text, MARGIN + 2, y, { maxWidth: CONTENT_W - 4 });
      y += 5.5;
    });
    y += 4;
  }

  // ── Notes
  if (notesV) {
    if (y + 20 > PAGE_H - 30) { doc.addPage(); y = MARGIN; }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(26, 61, 110);
    doc.text('NOTES SUPPLÉMENTAIRES', MARGIN, y);
    y += 4;
    doc.setDrawColor(200,210,225);
    doc.line(MARGIN, y, PAGE_W - MARGIN, y);
    y += 5;
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(80, 80, 80);
    const splitNotes = doc.splitTextToSize(notesV, CONTENT_W - 4);
    doc.text(splitNotes, MARGIN, y);
    y += splitNotes.length * 5 + 6;
  }

  // ── Signatures
  if (y + 40 > PAGE_H - 15) { doc.addPage(); y = MARGIN; }
  y = PAGE_H - 50;
  doc.setDrawColor(180, 190, 205);
  doc.setLineWidth(.3);
  doc.line(MARGIN, y, PAGE_H - 20, y);
  doc.line(PAGE_H + 10, y, PAGE_W - MARGIN, y);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 110, 130);
  doc.text('Signature de l\'entrepreneur', MARGIN, y + 5);
  doc.text('Signature du client', PAGE_H + 10, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(coName, MARGIN, y + 10);
  doc.text(clName, PAGE_H + 10, y + 10);
  doc.text('Date : ___________________', MARGIN, y + 17);
  doc.text('Date : ___________________', PAGE_H + 10, y + 17);

  // ── Footer all pages
  const totalPages = doc.internal.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFillColor(245, 247, 250);
    doc.rect(0, PAGE_H - 10, PAGE_W, 10, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(140, 150, 165);
    doc.text(`${coName}  |  Soumission N° ${state.quoteNumber}  |  ${today}`, PAGE_W / 2, PAGE_H - 4, { align: 'center' });
    doc.text(`Page ${p} / ${totalPages}`, PAGE_W - MARGIN, PAGE_H - 4, { align: 'right' });
  }

  doc.save(`Soumission-${state.quoteNumber}-${clName.replace(/\s+/g,'-') || 'client'}.pdf`);
}

function pdfTable(doc, y, margin, contentW, pageH, title, rows, subtitleLabel) {
  if (y + 30 > pageH - 20) { doc.addPage(); y = margin; }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(26, 61, 110);
  doc.text(title, margin, y);
  y += 4;
  doc.setDrawColor(200, 210, 225);
  doc.setLineWidth(.3);
  doc.line(margin, y, margin + contentW, y);
  y += 3;

  if (rows.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(160, 170, 180);
    doc.text('Aucun élément.', margin + 4, y + 5);
    return y + 12;
  }

  const subtotal = rows.reduce((s, r) => s + (r.qty||0) * (r.price||0), 0);

  doc.autoTable({
    startY: y,
    margin: { left: margin, right: margin },
    tableWidth: contentW,
    head: [[
      { content: 'Description', styles: { halign: 'left' } },
      { content: 'Qté', styles: { halign: 'center' } },
      { content: 'Unité', styles: { halign: 'center' } },
      { content: 'Prix unit.', styles: { halign: 'right' } },
      { content: 'Total', styles: { halign: 'right' } },
    ]],
    body: rows.filter(r => r.desc || r.qty || r.price).map(r => [
      r.desc || '—',
      { content: String(r.qty || 0), styles: { halign: 'center' } },
      { content: r.unit || '', styles: { halign: 'center' } },
      { content: formatCAD(r.price || 0), styles: { halign: 'right' } },
      { content: formatCAD((r.qty||0) * (r.price||0)), styles: { halign: 'right' } },
    ]),
    foot: [[
      { content: subtitleLabel, colSpan: 4, styles: { halign: 'right', fontStyle: 'bold', textColor: [26,61,110] } },
      { content: formatCAD(subtotal), styles: { halign: 'right', fontStyle: 'bold', textColor: [26,61,110] } },
    ]],
    headStyles: {
      fillColor: [26, 61, 110],
      textColor: 255,
      fontSize: 8,
      fontStyle: 'bold',
      cellPadding: 3,
    },
    bodyStyles: { fontSize: 8, cellPadding: 2.5, textColor: [40, 40, 40] },
    alternateRowStyles: { fillColor: [247, 249, 252] },
    footStyles: { fillColor: [235, 240, 250], cellPadding: 3, fontSize: 8.5 },
    columnStyles: { 0: { cellWidth: 'auto' } },
    showFoot: 'lastPage',
  });

  return doc.lastAutoTable.finalY + 8;
}

/* ─── Helpers ────────────────────────────────────────────────── */
function formatCAD(n) {
  return new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD' }).format(n || 0);
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}
