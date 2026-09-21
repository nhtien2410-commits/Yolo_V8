"""
================================================================================
BƯỚC 6A: SCRIPT EXPORT MÔ HÌNH YOLOV8 SANG ONNX
Dự án: Hệ thống AI phân loại bệnh dâu tây cho Robot nhà kính
================================================================================
"""

import os
from ultralytics import YOLO

# ============================================================
# CẤU HÌNH ĐƯỜNG DẪN
# ============================================================
PT_MODEL_PATH = "/content/drive/MyDrive/NCKH_Strawberry_Project/yolov8n_strawberry_disease/weights/best.pt"

def main():
    print("=" * 65)
    print("🚀 [BƯỚC 6A] ĐANG CHUYỂN ĐỔI MÔ HÌNH SANG ĐỊNH DẠNG ONNX...")
    print("=" * 65)

    if not os.path.exists(PT_MODEL_PATH):
        # Fallback đường dẫn cục bộ nếu chạy trên PC
        local_path = "C:/Users/ADMIN/Downloads/NCKH/best.pt"
        if os.path.exists(local_path):
            model_path = local_path
        else:
            print(f"[LỖI] Không tìm thấy file trọng số .pt: {PT_MODEL_PATH}")
            return
    else:
        model_path = PT_MODEL_PATH

    model = YOLO(model_path)

    onnx_file = model.export(
        format="onnx",
        imgsz=640,          # Kích thước cố định 640x640
        dynamic=False,      # Cố định batch size 1 tối ưu cho máy tính trạm/nhúng
        opset=12,           # Chuẩn tương thích ONNX Runtime
        simplify=True       # Tối ưu hóa lược bỏ layer dư thừa
    )

    print("\n" + "=" * 65)
    print(f"🎉 EXPORT ONNX HOÀN TẤT!")
    print(f" - File ONNX lưu tại: {onnx_file}")
    print("=" * 65)

if __name__ == "__main__":
    main()
