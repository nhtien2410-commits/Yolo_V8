"""
================================================================================
BƯỚC 4: SCRIPT HUẤN LUYỆN YOLOV8-NANO TRÊN GOOGLE COLAB (GPU T4)
Dự án: Hệ thống AI phân loại bệnh dâu tây cho Robot nhà kính
================================================================================
"""

import os
import torch
from ultralytics import YOLO

# ============================================================
# 1. THIẾT LẬP THIẾT BỊ VÀ ĐƯỜNG DẪN
# ============================================================
DATA_YAML_PATH  = "/content/dataset/data.yaml"
PROJECT_NAME    = "/content/drive/MyDrive/NCKH_Strawberry_Project"
EXPERIMENT_NAME = "yolov8n_strawberry_disease"

device_str = "0" if torch.cuda.is_available() else "cpu"
print(f"🚀 Huấn luyện trên thiết bị: {torch.cuda.get_device_name(0) if torch.cuda.is_available() else 'CPU'}")

# ============================================================
# 2. KHỞI TẠO MÔ HÌNH PRETRAINED
# ============================================================
# Sử dụng YOLOv8-Nano (3.2M params) siêu nhẹ, tối ưu cho máy tính trạm và nhúng
model = YOLO("yolov8n.pt")

# ============================================================
# 3. TIẾN HÀNH HUẤN LUYỆN (TRAINING)
# ============================================================
results = model.train(
    data=DATA_YAML_PATH,         # File cấu hình 5 lớp bệnh
    epochs=100,                  # 100 epochs (~25 phút trên Colab T4)
    batch=16,                    # Batch size 16 tối ưu cho 16GB VRAM
    imgsz=640,                   # Kích thước ảnh 640x640
    device=device_str,           # GPU ID 0
    workers=4,                   # Số CPU worker nạp dữ liệu

    # --- Chiến lược tối ưu hóa ---
    optimizer="AdamW",           # AdamW hội tụ nhanh và ổn định
    lr0=0.001,                   # Initial Learning Rate
    lrf=0.01,                    # Cosine Learning Rate Decay (lr_min = 1e-5)
    warmup_epochs=3.0,           # 3 epoch đầu tăng lr từ từ
    weight_decay=0.0005,         # Chống Overfitting

    # --- Cơ chế dừng sớm & Lưu checkpoint ---
    patience=20,                 # Dừng sớm nếu 20 epoch không tăng mAP50
    save=True,
    save_period=10,
    project=PROJECT_NAME,
    name=EXPERIMENT_NAME,
    exist_ok=True,

    # ========================================================
    # ⚠️ BẢO TỒN SẮC TỐ BỆNH (COLOR-PRESERVING SETTINGS)
    # ========================================================
    hsv_h=0.0,                   # TẮT đổi màu (Hue=0.0) để giữ nguyên màu vàng/trắng/nâu
    hsv_s=0.1,                   # Biến thiên bão hòa màu rất nhẹ (+-10%)
    hsv_v=0.2,                   # Biến thiên độ sáng (+-20%) theo ánh sáng flash
    degrees=10.0,                # Xoay nhẹ (+-10 độ)
    translate=0.05,
    scale=0.1,
    fliplr=0.5,
    flipud=0.0,
    mosaic=0.5,
    close_mosaic=10,
    
    verbose=True,
    plots=True
)

print("\n" + "=" * 65)
print("🎉 HUẤN LUYỆN HOÀN TẤT THÀNH CÔNG!")
print(f" - Best Weights: {os.path.join(PROJECT_NAME, EXPERIMENT_NAME, 'weights', 'best.pt')}")
print(f" - Last Weights: {os.path.join(PROJECT_NAME, EXPERIMENT_NAME, 'weights', 'last.pt')}")
print("=" * 65)
