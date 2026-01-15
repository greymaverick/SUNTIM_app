import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Plus, Trash2, Users, User, GripVertical, Save, Briefcase, 
  X, Sparkles, Menu, ChevronRight, ChevronDown, FileSpreadsheet, 
  ArrowRightLeft, LogOut, Search, Download, ArrowUpDown, Filter, Check, MoreVertical, 
  Copyright, ShieldCheck, Pencil, AlertTriangle, Info, BarChart3, PieChart, Activity, CheckCircle2, List, FileDown, Upload, FolderOpen, ArrowDownAZ, ArrowDownWideNarrow, CalendarClock, FileText, Printer, Edit3
} from 'lucide-react';

// --- Constants ---

const APP_NAME = "SUNTIM";
const APP_SUBTITLE = "Tools Penyusunan dan Analitik Susunan Tim Pemeriksa";
const DEVELOPER_NAME = "Tim DAC BPK Bali"; 
const YEAR = "2026";

const ROLES = [
  { key: 'PJ', short: 'PJ', label: 'Penanggung Jawab', color: 'bg-purple-100 text-purple-800 border-purple-200', isTech: false },
  { key: 'WPJ', short: 'WPJ', label: 'Wakil Penanggung Jawab', color: 'bg-indigo-100 text-indigo-800 border-indigo-200', isTech: false },
  { key: 'PT', short: 'PT', label: 'Pengendali Teknis', color: 'bg-blue-100 text-blue-800 border-blue-200', isTech: false },
  { key: 'KT', short: 'KT', label: 'Ketua Tim', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', isTech: true },
  { key: 'KST', short: 'KST', label: 'Ketua Sub Tim', color: 'bg-teal-100 text-teal-800 border-teal-200', isTech: true },
  { key: 'AT', short: 'AT', label: 'Anggota Tim', color: 'bg-slate-100 text-slate-800 border-slate-200', isTech: true },
  { key: 'Dukrik', short: 'DKR', label: 'Dukungan Pemeriksaan', color: 'bg-orange-100 text-orange-800 border-orange-200', isTech: true },
];

const JOB_RANK = {
  'Kepala Perwakilan': 1,
  'Kepala Bidang Pemeriksaan': 2,
  'Kepala Sekretariat Perwakilan': 3,
  'Pemeriksa Ahli Madya': 4,
  'Pemeriksa Madya': 4,
  'Kepala Subbagian': 5,
  'Pemeriksa Ahli Muda': 6,
  'Pemeriksa Muda': 6,
  'Pemeriksa Ahli Pertama': 7,
  'Pemeriksa Pertama': 7,
};

const PROJECT_STATUSES = [
  { id: 'draft', label: 'Draft Usulan Tim DAC', shortCode: 'DraftDAC', color: 'bg-red-100 text-red-700 border-red-200' },
  { id: 'review_madya', label: 'Reviu & Koreksi Pemeriksa Ahli Madya', shortCode: 'RevMadya', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { id: 'review_kabid', label: 'Reviu & Koreksi Kepala Bidang Pemeriksaan', shortCode: 'RevKabid', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { id: 'review_kalan', label: 'Reviu & Koreksi Kepala Perwakilan', shortCode: 'RevKalan', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { id: 'final', label: 'Final/Surat Tugas Terbit', shortCode: 'FINAL', color: 'bg-green-100 text-green-700 border-green-200' },
];

const INITIAL_EXAMINERS = [
  { id: 'p1', name: 'Budi Santoso', nip_bpk: '240001234', nip_18: '198001012000031001', jabatan: 'Pemeriksa Ahli Madya', edu: 'S2 Akuntansi', gender: 'L', status: true, reason: '', photo: '' },
  { id: 'p2', name: 'Siti Aminah', nip_bpk: '240005678', nip_18: '198502022005032002', jabatan: 'Pemeriksa Ahli Muda', edu: 'S1 Hukum', gender: 'P', status: true, reason: '', photo: '' },
  { id: 'p3', name: 'I Gede Putu Eka', nip_bpk: '240009101', nip_18: '199003032010031003', jabatan: 'Pemeriksa Ahli Pertama', edu: 'S1 Teknik Sipil', gender: 'L', status: true, reason: '', photo: '' },
  { id: 'p4', name: 'Anak Agung Bagus Suteja', nip_bpk: '240001121', nip_18: '199204042014031004', jabatan: 'Pemeriksa Ahli Pertama', edu: 'S1 Ekonomi', gender: 'L', status: true, reason: '', photo: '' },
  { id: 'p5', name: 'Eko Prasetyo', nip_bpk: '240003141', nip_18: '199505052018031005', jabatan: 'Pemeriksa Ahli Pertama', edu: 'S1 Informatika', gender: 'L', status: true, reason: '', photo: '' },
  { id: 'p6', name: 'Fajar Nugraha', nip_bpk: '240005161', nip_18: '198806062009031006', jabatan: 'Pemeriksa Ahli Muda', edu: 'S2 Manajemen', gender: 'L', status: false, reason: 'Cuti Melahirkan', photo: '' },
  { id: 'p7', name: 'Ni Made Ayu', nip_bpk: '240007181', nip_18: '199307072015032007', jabatan: 'Pemeriksa Ahli Pertama', edu: 'S1 Akuntansi', gender: 'P', status: true, reason: '', photo: '' },
];

const INITIAL_OBJECTS = [
  { 
    id: 'obj1', 
    name: 'LKPD Pemprov Bali', 
    slots: { PJ: 1, WPJ: 2, PT: 2, KT: 1, KST: 2, AT: 6, Dukrik: 0 } 
  },
  { 
    id: 'obj2', 
    name: 'LKPD Pemkab Badung', 
    slots: { PJ: 1, WPJ: 2, PT: 2, KT: 1, KST: 2, AT: 5, Dukrik: 0 } 
  }
];

// --- Helpers ---

const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  const selectedParts = parts.slice(0, 3);
  return selectedParts.map(p => p[0]).join('').toUpperCase();
};

const determineGenderFromNIP = (nip18) => {
  if (!nip18 || nip18.length < 15) return 'L'; 
  const code = nip18.charAt(14);
  return code === '2' ? 'P' : 'L';
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

const formatTimestampForFile = () => {
    const now = new Date();
    const Y = now.getFullYear();
    const M = String(now.getMonth()+1).padStart(2,'0');
    const D = String(now.getDate()).padStart(2,'0');
    const h = String(now.getHours()).padStart(2,'0');
    const m = String(now.getMinutes()).padStart(2,'0');
    const s = String(now.getSeconds()).padStart(2,'0');
    return `${Y}-${M}-${D}_${h}${m}${s}`;
};

// --- Sub-Components ---

const SlotSearch = ({ examiners, onSelect }) => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0); 
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const filtered = useMemo(() => 
    examiners.filter(e => e.status && e.name.toLowerCase().includes(query.toLowerCase())),
  [examiners, query]);

  useEffect(() => { setActiveIndex(0); }, [query]);
  useEffect(() => { if (open && inputRef.current) inputRef.current.focus(); }, [open]);
  useEffect(() => {
    if (open && listRef.current) {
      const activeItem = listRef.current.children[activeIndex];
      if (activeItem) activeItem.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex, open]);

  const handleKeyDown = (e) => {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev < filtered.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[activeIndex]) {
        onSelect(filtered[activeIndex].id);
        setOpen(false);
        setQuery('');
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
    }
  };

  return (
    <div className="relative flex-1">
      {!open ? (
         <button onClick={() => setOpen(true)} className="w-full h-8 border border-dashed border-slate-300 rounded flex items-center justify-center text-slate-400 hover:border-amber-400 hover:text-amber-500 hover:bg-amber-50 transition-all text-xs">
            <Plus className="w-3 h-3 mr-1" /> Isi Slot
         </button>
      ) : (
        <div className="absolute top-full left-0 w-full z-[9999] mt-1">
           <div className="bg-white border border-amber-300 rounded-lg shadow-xl overflow-hidden">
              <div className="flex items-center px-2 py-1 border-b border-slate-100 bg-white">
                <Search className="w-3 h-3 text-slate-400 mr-2" />
                <input 
                  ref={inputRef}
                  autoFocus 
                  className="w-full text-xs py-1 focus:outline-none" 
                  placeholder="Ketik nama..." 
                  value={query} 
                  onChange={e => setQuery(e.target.value)} 
                  onKeyDown={handleKeyDown}
                  onBlur={() => setTimeout(() => setOpen(false), 200)} 
                />
              </div>
              <div ref={listRef} className="max-h-40 overflow-y-auto custom-scrollbar bg-white">
                {filtered.length === 0 ? (
                  <div className="px-3 py-2 text-xs text-slate-400 italic">Tidak ada hasil.</div>
                ) : (
                  filtered.map((ex, idx) => (
                    <div 
                      key={ex.id} 
                      onMouseDown={() => { onSelect(ex.id); setOpen(false); }} 
                      className={`px-3 py-2 text-xs cursor-pointer border-b border-slate-50 last:border-0 flex justify-between items-center ${idx === activeIndex ? 'bg-amber-100 text-amber-900' : 'hover:bg-slate-50 text-slate-700'}`}
                    >
                      <div className="font-semibold">{ex.name}</div>
                      {idx === activeIndex && <div className="text-[10px] text-amber-600 italic">Enter to select</div>}
                    </div>
                  ))
                )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const Button = ({ children, onClick, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "px-3 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-sm active:scale-95 text-sm";
  const variants = {
    primary: "bg-slate-900 text-white hover:bg-slate-800",
    gold: "bg-amber-500 text-white hover:bg-amber-600 border border-amber-600 shadow-md",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200",
    ghost: "bg-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100",
    outline: "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50",
    icon_light: "text-slate-400 hover:text-white hover:bg-slate-700/50 p-1.5 rounded cursor-pointer"
  };
  return (
    <button type="button" onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Input = ({ label, ...props }) => (
  <div className="mb-2">
    {label && <label className="block text-xs font-semibold text-slate-500 mb-1">{label}</label>}
    <input 
      className="w-full bg-white border border-slate-300 text-slate-800 px-3 py-2 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 placeholder-slate-400 text-sm shadow-sm"
      {...props}
    />
  </div>
);

const SortIcon = ({ active, direction }) => {
  if (!active) return <ArrowUpDown className="w-3 h-3 text-slate-300 ml-1 inline" />;
  return <ArrowUpDown className={`w-3 h-3 ml-1 inline ${direction === 'asc' ? 'text-amber-500 rotate-0' : 'text-amber-500 rotate-180'} transition-transform`} />;
};

const FilterHeader = ({ label, fieldKey, uniqueOptions, activeFilters, onApplyFilter, onSort, sortState }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [pendingFilters, setPendingFilters] = useState([]);
  const popoverRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setPendingFilters(activeFilters || []);
      setSearchTerm('');
    }
  }, [isOpen, activeFilters]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const toggleValue = (val) => {
    setPendingFilters(prev => {
      if (prev.includes(val)) return prev.filter(item => item !== val);
      return [...prev, val];
    });
  };

  const handleApply = () => {
    onApplyFilter(pendingFilters);
    setIsOpen(false);
  };

  const handleClear = () => {
    onApplyFilter([]);
    setIsOpen(false);
  };

  const filteredOptions = uniqueOptions.filter(opt => 
    String(opt).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isActive = activeFilters && activeFilters.length > 0;

  return (
    <th className="px-4 py-3 align-top relative z-10">
      <div className="flex items-center justify-between gap-2">
        <div 
          className="flex items-center cursor-pointer hover:text-slate-900 transition-colors select-none"
          onClick={() => onSort(fieldKey)}
        >
          {label} 
          <SortIcon active={sortState.key === fieldKey} direction={sortState.dir} />
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`p-1 rounded hover:bg-slate-200 transition-colors ${isActive || isOpen ? 'text-amber-600 bg-amber-50' : 'text-slate-400'}`}
        >
          <Filter className={`w-3 h-3 ${isActive ? 'fill-current' : ''}`} />
        </button>
      </div>
      
      {isOpen && (
        <div ref={popoverRef} className="absolute top-full right-0 mt-1 w-64 bg-white border border-slate-200 rounded-lg shadow-2xl z-50 p-3 animate-in fade-in zoom-in-95 text-left font-normal">
          <div className="relative mb-2">
             <input 
              autoFocus
              type="text" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              placeholder="Cari..."
              className="w-full text-xs pl-8 pr-2 py-1.5 border border-slate-300 rounded focus:border-amber-500 focus:outline-none bg-slate-50"
            />
            <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-2" />
          </div>

          <div className="max-h-48 overflow-y-auto border border-slate-100 rounded mb-3 custom-scrollbar">
            {filteredOptions.length === 0 ? (
               <div className="p-2 text-xs text-slate-400 text-center italic">Tidak ada data</div>
            ) : (
               filteredOptions.map((opt, idx) => (
                <label key={idx} className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={pendingFilters.includes(opt)}
                    onChange={() => toggleValue(opt)}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-amber-500 focus:ring-amber-500 accent-amber-500"
                  />
                  <span className="text-xs text-slate-700 truncate">{opt}</span>
                </label>
               ))
            )}
          </div>
          
          <div className="flex justify-between items-center pt-2 border-t border-slate-100">
             <button onClick={() => setIsOpen(false)} className="text-xs px-3 py-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded">Batal</button>
             <button onClick={handleApply} className="text-xs px-3 py-1.5 bg-amber-500 text-white hover:bg-amber-600 rounded font-medium shadow-sm">Terapkan</button>
          </div>
          
          {pendingFilters.length > 0 && (
             <div className="text-center mt-1">
               <button onClick={handleClear} className="text-[10px] text-red-500 hover:underline">Hapus Filter</button>
             </div>
          )}
        </div>
      )}
    </th>
  );
};

// --- Modals ---

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 sticky top-0">
          <h3 className="font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full text-slate-500"><X className="w-5 h-5"/></button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmLabel = "Hapus", isAlert = false }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 scale-100">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-full shrink-0 ${isAlert ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
            {isAlert ? <Info className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{message}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          {!isAlert && (
            <button 
              onClick={onClose} 
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium text-sm transition-colors"
            >
              Batal
            </button>
          )}
          <button 
            onClick={() => { onConfirm(); onClose(); }} 
            className={`px-4 py-2 rounded-lg text-white font-medium text-sm shadow-sm transition-colors ${isAlert ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'}`}
          >
            {isAlert ? 'OK' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

const StatusSelectionModal = ({ isOpen, onClose, onConfirm }) => {
  const [selectedStatus, setSelectedStatus] = useState('draft');
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
         <h3 className="text-lg font-bold text-slate-900 mb-4">Pilih Status Proyek</h3>
         <div className="space-y-2 mb-6">
           {PROJECT_STATUSES.map(status => (
             <div key={status.id} onClick={() => setSelectedStatus(status.id)} className={`p-3 rounded-lg border cursor-pointer flex items-center gap-3 transition-all ${selectedStatus === status.id ? 'border-amber-500 bg-amber-50 ring-1 ring-amber-500' : 'border-slate-200 hover:bg-slate-50'}`}>
               <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedStatus === status.id ? 'border-amber-500' : 'border-slate-400'}`}>
                 {selectedStatus === status.id && <div className="w-2 h-2 rounded-full bg-amber-500"></div>}
               </div>
               <span className={`text-sm font-medium ${selectedStatus === status.id ? 'text-slate-900' : 'text-slate-600'}`}>{status.label}</span>
             </div>
           ))}
         </div>
         <div className="flex justify-end gap-3">
           <button onClick={onClose} className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium text-sm">Batal</button>
           <button onClick={() => onConfirm(selectedStatus)} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium text-sm shadow-sm">Simpan Proyek</button>
         </div>
      </div>
    </div>
  );
};

const DrillDownModal = ({ isOpen, onClose, title, data }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full text-slate-500"><X className="w-4 h-4"/></button>
        </div>
        <div className="p-0 overflow-y-auto flex-1 custom-scrollbar">
          {data.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs italic">Tidak ada data.</div>
          ) : (
            <div className="divide-y divide-slate-50">
              {data.map((person, idx) => (
                <div key={idx} className="p-3 flex items-center gap-3 hover:bg-slate-50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">
                    {getInitials(person.name)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-800 truncate">{person.name}</div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-2">
                      {person.roleLabel && <span className="bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-bold">{person.roleLabel}</span>}
                      {person.objName && <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-bold">{person.objName}</span>}
                      <span className="bg-slate-100 px-1.5 py-0.5 rounded">{person.jabatan}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="p-3 border-t border-slate-100 bg-slate-50 text-right">
          <span className="text-xs text-slate-400">Total: {data.length} Orang</span>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function TeamManager() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('team_builder'); 
  const [objects, setObjects] = useState(INITIAL_OBJECTS);
  const [examiners, setExaminers] = useState(INITIAL_EXAMINERS);
  const [assignments, setAssignments] = useState({});

  // Status & Metadata
  const [projectStatus, setProjectStatus] = useState('draft');
  const [lastSaved, setLastSaved] = useState(null);
  const [projectTitle, setProjectTitle] = useState('Proyek Pemeriksaan Baru');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState('');

  // UI State
  const [showObjectModal, setShowObjectModal] = useState(false);
  const [editingObject, setEditingObject] = useState(null);
  const [showExaminerModal, setShowExaminerModal] = useState(false);
  const [editingExaminer, setEditingExaminer] = useState(null);
  const [statusReasonModal, setStatusReasonModal] = useState({ open: false, examinerId: null });
  const [tempReason, setTempReason] = useState('');
  const [isMonitorOpen, setIsMonitorOpen] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false); // Export Dropdown
  const [isPrinting, setIsPrinting] = useState(false);

  // Refs
  const fileInputRef = useRef(null); 
  const backupInputRef = useRef(null); 
  const dragItem = useRef(null); 
  const dragRow = useRef(null); 

  const [confirmState, setConfirmState] = useState({ isOpen: false, title: '', message: '', onConfirm: () => {}, confirmLabel: 'Hapus', isAlert: false });
  const [drillDown, setDrillDown] = useState({ isOpen: false, title: '', data: [] });

  // Table State
  const [objSort, setObjSort] = useState({ key: null, dir: 'asc' });
  const [examSort, setExamSort] = useState({ key: null, dir: 'asc' });
  const [examFilter, setExamFilter] = useState({ name: [], nip_bpk: [], nip_18: [], jabatan: [], edu: [] }); 

  // Context Menu State
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, examinerId: null, sourceObjId: null, sourceKey: null });
  const [moveSubMenu, setMoveSubMenu] = useState(null); 
  const [selectedTargetObjId, setSelectedTargetObjId] = useState(null);

  // --- Persistence ---
  useEffect(() => {
    const savedObj = localStorage.getItem('bpk_suntim_objects_v16');
    const savedExam = localStorage.getItem('bpk_suntim_examiners_v16');
    const savedAssign = localStorage.getItem('bpk_suntim_assignments_v16');
    const savedMeta = localStorage.getItem('bpk_suntim_meta_v16');
    
    if (savedObj) setObjects(JSON.parse(savedObj));
    if (savedExam) setExaminers(JSON.parse(savedExam));
    if (savedAssign) setAssignments(JSON.parse(savedAssign));
    if (savedMeta) {
        const meta = JSON.parse(savedMeta);
        if(meta.title) setProjectTitle(meta.title);
        if(meta.status) setProjectStatus(meta.status);
        if(meta.lastSaved) setLastSaved(meta.lastSaved);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('bpk_suntim_objects_v16', JSON.stringify(objects));
    localStorage.setItem('bpk_suntim_examiners_v16', JSON.stringify(examiners));
    localStorage.setItem('bpk_suntim_assignments_v16', JSON.stringify(assignments));
    localStorage.setItem('bpk_suntim_meta_v16', JSON.stringify({ title: projectTitle, status: projectStatus, lastSaved }));
  }, [objects, examiners, assignments, projectTitle, projectStatus, lastSaved]);

  // Handle PDF Print Event
  useEffect(() => {
      const handleAfterPrint = () => {
          setIsPrinting(false);
          document.title = APP_NAME; // Restore original title
      };
      
      window.addEventListener('afterprint', handleAfterPrint);
      return () => window.removeEventListener('afterprint', handleAfterPrint);
  }, []);

  // UseEffect to trigger print when mode changes to true
  useEffect(() => {
      if (isPrinting) {
          // Delay slightly to ensure DOM is rendered
          setTimeout(() => {
              window.print();
              // Fallback for browsers that don't support afterprint reliably or if user cancels quickly
              // Actually, better to rely on afterprint, but a safety timeout can be added if needed.
              // For "Sat-Set", standard print dialog is blocking in Chrome/Edge, so execution pauses.
          }, 500); 
      }
  }, [isPrinting]);

  // --- Logic Implementations ---
  const getExaminerInSlot = (objId, rKey, idx) => {
    const id = assignments[objId]?.[`${rKey}_${idx}`];
    return examiners.find(e => e.id === id);
  };

  const showConfirm = (title, message, callback, label = "Hapus") => {
    setConfirmState({ isOpen: true, title, message, onConfirm: callback, confirmLabel: label, isAlert: false });
  };
  const showAlert = (title, message) => {
    setConfirmState({ isOpen: true, title, message, onConfirm: () => {}, confirmLabel: 'OK', isAlert: true });
  };
  const openDrillDown = (title, dataList) => {
    setDrillDown({ isOpen: true, title, data: dataList });
  };

  const handleDownloadTemplate = () => {
    const headers = ["NIP BPK", "NIP 18", "NAMA", "JABATAN", "LATAR PENDIDIKAN"];
    const rows = [["24000xxxx", "19xx100120xx051001", "YPS", "Pemeriksa Ahli Muda", "Akuntansi"], ["24000yyyy", "19xx020220xx032002", "Contoh Wanita", "Pemeriksa Pertama", "Hukum"]];
    const csvContent = "sep=;\n" + headers.join(";") + "\n" + rows.map(e => e.join(";")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = "Template_Daftar_Pemeriksa.csv"; document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const handleImportClick = () => fileInputRef.current.click();
  const handleFileChange = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target.result; const lines = text.split('\n'); const importedData = [];
      let startIndex = lines[0].trim().startsWith('sep=') ? 2 : 1;
      for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i].trim(); if (!line) continue;
        const cols = line.split(';'); if (cols.length >= 2) { 
           const nip18 = cols[1]?.trim() || '-';
           importedData.push({ id: `imp${Date.now()}${i}`, nip_bpk: cols[0]?.trim()||'-', nip_18: nip18, name: cols[2]?.trim()||'No Name', jabatan: cols[3]?.trim()||'-', edu: cols[4]?.trim()||'-', gender: determineGenderFromNIP(nip18), status: true, reason: '', photo: '' });
        }
      }
      if (importedData.length > 0) { setExaminers(prev => [...prev, ...importedData]); showAlert("Sukses", `Berhasil mengimpor ${importedData.length} data.`); } else showAlert("Gagal", "Format salah/kosong.");
    };
    reader.readAsText(file); e.target.value = null; 
  };

  const onBackupClick = () => setShowStatusModal(true);

  const performBackup = (statusId) => {
    const timestamp = new Date().toISOString();
    setProjectStatus(statusId); setLastSaved(timestamp);
    const data = { objects, examiners, assignments, projectTitle, version: '1.0', timestamp, status: statusId };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url;
    const now = new Date();
    const Y = now.getFullYear(); const M = String(now.getMonth()+1).padStart(2,'0'); const D = String(now.getDate()).padStart(2,'0');
    const h = String(now.getHours()).padStart(2,'0'); const m = String(now.getMinutes()).padStart(2,'0'); const s = String(now.getSeconds()).padStart(2,'0');
    const statusObj = PROJECT_STATUSES.find(st => st.id === statusId);
    const shortStatus = statusObj ? statusObj.shortCode : 'Draft';
    link.download = `SUNTIM_${shortStatus}_${Y}-${M}-${D}_${h}${m}${s}.suntim`; 
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
    setShowStatusModal(false);
  };

  const handleLoadProjectClick = () => backupInputRef.current.click();
  const handleBackupFileChange = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try { const json = JSON.parse(evt.target.result); if (json.objects) { showConfirm("Muat Proyek?", "Data lama akan ditimpa.", () => { 
          setObjects(json.objects); setExaminers(json.examiners); setAssignments(json.assignments); 
          if(json.status) setProjectStatus(json.status); 
          if(json.timestamp) setLastSaved(json.timestamp);
          if(json.projectTitle) setProjectTitle(json.projectTitle);
          showAlert("Sukses", "Proyek dimuat."); 
        }, "Timpa"); } else showAlert("Error", "File invalid."); } catch (err) { showAlert("Error", "Gagal baca file."); }
    };
    reader.readAsText(file); e.target.value = null;
  };

  const handleExportClick = (type) => {
    setIsExportMenuOpen(false); // close dropdown
    const currentStatus = PROJECT_STATUSES.find(s => s.id === projectStatus);
    const statusLabel = currentStatus ? currentStatus.shortCode : 'Draft';
    const timestamp = formatTimestampForFile();

    if (type === 'excel') {
        // HTML Table to .xls trick
        let tableHTML = `<html xmlns:x="urn:schemas-microsoft-com:office:excel">
        <head><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body>`;
        
        objects.forEach(obj => {
            tableHTML += `<h3>${obj.name}</h3><table border="1"><thead><tr style="background-color:#eee;"><th>NO</th><th>NAMA</th><th>PERAN</th><th>JABATAN</th><th>LATAR PENDIDIKAN</th></tr></thead><tbody>`;
            let no = 1;
            ROLES.forEach(role => {
                const count = obj.slots[role.key];
                for(let i=0; i<count; i++) {
                    const ex = getExaminerInSlot(obj.id, role.key, i);
                    if(ex) {
                        tableHTML += `<tr><td>${no++}</td><td>${ex.name}</td><td>${role.label}</td><td>${ex.jabatan}</td><td>${ex.edu}</td></tr>`;
                    }
                }
            });
            tableHTML += `</tbody></table><br/>`;
        });
        tableHTML += `</body></html>`;

        const blob = new Blob([tableHTML], { type: 'application/vnd.ms-excel' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `SUNTIM_${statusLabel}_${timestamp}.xls`;
        document.body.appendChild(link); link.click(); document.body.removeChild(link);
    } 
    else if (type === 'pdf') {
        document.title = `Konsep Susunan Tim Pemeriksaan ${projectTitle}`;
        setIsPrinting(true); // Triggers useEffect to print
    }
  };

  const moveExaminerRow = (from, to) => { const updated = [...examiners]; const [moved] = updated.splice(from, 1); updated.splice(to, 0, moved); setExaminers(updated); };
  const autoSortExaminers = () => { showConfirm("Urutkan Nama?", "Urutkan berdasarkan Jabatan > Angkatan > Usia.", () => { setExaminers(prev => [...prev].sort((a, b) => { const rankA = JOB_RANK[a.jabatan]||99; const rankB = JOB_RANK[b.jabatan]||99; if(rankA!==rankB) return rankA-rankB; const angA = a.nip_18?.length>=12?parseInt(a.nip_18.substring(8,12)):9999; const angB = b.nip_18?.length>=12?parseInt(b.nip_18.substring(8,12)):9999; if(angA!==angB) return angA-angB; return (a.nip_18?.length>=8?parseInt(a.nip_18.substring(0,8)):99999999)-(b.nip_18?.length>=8?parseInt(b.nip_18.substring(0,8)):99999999); })); showAlert("Sukses", "Daftar diurutkan."); }, "Urutkan"); };
  const autoSortTeams = () => { showConfirm("Urutkan Tim?", "Personil diurutkan sesuai database.", () => { setAssignments(prev => { const next={...prev}; Object.keys(next).forEach(objId=>{ const groups={}; Object.keys(next[objId]).forEach(k=>{ const r=k.split('_')[0]; if(!groups[r])groups[r]=[]; groups[r].push(next[objId][k]); }); Object.keys(groups).forEach(r=>{ groups[r].sort((a,b)=>examiners.findIndex(e=>e.id===a)-examiners.findIndex(e=>e.id===b)); groups[r].forEach((id,i)=>next[objId][`${r}_${i}`]=id); }); }); return next; }); showAlert("Sukses", "Tim diurutkan."); }, "Urutkan"); };

  // CRUD
  const saveObject = (e) => { e.preventDefault(); const fd = new FormData(e.target); const slots = {}; ROLES.forEach(r => slots[r.key] = parseInt(fd.get(`slot_${r.key}`)||0)); const newObj = { id: editingObject ? editingObject.id : `obj${Date.now()}`, name: fd.get('name'), slots }; if(editingObject) setObjects(prev=>prev.map(o=>o.id===editingObject.id?newObj:o)); else setObjects(prev=>[...prev, newObj]); setShowObjectModal(false); };
  const deleteObject = (id) => showConfirm("Hapus Obrik?", "Data ploting akan hilang.", () => { setObjects(prev=>prev.filter(o=>o.id!==id)); setAssignments(prev=>{const n={...prev};delete n[id];return n;}); });
  const deleteAllExaminers = () => showConfirm("Hapus Semua?", "Tak bisa dibatalkan.", () => setExaminers([]));
  const deleteExaminer = (id) => showConfirm("Hapus Data?", "Hapus permanen.", () => setExaminers(prev=>prev.filter(e=>e.id!==id)));
  const saveExaminer = (e) => { e.preventDefault(); const fd = new FormData(e.target); const newEx = { id: editingExaminer?editingExaminer.id:`p${Date.now()}`, name:fd.get('name'), nip_bpk:fd.get('nip_bpk'), nip_18:fd.get('nip_18'), jabatan:fd.get('jabatan'), edu:fd.get('edu'), gender:determineGenderFromNIP(fd.get('nip_18')), status:true, reason:'', photo:''}; if(editingExaminer) setExaminers(prev=>prev.map(ex=>ex.id===editingExaminer.id?{...newEx, status:editingExaminer.status, reason:editingExaminer.reason}:ex)); else setExaminers(prev=>[...prev, newEx]); setShowExaminerModal(false); };
  const toggleStatus = (id) => { const ex = examiners.find(e=>e.id===id); if(ex.status) { setStatusReasonModal({open:true, examinerId:id}); setTempReason(''); } else setExaminers(prev=>prev.map(e=>e.id===id?{...e, status:true, reason:''}:e)); };
  const confirmStatusReason = () => { setExaminers(prev=>prev.map(e=>e.id===statusReasonModal.examinerId?{...e, status:false, reason:tempReason}:e)); setStatusReasonModal({open:false, examinerId:null}); };

  // DnD Logic
  const updateAssignment = (objId, rKey, idx, exId) => { setAssignments(prev=>{ const n=JSON.parse(JSON.stringify(prev)); if(!n[objId])n[objId]={}; Object.keys(n[objId]).forEach(k=>{if(n[objId][k]===exId)delete n[objId][k]}); n[objId][`${rKey}_${idx}`]=exId; return n; }); };
  const handleDrop = (e, tObjId, tRole, tIdx) => { 
    e.preventDefault(); 
    if(!dragItem.current) return; 
    const isGap = e.currentTarget.dataset.isGap === "true";
    const {examiner, sourceObjId, sourceRole, sourceIndex} = dragItem.current;
    
    setAssignments(prev => {
        const next = JSON.parse(JSON.stringify(prev));
        if(!next[tObjId]) next[tObjId] = {};
        if(!next[sourceObjId]) next[sourceObjId] = {};
        
        delete next[sourceObjId][`${sourceRole}_${sourceIndex}`]; // Remove from source

        if (isGap) {
            // INSERT LOGIC
            const targetCapacity = objects.find(o=>o.id===tObjId).slots[tRole];
            let list = [];
            for(let i=0; i<targetCapacity; i++) list.push(next[tObjId][`${tRole}_${i}`]);
            
            // Remove nulls and insert new item
            const compacted = list.filter(id => id);
            
            // If dragging within same list, ensure we don't have dupes (already deleted above, but index might shift)
            // The simple logic: insert at tIdx. 
            compacted.splice(tIdx, 0, examiner.id);
            
            // Re-assign slots
            for(let i=0; i<targetCapacity; i++) {
                if(i < compacted.length) next[tObjId][`${tRole}_${i}`] = compacted[i];
                else delete next[tObjId][`${tRole}_${i}`];
            }
        } else {
            // SWAP LOGIC
            const targetEx = getExaminerInSlot(tObjId, tRole, tIdx);
            if(targetEx) next[sourceObjId][`${sourceRole}_${sourceIndex}`] = targetEx.id;
            next[tObjId][`${tRole}_${tIdx}`] = examiner.id;
        }
        return next;
    });
    dragItem.current=null; 
  };
  const removeAssignment = (objId, rKey, idx) => { setAssignments(prev=>{ const n={...prev}; if(n[objId]){ const no={...n[objId]}; delete no[`${rKey}_${idx}`]; n[objId]=no; } return n; }); };
  const handleContextMenu = (e, exId, objId, slotKey) => { setContextMenu({ visible: true, x: e.clientX, y: e.clientY, examinerId: exId, sourceObjId: objId, sourceKey: slotKey }); setMoveSubMenu(null); setSelectedTargetObjId(null); };
  const selectTargetObjectForMove = (id) => { setSelectedTargetObjId(id); setMoveSubMenu('move_role_select'); };
  const executeMoveFinal = (roleKey) => { /* ... move logic ... */ 
      if(!selectedTargetObjId) return;
      const tObj = objects.find(o=>o.id===selectedTargetObjId); const cap = tObj.slots[roleKey]||0; let tIdx=-1;
      for(let i=0;i<cap;i++) if(!assignments[selectedTargetObjId]?.[`${roleKey}_${i}`]) {tIdx=i; break;}
      if(tIdx!==-1) {
          setAssignments(prev=>{ 
            const n=JSON.parse(JSON.stringify(prev)); if(!n[selectedTargetObjId])n[selectedTargetObjId]={};
            const [sR, sI]=contextMenu.sourceKey.split('_'); 
            if(n[contextMenu.sourceObjId]) delete n[contextMenu.sourceObjId][`${sR}_${sI}`];
            Object.keys(n[selectedTargetObjId]).forEach(k=>{if(n[selectedTargetObjId][k]===contextMenu.examinerId) delete n[selectedTargetObjId][k]});
            n[selectedTargetObjId][`${roleKey}_${tIdx}`]=contextMenu.examinerId; 
            return n; 
          });
          setContextMenu({visible:false, x:0, y:0, examinerId:null, sourceObjId:null, sourceKey:null});
      } else showAlert("Penuh", `Slot ${roleKey} penuh.`);
  };
  const executeSwap = (tObjId, tExId) => { 
      let tSlot=null; const tAssign=assignments[tObjId]||{}; 
      Object.keys(tAssign).forEach(k=>{if(tAssign[k]===tExId)tSlot=k});
      if(tSlot) { 
          setAssignments(prev=>{ 
              const n=JSON.parse(JSON.stringify(prev)); 
              delete n[contextMenu.sourceObjId][contextMenu.sourceKey]; delete n[tObjId][tSlot];
              if(!n[contextMenu.sourceObjId])n[contextMenu.sourceObjId]={}; if(!n[tObjId])n[tObjId]={};
              n[contextMenu.sourceObjId][contextMenu.sourceKey]=tExId; n[tObjId][tSlot]=contextMenu.examinerId;
              return n; 
          });
          setContextMenu({visible:false, x:0, y:0, examinerId:null, sourceObjId:null, sourceKey:null});
      }
  };

  // --- Render Views ---

  const renderSidebar = () => (
    <div className={`fixed inset-y-0 left-0 bg-slate-900 text-slate-300 transition-all duration-300 z-50 flex flex-col ${sidebarOpen ? 'w-64' : 'w-16'} print:hidden`}>
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 shrink-0 bg-slate-900">
        {sidebarOpen && (
            <div className="flex flex-col">
                <span className="font-bold text-white tracking-wider text-lg">{APP_NAME}</span>
                <span className="text-[10px] text-slate-400 font-medium tracking-tight whitespace-nowrap overflow-hidden">{APP_SUBTITLE}</span>
            </div>
        )}
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-slate-800 rounded">
            {/* Fallback to Icon if image missing */}
            <img 
                src="icon.jpg" 
                alt="Menu" 
                className="w-6 h-6 rounded" 
                onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} 
            />
            <ShieldCheck className="w-6 h-6 hidden text-amber-500" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto py-4 space-y-2">
         <div className="px-2">
          {sidebarOpen && <div className="text-xs font-bold text-slate-500 uppercase px-2 mb-2">KONFIGURASI DATA</div>}
          <button onClick={() => setActiveMenu('examiners')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeMenu === 'examiners' ? 'bg-amber-500 text-white' : 'hover:bg-slate-800'} mt-1`}>
            <Users className="w-5 h-5 shrink-0" />{sidebarOpen && <span>Pemeriksa</span>}
          </button>
        </div>
        <div className="border-t border-slate-800 my-2 mx-4"></div>
        <div className="px-2">
           {sidebarOpen && <div className="text-xs font-bold text-slate-500 uppercase px-2 mb-2">Manajemen</div>}
           <button onClick={() => setActiveMenu('team_builder')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeMenu === 'team_builder' ? 'bg-amber-500 text-white' : 'hover:bg-slate-800'}`}>
            <Sparkles className="w-5 h-5 shrink-0" />{sidebarOpen && <span>Penyusunan Tim</span>}
          </button>
          <button onClick={() => setActiveMenu('analytics')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeMenu === 'analytics' ? 'bg-amber-500 text-white' : 'hover:bg-slate-800'} mt-1`}>
            <BarChart3 className="w-5 h-5 shrink-0" />{sidebarOpen && <span>Analitik & Monitoring</span>}
          </button>
        </div>
      </div>
      {sidebarOpen && <div className="p-4 border-t border-slate-800 text-center font-sans text-xs text-slate-400 font-light"><div>Aplikasi {APP_NAME} v1.0</div><div>&copy; {YEAR} {DEVELOPER_NAME}</div></div>}
    </div>
  );

  // --- Print View ---
  const renderPrintView = () => {
    if (!isPrinting) return null;
    const currentStatus = PROJECT_STATUSES.find(s => s.id === projectStatus);
    const now = new Date();
    const dateStr = now.toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'});
    const timeStr = now.toLocaleTimeString('id-ID', {hour: '2-digit', minute: '2-digit'});

    return (
        <div className="bg-white text-black p-8 hidden print:block absolute top-0 left-0 w-full h-full z-[9999]" id="print-area">
            <h1 className="text-xl font-bold text-center mb-8 uppercase border-b-2 border-black pb-2">{`Konsep Susunan Tim Pemeriksaan ${projectTitle}`}</h1>
            <div className="space-y-8">
                {objects.map((obj, i) => (
                    <div key={obj.id} className="break-inside-avoid">
                        <h2 className="font-bold text-lg mb-2">{i+1}. {obj.name}</h2>
                        <table className="w-full border-collapse border border-black text-sm">
                            <thead><tr className="bg-gray-100"><th className="border border-black p-2 w-10">No</th><th className="border border-black p-2">Nama</th><th className="border border-black p-2 w-40">Peran</th><th className="border border-black p-2">Jabatan</th><th className="border border-black p-2">Latar Pendidikan</th></tr></thead>
                            <tbody>
                                {(() => {
                                    let no = 1;
                                    const rows = [];
                                    ROLES.forEach(role => {
                                        const count = obj.slots[role.key];
                                        for(let k=0; k<count; k++) {
                                            const ex = getExaminerInSlot(obj.id, role.key, k);
                                            if(ex) {
                                                rows.push(<tr key={`${role.key}_${k}`}><td className="border border-black p-1 text-center">{no++}</td><td className="border border-black p-1">{ex.name}</td><td className="border border-black p-1">{role.label}</td><td className="border border-black p-1">{ex.jabatan}</td><td className="border border-black p-1">{ex.edu}</td></tr>);
                                            }
                                        }
                                    });
                                    return rows.length > 0 ? rows : <tr><td colSpan="5" className="border border-black p-2 text-center italic">Belum ada personil</td></tr>;
                                })()}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
            <div className="mt-8 pt-4 border-t border-black flex justify-between text-xs font-mono text-gray-600 fixed bottom-0 w-full pr-16 bg-white">
                <div className="w-1/3">Status Konsep Susunan Tim: <br/><span className="font-bold">{currentStatus?.label}</span><br/>{dateStr} pukul {timeStr}</div>
                <div className="w-1/3 text-center">dicetak dari Aplikasi SUNTIM<br/>&copy; {YEAR} {DEVELOPER_NAME}</div>
                <div className="w-1/3 text-right"></div>
            </div>
        </div>
    );
  };

  const renderExaminersView = () => {
    // ... Sort Logic ...
    const handleSort = (key) => setExamSort(prev => ({ key, dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc' }));
    const uniqueNames = [...new Set(examiners.map(e => e.name))].sort();
    // ... other unique options ... 
    const uniqueNipBpk = [...new Set(examiners.map(e => e.nip_bpk))].sort();
    const uniqueNip18 = [...new Set(examiners.map(e => e.nip_18))].sort();
    const uniqueJabatan = [...new Set(examiners.map(e => e.jabatan))].sort();
    const uniqueEdu = [...new Set(examiners.map(e => e.edu))].sort();

    let processedData = [...examiners];
    // ... filters ...
    if (examFilter.name.length > 0) processedData = processedData.filter(e => examFilter.name.includes(e.name));
    if (examFilter.nip_bpk.length > 0) processedData = processedData.filter(e => examFilter.nip_bpk.includes(e.nip_bpk));
    if (examFilter.nip_18.length > 0) processedData = processedData.filter(e => examFilter.nip_18.includes(e.nip_18));
    if (examFilter.jabatan.length > 0) processedData = processedData.filter(e => examFilter.jabatan.includes(e.jabatan));
    if (examFilter.edu.length > 0) processedData = processedData.filter(e => examFilter.edu.includes(e.edu));

    if (examSort.key) {
      processedData.sort((a, b) => {
        const valA = (a[examSort.key] || '').toString().toLowerCase();
        const valB = (b[examSort.key] || '').toString().toLowerCase();
        return examSort.dir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      });
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div><h2 className="text-2xl font-bold text-slate-800">Daftar Pemeriksa</h2></div>
          <div className="flex gap-2 items-center">
            <input type="file" accept=".csv" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
            <div className="flex bg-white rounded-lg border border-slate-300 overflow-hidden shadow-sm">
               <button onClick={handleImportClick} className="px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 border-r border-slate-300"><FileSpreadsheet className="w-4 h-4 text-green-600" /> Import Excel</button>
               <button onClick={handleDownloadTemplate} className="px-2 py-2 text-sm bg-slate-50 text-slate-500 hover:text-slate-700 hover:bg-slate-100" title="Unduh Template"><FileDown className="w-4 h-4" /></button>
            </div>
            <Button variant="outline" onClick={autoSortExaminers} title="Urutkan SDM"><ArrowDownWideNarrow className="w-4 h-4 text-slate-600" /> Urutkan SDM</Button>
            <div className="h-6 w-px bg-slate-300 mx-2"></div>
            <Button variant="danger" onClick={deleteAllExaminers}><Trash2 className="w-4 h-4" /> Hapus Semua</Button>
            <Button variant="gold" onClick={() => { setEditingExaminer(null); setShowExaminerModal(true); }}><Plus className="w-4 h-4" /> Tambah Pemeriksa</Button>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-visible">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 w-10"></th>
                <th className="px-4 py-3 w-10">No</th>
                <FilterHeader label="NIP BPK" fieldKey="nip_bpk" uniqueOptions={uniqueNipBpk} activeFilters={examFilter.nip_bpk} onApplyFilter={(v) => setExamFilter({...examFilter, nip_bpk: v})} onSort={() => handleSort('nip_bpk')} sortState={examSort} />
                <FilterHeader label="NIP 18 Digit" fieldKey="nip_18" uniqueOptions={uniqueNip18} activeFilters={examFilter.nip_18} onApplyFilter={(v) => setExamFilter({...examFilter, nip_18: v})} onSort={() => handleSort('nip_18')} sortState={examSort} />
                <FilterHeader label="Nama" fieldKey="name" uniqueOptions={uniqueNames} activeFilters={examFilter.name} onApplyFilter={(v)=>setExamFilter({...examFilter, name:v})} onSort={() => handleSort('name')} sortState={examSort} />
                <FilterHeader label="Jabatan" fieldKey="jabatan" uniqueOptions={uniqueJabatan} activeFilters={examFilter.jabatan} onApplyFilter={(v) => setExamFilter({...examFilter, jabatan: v})} onSort={() => handleSort('jabatan')} sortState={examSort} />
                <FilterHeader label="Pendidikan" fieldKey="edu" uniqueOptions={uniqueEdu} activeFilters={examFilter.edu} onApplyFilter={(v) => setExamFilter({...examFilter, edu: v})} onSort={() => handleSort('edu')} sortState={examSort} />
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 w-24 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {processedData.map((ex, idx) => (
                <tr key={ex.id} className={`hover:bg-slate-50 ${!ex.status ? 'bg-slate-50/50' : ''}`} draggable onDragStart={() => { dragRow.current = idx; }} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); if (dragRow.current !== null) { moveExaminerRow(dragRow.current, idx); dragRow.current = null; } }}>
                  <td className="px-4 py-3 text-center cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500"><GripVertical className="w-4 h-4" /></td>
                  <td className="px-4 py-3 text-center text-slate-500">{idx + 1}</td>
                  <td className="px-4 py-3 text-slate-600 font-mono text-xs">{ex.nip_bpk}</td>
                  <td className="px-4 py-3 text-slate-600 font-mono text-xs">{ex.nip_18}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{ex.name}{!ex.status && <div className="text-[10px] text-red-500 mt-0.5">Off: {ex.reason}</div>}</td>
                  <td className="px-4 py-3 text-slate-600">{ex.jabatan}</td>
                  <td className="px-4 py-3 text-slate-600">{ex.edu}</td>
                  <td className="px-4 py-3 text-center"><button onClick={() => toggleStatus(ex.id)} className={`px-3 py-1 rounded-full text-xs font-semibold border ${ex.status ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>{ex.status ? 'ON' : 'OFF'}</button></td>
                  <td className="px-4 py-3"><div className="flex justify-center gap-1"><button onClick={() => { setEditingExaminer(ex); setShowExaminerModal(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><User className="w-4 h-4"/></button><button onClick={() => deleteExaminer(ex.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4"/></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderTeamBuilderView = () => {
    const unassigned = examiners.filter(ex => { if (!ex.status) return false; let isAssigned = false; Object.keys(assignments).forEach(objId => { Object.values(assignments[objId]).forEach(assignedId => { if (assignedId === ex.id) isAssigned = true; }); }); return !isAssigned; });
    const currentStatus = PROJECT_STATUSES.find(s => s.id === projectStatus);

    return (
      <div className="space-y-6 pb-20 relative print:hidden">
        <div className="flex justify-between items-center sticky top-0 bg-slate-50 py-4 z-30 border-b border-slate-200">
          <div>
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><ShieldCheck className="w-6 h-6 text-amber-500" />Workspace Penyusunan Tim</h2>
          </div>
          <div className="flex gap-2 items-center">
            <input type="file" accept=".suntim" ref={backupInputRef} className="hidden" onChange={handleBackupFileChange} />
            <Button variant="outline" onClick={handleLoadProjectClick}><FolderOpen className="w-4 h-4 text-slate-600" /> Buka Proyek</Button>
            <Button variant="outline" onClick={onBackupClick}><Save className="w-4 h-4 text-blue-600" /> Simpan Proyek</Button>
            
            {/* Export Dropdown */}
            <div className="relative">
                <Button variant="gold" onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}><Download className="w-4 h-4" /> Ekspor Hasil</Button>
                {isExportMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-200 z-[100] animate-in fade-in zoom-in-95 overflow-hidden">
                        <button onClick={() => handleExportClick('excel')} className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-green-50 hover:text-green-700 flex items-center gap-2 border-b border-slate-100">
                            <FileSpreadsheet className="w-4 h-4" /> Excel (.xls)
                        </button>
                        <button onClick={() => handleExportClick('pdf')} className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-red-50 hover:text-red-700 flex items-center gap-2">
                            <FileText className="w-4 h-4" /> PDF Document
                        </button>
                    </div>
                )}
                {isExportMenuOpen && <div className="fixed inset-0 z-[90]" onClick={() => setIsExportMenuOpen(false)}></div>}
            </div>

            <div className="h-6 w-px bg-slate-300 mx-2"></div>
            <Button variant="outline" onClick={autoSortTeams}><ArrowDownAZ className="w-4 h-4 text-slate-600" /> Urutkan Tim</Button>
            <Button variant="primary" onClick={() => { setEditingObject(null); setShowObjectModal(true); }}><Plus className="w-4 h-4" /> Tambah Obrik</Button>
          </div>
        </div>

        {/* Project Title Editor */}
        <div className="flex items-center gap-2 -mt-4 mb-2 group">
            {isEditingTitle ? (
                <div className="flex items-center gap-2">
                    <input 
                        autoFocus
                        value={tempTitle}
                        onChange={e => setTempTitle(e.target.value)}
                        className="text-lg font-bold text-slate-800 bg-white border border-blue-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button onClick={() => { setProjectTitle(tempTitle); setIsEditingTitle(false); }} className="p-1 bg-green-100 text-green-700 rounded hover:bg-green-200"><Check className="w-4 h-4"/></button>
                    <button onClick={() => setIsEditingTitle(false)} className="p-1 bg-red-100 text-red-700 rounded hover:bg-red-200"><X className="w-4 h-4"/></button>
                </div>
            ) : (
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setTempTitle(projectTitle); setIsEditingTitle(true); }}>
                    <h1 className="text-lg font-bold text-slate-700 hover:text-blue-600">{projectTitle}</h1>
                    <Pencil className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            )}
        </div>

        <div className="flex items-center gap-2 mb-2 p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
           <CalendarClock className="w-5 h-5 text-slate-400" />
           <div className="text-sm text-slate-600">Status Konsep Susunan Tim: <span className={`font-bold px-2 py-0.5 rounded ${currentStatus?.color}`}>{currentStatus?.label}</span>{lastSaved && <span className="ml-2 text-xs text-slate-400">- {formatDate(lastSaved)}</span>}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-start">
          {objects.map(obj => (
            <div key={obj.id} className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-visible flex flex-col hover:shadow-md transition-shadow relative hover:z-[40] focus-within:z-[50]">
              <div className="bg-slate-800 px-3 py-2 border-b border-slate-700 flex justify-between items-center group rounded-t-lg">
                 <h3 className="font-bold text-white text-sm truncate max-w-[150px]" title={obj.name}>{obj.name}</h3>
                 <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-slate-400 hover:text-white hover:bg-slate-700/50 p-1.5 rounded" onClick={() => { setEditingObject(obj); setShowObjectModal(true); }}><Pencil className="w-3 h-3" /></button>
                    <button className="text-slate-400 hover:text-white hover:bg-slate-700/50 p-1.5 rounded" onClick={() => deleteObject(obj.id)}><Trash2 className="w-3 h-3 text-red-400" /></button>
                 </div>
              </div>
              <div className="p-2 space-y-1 relative z-10">
                {ROLES.map(role => {
                  const count = obj.slots[role.key];
                  if (count === 0) return null;
                  return Array.from({ length: count }).map((_, idx) => {
                    const examiner = getExaminerInSlot(obj.id, role.key, idx);
                    return (
                        <React.Fragment key={`${role.key}-${idx}`}>
                           <div className="h-2 -my-1 w-full hover:bg-blue-400 hover:h-4 transition-all opacity-0 hover:opacity-50 rounded cursor-copy z-20" data-is-gap="true" onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.opacity = '1'; }} onDragLeave={(e) => { e.currentTarget.style.opacity = '0'; }} onDrop={(e) => handleDrop(e, obj.id, role.key, idx)}></div>
                           <div className="flex items-center gap-2 relative" onDragOver={e => e.preventDefault()} onDrop={(e) => handleDrop(e, obj.id, role.key, idx)}>
                            <div className={`w-10 shrink-0 text-[10px] py-1 text-center rounded font-bold uppercase ${role.color}`}>{role.short}</div>
                            <div className="flex-1 min-w-0 relative"> 
                              {examiner ? (
                                <div draggable onDragStart={() => { dragItem.current = { examiner, sourceObjId: obj.id, sourceRole: role.key, sourceIndex: idx }; }} className="group bg-white border border-slate-200 rounded p-1 shadow-sm hover:border-amber-400 flex items-center gap-2 cursor-grab active:cursor-grabbing">
                                  <GripVertical className="w-3 h-3 text-slate-300" />
                                  <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 shrink-0 overflow-hidden">
                                      <img src={examiner.photo || "icon.jpg"} alt={getInitials(examiner.name)} className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.parentNode.innerText = getInitials(examiner.name); }} />
                                  </div>
                                  <div className="flex-1 min-w-0 cursor-pointer" onClick={(e) => { e.stopPropagation(); handleContextMenu(e, examiner.id, obj.id, `${role.key}_${idx}`); }}><div className="text-xs font-semibold text-slate-800 truncate">{examiner.name}</div></div>
                                  <button onClick={() => removeAssignment(obj.id, role.key, idx)} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500"><X className="w-3 h-3" /></button>
                                </div>
                              ) : <SlotSearch examiners={examiners} onSelect={(eid) => updateAssignment(obj.id, role.key, idx, eid)} />}
                            </div>
                          </div>
                      </React.Fragment>
                    );
                  });
                })}
              </div>
            </div>
          ))}
        </div>
        {/* Floating Monitor */}
        <div className="fixed bottom-8 right-8 z-50">
          <button onClick={() => setIsMonitorOpen(!isMonitorOpen)} className={`flex items-center justify-center w-14 h-14 rounded-full shadow-xl transition-all hover:scale-105 active:scale-95 ${unassigned.length > 0 ? 'bg-amber-500 text-white animate-pulse' : 'bg-green-500 text-white'}`}>{unassigned.length > 0 ? <AlertTriangle className="w-7 h-7" /> : <CheckCircle2 className="w-7 h-7" />}</button>
          {isMonitorOpen && (
            <div className="absolute bottom-16 right-0 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-5">
              <div className={`p-3 font-bold text-sm flex justify-between items-center ${unassigned.length > 0 ? 'bg-amber-50 text-amber-800' : 'bg-green-50 text-green-800'}`}>{unassigned.length > 0 ? `Belum Terplot (${unassigned.length})` : 'Semua Terplot!'}<button onClick={() => setIsMonitorOpen(false)}><X className="w-4 h-4 opacity-50 hover:opacity-100"/></button></div>
              <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-1">{unassigned.length > 0 ? (unassigned.map(ex => <div key={ex.id} className="p-2 flex items-center gap-2 hover:bg-slate-50 border-b border-slate-50 last:border-0"><div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">{getInitials(ex.name)}</div><div className="min-w-0"><div className="text-xs font-semibold text-slate-800 truncate">{ex.name}</div><div className="text-[9px] text-slate-500 truncate">{ex.jabatan}</div></div></div>)) : <div className="p-4 text-center text-xs text-slate-400 italic">Great job! Semua personil aktif sudah masuk tim.</div>}</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderDashboardView = () => {
    // ... (Analytics logic same as before) ...
    // 1. Recapitulation
    const recapData = objects.map(obj => {
      const counts = {};
      let rowTotal = 0;
      ROLES.forEach(r => { 
        counts[r.key] = 0;
        const objAssigns = assignments[obj.id] || {};
        Object.keys(objAssigns).forEach(slotKey => {
            if (slotKey.startsWith(r.key)) counts[r.key]++;
        });
        rowTotal += counts[r.key];
      });
      return { objName: obj.name, counts, rowTotal };
    });
    const recapColTotals = {};
    ROLES.forEach(r => {
        recapColTotals[r.key] = recapData.reduce((acc, row) => acc + row.counts[r.key], 0);
    });
    const recapGrandTotal = recapData.reduce((acc, row) => acc + row.rowTotal, 0);

    // 2. Matrix Jabatan
    let matrixJabatan = {}; 
    Object.keys(assignments).forEach(objId => {
      Object.keys(assignments[objId]).forEach(slotKey => {
        const roleKey = slotKey.split('_')[0];
        const exId = assignments[objId][slotKey];
        const ex = examiners.find(e => e.id === exId);
        if (ex) {
          if (!matrixJabatan[ex.jabatan]) matrixJabatan[ex.jabatan] = {};
          if (!matrixJabatan[ex.jabatan][roleKey]) matrixJabatan[ex.jabatan][roleKey] = new Set();
          matrixJabatan[ex.jabatan][roleKey].add(ex.id);
        }
      });
    });
    const sortedJabatans = Object.keys(matrixJabatan).sort((a, b) => (JOB_RANK[a] || 99) - (JOB_RANK[b] || 99));
    const matColTotals = {};
    ROLES.forEach(r => matColTotals[r.key] = 0);
    let matGrandTotal = 0;

    // 3. Gender
    const genderData = objects.map(obj => {
        let L = 0, P = 0;
        let peopleL = [], peopleP = [];
        const objAssigns = assignments[obj.id] || {};
        Object.keys(objAssigns).forEach(slotKey => {
            const roleKey = slotKey.split('_')[0];
            const roleConfig = ROLES.find(r => r.key === roleKey);
            if (roleConfig && roleConfig.isTech) {
                const exId = objAssigns[slotKey];
                const ex = examiners.find(e => e.id === exId);
                if (ex) {
                    if (ex.gender === 'L') { L++; peopleL.push(ex); } else { P++; peopleP.push(ex); }
                }
            }
        });
        return { objName: obj.name, L, P, peopleL, peopleP };
    });
    const maxVal = Math.max(...genderData.map(d => Math.max(d.L, d.P)), 1);

    // 4. Edu
    const uniqueEdu = [...new Set(examiners.map(e => e.edu).filter(e => e))].sort();
    const eduRows = uniqueEdu.map(edu => {
        const rowData = { eduLabel: edu, cells: {}, rowTotal: 0 };
        objects.forEach(obj => {
            let count = 0;
            let people = [];
            const objAssigns = assignments[obj.id] || {};
            Object.keys(objAssigns).forEach(slotKey => {
                const exId = objAssigns[slotKey];
                const ex = examiners.find(e => e.id === exId);
                const roleKey = slotKey.split('_')[0];
                const roleConfig = ROLES.find(r => r.key === roleKey);
                if (roleConfig && roleConfig.isTech && ex && ex.edu === edu) {
                    count++;
                    people.push(ex);
                }
            });
            rowData.cells[obj.id] = { count, people };
            rowData.rowTotal += count;
        });
        return rowData;
    });
    const eduColTotals = {};
    objects.forEach(obj => {
        eduColTotals[obj.id] = eduRows.reduce((acc, row) => acc + (row.cells[obj.id]?.count || 0), 0);
    });
    const eduGrandTotal = eduRows.reduce((acc, row) => acc + row.rowTotal, 0);

    return (
      <div className="space-y-6 pb-20">
        <div className="flex justify-between items-center"><h2 className="text-2xl font-bold text-slate-800">Dashboard Analitik</h2></div>
        {/* 1. Recap */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
           <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><List className="w-4 h-4 text-blue-600" />Rekapitulasi Pemeriksa per Obrik</h3>
           <table className="w-full text-xs text-left border-collapse min-w-[600px]">
             <thead>
               <tr><th className="p-2 border border-slate-100 bg-slate-50 font-semibold text-slate-600">Objek Pemeriksaan</th>{ROLES.map(r => <th key={r.key} className="p-2 border border-slate-100 bg-slate-50 font-semibold text-center text-slate-600">{r.short}</th>)}<th className="p-2 border border-slate-100 bg-slate-50 font-semibold text-center text-slate-600 bg-slate-100">Total</th></tr>
             </thead>
             <tbody>
               {recapData.map((row, i) => { const total = Object.values(row.counts).reduce((a, b) => a + b, 0); return ( <tr key={i}><td className="p-2 border border-slate-100 font-medium text-slate-700">{row.objName}</td>{ROLES.map(r => <td key={r.key} className="p-2 border border-slate-100 text-center text-slate-600">{row.counts[r.key] > 0 ? <span className={`font-bold ${r.color.split(' ')[1]}`}>{row.counts[r.key]}</span> : '-'}</td>)}<td className="p-2 border border-slate-100 text-center font-bold text-slate-800 bg-slate-50">{row.rowTotal}</td></tr> ); })}
               <tr className="bg-slate-100 font-bold border-t-2 border-slate-200"><td className="p-2 border border-slate-100 text-slate-800">Total Keseluruhan</td>{ROLES.map(r => <td key={r.key} className="p-2 border border-slate-100 text-center text-slate-800">{recapColTotals[r.key]}</td>)}<td className="p-2 border border-slate-100 text-center text-slate-900">{recapGrandTotal}</td></tr>
             </tbody>
           </table>
        </div>
        {/* 2. Jabatan */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
           <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-blue-600" />Matriks Sebaran: Jabatan vs Peran Tim</h3>
           <table className="w-full text-xs text-left border-collapse min-w-[500px]">
             <thead><tr><th className="p-2 border border-slate-100 bg-slate-50 font-semibold text-slate-600">Jabatan \ Peran</th>{ROLES.map(r => <th key={r.key} className="p-2 border border-slate-100 bg-slate-50 font-semibold text-center text-slate-600">{r.short}</th>)}<th className="p-2 border border-slate-100 bg-slate-50 font-semibold text-center text-slate-600 bg-slate-100">Total</th></tr></thead>
             <tbody>
               {sortedJabatans.map(jab => { let rowTotal = 0; return ( <tr key={jab}><td className="p-2 border border-slate-100 font-medium text-slate-700">{jab}</td>{ROLES.map(r => { const peopleSet = matrixJabatan[jab]?.[r.key] || new Set(); const count = peopleSet.size; rowTotal += count; matColTotals[r.key] += count; matGrandTotal += count; return ( <td key={r.key} className={`p-2 border border-slate-100 text-center cursor-pointer hover:bg-blue-100 transition-colors ${count > 0 ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-300'}`} onClick={() => { if(count>0) { const people = []; peopleSet.forEach(id => { const ex = examiners.find(e=>e.id===id); if(ex) { let obrikNames = []; Object.keys(assignments).forEach(objId => { Object.keys(assignments[objId]).forEach(slotKey => { if (slotKey.startsWith(r.key) && assignments[objId][slotKey] === id) { const obj = objects.find(o => o.id === objId); if(obj) obrikNames.push(obj.name); } }); }); people.push({...ex, roleLabel: r.short, objName: obrikNames.join(', ')}) } }); openDrillDown(`${jab}`, people); } }}>{count || '-'}</td> ) })}<td className="p-2 border border-slate-100 text-center font-bold text-slate-800 bg-slate-50">{rowTotal}</td></tr> ) })}
               <tr className="bg-slate-100 font-bold border-t-2 border-slate-200"><td className="p-2 border border-slate-100 text-slate-800">Total</td>{ROLES.map(r => <td key={r.key} className="p-2 border border-slate-100 text-center text-slate-800">{matColTotals[r.key]}</td>)}<td className="p-2 border border-slate-100 text-center text-slate-900">{matGrandTotal}</td></tr>
             </tbody>
           </table>
        </div>
        {/* 4. Edu */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
           <div className="mb-4"><h3 className="font-bold text-slate-700 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-green-600" />Matriks Sebaran: Latar Pendidikan vs Obrik</h3><p className="text-xs text-slate-400 italic">Analitik ini hanya menghitung komposisi dari Ketua Tim sampai Dukungan Pemeriksaan</p></div>
           <table className="w-full text-xs text-left border-collapse min-w-[300px]">
             <thead><tr><th className="p-2 border border-slate-100 bg-slate-50 font-semibold text-slate-600">Pendidikan \ Obrik</th>{objects.map(obj => <th key={obj.id} className="p-2 border border-slate-100 bg-slate-50 font-semibold text-center text-slate-600">{obj.name}</th>)}<th className="p-2 border border-slate-100 bg-slate-50 font-semibold text-center text-slate-600 bg-slate-100">Total</th></tr></thead>
             <tbody>
               {eduRows.map((row, i) => ( <tr key={i}><td className="p-2 border border-slate-100 font-medium text-slate-700">{row.eduLabel}</td>{objects.map(obj => { const cell = row.cells[obj.id] || { count: 0, people: [] }; return ( <td key={obj.id} className={`p-2 border border-slate-100 text-center cursor-pointer hover:bg-green-50 transition-colors ${cell.count > 0 ? 'bg-green-50/50 text-green-700 font-bold' : 'text-slate-300'}`} onClick={() => cell.count > 0 && openDrillDown(`Latar pendidikan ${row.eduLabel} di ${obj.name}`, cell.people)}>{cell.count || '-'}</td> ) })}<td className="p-2 border border-slate-100 text-center font-bold text-slate-800 bg-slate-50">{row.rowTotal}</td></tr> ))}
               <tr className="bg-slate-100 font-bold border-t-2 border-slate-200"><td className="p-2 border border-slate-100 text-slate-800">Total</td>{objects.map(obj => <td key={obj.id} className="p-2 border border-slate-100 text-center text-slate-800">{eduColTotals[obj.id]}</td>)}<td className="p-2 border border-slate-100 text-center text-slate-900">{eduGrandTotal}</td></tr>
             </tbody>
           </table>
        </div>
        {/* 3. Gender */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
           <div className="mb-4"><h3 className="font-bold text-slate-700 flex items-center gap-2"><PieChart className="w-4 h-4 text-purple-500" />Komposisi berdasarkan Jenis Kelamin</h3><p className="text-xs text-slate-400 italic">Analitik ini hanya menghitung komposisi dari Ketua Tim sampai Dukungan Pemeriksaan</p></div>
           <div className="space-y-4">
             <div className="flex text-xs font-bold text-slate-500 mb-2 border-b border-slate-100 pb-2"><div className="w-1/3">Objek Pemeriksaan</div><div className="flex-1 flex justify-center">Pemeriksa Laki-laki</div><div className="w-8"></div><div className="flex-1 flex justify-center">Pemeriksa Perempuan</div></div>
             {genderData.map((d, i) => (
               <div key={i} className="text-sm">
                 <div className="font-semibold text-slate-700 mb-1 text-xs truncate">{d.objName}</div>
                 <div className="flex items-center h-6">
                   <div className="flex-1 flex justify-end pr-2 border-r border-slate-200 relative"><div className="bg-blue-500 h-4 rounded-l cursor-pointer hover:bg-blue-600 transition-all flex items-center justify-end pr-1 text-[10px] text-white font-bold" style={{ width: `${(d.L / maxVal) * 100}%`, minWidth: d.L > 0 ? '20px' : '0' }} onClick={() => openDrillDown(`Pemeriksa Laki-laki di ${d.objName}`, d.peopleL)}>{d.L > 0 && d.L}</div></div>
                   <div className="flex-1 flex justify-start pl-2"><div className="bg-pink-500 h-4 rounded-r cursor-pointer hover:bg-pink-600 transition-all flex items-center pl-1 text-[10px] text-white font-bold" style={{ width: `${(d.P / maxVal) * 100}%`, minWidth: d.P > 0 ? '20px' : '0' }} onClick={() => openDrillDown(`Pemeriksa Perempuan di ${d.objName}`, d.peopleP)}>{d.P > 0 && d.P}</div></div>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{`@media print { body * { visibility: hidden; } #print-area, #print-area * { visibility: visible; } #print-area { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 20px; background: white; color: black; } @page { margin: 1cm; size: landscape; } }`}</style>
      {renderPrintView()}
      <div className="min-h-screen bg-slate-50 font-sans flex text-slate-800 print:hidden">
        {renderSidebar()}
        <main className={`flex-1 transition-all duration-300 p-8 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
          {activeMenu === 'examiners' && renderExaminersView()}
          {activeMenu === 'team_builder' && renderTeamBuilderView()}
          {activeMenu === 'analytics' && renderDashboardView()}
        </main>

        {/* Modals & Popups */}
        <StatusSelectionModal isOpen={showStatusModal} onClose={() => setShowStatusModal(false)} onConfirm={performBackup} />
        {/* Export Selection Modal Removed, using inline dropdown */}
        <DrillDownModal isOpen={drillDown.isOpen} title={drillDown.title} data={drillDown.data} onClose={() => setDrillDown({ ...drillDown, isOpen: false })} />
        <ConfirmModal isOpen={confirmState.isOpen} title={confirmState.title} message={confirmState.message} onConfirm={confirmState.onConfirm} onClose={() => setConfirmState({ ...confirmState, isOpen: false })} confirmLabel={confirmState.confirmLabel} isAlert={confirmState.isAlert} />
        <Modal isOpen={showObjectModal} onClose={() => setShowObjectModal(false)} title={editingObject ? 'Edit Objek' : 'Tambah Obrik'}><form onSubmit={saveObject} className="space-y-4"><Input name="name" label="Nama Objek Pemeriksaan" defaultValue={editingObject?.name} placeholder="Contoh: LKPD Kab. Badung" required /><div className="border-t pt-4 border-slate-100"><label className="block text-xs font-bold text-slate-700 mb-2">Konfigurasi Slot Tim</label><div className="grid grid-cols-2 gap-3">{ROLES.map(r => (<div key={r.key} className="flex items-center justify-between bg-slate-50 p-2 rounded border border-slate-200"><span className="text-xs font-medium text-slate-600 w-1/2">{r.label} ({r.short})</span><input type="number" name={`slot_${r.key}`} min="0" className="w-16 text-center text-sm border rounded p-1" defaultValue={editingObject ? (editingObject.slots[r.key] || 0) : (r.key === 'PJ' || r.key === 'KT' ? 1 : 0)} /></div>))}</div></div><div className="flex justify-end gap-2 mt-6"><Button type="button" variant="ghost" onClick={() => setShowObjectModal(false)}>Batal</Button><Button type="submit" variant="gold">Simpan</Button></div></form></Modal>
        <Modal isOpen={showExaminerModal} onClose={() => setShowExaminerModal(false)} title={editingExaminer ? 'Edit Pemeriksa' : 'Tambah Pemeriksa'}><form onSubmit={saveExaminer} className="space-y-4"><Input name="nip_bpk" label="NIP BPK" defaultValue={editingExaminer?.nip_bpk} required /><Input name="nip_18" label="NIP 18 Digit" defaultValue={editingExaminer?.nip_18} required /><Input name="name" label="Nama Lengkap" defaultValue={editingExaminer?.name} required /><Input name="jabatan" label="Jabatan" defaultValue={editingExaminer?.jabatan} required /><Input name="edu" label="Latar Pendidikan" defaultValue={editingExaminer?.edu} required /><div className="flex justify-end gap-2 mt-6"><Button type="button" variant="ghost" onClick={() => setShowExaminerModal(false)}>Batal</Button><Button type="submit" variant="gold">Simpan</Button></div></form></Modal>
        <Modal isOpen={statusReasonModal.open} onClose={() => setStatusReasonModal({open: false})} title="Alasan Non-Aktif"><p className="text-sm text-slate-500 mb-2">Mengapa pemeriksa ini tidak bisa mengikuti pemeriksaan?</p><textarea className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:border-amber-500 focus:outline-none" rows="3" placeholder="Contoh: Cuti Melahirkan, Diklat..." value={tempReason} onChange={e => setTempReason(e.target.value)}></textarea><div className="flex justify-end gap-2 mt-4"><Button onClick={() => setStatusReasonModal({open: false})}>Batal</Button><Button variant="danger" onClick={confirmStatusReason}>Non-Aktifkan</Button></div></Modal>
        {contextMenu.visible && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setContextMenu({ ...contextMenu, visible: false })} />
            <div className="fixed z-50 bg-white rounded-lg shadow-xl border border-slate-200 w-64 overflow-hidden animate-in fade-in zoom-in-95 duration-100" style={{ top: Math.min(contextMenu.y, window.innerHeight - 300), left: Math.min(contextMenu.x, window.innerWidth - 300) }}>
              <div className="bg-slate-50 px-3 py-2 border-b border-slate-100 text-xs font-bold text-slate-500">Opsi Perpindahan</div>
              {moveSubMenu === null && (<div className="p-1"><button className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-amber-50 rounded flex justify-between items-center group" onClick={(e) => { e.stopPropagation(); setMoveSubMenu('move_target_list'); }}><span>Pindahkan ke...</span><ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-500"/></button><button className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-amber-50 rounded flex justify-between items-center group" onClick={(e) => { e.stopPropagation(); setMoveSubMenu('swap_target_list'); }}><span>Tukar dengan...</span><ArrowRightLeft className="w-4 h-4 text-slate-400 group-hover:text-amber-500"/></button><div className="border-t border-slate-100 my-1"></div><button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded flex gap-2 items-center" onClick={() => { removeAssignment(contextMenu.sourceObjId, contextMenu.sourceKey.split('_')[0], contextMenu.sourceKey.split('_')[1]); setContextMenu({...contextMenu, visible:false}); }}><LogOut className="w-4 h-4"/> Lepas dari Tim</button></div>)}
              {moveSubMenu === 'move_target_list' && (<div className="p-1 max-h-60 overflow-y-auto"><button className="w-full text-left px-2 py-1 text-xs text-slate-400 mb-1 flex items-center" onClick={(e) => { e.stopPropagation(); setMoveSubMenu(null); }}><ChevronDown className="w-3 h-3 rotate-90 mr-1"/> Kembali</button>{objects.filter(o => o.id !== contextMenu.sourceObjId).map(obj => (<button key={obj.id} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-green-50 rounded border-b border-slate-50 last:border-0" onClick={() => selectTargetObjectForMove(obj.id)}><div className="font-semibold">{obj.name}</div></button>))}{objects.length <= 1 && <div className="p-3 text-center text-xs text-slate-400">Tidak ada tim lain tersedia.</div>}</div>)}
              {moveSubMenu === 'move_role_select' && selectedTargetObjId && (<div className="p-1 max-h-60 overflow-y-auto"><button className="w-full text-left px-2 py-1 text-xs text-slate-400 mb-1 flex items-center" onClick={(e) => { e.stopPropagation(); setMoveSubMenu('move_target_list'); }}><ChevronDown className="w-3 h-3 rotate-90 mr-1"/> Pilih Tim Lain</button><div className="px-2 py-1 bg-amber-50 text-[10px] font-bold text-slate-500 uppercase mb-1 rounded">Pilih Peran:</div>{ROLES.map(role => {const obj = objects.find(o => o.id === selectedTargetObjId);const capacity = obj.slots[role.key] || 0;if (capacity === 0) return null; let available = false;for (let i = 0; i < capacity; i++) {if (!assignments[selectedTargetObjId]?.[`${role.key}_${i}`]) {available = true;break;}}if (!available) return null; return (<button key={role.key} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-green-50 rounded border-b border-slate-50 flex items-center gap-2" onClick={() => executeMoveFinal(role.key)}><div className={`w-2 h-2 rounded-full ${role.color.split(' ')[0]}`}></div><span>{role.label}</span></button>)})}{ROLES.every(role => {const obj = objects.find(o => o.id === selectedTargetObjId);const capacity = obj.slots[role.key] || 0;let available = false;for (let i = 0; i < capacity; i++) {if (!assignments[selectedTargetObjId]?.[`${role.key}_${i}`]) {available = true;break;}}return !available;}) && <div className="p-3 text-center text-xs text-red-400">Tim ini penuh.</div>}</div>)}
              {moveSubMenu === 'swap_target_list' && (<div className="p-1 max-h-60 overflow-y-auto"><button className="w-full text-left px-2 py-1 text-xs text-slate-400 mb-1 flex items-center" onClick={(e) => { e.stopPropagation(); setMoveSubMenu(null); }}><ChevronDown className="w-3 h-3 rotate-90 mr-1"/> Kembali</button>{objects.filter(o => o.id !== contextMenu.sourceObjId).map(obj => (<div key={obj.id} className="mb-1"><div className="px-2 py-1 bg-slate-100 text-[10px] font-bold text-slate-500 uppercase">{obj.name}</div>{(() => {const assignedInObj = assignments[obj.id] || {};const peopleIds = Object.values(assignedInObj);if (peopleIds.length === 0) return <div className="px-3 py-1 text-xs text-slate-400 italic">Tim Kosong</div>;return peopleIds.map(pid => {const p = examiners.find(e => e.id === pid);const slotKey = Object.keys(assignedInObj).find(key => assignedInObj[key] === pid);const roleKey = slotKey ? slotKey.split('_')[0] : '';const roleData = ROLES.find(r => r.key === roleKey);return <button key={pid} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-amber-50 flex items-center gap-2" onClick={() => executeSwap(obj.id, pid)}><span className={`text-[10px] w-8 text-center py-0.5 rounded font-bold ${roleData?.color}`}>{roleData?.short}</span><span className="truncate">{p.name}</span></button>});})()}</div>))}{objects.length <= 1 && <div className="p-3 text-center text-xs text-slate-400">Tidak ada tim lain tersedia.</div>}</div>)}
            </div>
          </>
        )}
      </div>
    </>
  );
}