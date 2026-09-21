"""
================================================================================
BƯỚC 7: PARSE TỌA ĐỘ (X, Y) & XUẤT CSV BẢN ĐỒ ĐIỀU PHỐI PHUN THUỐC CỤC BỘ
Dự án: Hệ thống AI phân loại bệnh dâu tây cho Robot nhà kính
================================================================================
"""

import os
import re
import glob
import cv2
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from tqdm import tqdm
from ultralytics import YOLO

# ============================================================
# 1. CẤU HÌNH ĐƯỜNG DẪN & THAM SỐ
# ============================================================
ROBOT_RUN_IMAGES_DIR = "C:/Users/ADMIN/Downloads/NCKH/captured_images"
ONNX_MODEL_PATH      = "C:/Users/ADMIN/Downloads/NCKH/best.onnx"
OUTPUT_REPORT_DIR    = "C:/Users/ADMIN/Downloads/NCKH/spray_reports"

CONF_THRESHOLD       = 0.35   # Ngưỡng tin cậy kích hoạt cảnh báo bệnh
MAX_GRID_X           = 10     # Cột X tối đa trong nhà kính
MAX_GRID_Y           = 15     # Hàng Y tối đa trong nhà kính

os.makedirs(OUTPUT_REPORT_DIR, exist_ok=True)

CLASS_NAMES = {
    0: "khoe_manh",
    1: "dom_trang",
    2: "vang_ua",
    3: "kho_heo",
    4: "chay_la"
}

# Ưu tiên bệnh nặng hơn nếu 1 cây chụp nhiều góc / phát hiện nhiều bệnh
DISEASE_SEVERITY_PRIORITY = {
    "kho_heo":   5,  # Nguy hiểm nhất
    "chay_la":   4,
    "dom_trang": 3,
    "vang_ua":   2,
    "khoe_manh": 1
}

# ============================================================
# 2. HÀM BÓC TÁCH TỌA ĐỘ (X, Y) TỪ TÊN FILE
# ============================================================
def parse_grid_coordinates(filename):
    """
    Trích xuất tọa độ X và Y từ tên file dạng:
    'X03_Y07_20260826_01.jpg' -> X = 3, Y = 7
    """
    match = re.search(r'X(\d+)_Y(\d+)', filename, re.IGNORECASE)
    if match:
        return int(match.group(1)), int(match.group(2))
    return None, None

