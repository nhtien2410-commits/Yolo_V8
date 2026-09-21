"""
================================================================================
BƯỚC 5: ĐÁNH GIÁ CHI TIẾT MÔ HÌNH (PER-CLASS METRICS & CONFUSION MATRIX)
Dự án: Hệ thống AI phân loại bệnh dâu tây cho Robot nhà kính
================================================================================
"""

import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from tabulate import tabulate
from ultralytics import YOLO

# ============================================================
# 1. CẤU HÌNH ĐƯỜNG DẪN
# ============================================================
MODEL_PATH      = "/content/drive/MyDrive/NCKH_Strawberry_Project/yolov8n_strawberry_disease/weights/best.pt"
DATA_YAML_PATH  = "/content/dataset/data.yaml"
OUTPUT_EVAL_DIR = "/content/drive/MyDrive/NCKH_Strawberry_Project/evaluation_reports"

os.makedirs(OUTPUT_EVAL_DIR, exist_ok=True)

CLASS_NAMES = ["khoe_manh", "dom_trang", "vang_ua", "kho_heo", "chay_la"]

# ============================================================
# 2. ĐÁNH GIÁ TRÊN TẬP TEST ĐỘC LẬP
# ============================================================
def main():
    print("=" * 75)
    print("🚀 [BƯỚC 5] ĐÁNH GIÁ ĐỘ CHÍNH XÁC MÔ HÌNH TRÊN TẬP TEST (15%)")
    print("=" * 75)

    if not os.path.exists(MODEL_PATH):
        print(f"[LỖI] Không tìm thấy model weights tại: {MODEL_PATH}")
        return

    model = YOLO(MODEL_PATH)

    metrics = model.val(
        data=DATA_YAML_PATH,
        split="test",
        imgsz=640,
        batch=16,
        conf=0.25,
        iou=0.6,
        plots=True
    )

    # 3. TRÍCH XUẤT VÀ TÍNH TOÁN METRICS TỪNG LỚP
    report_data = []
    p_list   = metrics.box.p
    r_list   = metrics.box.r
    map50    = metrics.box.ap50
    map50_95 = metrics.box.ap

    for idx, class_name in enumerate(CLASS_NAMES):
        p = p_list[idx] if idx < len(p_list) else 0.0
        r = r_list[idx] if idx < len(r_list) else 0.0
        f1 = (2 * p * r) / (p + r + 1e-7)
        ap50 = map50[idx] if idx < len(map50) else 0.0
        ap95 = map50_95[idx] if idx < len(map50_95) else 0.0

        report_data.append({
            "Lớp Bệnh": f"{idx}: {class_name}",
            "Precision": f"{p*100:.2f}%",
            "Recall": f"{r*100:.2f}%",
            "F1-Score": f"{f1:.4f}",
            "mAP@0.5": f"{ap50*100:.2f}%",
            "mAP@0.5:0.95": f"{ap95*100:.2f}%"
        })

    # Dòng tổng kết trung bình
    mean_p  = metrics.box.mp
    mean_r  = metrics.box.mr
    mean_f1 = (2 * mean_p * mean_r) / (mean_p + mean_r + 1e-7)
    mean_map50 = metrics.box.map50
    mean_map95 = metrics.box.map

    report_data.append({
        "Lớp Bệnh": "👉 TOÀN BỘ (All Classes)",
        "Precision": f"{mean_p*100:.2f}%",
        "Recall": f"{mean_r*100:.2f}%",
        "F1-Score": f"{mean_f1:.4f}",
        "mAP@0.5": f"{mean_map50*100:.2f}%",
        "mAP@0.5:0.95": f"{mean_map95*100:.2f}%"
    })

    df_report = pd.DataFrame(report_data)
    print("\n" + tabulate(df_report, headers="keys", tablefmt="fancy_grid", showindex=False))

    csv_save_path = os.path.join(OUTPUT_EVAL_DIR, "detailed_class_metrics.csv")
    df_report.to_csv(csv_save_path, index=False, encoding="utf-8-sig")
    print(f"\n💾 Bảng chỉ số chi tiết đã lưu tại: {csv_save_path}")

    # 4. VẼ MA TRẬN NHẦM LẪN (CONFUSION MATRIX)
    try:
        cm_matrix = metrics.confusion_matrix.matrix
        labels_with_bg = CLASS_NAMES + ["background"]
        cm_normalized = cm_matrix.astype('float') / (cm_matrix.sum(axis=1)[:, np.newaxis] + 1e-7) * 100

        plt.figure(figsize=(10, 8))
        sns.heatmap(
            cm_normalized,
            annot=True,
            fmt=".1f",
            cmap="YlGnBu",
            xticklabels=labels_with_bg,
            yticklabels=labels_with_bg,
            cbar_kws={'label': 'Tỷ lệ nhận diện (%)'}
        )
        plt.title("MA TRẬN NHẦM LẪN (CONFUSION MATRIX) - 5 LỚP BỆNH DÂU TÂY", fontsize=14, fontweight="bold", pad=15)
        plt.xlabel("Nhãn Dự Đoán (Predicted)", fontsize=12, fontweight="bold")
        plt.ylabel("Nhãn Thực Tế (True Ground Truth)", fontsize=12, fontweight="bold")
        plt.xticks(rotation=30, ha="right")
        plt.yticks(rotation=0)
        plt.tight_layout()

        cm_save_path = os.path.join(OUTPUT_EVAL_DIR, "confusion_matrix_custom.png")
        plt.savefig(cm_save_path, dpi=300)
        plt.close()
        print(f"📊 Đồ thị Confusion Matrix đã lưu tại: {cm_save_path}")
    except Exception as e:
        print(f"[CẢNH BÁO] Không thể xuất biểu đồ ma trận: {e}")

    print("=" * 75)

if __name__ == "__main__":
    main()
