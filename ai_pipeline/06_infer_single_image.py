"""
================================================================================
BƯỚC 6B: SCRIPT INFERENCE NGOẠI TUYẾN 1 ẢNH & BÓC TÁCH ĐỐM BỆNH
Dự án: Hệ thống AI phân loại bệnh dâu tây cho Robot nhà kính
================================================================================
"""

import os
import cv2
from ultralytics import YOLO

# ============================================================
# 1. CẤU HÌNH ĐƯỜNG DẪN MÔ HÌNH VÀ ẢNH TEST
# ============================================================
ONNX_MODEL_PATH  = "C:/Users/ADMIN/Downloads/NCKH/best.onnx"
INPUT_IMAGE_PATH = "C:/Users/ADMIN/Downloads/NCKH/captured_images/strawberry_01.jpg"
OUTPUT_DIR       = "C:/Users/ADMIN/Downloads/NCKH/inference_results"

os.makedirs(OUTPUT_DIR, exist_ok=True)

CLASS_NAMES = {
    0: "khoe_manh",
    1: "dom_trang",
    2: "vang_ua",
    3: "kho_heo",
    4: "chay_la"
}

CLASS_COLORS = {
    0: (0, 255, 0),     # Xanh lá (Khỏe mạnh)
    1: (255, 255, 255), # Trắng (Đốm trắng)
    2: (0, 255, 255),   # Vàng (Vàng úa)
    3: (0, 165, 255),   # Cam (Khô héo)
    4: (0, 0, 255)      # Đỏ (Cháy lá)
}

# ============================================================
# 2. HÀM DỰ ĐOÁN VÀ TRÍCH XUẤT TỌA ĐỘ ĐỐM BỆNH
# ============================================================
def predict_and_visualize(image_path, model_path, conf_threshold=0.35):
    if not os.path.exists(model_path):
        print(f"[LỖI] Không tìm thấy mô hình ONNX tại: {model_path}")
        return

    model = YOLO(model_path, task='detect')

    img = cv2.imread(image_path)
    if img is None:
        print(f"[LỖI] Không thể đọc ảnh từ: {image_path}")
        return

    orig_h, orig_w = img.shape[:2]

    # Chạy inference
    results = model.predict(source=img, conf=conf_threshold, imgsz=640, verbose=False)
    result = results[0]
    boxes = result.boxes
    total_spots = len(boxes)

    print("=" * 65)
    print(f"📸 KẾT QUẢ PHÂN TÍCH ẢNH: {os.path.basename(image_path)}")
    print(f" - Kích thước ảnh gốc: {orig_w} x {orig_h} px")
    print(f" - Số lượng đốm bệnh phát hiện: {total_spots}")
    print("-" * 65)

    if total_spots == 0:
        print("✅ Không phát hiện dấu hiệu bất thường (Cây khỏe mạnh / Dưới ngưỡng).")
    else:
        for idx, box in enumerate(boxes):
            cls_id = int(box.cls[0].item())
            conf = float(box.conf[0].item())
            cls_name = CLASS_NAMES.get(cls_id, f"Class_{cls_id}")

            # Tọa độ pixel (xmin, ymin, xmax, ymax)
            xyxy = box.xyxy[0].cpu().numpy().astype(int)
            x1, y1, x2, y2 = xyxy[0], xyxy[1], xyxy[2], xyxy[3]
            spot_w = x2 - x1
            spot_h = y2 - y1

            # Tâm chuẩn hóa (0 -> 1)
            x_center_norm = ((x1 + x2) / 2.0) / orig_w
            y_center_norm = ((y1 + y2) / 2.0) / orig_h

            print(f"  [Đốm #{idx+1}]")
            print(f"   + Loại bệnh    : {cls_name} (Class ID: {cls_id})")
            print(f"   + Độ tin cậy   : {conf*100:.2f}%")
            print(f"   + Tọa độ Pixel : Box [X1={x1}, Y1={y1}, X2={x2}, Y2={y2}] (W={spot_w}px, H={spot_h}px)")
            print(f"   + Tâm chuẩn hóa: (X_center={x_center_norm:.4f}, Y_center={y_center_norm:.4f})")
            print("-" * 65)

            # Vẽ Bounding Box và Nhãn
            color = CLASS_COLORS.get(cls_id, (0, 255, 0))
            cv2.rectangle(img, (x1, y1), (x2, y2), color, 2)
            
            label_text = f"{cls_name}: {conf*100:.1f}%"
            cv2.putText(img, label_text, (x1, max(y1 - 10, 20)),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2, cv2.LINE_AA)

    out_filename = "pred_" + os.path.basename(image_path)
    out_path = os.path.join(OUTPUT_DIR, out_filename)
    cv2.imwrite(out_path, img)
    print(f"💾 Ảnh đã vẽ Bounding Box được lưu tại: {out_path}")
    print("=" * 65)

if __name__ == "__main__":
    predict_and_visualize(INPUT_IMAGE_PATH, ONNX_MODEL_PATH)
