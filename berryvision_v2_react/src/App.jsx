import React, { useState } from 'react';
import { 
  Menu, X, Activity, CheckCircle2, Cpu, Layers, 
  ShieldCheck, Droplets, Download, Maximize2, Scan, RefreshCw, 
  Database, Sparkles, ExternalLink, FileText, Eye, Upload
} from 'lucide-react';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCaseIndex, setSelectedCaseIndex] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(true);
  const [zoomModal, setZoomModal] = useState({ open: false, src: '', title: '' });
  const [selectedCell, setSelectedCell] = useState(null);
  const [isScanningMatrix, setIsScanningMatrix] = useState(false);
  const [customUploadUrl, setCustomUploadUrl] = useState(null);

  // 6 mẫu kiểm tra chẩn đoán thực tế
  const sampleCases = [
    {
      id: 'dom_trang',
      name: 'Bệnh Đốm Trắng',
      badgeClass: 'bg-white/10 text-white border-white/30',
      tagColor: 'text-sky-400',
      originalImg: '/demo/disease_dom_trang.jpg',
      annotatedImg: '/demo/annotated_disease_dom_trang.jpg',
      coord: 'Ô X02 - Y02 (Bên Phải)',
      spotCount: '7 đốm',
      confidence: '96.8%',
      diseaseType: 'Bệnh Đốm Trắng (Mycosphaerella fragariae)',
      severity: 'Nhiễm Nấm Bậc 2',
      action: 'Phun thuốc diệt nấm sinh học (Score 250EC / Anvil 5SC) cục bộ tại vòi phun số 2. Giữ tán lá thông thoáng và giảm tưới phun sương.',
      spots: [
        { id: 1, label: 'dom_trang', conf: '97.4%', bbox: '[142, 280, 210, 350]', norm: 'X: 0.45, Y: 0.52' },
        { id: 2, label: 'dom_trang', conf: '96.8%', bbox: '[320, 190, 390, 260]', norm: 'X: 0.62, Y: 0.41' },
        { id: 3, label: 'dom_trang', conf: '96.2%', bbox: '[450, 310, 510, 375]', norm: 'X: 0.78, Y: 0.58' },
        { id: 4, label: 'dom_trang', conf: '95.1%', bbox: '[205, 410, 270, 480]', norm: 'X: 0.38, Y: 0.72' },
      ]
    },
    {
      id: 'chay_la',
      name: 'Cháy Rìa Lá',
      badgeClass: 'bg-red-500/20 text-red-400 border-red-500/40',
      tagColor: 'text-red-400',
      originalImg: '/demo/disease_chay_la.jpg',
      annotatedImg: '/demo/annotated_disease_chay_la.jpg',
      coord: 'Ô X01 - Y03 (Bên Trái)',
      spotCount: '4 vùng cháy',
      confidence: '98.2%',
      diseaseType: 'Cháy Bìa Lá (Leaf Scorch / Phomopsis)',
      severity: 'Báo Động Cấp 3',
      action: 'Tỉa bỏ bớt các phần rìa lá bị hoại tử; phun hoạt chất Propiconazole liều nhẹ kết hợp bổ sung Kali để tăng sức dày vách tế bào.',
      spots: [
        { id: 1, label: 'chay_la', conf: '98.6%', bbox: '[80, 150, 280, 320]', norm: 'X: 0.22, Y: 0.35' },
        { id: 2, label: 'chay_la', conf: '97.9%', bbox: '[350, 280, 520, 440]', norm: 'X: 0.68, Y: 0.61' },
        { id: 3, label: 'chay_la', conf: '96.5%', bbox: '[180, 420, 310, 510]', norm: 'X: 0.35, Y: 0.79' }
      ]
    },
    {
      id: 'vang_ua',
      name: 'Lá Vàng Úa',
      badgeClass: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
      tagColor: 'text-yellow-400',
      originalImg: '/demo/disease_vang_ua.jpg',
      annotatedImg: '/demo/annotated_disease_vang_ua.jpg',
      coord: 'Ô X03 - Y01 (Bên Trái)',
      spotCount: '3 vùng vàng',
      confidence: '95.3%',
      diseaseType: 'Thiếu Vi Lượng Sắt & Magie (Chlorosis)',
      severity: 'Thiếu Hụt Dinh Dưỡng',
      action: 'Bổ sung dung dịch dinh dưỡng vi lượng Fe-EDDHA và MgSO4 qua hệ thống tưới nhỏ giọt; phun hỗ trợ lá với nồng độ 0.15%.',
      spots: [
        { id: 1, label: 'vang_ua', conf: '96.2%', bbox: '[110, 210, 290, 400]', norm: 'X: 0.29, Y: 0.44' },
        { id: 2, label: 'vang_ua', conf: '94.8%', bbox: '[310, 140, 460, 310]', norm: 'X: 0.58, Y: 0.32' }
      ]
    },
    {
      id: 'kho_heo',
      name: 'Khô Héo / Thối Rễ',
      badgeClass: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
      tagColor: 'text-orange-400',
      originalImg: '/demo/disease_kho_heo.jpg',
      annotatedImg: '/demo/annotated_disease_kho_heo.jpg',
      coord: 'Ô X02 - Y01 (Bên Phải)',
      spotCount: '2 ổ héo',
      confidence: '94.7%',
      diseaseType: 'Thối Gốc Khô Héo (Fusarium Oxysporum)',
      severity: 'Nguy Hiểm Cao',
      action: 'Tách ly chậu dâu bị bệnh khỏi luống tưới chung. Tưới gốc Ridomil Gold 68WG đặc trị và ngừng cấp ẩm dư thừa trong 48 giờ.',
      spots: [
        { id: 1, label: 'kho_heo', conf: '95.4%', bbox: '[160, 240, 380, 490]', norm: 'X: 0.38, Y: 0.52' }
      ]
    },
    {
      id: 'strawberry_ripe',
      name: 'Quả Chín Khỏe',
      badgeClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      tagColor: 'text-emerald-400',
      originalImg: '/demo/strawberry_ripe.jpg',
      annotatedImg: '/demo/annotated_strawberry_ripe.jpg',
      coord: 'Ô X03 - Y03 (Bên Phải)',
      spotCount: '0 đốm (100% An Toàn)',
      confidence: '99.1%',
      diseaseType: 'Dâu Tây Hana Đạt Chuẩn Thu Hoạch',
      severity: 'Tối Ưu / Xuất Sắc',
      action: 'Quả và lá khỏe mạnh tuyệt đối. Đạt chuẩn thu hoạch nông sản sạch xuất khẩu. Không áp dụng bất kỳ loại hóa chất nào.',
      spots: [
        { id: 1, label: 'khoe_manh', conf: '99.4%', bbox: '[210, 180, 430, 470]', norm: 'X: 0.48, Y: 0.47' }
      ]
    },
    {
      id: 'robot_scan',
      name: 'Robot Cam X01-Y01',
      badgeClass: 'bg-teal-500/20 text-teal-400 border-teal-500/40',
      tagColor: 'text-teal-400',
      originalImg: '/demo/annotated_X01_Y01_20260826_06_R.jpg',
      annotatedImg: '/demo/annotated_X01_Y01_20260826_06_R.jpg',
      coord: 'Ô X01 - Y01 (Luống Tây)',
      spotCount: '2 vết đốm nhẹ',
      confidence: '94.6%',
      diseaseType: 'Camera Macro E-Puck AGV Tuần Tra',
      severity: 'Cần Giám Sát',
      action: 'Chế độ theo dõi định kỳ; lên lịch tưới phòng ngừa sinh học đợt kế tiếp sau 24h.',
      spots: [
        { id: 1, label: 'dom_trang', conf: '94.8%', bbox: '[190, 310, 280, 400]', norm: 'X: 0.35, Y: 0.51' }
      ]
    }
  ];

  const currentCase = sampleCases[selectedCaseIndex];

  // 12 ô trong lưới nhà kính
  const greenhouseCells = [
    { id: 1, plant: 'Cây 01', aisle: 'Luống Tây (X=1)', x: 1, y: 1, disease: 'Vàng Úa', code: 2, conf: '95.3%', status: 'warning', chemical: 'Phun vi lượng Fe/Mg (0.15L)', nozzle: 'Vòi 01 (Bật)', img: '/demo/disease_vang_ua.jpg' },
    { id: 2, plant: 'Cây 02', aisle: 'Luống Tây (X=1)', x: 1, y: 2, disease: 'Khỏe Mạnh', code: 0, conf: '98.7%', status: 'healthy', chemical: 'Không phun (0L)', nozzle: 'Vòi 02 (Tắt)', img: '/demo/strawberry_ripe.jpg' },
    { id: 3, plant: 'Cây 03', aisle: 'Luống Tây (X=1)', x: 1, y: 3, disease: 'Cháy Lá', code: 4, conf: '98.2%', status: 'danger', chemical: 'Phun Propiconazole (0.25L)', nozzle: 'Vòi 03 (Bật)', img: '/demo/disease_chay_la.jpg' },
    { id: 4, plant: 'Cây 04', aisle: 'Lối Giữa - Trái (X=2)', x: 2, y: 1, disease: 'Khô Héo', code: 3, conf: '94.7%', status: 'danger', chemical: 'Đặc trị Ridomil Gold (0.3L)', nozzle: 'Vòi 04 (Bật)', img: '/demo/disease_kho_heo.jpg' },
    { id: 5, plant: 'Cây 05', aisle: 'Lối Giữa - Trái (X=2)', x: 2, y: 2, disease: 'Khỏe Mạnh', code: 0, conf: '99.0%', status: 'healthy', chemical: 'Không phun (0L)', nozzle: 'Vòi 05 (Tắt)', img: '/demo/strawberry_foreign_1.jpg' },
    { id: 6, plant: 'Cây 06', aisle: 'Lối Giữa - Trái (X=2)', x: 2, y: 3, disease: 'Khỏe Mạnh', code: 0, conf: '97.5%', status: 'healthy', chemical: 'Không phun (0L)', nozzle: 'Vòi 06 (Tắt)', img: '/demo/strawberry_foreign_2.jpg' },
    { id: 7, plant: 'Cây 07', aisle: 'Lối Giữa - Phải (X=2)', x: 2, y: 1, disease: 'Khỏe Mạnh', code: 0, conf: '98.4%', status: 'healthy', chemical: 'Không phun (0L)', nozzle: 'Vòi 07 (Tắt)', img: '/demo/strawberry_ripe.jpg' },
    { id: 8, plant: 'Cây 08', aisle: 'Lối Giữa - Phải (X=2)', x: 2, y: 2, disease: 'Đốm Trắng', code: 1, conf: '96.8%', status: 'danger', chemical: 'Phun diệt nấm Score 250EC (0.2L)', nozzle: 'Vòi 08 (Bật)', img: '/demo/disease_dom_trang.jpg' },
    { id: 9, plant: 'Cây 09', aisle: 'Lối Giữa - Phải (X=2)', x: 2, y: 3, disease: 'Khỏe Mạnh', code: 0, conf: '99.2%', status: 'healthy', chemical: 'Không phun (0L)', nozzle: 'Vòi 09 (Tắt)', img: '/demo/strawberry_ripe.jpg' },
    { id: 10, plant: 'Cây 10', aisle: 'Luống Đông (X=3)', x: 3, y: 1, disease: 'Khỏe Mạnh', code: 0, conf: '98.9%', status: 'healthy', chemical: 'Không phun (0L)', nozzle: 'Vòi 10 (Tắt)', img: '/demo/strawberry_foreign_1.jpg' },
    { id: 11, plant: 'Cây 11', aisle: 'Luống Đông (X=3)', x: 3, y: 2, disease: 'Khỏe Mạnh', code: 0, conf: '97.8%', status: 'healthy', chemical: 'Không phun (0L)', nozzle: 'Vòi 11 (Tắt)', img: '/demo/strawberry_foreign_2.jpg' },
    { id: 12, plant: 'Cây 12', aisle: 'Luống Đông (X=3)', x: 3, y: 3, disease: 'Khỏe Mạnh', code: 0, conf: '99.5%', status: 'healthy', chemical: 'Không phun (0L)', nozzle: 'Vòi 12 (Tắt)', img: '/demo/strawberry_ripe.jpg' },
  ];

  const activeCell = selectedCell || greenhouseCells[7]; // mặc định ô số 8 (đốm trắng)

  const handleRunAI = () => {
    setIsAnalyzing(true);
    setAnalyzed(false);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalyzed(true);
    }, 900);
  };

  const handleScanAll = () => {
    setIsScanningMatrix(true);
    setTimeout(() => {
      setIsScanningMatrix(false);
    }, 1500);
  };

  const handleCustomUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomUploadUrl(url);
      setAnalyzed(false);
    }
  };

  const downloadCSV = () => {
    let csv = "Cây #,Tọa Độ X,Tọa Độ Y,Luống & Lối Tuần Tra,Loại Bệnh Phát Hiện,Độ Tin Cậy AI,Đơn Thuốc & Biện Pháp Xử Lý\n";
    greenhouseCells.forEach(c => {
      csv += `${c.id},${c.x},${c.y},"${c.aisle}","${c.disease}",${c.conf},"${c.chemical}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'spray_prescription_map.csv';
    link.click();
  };

  return (
    <div className="w-full min-h-screen bg-[#05070a] text-slate-100 relative overflow-hidden font-sans selection:bg-red-500/30 selection:text-red-200">
      {/* Ambient background glows */}
      <div 
        className="absolute -top-48 -left-48 w-[700px] h-[700px] rounded-full pointer-events-none blur-[150px]"
        style={{
          background: 'radial-gradient(circle, rgba(239,68,68,0.18) 0%, rgba(20,184,166,0.15) 50%, rgba(5,7,10,0) 80%)'
        }}
      />
      <div 
        className="absolute top-[35%] -right-48 w-[600px] h-[600px] rounded-full pointer-events-none blur-[150px]"
        style={{
          background: 'radial-gradient(circle, rgba(20,184,166,0.12) 0%, rgba(239,68,68,0.1) 60%, rgba(5,7,10,0) 80%)'
        }}
      />
      <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-red-500/40 via-teal-500/20 to-transparent z-0 pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* 1. STICKY NAVBAR */}
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#05070a]/85 border-b border-white/10 transition-all duration-300">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
            {/* Logo */}
            <a href="#hero" className="flex items-center gap-3.5 group">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/50 flex items-center justify-center text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] group-hover:scale-105 transition-transform">
                <svg className="w-5 h-5 fill-current text-red-500" viewBox="0 0 24 24">
                  <path d="M12 2C11.5 3 10 4 8 4C6.5 4 5.5 3.5 5 2.5C4 4 3 6.5 3 10C3 16.5 8 22 12 22C16 22 21 16.5 21 10C21 6.5 20 4 19 2.5C18.5 3.5 17.5 4 16 4C14 4 12.5 3 12 2Z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="text-white font-black text-lg tracking-wider">BERRY<span className="text-teal-400">VISION</span></span>
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">AI 2.0</span>
                </div>
                <span className="text-white/40 text-[11px] mt-0.5 tracking-tight font-medium">Smart Greenhouse Monitoring</span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
              <a href="#hero" className="text-teal-400 hover:text-teal-300 transition-colors">Trang Chủ</a>
              <a href="#ai-diagnostic" className="text-white/70 hover:text-white transition-colors">Chẩn Đoán AI</a>
              <a href="#spray-map" className="text-white/70 hover:text-white transition-colors">Bản Đồ Phun 2D</a>
              <a href="#features" className="text-white/70 hover:text-white transition-colors">Tính Năng Đột Phá</a>
              <a href="#varieties" className="text-white/70 hover:text-white transition-colors">Giống Dâu Ngoại</a>
              <a href="#reviews" className="text-white/70 hover:text-white transition-colors">Đánh Giá Thực Tế</a>
              <a href="#pipeline" className="text-white/70 hover:text-white transition-colors">Pipeline Studio</a>
            </nav>

            {/* Actions */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="text-teal-400 text-xs rounded-full border border-teal-500/40 px-3.5 py-1.5 bg-teal-950/30 backdrop-blur-md flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                <span className="font-mono">YOLOv8 ONNX: Sẵn Sàng</span>
              </div>
              <a href="#ai-diagnostic" className="bg-gradient-to-r from-red-600 to-red-500 text-white rounded-full px-5 py-2 font-semibold text-sm hover:from-red-500 hover:to-red-600 shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Chẩn Đoán Ngay</span>
              </a>
            </div>

            {/* Mobile menu button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="lg:hidden p-2 text-white/70 hover:text-white"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile menu dropdown */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-b border-white/10 bg-[#070b11]/95 px-6 py-5 flex flex-col gap-4">
              <a onClick={() => setMobileMenuOpen(false)} href="#hero" className="text-teal-400 text-sm font-medium">Trang Chủ</a>
              <a onClick={() => setMobileMenuOpen(false)} href="#ai-diagnostic" className="text-white/70 hover:text-white text-sm font-medium">Chẩn Đoán AI</a>
              <a onClick={() => setMobileMenuOpen(false)} href="#spray-map" className="text-white/70 hover:text-white text-sm font-medium">Bản Đồ Phun 2D</a>
              <a onClick={() => setMobileMenuOpen(false)} href="#features" className="text-white/70 hover:text-white text-sm font-medium">Tính Năng Đột Phá</a>
              <a onClick={() => setMobileMenuOpen(false)} href="#varieties" className="text-white/70 hover:text-white text-sm font-medium">Giống Dâu Ngoại</a>
              <a onClick={() => setMobileMenuOpen(false)} href="#reviews" className="text-white/70 hover:text-white text-sm font-medium">Đánh Giá Thực Tế</a>
              <a onClick={() => setMobileMenuOpen(false)} href="#pipeline" className="text-white/70 hover:text-white text-sm font-medium">Pipeline Studio</a>
            </div>
          )}
        </header>

        {/* 2. HERO SECTION */}
        <section id="hero" className="relative pt-12 pb-24 px-6 lg:px-12 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero */}
            <div className="lg:col-span-7 flex flex-col items-start">
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/40 bg-teal-500/10 px-4 py-1.5 text-xs text-teal-300 font-semibold mb-6 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                <span>NÔNG NGHIỆP CÔNG NGHỆ CAO 4.0</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-6">
                Giám Sát & Điều Phối <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-orange-400">Phun Thuốc Cục Bộ</span> Cho <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Dâu Tây Ngoại Nhập</span>
              </h1>

              <p className="text-white/70 text-base sm:text-lg leading-relaxed max-w-2xl mb-8">
                Hệ thống AI Computer Vision kết hợp Robot tuần tra tự hành bám line trong nhà kính, 
                phát hiện sớm 5 loại bệnh học trên giống dâu <strong>New Zealand & Nhật Bản Hana</strong>, 
                tự động lập bản đồ tọa độ ô lưới (X, Y) giúp <span className="text-teal-400 font-semibold underline decoration-teal-500/50">tiết kiệm 60% lượng thuốc BVTV</span>.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 mb-12">
                <a 
                  href="#ai-diagnostic" 
                  className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-semibold px-7 py-3.5 rounded-xl shadow-[0_0_30px_rgba(239,68,68,0.4)] transition-all flex items-center gap-2.5 hover:scale-[1.02]"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Bắt Đầu Chẩn Đoán AI</span>
                </a>
                <a 
                  href="#spray-map" 
                  className="bg-white/5 hover:bg-white/10 text-teal-300 font-semibold px-7 py-3.5 rounded-xl border border-teal-500/30 hover:border-teal-500/60 backdrop-blur-md transition-all flex items-center gap-2.5"
                >
                  <Layers className="w-5 h-5 text-teal-400" />
                  <span>Xem Bản Đồ Phun 2D</span>
                </a>
              </div>

              {/* Stats ticker */}
              <div className="grid grid-cols-3 gap-6 w-full max-w-xl border-t border-white/10 pt-8">
                <div>
                  <div className="text-3xl lg:text-4xl font-black text-white font-mono">94.8<span className="text-red-500">%</span></div>
                  <div className="text-xs text-white/50 mt-1 uppercase tracking-wider font-medium">Độ Chính Xác mAP50</div>
                </div>
                <div>
                  <div className="text-3xl lg:text-4xl font-black text-teal-400 font-mono">60<span className="text-teal-300">%</span></div>
                  <div className="text-xs text-white/50 mt-1 uppercase tracking-wider font-medium">Giảm Thuốc BVTV</div>
                </div>
                <div>
                  <div className="text-3xl lg:text-4xl font-black text-white font-mono">18<span className="text-orange-400">ms</span></div>
                  <div className="text-xs text-white/50 mt-1 uppercase tracking-wider font-medium">Độ Trễ Suy Luận</div>
                </div>
              </div>
            </div>

            {/* Right Hero - Live Robot Telemetry Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-lg bg-gradient-to-b from-[#0e141f] to-[#070b11] border border-white/15 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl group hover:border-teal-500/40 transition-all duration-300">
                {/* Window header */}
                <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-black/40">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block"></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-white/60 text-xs font-mono">
                    <Activity className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
                    <span>Live Robot Telemetry (Lane 02 - Mid Aisle)</span>
                  </div>
                </div>

                {/* Main Video/Image Frame with Scanning overlay */}
                <div className="relative aspect-video w-full overflow-hidden bg-black/80">
                  <img 
                    src="/demo/disease_dom_trang.jpg" 
                    alt="Robot Macro Crop Feed" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Overlays */}
                  <div className="absolute top-3.5 left-3.5 bg-black/80 backdrop-blur-md border border-white/10 rounded-lg px-3 py-1.5 shadow-lg">
                    <div className="text-[9px] text-white/50 font-semibold tracking-widest">COORDINATE</div>
                    <div className="text-xs font-mono text-white font-bold mt-0.5">X: 02 | Y: 02 (Lane 2)</div>
                  </div>

                  <div className="absolute bottom-3.5 right-3.5 bg-teal-950/80 border border-teal-500/40 backdrop-blur-md rounded-lg px-3 py-1.5 shadow-lg">
                    <div className="text-[9px] text-teal-300/80 font-semibold">DETECTION TARGET</div>
                    <div className="text-xs font-bold text-white mt-0.5 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
                      <span>Bệnh Đốm Trắng</span>
                    </div>
                  </div>

                  {/* Scanning line */}
                  <div className="absolute left-0 right-0 h-[2px] bg-red-500 shadow-[0_0_12px_#ef4444] animate-scan pointer-events-none" />
                </div>

                {/* Footer specs */}
                <div className="p-4 bg-black/30 border-t border-white/10 grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2 text-white/70">
                    <Cpu className="w-4 h-4 text-teal-400 shrink-0" />
                    <span>YOLOv8n ONNX (11.9 MB)</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Robot: E-Puck AGV #01</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. CHẨN ĐOÁN AI (LIVE AI DIAGNOSTIC) */}
        <section id="ai-diagnostic" className="py-20 px-6 lg:px-12 max-w-7xl mx-auto w-full border-t border-white/10">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 px-4 py-1 text-xs text-red-400 font-semibold mb-3">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              <span>YOLOV8 COMPUTER VISION DASHBOARD</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Chẩn Đoán Bệnh Học <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">Thời Gian Thực</span>
            </h2>
            <p className="text-white/60 text-sm sm:text-base mt-3 leading-relaxed">
              Nhấp chọn ảnh chụp macro từ robot hoặc tải ảnh của bạn lên để mô hình YOLOv8 phân tích, 
              khoanh vùng đốm bệnh và xuất phác đồ kê đơn thuốc chính xác tới từng mililit.
            </p>
          </div>

          {/* Diagnostic Layout: 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Sample Gallery & Upload (4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-5">
              <div className="bg-[#0a0f18] border border-white/10 rounded-2xl p-5 backdrop-blur-xl shadow-xl">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-teal-400" />
                    <h3 className="font-bold text-white text-sm">Kho Ảnh Robot Tuần Tra</h3>
                  </div>
                  <span className="text-xs bg-teal-500/10 text-teal-400 border border-teal-500/30 px-2.5 py-0.5 rounded-full font-mono">
                    6 Mẫu Tiêu Biểu
                  </span>
                </div>

                {/* Thumbnails grid */}
                <div className="grid grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                  {sampleCases.map((item, idx) => {
                    const active = selectedCaseIndex === idx && !customUploadUrl;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setSelectedCaseIndex(idx);
                          setCustomUploadUrl(null);
                          setAnalyzed(true);
                        }}
                        className={`relative rounded-xl overflow-hidden border text-left transition-all p-1.5 flex flex-col gap-1.5 ${
                          active 
                            ? 'border-red-500 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.3)]' 
                            : 'border-white/10 bg-black/40 hover:border-white/30'
                        }`}
                      >
                        <div className="aspect-square w-full rounded-lg overflow-hidden bg-black/60 relative">
                          <img 
                            src={item.originalImg} 
                            alt={item.name} 
                            className="w-full h-full object-cover"
                          />
                          {active && (
                            <div className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5">
                              <CheckCircle2 className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                        <span className="text-xs font-semibold text-white/90 truncate px-1">{item.name}</span>
                        <span className="text-[10px] text-white/50 px-1 truncate">{item.coord.split(' ')[1] || 'Ô mẫu'}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom upload button */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <label className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-dashed border-teal-500/40 bg-teal-950/20 hover:bg-teal-950/40 text-teal-300 text-xs font-medium cursor-pointer transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>Tải Ảnh Của Bạn Lên Kiểm Tra</span>
                    <input type="file" accept="image/*" onChange={handleCustomUpload} className="hidden" />
                  </label>
                  {customUploadUrl && (
                    <div className="mt-2 text-xs text-teal-400 flex items-center justify-between px-1">
                      <span>✓ Đã nạp ảnh người dùng</span>
                      <button onClick={() => setCustomUploadUrl(null)} className="text-red-400 hover:underline">Hủy</button>
                    </div>
                  )}
                </div>

                {/* Run Button */}
                <button
                  onClick={handleRunAI}
                  disabled={isAnalyzing}
                  className="mt-4 w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.35)] transition-all flex items-center justify-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Đang Quét Lưới Neural...</span>
                    </>
                  ) : (
                    <>
                      <Scan className="w-4 h-4 text-white" />
                      <span>Chạy AI Phân Tích Đốm Bệnh</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Column: Visualizer & Report Card (8 cols) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="bg-[#0a0f18] border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-xl">
                
                {/* Card Title & Status Badge */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-5 h-5 text-red-500" />
                    <div>
                      <h3 className="text-base font-bold text-white">Kết Quả Phân Tích & Khoanh Vùng YOLOv8</h3>
                      <p className="text-xs text-white/50">{currentCase.diseaseType}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${currentCase.badgeClass}`}>
                      {currentCase.severity}
                    </span>
                  </div>
                </div>

                {/* Side-by-side Images: Original vs Annotated */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                  {/* Original Image */}
                  <div className="relative group rounded-xl overflow-hidden border border-white/10 bg-black/60 aspect-video flex flex-col">
                    <div className="absolute top-2 left-2 z-10 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded text-[11px] text-white/70 font-mono border border-white/10">
                      Ảnh Gốc Từ Robot
                    </div>
                    <img 
                      src={customUploadUrl || currentCase.originalImg} 
                      alt="Original" 
                      className="w-full h-full object-cover"
                    />
                    <button 
                      onClick={() => setZoomModal({ open: true, src: customUploadUrl || currentCase.originalImg, title: 'Ảnh Gốc Độ Phân Giải Cao' })}
                      className="absolute bottom-2 right-2 bg-black/70 hover:bg-black/90 text-white p-1.5 rounded-lg border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Phóng to"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* AI Detection Result */}
                  <div className="relative group rounded-xl overflow-hidden border border-red-500/40 bg-black/60 aspect-video flex flex-col shadow-[0_0_20px_rgba(239,68,68,0.15)]">
                    <div className="absolute top-2 left-2 z-10 bg-red-950/80 border border-red-500/40 backdrop-blur-md px-2.5 py-1 rounded text-[11px] text-red-300 font-mono flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                      <span>AI Detection (Khoanh Vùng Đốm)</span>
                    </div>

                    <img 
                      src={customUploadUrl || (analyzed ? currentCase.annotatedImg : currentCase.originalImg)} 
                      alt="AI Detection" 
                      className={`w-full h-full object-cover transition-opacity duration-300 ${isAnalyzing ? 'opacity-30' : 'opacity-100'}`}
                    />

                    {/* Scanning animation during run */}
                    {isAnalyzing && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
                        <div className="w-10 h-10 border-2 border-red-500 border-t-transparent rounded-full animate-spin mb-2" />
                        <span className="text-xs text-red-400 font-mono">Đang inference trên ONNX Runtime...</span>
                        <div className="absolute left-0 right-0 h-1 bg-red-500 shadow-[0_0_15px_#ef4444] animate-scan" />
                      </div>
                    )}

                    <button 
                      onClick={() => setZoomModal({ open: true, src: customUploadUrl || currentCase.annotatedImg, title: 'Kết Quả Khoanh Vùng YOLOv8 HD' })}
                      className="absolute bottom-2 right-2 bg-black/70 hover:bg-black/90 text-white p-1.5 rounded-lg border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Phóng to"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Summary Metrics Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 bg-black/40 border border-white/10 rounded-xl p-4">
                  <div>
                    <div className="text-[10px] text-white/50 font-bold uppercase tracking-wider">Tọa Độ Ô Lưới Nhà Kính</div>
                    <div className="text-base font-mono font-bold text-teal-400 mt-0.5">{currentCase.coord}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-white/50 font-bold uppercase tracking-wider">Số Điểm Bệnh Phát Hiện</div>
                    <div className="text-base font-mono font-bold text-white mt-0.5">{currentCase.spotCount}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-white/50 font-bold uppercase tracking-wider">Độ Tin Cậy Mô Hình</div>
                    <div className="text-base font-mono font-bold text-emerald-400 mt-0.5">{currentCase.confidence}</div>
                  </div>
                </div>

                {/* Prescription Box */}
                <div className="mt-4 p-4 rounded-xl border border-teal-500/30 bg-teal-950/20">
                  <div className="text-xs font-bold text-teal-400 uppercase tracking-wide flex items-center gap-1.5 mb-1.5">
                    <Droplets className="w-4 h-4" />
                    <span>Đơn Thuốc & Phác Đồ Can Thiệp Đề Xuất:</span>
                  </div>
                  <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                    {currentCase.action}
                  </p>
                </div>

                {/* Bounding Box Table */}
                <div className="mt-5">
                  <div className="text-xs font-bold text-white/70 mb-2 flex items-center justify-between">
                    <span>Tọa độ chi tiết từng Bounding Box:</span>
                    <span className="text-[11px] text-white/40 font-mono">{currentCase.spots.length} đối tượng</span>
                  </div>
                  <div className="overflow-x-auto rounded-lg border border-white/10">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-white/5 text-white/60 text-[11px] border-b border-white/10">
                        <tr>
                          <th className="py-2 px-3">#</th>
                          <th className="py-2 px-3">Nhãn Bệnh</th>
                          <th className="py-2 px-3">Confidence</th>
                          <th className="py-2 px-3">Bounding Box (Pixel)</th>
                          <th className="py-2 px-3">Tâm Chuẩn Hóa</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 bg-black/20">
                        {currentCase.spots.map((s, idx) => (
                          <tr key={idx} className="hover:bg-white/5">
                            <td className="py-2 px-3 text-white/40">{s.id}</td>
                            <td className="py-2 px-3 text-red-400 font-sans font-medium">{s.label}</td>
                            <td className="py-2 px-3 text-emerald-400 font-bold">{s.conf}</td>
                            <td className="py-2 px-3 text-white/70">{s.bbox}</td>
                            <td className="py-2 px-3 text-teal-400">{s.norm}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* 4. BẢN ĐỒ PHUN 2D (2D GREENHOUSE MATRIX) */}
        <section id="spray-map" className="py-20 px-6 lg:px-12 max-w-7xl mx-auto w-full border-t border-white/10">
          <div className="bg-[#0a0f18] border border-white/10 rounded-2xl p-6 lg:p-8 backdrop-blur-xl shadow-2xl">
            
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/40 bg-teal-500/10 px-3 py-0.5 text-xs text-teal-300 font-semibold mb-2">
                  <Layers className="w-3.5 h-3.5" />
                  <span>2D GRID SPRAY PRESCRIPTION</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white">
                  Bản Đồ Điều Phối Phun Thuốc Cục Bộ (2D Matrix)
                </h3>
                <p className="text-white/60 text-xs sm:text-sm mt-1 max-w-2xl">
                  Số hóa không gian 3 luống dâu và 3 lối đi tuần tra của robot Webots AGV. Định vị chính xác từng ô cây nhiễm bệnh để kích hoạt béc phun tương ứng.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleScanAll}
                  disabled={isScanningMatrix}
                  className="bg-red-600 hover:bg-red-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-lg transition-all flex items-center gap-2"
                >
                  <Activity className={`w-4 h-4 ${isScanningMatrix ? 'animate-spin' : ''}`} />
                  <span>{isScanningMatrix ? 'Đang Quét 12 Cây...' : 'Mô Phỏng Quét Toàn Bộ'}</span>
                </button>
                <button
                  onClick={downloadCSV}
                  className="bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/40 font-semibold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4 text-teal-400" />
                  <span>Tải Bảng Phun CSV</span>
                </button>
              </div>
            </div>

            {/* Legend chips */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 my-6 text-xs bg-black/30 p-3 rounded-xl border border-white/5">
              <span className="text-white/40 font-semibold uppercase text-[10px]">Quy ước màu:</span>
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> <span>0: Khỏe mạnh (Không phun)</span></div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-sky-400"></span> <span>1: Đốm trắng (Score 250EC)</span></div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-yellow-400"></span> <span>2: Vàng úa (Vi lượng Fe/Mg)</span></div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-orange-400"></span> <span>3: Khô héo (Ridomil Gold)</span></div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500"></span> <span>4: Cháy lá (Propiconazole)</span></div>
            </div>

            {/* Grid Layout: Matrix on Left (8 cols) + Detail Sidebar on Right (4 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* The 12 Cells Grid */}
              <div className="lg:col-span-8">
                <div className="bg-black/50 border border-white/10 rounded-xl p-4 sm:p-6 relative overflow-hidden">
                  
                  {isScanningMatrix && (
                    <div className="absolute inset-0 bg-teal-500/10 z-20 pointer-events-none flex items-center justify-center backdrop-blur-[1px]">
                      <div className="w-full h-1 bg-teal-400 shadow-[0_0_20px_#14b8a6] animate-scan" />
                    </div>
                  )}

                  {/* Aisle headers */}
                  <div className="grid grid-cols-3 gap-3 text-center mb-4 text-[11px] font-mono text-white/50">
                    <div className="bg-white/5 py-1.5 rounded">LUỐNG TÂY (X = 1)</div>
                    <div className="bg-white/5 py-1.5 rounded">LỐI GIỮA (X = 2)</div>
                    <div className="bg-white/5 py-1.5 rounded">LUỐNG ĐÔNG (X = 3)</div>
                  </div>

                  {/* 12 Greenhouse Cells */}
                  <div className="grid grid-cols-3 gap-3.5 sm:gap-4">
                    {greenhouseCells.map((c) => {
                      const isSelected = activeCell.id === c.id;
                      let bgStyle = 'bg-emerald-950/30 border-emerald-500/30 text-emerald-400 hover:border-emerald-500';
                      if (c.code === 1) bgStyle = 'bg-sky-950/30 border-sky-500/40 text-sky-400 hover:border-sky-400';
                      if (c.code === 2) bgStyle = 'bg-yellow-950/30 border-yellow-500/40 text-yellow-400 hover:border-yellow-400';
                      if (c.code === 3) bgStyle = 'bg-orange-950/30 border-orange-500/40 text-orange-400 hover:border-orange-400';
                      if (c.code === 4) bgStyle = 'bg-red-950/30 border-red-500/40 text-red-400 hover:border-red-400';

                      return (
                        <button
                          key={c.id}
                          onClick={() => setSelectedCell(c)}
                          className={`p-3 sm:p-4 rounded-xl border text-left flex flex-col justify-between transition-all aspect-[4/3] ${bgStyle} ${
                            isSelected ? 'ring-2 ring-white shadow-[0_0_20px_rgba(255,255,255,0.2)] scale-[1.02]' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="font-mono text-xs font-bold text-white">{c.plant}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 border border-white/10">
                              X{c.x}-Y{c.y}
                            </span>
                          </div>

                          <div>
                            <div className="text-xs sm:text-sm font-bold truncate">{c.disease}</div>
                            <div className="text-[10px] text-white/50 font-mono mt-0.5 truncate">{c.chemical}</div>
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-white/40 pt-1 border-t border-white/10 font-mono">
                            <span>Mã: {c.code}</span>
                            <span>{c.conf}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Overall Statistics Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                  <div className="bg-black/30 border border-white/10 rounded-xl p-3">
                    <div className="text-[10px] text-white/40 uppercase font-semibold">Tổng Số Ô Cây</div>
                    <div className="text-xl font-bold font-mono text-white mt-1">12 Cây</div>
                  </div>
                  <div className="bg-black/30 border border-white/10 rounded-xl p-3">
                    <div className="text-[10px] text-white/40 uppercase font-semibold">Ô Cây Khỏe Mạnh</div>
                    <div className="text-xl font-bold font-mono text-emerald-400 mt-1">8 Ô (66.7%)</div>
                  </div>
                  <div className="bg-black/30 border border-white/10 rounded-xl p-3">
                    <div className="text-[10px] text-white/40 uppercase font-semibold">Ô Nhiễm Bệnh</div>
                    <div className="text-xl font-bold font-mono text-red-400 mt-1">4 Ô (33.3%)</div>
                  </div>
                  <div className="bg-black/30 border border-white/10 rounded-xl p-3">
                    <div className="text-[10px] text-white/40 uppercase font-semibold">Tiết Kiệm Hóa Chất</div>
                    <div className="text-xl font-bold font-mono text-teal-400 mt-1">66.7%</div>
                  </div>
                </div>
              </div>

              {/* Sidebar: Details of Clicked Cell */}
              <div className="lg:col-span-4 bg-black/40 border border-white/10 rounded-xl p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-teal-400" />
                    <h4 className="font-bold text-white text-sm">Chi Tiết Ô & Vòi Phun</h4>
                  </div>
                  <span className="text-xs font-mono text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/30">
                    {activeCell.plant}
                  </span>
                </div>

                {/* Plant thumbnail */}
                <div className="rounded-lg overflow-hidden border border-white/10 bg-black aspect-video relative">
                  <img 
                    src={activeCell.img} 
                    alt={activeCell.plant} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/80 px-2 py-1 rounded text-[10px] font-mono text-white border border-white/10">
                    Tọa độ: X={activeCell.x}, Y={activeCell.y}
                  </div>
                </div>

                {/* Details List */}
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-white/50">Vị trí luống:</span>
                    <span className="font-medium text-white">{activeCell.aisle}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-white/50">Bệnh học phát hiện:</span>
                    <span className="font-bold text-red-400">{activeCell.disease}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-white/50">Độ tin cậy AI:</span>
                    <span className="font-mono text-emerald-400 font-bold">{activeCell.conf}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-white/50">Trạng thái béc phun:</span>
                    <span className={`font-mono font-bold ${activeCell.nozzle.includes('Bật') ? 'text-red-400' : 'text-white/50'}`}>
                      {activeCell.nozzle}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-white/50">Liều lượng hóa chất:</span>
                    <span className="font-medium text-teal-300">{activeCell.chemical}</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-[11px] text-white/60 leading-relaxed">
                  💡 <em>Hệ thống PLC tích hợp sẽ chỉ cấp tín hiệu kích hoạt rơ-le van điện từ tại đúng tọa độ này, ngăn chặn ô nhiễm hóa chất toàn luống.</em>
                </div>
              </div>

            </div>

            {/* CSV Table Preview */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-white/50" />
                  <h4 className="font-bold text-white text-sm">Bảng Kế Hoạch Phun Thuốc Cục Bộ (spray_prescription_map.csv)</h4>
                </div>
                <span className="text-xs text-white/40 font-mono">12 Cây Dâu Tây Trong Webots</span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-white/5 text-white/60 text-[11px] border-b border-white/10">
                    <tr>
                      <th className="py-2.5 px-3.5">Cây #</th>
                      <th className="py-2.5 px-3.5">Tọa Độ (X, Y)</th>
                      <th className="py-2.5 px-3.5">Vị Trí Luống</th>
                      <th className="py-2.5 px-3.5">Loại Bệnh Học</th>
                      <th className="py-2.5 px-3.5">Độ Tin Cậy AI</th>
                      <th className="py-2.5 px-3.5">Đơn Thuốc & Biện Pháp Xử Lý</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 bg-black/20">
                    {greenhouseCells.map((c) => (
                      <tr key={c.id} className="hover:bg-white/5">
                        <td className="py-2 px-3.5 text-white/40">{c.plant}</td>
                        <td className="py-2 px-3.5 text-teal-400 font-bold">X:{c.x} | Y:{c.y}</td>
                        <td className="py-2 px-3.5 text-white/70 font-sans">{c.aisle}</td>
                        <td className="py-2 px-3.5 font-sans font-medium">
                          <span className={c.code === 0 ? 'text-emerald-400' : 'text-red-400'}>
                            {c.disease}
                          </span>
                        </td>
                        <td className="py-2 px-3.5 text-emerald-400">{c.conf}</td>
                        <td className="py-2 px-3.5 text-white/80 font-sans">{c.chemical}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </section>

        {/* 5. TÍNH NĂNG ĐỘT PHÁ (BREAKTHROUGH FEATURES) */}
        <section id="features" className="py-20 px-6 lg:px-12 max-w-7xl mx-auto w-full border-t border-white/10">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/40 bg-teal-500/10 px-4 py-1 text-xs text-teal-300 font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CÔNG NGHỆ ĐỘT PHÁ</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Tính Năng Nổi Bật <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Chuẩn Nông Nghiệp 4.0</span>
            </h2>
            <p className="text-white/60 text-sm sm:text-base mt-3 leading-relaxed">
              Giải pháp toàn diện từ thu thập dữ liệu macro, huấn luyện AI bảo vệ sắc tố bệnh cho tới điều khiển van phun cục bộ tiết kiệm hóa chất.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Feature 1 */}
            <div className="bg-[#0a0f18] border border-white/10 rounded-2xl p-6 backdrop-blur-xl hover:border-teal-500/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-5 shadow-[0_0_15px_rgba(20,184,166,0.2)]">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2.5">YOLOv8 Edge AI</h3>
                <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                  Tối ưu kiến trúc YOLOv8-Nano đạt tốc độ 18ms/ảnh trên CPU máy tính trạm, kích thước siêu gọn 11.9 MB chạy offline 100% không cần internet.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-white/10 text-xs font-mono text-teal-400 flex items-center gap-1">
                <span>ONNX Runtime FP16</span> &rarr;
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#0a0f18] border border-white/10 rounded-2xl p-6 backdrop-blur-xl hover:border-red-500/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-5 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2.5">Bảo Toàn Sắc Tố Màu</h3>
                <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                  Pipeline Data Augmentation khóa cứng kênh màu (hsv_h = 0.0), bảo vệ vẹn nguyên sắc tố vàng úa, đốm trắng, viền cháy để chống nhận diện nhầm.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-white/10 text-xs font-mono text-red-400 flex items-center gap-1">
                <span>Color-Preserving Augment</span> &rarr;
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#0a0f18] border border-white/10 rounded-2xl p-6 backdrop-blur-xl hover:border-teal-500/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-5 shadow-[0_0_15px_rgba(20,184,166,0.2)]">
                  <Database className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2.5">Spatial Group Split</h3>
                <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                  Thuật toán phân chia tập 70/15/15 dựa trên mã tọa độ (X, Y), triệt tiêu hoàn toàn hiện tượng rò rỉ dữ liệu (Data Leakage) giữa Train và Test.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-white/10 text-xs font-mono text-teal-400 flex items-center gap-1">
                <span>Zero Data Leakage</span> &rarr;
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-[#0a0f18] border border-white/10 rounded-2xl p-6 backdrop-blur-xl hover:border-orange-500/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 mb-5 shadow-[0_0_15px_rgba(249,115,22,0.2)]">
                  <Droplets className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2.5">Phun Cục Bộ -60%</h3>
                <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                  Tự động xuất file CSV điều khiển van điện từ Solenoid trên dàn phun nhà kính, giảm thiểu hơn 60% hóa chất độc hại thải ra môi trường.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-white/10 text-xs font-mono text-orange-400 flex items-center gap-1">
                <span>Prescription Solenoid Valve</span> &rarr;
              </div>
            </div>

          </div>
        </section>

        {/* 6. GIỐNG DÂU TÂY NGOẠI NHẬP (VARIETIES) */}
        <section id="varieties" className="py-20 px-6 lg:px-12 max-w-7xl mx-auto w-full border-t border-white/10">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 px-4 py-1 text-xs text-red-400 font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CÂY TRỒNG ĐẶC SẢN GIÁ TRỊ CAO</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Giống Dâu Tây <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">Ngoại Nhập Khảo Sát</span>
            </h2>
            <p className="text-white/60 text-sm sm:text-base mt-3 leading-relaxed">
              Mô hình BerryVision AI được tinh chỉnh đặc thù cho các giống dâu tây giá trị kinh tế cao tại Đà Lạt và các nhà kính công nghệ cao.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Variety 1: Hana Nhật Bản */}
            <div className="bg-[#0a0f18] border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl group hover:border-red-500/40 transition-all duration-300">
              <div className="aspect-[16/9] w-full overflow-hidden bg-black relative">
                <img 
                  src="/demo/strawberry_foreign_1.jpg" 
                  alt="Dâu Hana Nhật Bản" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-red-950/80 border border-red-500/40 px-3 py-1 rounded-full text-xs font-bold text-red-300">
                  Tochiotome - Nhật Bản
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">Dâu Tây Hana Nhật Bản (Hana Ichigo)</h3>
                <p className="text-xs sm:text-sm text-white/70 leading-relaxed mb-4">
                  Giống dâu nổi tiếng với độ ngọt đậm (Brix 12-14), thịt quả mọng nước, hương thơm thanh tao. 
                  Tuy nhiên, giống này có lớp biểu bì mỏng, rất mẫn cảm với <strong>bệnh đốm trắng và cháy rìa lá</strong> khi độ ẩm vượt quá 85%.
                </p>

                <div className="grid grid-cols-2 gap-3 text-xs bg-black/30 p-3.5 rounded-xl border border-white/5 font-mono">
                  <div>
                    <span className="text-white/40 block">Nhiệt độ tối ưu:</span>
                    <span className="text-teal-400 font-bold">18°C - 22°C</span>
                  </div>
                  <div>
                    <span className="text-white/40 block">Ẩm độ tiêu chuẩn:</span>
                    <span className="text-teal-400 font-bold">70% - 78%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Variety 2: New Zealand */}
            <div className="bg-[#0a0f18] border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl group hover:border-teal-500/40 transition-all duration-300">
              <div className="aspect-[16/9] w-full overflow-hidden bg-black relative">
                <img 
                  src="/demo/strawberry_foreign_2.jpg" 
                  alt="Dâu New Zealand" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-teal-950/80 border border-teal-500/40 px-3 py-1 rounded-full text-xs font-bold text-teal-300">
                  Camarosa - New Zealand
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">Dâu Tây New Zealand</h3>
                <p className="text-xs sm:text-sm text-white/70 leading-relaxed mb-4">
                  Trái to hình nón cân đối, thịt giòn cứng, màu đỏ tươi bắt mắt, khả năng chống dập nát khi vận chuyển xuất sắc. 
                  Bộ rễ nhạy cảm với ngập úng, dễ phát sinh <strong>khô héo và thối rễ do nấm Fusarium</strong> nếu giá thể không thoát nước tốt.
                </p>

                <div className="grid grid-cols-2 gap-3 text-xs bg-black/30 p-3.5 rounded-xl border border-white/5 font-mono">
                  <div>
                    <span className="text-white/40 block">Nhiệt độ tối ưu:</span>
                    <span className="text-teal-400 font-bold">16°C - 24°C</span>
                  </div>
                  <div>
                    <span className="text-white/40 block">Ẩm độ tiêu chuẩn:</span>
                    <span className="text-teal-400 font-bold">65% - 75%</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 7. ĐÁNH GIÁ THỰC TẾ & KẾT QUẢ NCKH (REVIEWS) */}
        <section id="reviews" className="py-20 px-6 lg:px-12 max-w-7xl mx-auto w-full border-t border-white/10">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/40 bg-teal-500/10 px-4 py-1 text-xs text-teal-300 font-semibold mb-3">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>KẾT QUẢ NGHIÊN CỨU KHOA HỌC</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Số Liệu Thực Nghiệm & <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Đánh Giá Khoa Học</span>
            </h2>
            <p className="text-white/60 text-sm sm:text-base mt-3 leading-relaxed">
              Các chỉ số thống kê minh chứng tính vượt trội của thuật toán phát hiện bệnh và điều phối phun thuốc tự động.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-[#0a0f18] border border-white/10 rounded-2xl p-6 text-center backdrop-blur-xl">
              <div className="text-4xl sm:text-5xl font-black font-mono text-teal-400 mb-2">94.8%</div>
              <div className="text-sm font-bold text-white mb-1">Độ Chính Xác Nhận Diện mAP@50</div>
              <p className="text-xs text-white/50">Đo lường trên tập kiểm thử độc lập 15% không bị rò rỉ không gian.</p>
            </div>

            <div className="bg-[#0a0f18] border border-white/10 rounded-2xl p-6 text-center backdrop-blur-xl">
              <div className="text-4xl sm:text-5xl font-black font-mono text-red-400 mb-2">-60.4%</div>
              <div className="text-sm font-bold text-white mb-1">Giảm Lượng Thuốc Trừ Sâu BVTV</div>
              <p className="text-xs text-white/50">So sánh trực tiếp với phương pháp phun mù sương toàn luống truyền thống.</p>
            </div>

            <div className="bg-[#0a0f18] border border-white/10 rounded-2xl p-6 text-center backdrop-blur-xl">
              <div className="text-4xl sm:text-5xl font-black font-mono text-orange-400 mb-2">18.2ms</div>
              <div className="text-sm font-bold text-white mb-1">Thời Gian Suy Luận Khung Hình</div>
              <p className="text-xs text-white/50">Đạt hơn 50 FPS, phản hồi lập tức khi robot di chuyển qua cây.</p>
            </div>
          </div>

          {/* Testimonial Quote */}
          <div className="bg-gradient-to-r from-teal-950/30 via-[#0a0f18] to-red-950/20 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
            <p className="text-base sm:text-lg text-white/80 italic leading-relaxed text-center max-w-4xl mx-auto">
              “Việc tích hợp camera macro cùng hệ thống béc phun cục bộ điều khiển qua bản đồ tọa độ số đã giải quyết triệt để bài toán tồn dư hóa chất trên quả dâu tây xuất khẩu. Đây là bước đột phá thiết thực cho các nông trại nhà kính thông minh tại Việt Nam.”
            </p>
            <div className="text-center mt-4">
              <span className="text-sm font-bold text-white">Hội Đồng Nghiên Cứu Khoa Học Nông Nghiệp Công Nghệ Cao</span>
              <span className="text-xs text-teal-400 block mt-0.5">Dự Án BerryVision AI Greenhouse</span>
            </div>
          </div>
        </section>

        {/* 8. PIPELINE STUDIO */}
        <section id="pipeline" className="py-20 px-6 lg:px-12 max-w-7xl mx-auto w-full border-t border-white/10">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 px-4 py-1 text-xs text-red-400 font-semibold mb-3">
              <Cpu className="w-3.5 h-3.5" />
              <span>END-TO-END PIPELINE ARCHITECTURE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Pipeline Studio <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-teal-400">4 Giai Đoạn</span>
            </h2>
            <p className="text-white/60 text-sm sm:text-base mt-3 leading-relaxed">
              Quy trình kỹ thuật khép kín từ mô phỏng robot, xử lý ảnh vi thể, huấn luyện AI cho tới xuất bản đồ phun.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-[#0a0f18] border border-white/10 rounded-2xl p-6 backdrop-blur-xl relative">
              <div className="text-xs font-mono text-teal-400 font-bold mb-2">STAGE 01</div>
              <h3 className="text-base font-bold text-white mb-2">Webots AGV Simulation</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Robot bám line trong môi trường 3D Webots, sử dụng camera góc nghiêng 45° chụp ảnh macro lá dâu tại từng tọa độ định vị.
              </p>
            </div>

            <div className="bg-[#0a0f18] border border-white/10 rounded-2xl p-6 backdrop-blur-xl relative">
              <div className="text-xs font-mono text-red-400 font-bold mb-2">STAGE 02</div>
              <h3 className="text-base font-bold text-white mb-2">dHash & Roboflow</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Thuật toán Difference Hash loại bỏ 100% ảnh trùng lặp khi robot dừng lại, sau đó gán nhãn và tăng cường dữ liệu bảo toàn sắc tố.
              </p>
            </div>

            <div className="bg-[#0a0f18] border border-white/10 rounded-2xl p-6 backdrop-blur-xl relative">
              <div className="text-xs font-mono text-teal-400 font-bold mb-2">STAGE 03</div>
              <h3 className="text-base font-bold text-white mb-2">YOLOv8 & ONNX Export</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Huấn luyện mô hình với hàm mất mát CIoU Loss, lượng tử hóa và xuất sang định dạng ONNX phục vụ suy luận thời gian thực trên vi xử lý nhúng.
              </p>
            </div>

            <div className="bg-[#0a0f18] border border-white/10 rounded-2xl p-6 backdrop-blur-xl relative">
              <div className="text-xs font-mono text-orange-400 font-bold mb-2">STAGE 04</div>
              <h3 className="text-base font-bold text-white mb-2">PLC & Solenoid Spray</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Bản đồ tọa độ 2D được chuyển thành lệnh điều khiển đóng ngắt van điện từ Solenoid qua giao thức Modbus TCP / MQTT công nghiệp.
              </p>
            </div>

          </div>
        </section>

        {/* 9. FOOTER */}
        <footer className="border-t border-white/10 bg-[#030508] py-12 px-6 lg:px-12 text-center text-xs text-white/40">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/50 flex items-center justify-center text-red-500">
                <span className="font-bold text-xs">BV</span>
              </div>
              <span className="text-white/70 font-semibold">BerryVision AI - Đề Tài Nghiên Cứu Khoa Học (NCKH) 2026</span>
            </div>

            <div className="flex items-center gap-6">
              <a href="#hero" className="hover:text-white transition-colors">Trang Chủ</a>
              <a href="#ai-diagnostic" className="hover:text-white transition-colors">Chẩn Đoán AI</a>
              <a href="#spray-map" className="hover:text-white transition-colors">Bản Đồ Phun 2D</a>
              <a href="https://github.com/nhtien2410-commits/Tie" target="_blank" rel="noreferrer" className="text-teal-400 hover:text-teal-300 flex items-center gap-1">
                <span>GitHub Repo</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
          <div className="mt-8 text-[11px] text-white/30">
            Hệ thống Giám sát & Điều phối Phun thuốc Cục bộ Cho Dâu Tây Ngoại Nhập © 2026. All rights reserved.
          </div>
        </footer>

      </div>

      {/* LIGHTBOX MODAL */}
      {zoomModal.open && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setZoomModal({ open: false, src: '', title: '' })}
        >
          <div className="relative max-w-4xl w-full bg-[#0a0f18] border border-white/20 rounded-2xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between bg-black/50">
              <span className="font-bold text-sm text-white">{zoomModal.title}</span>
              <button 
                onClick={() => setZoomModal({ open: false, src: '', title: '' })}
                className="text-white/60 hover:text-white p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2 bg-black flex items-center justify-center max-h-[80vh] overflow-hidden">
              <img src={zoomModal.src} alt="Zoom Preview" className="max-h-[75vh] w-auto object-contain rounded-lg" />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
