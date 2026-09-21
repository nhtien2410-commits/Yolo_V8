import React from 'react';
import { Menu } from 'lucide-react';

export default function App() {
  return (
    <div className="w-full min-h-screen bg-[#05070a] relative overflow-hidden font-sans">
      {/* Glow góc trên trái: gradient radial đỏ (#ef4444) mờ dần sang xanh ngọc (#14b8a6), opacity thấp (~15-20%), blur lớn */}
      <div 
        className="absolute -top-48 -left-48 w-[650px] h-[650px] rounded-full pointer-events-none blur-[140px]"
        style={{
          background: 'radial-gradient(circle, rgba(239,68,68,0.18) 0%, rgba(20,184,166,0.15) 50%, rgba(5,7,10,0) 80%)'
        }}
      />

      {/* Đường kẻ dọc mảnh màu đỏ (#ef4444) sát mép phải màn hình, cao toàn viewport, opacity ~40% */}
      <div className="absolute top-0 right-0 w-[1px] h-full bg-[#ef4444]/40 z-0 pointer-events-none" />

      {/* Nội dung trong relative z-10 */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navbar */}
        <nav className="flex items-center justify-between px-8 lg:px-16 py-5">
          {/* Trái: icon logo (dâu tây nhỏ trong khung bo góc đỏ) + text 2 dòng */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-500/10 border border-[#ef4444] flex items-center justify-center text-red-500 shadow-sm">
              <svg className="w-5 h-5 fill-current text-[#ef4444]" viewBox="0 0 24 24">
                <path d="M12 2C11.5 3 10 4 8 4C6.5 4 5.5 3.5 5 2.5C4 4 3 6.5 3 10C3 16.5 8 22 12 22C16 22 21 16.5 21 10C21 6.5 20 4 19 2.5C18.5 3.5 17.5 4 16 4C14 4 12.5 3 12 2Z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1 leading-none">
                <span className="text-white font-bold text-base tracking-wider">BERRYVISION</span>
                <span className="text-[#14b8a6] font-bold text-base tracking-wider">AI</span>
              </div>
              <span className="text-white/40 text-xs mt-0.5">Smart Greenhouse Monitoring</span>
            </div>
          </div>

          {/* Giữa: nav links ẩn trên mobile, hiện từ lg */}
          <div className="hidden lg:flex items-center gap-7">
            <a href="#home" className="text-[#14b8a6] text-sm font-medium">Trang Chủ</a>
            <a href="#ai-diagnostic" className="text-white/70 hover:text-white text-sm font-medium transition-colors">Chẩn Đoán AI</a>
            <a href="#spray-map" className="text-white/70 hover:text-white text-sm font-medium transition-colors">Bản Đồ Phun 2D</a>
            <a href="#features" className="text-white/70 hover:text-white text-sm font-medium transition-colors">Tính Năng Đột Phá</a>
            <a href="#varieties" className="text-white/70 hover:text-white text-sm font-medium transition-colors">Giống Dâu Ngoại</a>
            <a href="#reviews" className="text-white/70 hover:text-white text-sm font-medium transition-colors">Đánh Giá Thực Tế</a>
            <a href="#pipeline" className="text-white/70 hover:text-white text-sm font-medium transition-colors">Pipeline Studio</a>
          </div>

          {/* Phải (desktop) */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="pill-status text-teal-400 text-xs rounded-full border border-teal-500/40 px-4 py-1.5 bg-transparent flex items-center gap-1.5">
              <span>🟢</span>
              <span>YOLOv8 ONNX: Đã Sẵn Sàng (12 ảnh)</span>
            </div>
            <button className="bg-[#ef4444] text-white rounded-full px-5 py-2 font-semibold text-sm hover:bg-red-600 transition-colors">
              ⚡ Chẩn Đoán Ngay
            </button>
          </div>

          {/* Trên mobile: chỉ hiện logo + hamburger button (không cần dựng menu overlay, chỉ đặt nút hamburger) */}
          <button className="lg:hidden text-white/70 hover:text-white p-2" aria-label="Menu">
            <Menu className="w-6 h-6" />
          </button>
        </nav>

        {/* Hero content */}
        <div className="flex-1 flex items-center">
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-8 lg:px-16 pt-16 pb-20 max-w-7xl mx-auto">
            {/* Cột trái */}
            <div className="flex flex-col items-start">
              {/* 1. Badge pill */}
              <div className="inline-flex items-center gap-2 bg-white/[0.03] border border-teal-500/20 text-teal-400 text-xs font-medium rounded-full px-4 py-1.5 mb-6">
                <span className="w-2 h-2 rounded-full bg-[#ef4444] animate-pulse"></span>
                <span>🔴 NÔNG NGHIỆP CÔNG NGHỆ CAO 4.0</span>
              </div>

              {/* 2. H1 3 dòng */}
              <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl leading-tight">
                <span className="text-white block">Giám Sát & Điều Phối</span>
                <span className="block mt-1">
                  <span className="text-[#ef4444]">Phun Thuốc Cục Bộ</span>
                  <span className="text-white"> Cho</span>
                </span>
                <span className="block mt-1 bg-gradient-to-r from-[#14b8a6] to-green-400 bg-clip-text text-transparent">
                  Dâu Tây Ngoại Nhập
                </span>
              </h1>

              {/* 3. Đoạn mô tả */}
              <p className="text-white/60 text-base max-w-lg leading-relaxed mt-6">
                Hệ thống AI Computer Vision kết hợp Robot tuần tra tự hành bám line trong nhà kính, phát hiện sớm 5 loại bệnh học trên giống dâu <strong className="font-bold text-white">New Zealand & Nhật Bản Hana</strong>, tự động lập bản đồ tọa độ ô lưới (X, Y) giúp giảm 60% dư lượng thuốc bảo vệ thực vật.
              </p>

              {/* 4. Hàng nút */}
              <div className="flex flex-wrap gap-4 mt-8">
                <button className="bg-[#ef4444] hover:bg-red-600 text-white rounded-full px-6 py-3 font-semibold transition-colors">
                  🔍 Bắt Đầu Chẩn Đoán AI
                </button>
                <button className="border border-white/15 bg-white/5 text-white rounded-full px-6 py-3 hover:bg-white/10 transition-colors">
                  📋 Xem Bản Đồ Phun 2D
                </button>
              </div>

              {/* 5. Grid 4 stat card */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 w-full">
                <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
                  <div className="text-teal-400 text-3xl font-bold">99.2%</div>
                  <div className="text-white/50 text-xs mt-1">Độ Chuẩn Xác mAP@0.5</div>
                </div>
                <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
                  <div className="text-red-400 text-3xl font-bold">18</div>
                  <div className="text-white/50 text-xs mt-1">Tốc Độ Suy Luận CPU (ms)</div>
                </div>
                <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
                  <div className="text-white text-3xl font-bold">60</div>
                  <div className="text-white/50 text-xs mt-1">Tiết Kiệm Thuốc BVTV</div>
                </div>
                <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
                  <div className="text-teal-400 text-3xl font-bold">5</div>
                  <div className="text-white/50 text-xs mt-1">Lớp Bệnh Nhận Diện</div>
                </div>
              </div>
            </div>

            {/* Cột phải — Card "Live Robot Telemetry" */}
            <div className="w-full flex justify-center">
              <div className="w-full max-w-lg bg-[#0a0d12] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                {/* Header giả cửa sổ mac */}
                <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block"></span>
                  </div>
                  <span className="text-white/40 text-xs">🛰️ Live Robot Telemetry: Lane 02 (Mid Aisle)</span>
                </div>

                {/* Ảnh chính */}
                <div className="relative aspect-video w-full overflow-hidden bg-black/60">
                  <img 
                    src="/strawberry_telemetry.jpg" 
                    alt="Strawberry Crop Telemetry" 
                    className="w-full h-full object-cover"
                  />

                  {/* Overlay trên ảnh (absolute, positioned) */}
                  {/* Góc trên trái: badge dark "COORDINATE" + "X: 03 | Y: 02" */}
                  <div className="absolute top-4 left-4 bg-black/75 backdrop-blur-md border border-white/10 rounded-lg px-3 py-1.5 shadow-lg">
                    <div className="text-[10px] text-white/50 font-medium tracking-wider leading-none">COORDINATE</div>
                    <div className="text-sm font-mono text-white font-bold mt-0.5">X: 03 | Y: 02</div>
                  </div>

                  {/* Góc dưới phải: badge nền teal/90: "TARGET CROP" + "Dâu New Zealand" */}
                  <div className="absolute bottom-4 right-4 bg-[#14b8a6]/90 backdrop-blur-md rounded-lg px-3 py-1.5 shadow-lg">
                    <div className="text-[10px] text-white/70 font-medium leading-none">TARGET CROP</div>
                    <div className="text-sm font-bold text-white mt-0.5">Dâu New Zealand</div>
                  </div>

                  {/* 1 đường quét ngang màu đỏ mờ (scanning line), animate di chuyển dọc ảnh liên tục */}
                  <div className="absolute left-0 right-0 h-[2px] bg-[#ef4444]/80 shadow-[0_0_10px_#ef4444] animate-scan pointer-events-none" />
                </div>

                {/* Footer dưới ảnh */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-white/10 text-xs text-white/40">
                  <span>🎯 Model: YOLOv8-Nano (11.9MB)</span>
                  <span>🤖 Robot ID: E-Puck AGV #01</span>
                </div>
              </div>
            </div>
          </div>
        {/* --- CÁC PHẦN NỘI DUNG MỚI ĐƯỢC THÊM VÀO ĐỂ NÚT BẤM HOẠT ĐỘNG --- */}
        
        <div id="ai-diagnostic" className="w-full min-h-[60vh] flex flex-col items-center justify-center border-t border-white/10 px-8 py-20">
          <h2 className="text-4xl font-bold text-white mb-6">Chẩn Đoán AI</h2>
          <p className="text-white/60 text-lg max-w-2xl text-center">
            Hệ thống sử dụng YOLOv8 để phân tích hình ảnh và phát hiện các loại bệnh nấm, đốm lá trên dâu tây với độ chính xác cao.
          </p>
        </div>

        <div id="spray-map" className="w-full min-h-[60vh] flex flex-col items-center justify-center border-t border-white/10 px-8 py-20 bg-[#0a0d12]">
          <h2 className="text-4xl font-bold text-[#14b8a6] mb-6">Bản Đồ Phun 2D</h2>
          <p className="text-white/60 text-lg max-w-2xl text-center">
            Lưới tọa độ 2D của nhà kính được số hóa. Các điểm đỏ hiển thị ô cây đang bị bệnh cần phun thuốc cục bộ.
          </p>
        </div>

        <div id="features" className="w-full min-h-[60vh] flex flex-col items-center justify-center border-t border-white/10 px-8 py-20">
          <h2 className="text-4xl font-bold text-white mb-6">Tính Năng Đột Phá</h2>
          <p className="text-white/60 text-lg max-w-2xl text-center">
            Camera Macro cận cảnh + Kính phân cực CPL + LED Strobe giúp nhìn rõ bề mặt lá mà không bị chói sáng.
          </p>
        </div>

        <div id="varieties" className="w-full min-h-[60vh] flex flex-col items-center justify-center border-t border-white/10 px-8 py-20 bg-[#0a0d12]">
          <h2 className="text-4xl font-bold text-[#ef4444] mb-6">Giống Dâu Ngoại</h2>
          <p className="text-white/60 text-lg max-w-2xl text-center">
            Hỗ trợ giám sát các giống dâu cao cấp như New Zealand, Nhật Bản Hana...
          </p>
        </div>

        <div id="reviews" className="w-full min-h-[60vh] flex flex-col items-center justify-center border-t border-white/10 px-8 py-20">
          <h2 className="text-4xl font-bold text-white mb-6">Đánh Giá Thực Tế</h2>
          <p className="text-white/60 text-lg max-w-2xl text-center">
            Giảm 70% lượng hóa chất bảo vệ thực vật, tiết kiệm chi phí đầu tư ban đầu so với hệ thống camera cố định.
          </p>
        </div>

        <div id="pipeline" className="w-full min-h-[60vh] flex flex-col items-center justify-center border-t border-white/10 px-8 py-20 bg-[#0a0d12]">
          <h2 className="text-4xl font-bold text-[#14b8a6] mb-6">Pipeline Studio</h2>
          <p className="text-white/60 text-lg max-w-2xl text-center">
            Xem trực tiếp quá trình tiền xử lý ảnh và bóc tách đặc trưng của mạng nơ-ron tích chập AI.
          </p>
        </div>

        {/* --- KẾT THÚC CÁC PHẦN THÊM MỚI --- */}

        </div>
      </div>
    </div>
  );
}
