# 🍓 BerryVisionAI 3D — Không Gian Triển Lãm Số Nhà Kính Thông Minh 4.0

Ứng dụng Web 3D Spatial Universe tương tác cao cấp dành cho đề tài NCKH: **Hệ Thống AI Phân Loại Bệnh Dâu Tây & Robot Tự Hành Nhà Kính**.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

- **Framework:** React 18 + Vite + TypeScript
- **3D Engine:** Three.js qua React Three Fiber (`@react-three/fiber`)
- **3D Helpers:** `@react-three/drei` (OrbitControls, Float, Html, Sparkles, Environment, PerformanceMonitor)
- **Styling:** Tailwind CSS + Glassmorphism Tokens
- **Animations:** Framer Motion
- **Âm thanh Tương tác:** Web Audio API Pure Synthesizer (Không phụ thuộc file ngoài)

---

## 🪐 5 Phân Khu Không Gian Triển Lãm 3D

1. **Zone 01 - Cyber Greenhouse Core (Vòm Kính Sinh Thái):**
   - Vòm kính Geodesic phát sáng neon cyan/emerald.
   - Giàn treo thủy canh A-Frame dâu tây cùng quả đỏ mọng.
   - Hệ thống hạt bào tử / phấn hoa phát quang sinh học bay theo xoáy gió.

2. **Zone 02 - Agribot Rover Lab (Robot Tự Hành Webots):**
   - Mô hình 3D Robot 4 bánh xích địa hình với cụm đèn pha LED.
   - Tháp LiDAR laser xanh xoay 360° quét không gian.
   - Cụm tháp camera stereo RGB chuyển động tìm kiếm bệnh.
   - Giàn 4 béc phun áp lực cao phát hiệu ứng hạt sương mù khi nhấn test.

3. **Zone 03 - Holographic Disease Diagnostic Lab (Phòng Thí Nghiệm AI 5 Lớp):**
   - Trái dâu tây & cành lá 3D tương tác biến đổi hình thái theo 5 bệnh:
     - **Cháy Rìa Lá (Leaf Scorch):** Độ tin cậy **99.3%** với viền lá cháy khô.
     - **Bệnh Đốm Trắng:** Độ tin cậy **90.1%** với chấm nấm tròn.
     - **Lá Vàng Úa:** Độ tin cậy **84.2%** với triệu chứng thiếu đạm.
     - **Héo Rũ / Thối Rễ:** Độ tin cậy **51.5%** với cành rũ.
     - **Khỏe Mạnh:** Độ tin cậy **88.9%** với tán lá xanh mướt.
   - Khung 3D Bounding Box laser & phác đồ điều trị nông học.

4. **Zone 04 - Spatial 3D Spray Matrix (Ma Trận 24 Luống Trồng):**
   - Bản đồ 3D tọa độ 24 ô ($X01 \dots X06, Y01 \dots Y04$) hiển thị trạng thái từng luống.
   - Click vào ô để xem thông số vi khí hậu (EC, pH, độ ẩm đất, nhiệt độ) và ra lệnh phun thuốc điểm.

5. **Zone 05 - Neural Brain & Telemetry Nexus (Bộ Não YOLOv8 & API):**
   - Cấu trúc mạng nơ-ron 3D đa tầng với các liên kết synaptic phát sáng.
   - Kết nối trực tiếp máy chủ AI Python (`http://localhost:5000`).

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Ứng Dụng

### 1. Cài đặt các thư viện phụ thuộc:
```bash
cd berryvision_3d_web
npm install
```

### 2. Khởi chạy máy chủ phát triển (Dev Server):
```bash
npm run dev
```
Trình duyệt sẽ tự động mở hoặc truy cập tại: **`http://localhost:5173`**

### 3. Build gói sản phẩm (Production Bundle):
```bash
npm run build
```

---

## 🎮 Hướng Dẫn Tương Tác:

- **Cuộn chuột (Mouse Wheel / Touch Swipe):** Lướt camera điện ảnh qua từng phân khu triển lãm.
- **Nút Chế Độ Camera (Góc phải trên):** Chuyển đổi giữa chế độ **CINEMATIC** và chế độ **DRONE 360° (OrbitControls)** để tự do xoay ngắm mọi góc độ.
- **Bảng Chọn 5 Bệnh Học:** Bấm chọn từng loại bệnh để xem lá dâu 3D biến đổi màu sắc, xuất hiện vết cháy rìa lá và hộp 3D Bounding Box!
- **Nút Test Phun Thuốc 3D (Trên Robot):** Kích hoạt hệ thống phun sương mù hạt nano áp suất cao.
- **Nút Loa:** Bật / tắt hiệu ứng âm thanh không gian tương lai.
