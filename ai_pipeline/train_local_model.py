"""
================================================================================
LOCAL TRAINING & ONNX EXPORT PIPELINE (FULL 5 CLASSES)
Dự án: Hệ thống AI nhận diện 5 bệnh dâu tây cho Robot nhà kính
================================================================================
"""

import os
import sys
import glob
from ultralytics import YOLO

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_YAML = os.path.join(BASE_DIR, "ai_pipeline", "data_local.yaml")
RUNS_DIR = os.path.join(BASE_DIR, "runs_local")
TARGET_ONNX = os.path.join(BASE_DIR, "best.onnx")

print("=" * 65)
print("🍓 BẮT ĐẦU HUẤN LUYỆN MÔ HÌNH YOLOV8 LOCAL (5 LỚP BỆNH)")
print("=" * 65)
print(f"📂 Data config: {DATA_YAML}")

# Khởi tạo YOLOv8-Small (Khả năng trích xuất đặc trưng sâu hơn, độ chính xác cao vượt trội)
print("📦 Khởi tạo model backbone YOLOv8-Small (High Precision)...")
model = YOLO("yolov8s.pt")

# Huấn luyện nâng cao 25 epochs trên tập dữ liệu đã làm sạch 100% dải trắng
print("🚀 Đang huấn luyện mô hình trên dữ liệu sạch...")
results = model.train(
    data=DATA_YAML,
    epochs=25,
    batch=8,
    imgsz=640,
    device="cpu",
    workers=0,
    optimizer="AdamW",
    lr0=0.0015,
    lrf=0.01,
    cos_lr=True,          # Cosine Annealing Learning Rate Schedule
    warmup_epochs=3.0,
    patience=15,          # Early stopping chống overfitting
    hsv_h=0.0,            # Khóa kênh màu để bảo vệ sắc tố bệnh
    hsv_s=0.15,
    hsv_v=0.25,
    degrees=10.0,
    fliplr=0.5,
    flipud=0.0,
    mosaic=0.5,           # Tăng cường tính đa dạng không gian
    close_mosaic=10,      # Tắt mosaic 10 epoch cuối để định vị bounding box chính xác nhất
    project=RUNS_DIR,
    name="strawberry_5class_high_precision",
    exist_ok=True,
    verbose=True
)

print("\n" + "=" * 65)
print("🎉 HUẤN LUYỆN LOCAL HOÀN TẤT!")
print("=" * 65)

# Tìm best.pt
best_pt = os.path.join(RUNS_DIR, "strawberry_5class_high_precision", "weights", "best.pt")
if os.path.exists(best_pt):
    best_model = YOLO(best_pt)
    print(f"📦 Best PyTorch weights: {best_pt}")
    
    # Export sang ONNX
    print("⚙️ Đang xuất sang định dạng ONNX...")
    exported_onnx = best_model.export(format="onnx", imgsz=640, dynamic=False, opset=12, simplify=True)
    
    import shutil
    shutil.copyfile(exported_onnx, TARGET_ONNX)
    print(f"✅ ĐÃ CẬP NHẬT FILE BEST.ONNX TẠI: {TARGET_ONNX}")
    print(f"   Dung lượng: {os.path.getsize(TARGET_ONNX)} bytes")
    
    # Chạy kiểm thử chẩn đoán trên từng loại ảnh
    print("\n🔍 KIỂM THỬ SUY LUẬN TRÊN 5 LOẠI ẢNH THỰC TẾ:")
    test_model = YOLO(TARGET_ONNX, task="detect")
    for img_path in glob.glob(os.path.join(BASE_DIR, "captured_images", "*.jpg"))[:12]:
        fname = os.path.basename(img_path)
        pred = test_model.predict(source=img_path, conf=0.15, imgsz=640, verbose=False)[0]
        detected = [test_model.names[int(c)] for c in pred.boxes.cls.tolist()]
        confs = [round(float(c) * 100, 1) for c in pred.boxes.conf.tolist()]
        print(f"  📷 {fname:38s} --> Phát hiện: {detected} {confs}%")
else:
    print(f"❌ Không tìm thấy {best_pt}")