# ============================================================
# 3. CHƯƠNG TRÌNH PHÂN TÍCH VÀ TẠO BẢN ĐỒ PHUN
# ============================================================
def main():
    print("=" * 70)
    print("🚜 [BƯỚC 7] PHÂN TÍCH DỮ LIỆU LƯỢT CHẠY ROBOT & TẠO BẢN ĐỒ PHUN THUỐC")
    print("=" * 70)

    if not os.path.exists(ONNX_MODEL_PATH):
        print(f"[LỖI] Không tìm thấy file mô hình ONNX: {ONNX_MODEL_PATH}")
        return

    model = YOLO(ONNX_MODEL_PATH, task='detect')

    # Quét toàn bộ ảnh
    image_paths = glob.glob(os.path.join(ROBOT_RUN_IMAGES_DIR, "**", "*.jpg"), recursive=True) + \
                  glob.glob(os.path.join(ROBOT_RUN_IMAGES_DIR, "**", "*.png"), recursive=True)

    if not image_paths:
        print(f"[CẢNH BÁO] Không tìm thấy ảnh trong: {ROBOT_RUN_IMAGES_DIR}")
        return

    print(f"📂 Tìm thấy {len(image_paths)} ảnh. Đang tiến hành phân tích hàng loạt...\n")

    results_list = []

    for img_path in tqdm(image_paths, desc="Đang quét ảnh"):
        filename = os.path.basename(img_path)
        x_coord, y_coord = parse_grid_coordinates(filename)

        if x_coord is None or y_coord is None:
            # Nếu tên file mẫu dạng strawberry_01.jpg -> ánh xạ tạm theo số thứ tự
            num_match = re.search(r'(\d+)', filename)
            if num_match:
                x_coord = int(num_match.group(1)) % 3 + 1
                y_coord = int(num_match.group(1)) // 3 + 1
            else:
                x_coord, y_coord = 0, 0

        img = cv2.imread(img_path)
        if img is None:
            continue

        pred = model.predict(source=img, conf=CONF_THRESHOLD, imgsz=640, verbose=False)[0]
        boxes = pred.boxes

        if len(boxes) == 0:
            results_list.append({
                "X": x_coord,
                "Y": y_coord,
                "nhan_benh": "khoe_manh",
                "do_tin_cay": 0.9500,
                "so_dom_benh": 0,
                "file_anh": filename
            })
        else:
            best_disease = "khoe_manh"
            best_conf = 0.0
            highest_severity = 0

            for box in boxes:
                cls_id = int(box.cls[0].item())
                conf = float(box.conf[0].item())
                dis_name = CLASS_NAMES.get(cls_id, "khoe_manh")
                severity = DISEASE_SEVERITY_PRIORITY.get(dis_name, 1)

                if (severity > highest_severity) or (severity == highest_severity and conf > best_conf):
                    highest_severity = severity
                    best_disease = dis_name
                    best_conf = conf

            results_list.append({
                "X": x_coord,
                "Y": y_coord,
                "nhan_benh": best_disease,
                "do_tin_cay": round(best_conf, 4),
                "so_dom_benh": len(boxes),
                "file_anh": filename
            })

    # Gộp kết quả theo ô (X, Y)
    df_all = pd.DataFrame(results_list)
    df_prescribed = df_all.sort_values(by=["X", "Y", "do_tin_cay"], ascending=[True, True, False])
    df_prescribed = df_prescribed.drop_duplicates(subset=["X", "Y"], keep="first")

    # Đúng 4 cột chuẩn theo yêu cầu đầu ra
    df_output = df_prescribed[["X", "Y", "nhan_benh", "do_tin_cay"]]

    csv_path = os.path.join(OUTPUT_REPORT_DIR, "spray_prescription_map.csv")
    df_output.to_csv(csv_path, index=False, encoding="utf-8-sig")

    print("\n" + "=" * 70)
    print(f"🎉 ĐÃ XUẤT BẢN ĐỒ PHUN THUỐC THÀNH CÔNG!")
    print(f" - File CSV đầu ra: {csv_path}")
    print("=" * 70)
    print("\n📋 KẾT QUẢ ĐIỀU PHỐI PHUN THUỐC THEO Ô TỌA ĐỘ:")
    print(df_output.to_string(index=False))

    # Vẽ Heatmap 2D Nhà kính
    try:
        disease_to_code = {"khoe_manh": 0, "dom_trang": 1, "vang_ua": 2, "kho_heo": 3, "chay_la": 4}
        max_x = max(df_output["X"].max() + 1, 4)
        max_y = max(df_output["Y"].max() + 1, 4)
        grid_map = np.zeros((max_y, max_x))

        for _, row in df_output.iterrows():
            gx, gy = int(row["X"]), int(row["Y"])
            if gx < max_x and gy < max_y:
                grid_map[gy, gx] = disease_to_code.get(row["nhan_benh"], 0)

        plt.figure(figsize=(9, 6))
        custom_cmap = sns.color_palette(["#2ecc71", "#bdc3c7", "#f1c40f", "#e67e22", "#e74c3c"])
        
        sns.heatmap(grid_map, annot=True, fmt=".0f", cmap=custom_cmap, cbar=False,
                    linewidths=1.0, linecolor="gray")
        
        plt.title("BẢN ĐỒ ĐIỀU PHỐI PHUN THUỐC CỤC BỘ THEO Ô TỌA ĐỘ (X, Y)", fontsize=13, fontweight="bold", pad=15)
        plt.xlabel("Cột Ô Lưới (Tọa độ X)", fontsize=11, fontweight="bold")
        plt.ylabel("Hàng Ô Lưới (Tọa độ Y)", fontsize=11, fontweight="bold")
        
        legend_labels = ["0: Khỏe", "1: Đốm trắng", "2: Vàng úa", "3: Khô héo", "4: Cháy lá"]
        plt.figtext(0.5, -0.05, " | ".join(legend_labels), ha="center", fontsize=10, bbox={"facecolor":"white", "pad":5})

        map_save_path = os.path.join(OUTPUT_REPORT_DIR, "greenhouse_spray_map.png")
        plt.savefig(map_save_path, dpi=300, bbox_inches="tight")
        plt.close()
        print(f"\n🗺️ Bản đồ nhiệt 2D đã lưu tại: {map_save_path}")
    except Exception as e:
        print(f"[GHI CHÚ] Bỏ qua vẽ bản đồ 2D: {e}")

    print("=" * 70)

if __name__ == "__main__":
    main()
