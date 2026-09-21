# 🍓 HƯỚNG DẪN VẬN HÀNH PIPELINE AI PHÂN LOẠI BỆNH DÂU TÂY & BẢN ĐỒ PHUN THUỐC
**Dự án:** Robot Nhà Kính Tự Hành Bám Line Phát Hiện Bệnh Cây Dâu Tây  
**Tác giả:** Đội ngũ NCKH & Kỹ sư AI / Computer Vision

---

## 📂 CẤU TRÚC THƯ MỤC PIPELINE (`ai_pipeline/`)

```text
ai_pipeline/
├── 01_preprocess_and_autolabel.py    # [Bước 1 & 2] Khử trùng ảnh, 640x640, sinh bounding box, Augmentation
├── 02_spatial_dataset_split.py       # [Bước 3] Chia tập 70/15/15 theo ô tọa độ (chống Data Leakage)
├── 03_train_colab.py                 # [Bước 4] Huấn luyện YOLOv8-Nano trên Colab GPU T4
├── 04_evaluate_model.py              # [Bước 5] Đánh giá Precision, Recall, F1, mAP@0.5, Confusion Matrix
├── 05_export_onnx.py                 # [Bước 6A] Xuất mô hình sang định dạng ONNX (6MB)
├── 06_infer_single_image.py          # [Bước 6B] Dự đoán 1 ảnh, in tọa độ pixel & vẽ box
├── 07_generate_spray_map.py          # [Bước 7] Quét toàn bộ ảnh robot -> CSV & Bản đồ phun thuốc 2D
├── colab_strawberry_yolov8.ipynb     # File Jupyter Notebook 1-Click chạy trên Google Colab
└── README_HUONG_DAN.md               # Tài liệu hướng dẫn chi tiết này
```

---

## 🚀 QUY TRÌNH THỰC HIỆN TỪNG BƯỚC

### 🔹 GIAI ĐOẠN 1: CHUẨN BỊ DỮ LIỆU (CHẠY TRÊN MÁY TÍNH CỤC BỘ)

#### Bước 1: Tiền xử lý & Tự động gắn nhãn (Auto-Labeling)
1. Gom ảnh đã chụp vào thư mục: `C:/Users/ADMIN/Downloads/NCKH/captured_images/`
2. Mở Terminal / PowerShell và chạy:
   ```bash
   cd C:/Users/ADMIN/Downloads/NCKH/ai_pipeline
   python 01_preprocess_and_autolabel.py
   ```
* **Kết quả:** Sinh ra thư mục `processed_dataset/` chứa toàn bộ ảnh đã resize $640\times 640$, lọc ảnh trùng và tự động sinh file nhãn `.txt` chuẩn YOLOv8.

#### Bước 2: Chia tập Train / Val / Test (70 / 15 / 15) theo ô tọa độ
Chạy lệnh:
```bash
python 02_spatial_dataset_split.py
```
* **Kết quả:** Sinh ra thư mục `dataset/` (gồm `images/`, `labels/`, `data.yaml`) sẵn sàng nạp vào YOLOv8.
* **Đóng gói:** Nén thư mục `dataset` thành file **`dataset.zip`**.

---

### 🔹 GIAI ĐOẠN 2: HUẤN LUYỆN TRÊN GOOGLE COLAB (GPU T4 MIỄN PHÍ)

1. Truy cập [Google Colab](https://colab.research.google.com/) và chọn **Upload notebook** $\to$ Chọn file `colab_strawberry_yolov8.ipynb`.
2. Trên thanh menu Colab: **Runtime** $\to$ **Change runtime type** $\to$ Chọn **T4 GPU** $\to$ **Save**.
3. Tải file `dataset.zip` lên Colab và nhấn nút **Run All** (hoặc chạy từng ô từ trên xuống dưới):
   * Tự động giải nén dataset.
   * Tự động huấn luyện mô hình YOLOv8-Nano với tham số bảo vệ sắc tố bệnh (`hsv_h=0.0`).
   * Tự động đánh giá chỉ số Precision, Recall, mAP50 từng lớp và vẽ Confusion Matrix.
   * Tự động export ra file `best.onnx` và tải về máy tính của bạn.

---

### 🔹 GIAI ĐOẠN 3: TRIỂN KHAI NGOẠI TUYẾN & ĐIỀU PHỐI PHUN THUỐC

Copy file `best.onnx` tải từ Colab về đặt tại: `C:/Users/ADMIN/Downloads/NCKH/best.onnx`.

#### 1. Kiểm tra thử trên 1 ảnh bất kỳ:
```bash
python 06_infer_single_image.py
```
* **Kết quả:** In ra loại bệnh, độ tin cậy và tọa độ Bounding Box $[X_1, Y_1, X_2, Y_2]$, đồng thời lưu ảnh kết quả vào `inference_results/`.

#### 2. Phân tích toàn bộ lượt chạy của Robot & Tạo bản đồ phun thuốc:
```bash
python 07_generate_spray_map.py
```
* **Kết quả:**
  1. File CSV: `spray_reports/spray_prescription_map.csv` gồm đúng 4 cột chuẩn:
     $$\mathbf{[X, Y, nhan\_benh, do\_tin\_cay]}$$
  2. Bản đồ nhiệt 2D: `spray_reports/greenhouse_spray_map.png` thể hiện trực quan toàn bộ các ô dâu tây cần xử lý thuốc trong nhà kính!

---

## 🎯 DANH MỤC 5 LỚP BỆNH VÀ MÃ MÀU

| Class ID | Tên Nhãn | Tên Tiếng Việt | Màu Bounding Box | Biện Pháp Can Thiệp |
| :---: | :---: | :---: | :---: | :---: |
| **0** | `khoe_manh` | Cây khỏe mạnh | Xanh lá (Green) | Duy trì tưới tiêu bình thường |
| **1** | `dom_trang` | Bệnh đốm trắng lá | Trắng (White) | Phun thuốc trị nấm cục bộ |
| **2** | `vang_ua` | Lá vàng úa | Vàng (Yellow) | Bổ sung vi lượng / Đạm qua lá |
| **3** | `kho_heo` | Héo rũ / thối rễ | Cam (Orange) | Phun thuốc đặc trị / cách ly |
| **4** | `chay_la` | Cháy rìa lá | Đỏ (Red) | Tỉa lá bệnh + phun chống cháy |

---
*Chúc bạn thực hiện đề tài Nghiên cứu Khoa học thành công rực rỡ!*
