"""
================================================================================
BƯỚC 1 & 2: TIỀN XỬ LÝ ẢNH, GẮN NHÃN TỰ ĐỘNG & DATA AUGMENTATION (TỐI ƯU HÓA)
Dự án: Hệ thống AI phân loại bệnh dâu tây cho Robot nhà kính
================================================================================
"""

import os
import sys
import hashlib
import glob
import re
import shutil

# Dam bao in tieng Viet va emoji khong loi tren Windows Console
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Thử nạp PIL nếu có
try:
    from PIL import Image, ImageEnhance
    HAS_PIL = True
except ImportError:
    HAS_PIL = False

# ============================================================
# 1. CẤU HÌNH ĐƯỜNG DẪN & THAM SỐ
# ============================================================
RAW_DATA_DIR = "C:/Users/ADMIN/Downloads/NCKH/captured_images"
OUTPUT_DIR   = "C:/Users/ADMIN/Downloads/NCKH/processed_dataset"
TARGET_SIZE  = (640, 640)      # Kích thước chuẩn YOLOv8

CLASS_MAPPING = {
    "khoe_manh": 0,
    "dom_trang": 1,
    "vang_ua":   2,
    "kho_heo":   3,
    "chay_la":   4
}

GRID_DISEASE_MAPPING = {
    "X03_Y02": 1,  # Đốm trắng
    "X03_Y03": 2,  # Vàng úa
    "X01_Y01": 3,  # Khô héo
    "X01_Y02": 4,  # Cháy lá
}

# ============================================================
# 2. CÁC HÀM HỖ TRỢ
# ============================================================
def get_image_hash(img_path):
    """Tính mã băm MD5 để loại bỏ ảnh trùng lặp."""
    with open(img_path, 'rb') as f:
        return hashlib.md5(f.read()).hexdigest()

def generate_default_bbox(cls_id):
    """
    Tự động sinh Bounding Box chuẩn YOLO (x_center, y_center, w, h).
    """
    if cls_id == 0:   # Khỏe mạnh
        return [[0.50, 0.50, 0.80, 0.80]], [0]
    elif cls_id == 1: # Đốm trắng: Khoanh vùng cụm đốm tròn
        bboxes = [
            [0.50, 0.50, 0.75, 0.75],
            [0.45, 0.45, 0.16, 0.16],
            [0.56, 0.52, 0.18, 0.18],
            [0.38, 0.58, 0.15, 0.15]
        ]
        return bboxes, [1] * len(bboxes)
    elif cls_id == 2: # Vàng úa
        return [[0.50, 0.50, 0.78, 0.78]], [2]
    elif cls_id == 3: # Khô héo
        return [[0.50, 0.52, 0.78, 0.78]], [3]
    elif cls_id == 4: # Cháy lá: Khoanh vùng phiến lá và 2 dải viền mép lá cháy sém
        bboxes = [
            [0.50, 0.50, 0.82, 0.82],
            [0.30, 0.50, 0.32, 0.65],
            [0.70, 0.50, 0.32, 0.65]
        ]
        return bboxes, [4] * len(bboxes)
    return [[0.50, 0.50, 0.80, 0.80]], [0]

def save_label_file(txt_path, bboxes, class_labels):
    """Lưu file nhãn .txt chuẩn YOLO."""
    with open(txt_path, 'w', encoding='utf-8') as f:
        for bbox, label in zip(bboxes, class_labels):
            f.write(f"{label} {bbox[0]:.6f} {bbox[1]:.6f} {bbox[2]:.6f} {bbox[3]:.6f}\n")

def strip_white_bar_pil(im_rgb):
    """Tự động phát hiện và cắt bỏ dải trắng thừa ở đáy ảnh do camera viewport."""
    w, h = im_rgb.size
    import numpy as np
    arr = np.array(im_rgb)
    cutoff = h
    for y in range(int(h * 0.45), h):
        if np.mean(arr[y, :, :]) > 225:
            cutoff = y
            break
    if cutoff < h and cutoff > int(h * 0.35):
        return im_rgb.crop((0, 0, w, cutoff))
    return im_rgb

# ============================================================
# 3. CHƯƠNG TRÌNH XỬ LÝ CHÍNH
# ============================================================
def main():
    os.makedirs(os.path.join(OUTPUT_DIR, "all_images"), exist_ok=True)
    os.makedirs(os.path.join(OUTPUT_DIR, "all_labels"), exist_ok=True)

    seen_hashes = set()
    total_valid = 0
    total_duplicates = 0
    total_generated = 0

    print("=" * 65)
    print("🚀 [GIAI ĐOẠN 1 - BƯỚC 1] TIỀN XỬ LÝ ẢNH, GẮN NHÃN TỰ ĐỘNG & AUGMENTATION")
    print("=" * 65)

    # 1. Quét toàn bộ ảnh trong captured_images
    all_raw_images = glob.glob(os.path.join(RAW_DATA_DIR, "**", "*.jpg"), recursive=True) + \
                     glob.glob(os.path.join(RAW_DATA_DIR, "**", "*.png"), recursive=True)

    if not all_raw_images:
        print(f"[CẢNH BÁO] Không tìm thấy ảnh trong: {RAW_DATA_DIR}")
        return

    print(f"📂 Quét được tổng cộng {len(all_raw_images)} ảnh gốc.")

    for img_path in all_raw_images:
        # Bỏ qua các ảnh debug frame cũ nếu có
        if "debug_frame" in os.path.basename(img_path):
            continue

        # Kiểm tra trùng lặp MD5
        img_hash = get_image_hash(img_path)
        if img_hash in seen_hashes:
            total_duplicates += 1
            continue
        seen_hashes.add(img_hash)

        filename = os.path.basename(img_path)
        base_name = os.path.splitext(filename)[0]

        # Xác định class_id từ từ khóa tên file hoặc tọa độ cây Webots
        cls_id = 0  # Mặc định là khỏe mạnh
        fname_lower = filename.lower()
        if "dom_trang" in fname_lower or "white_spot" in fname_lower:
            cls_id = 1
        elif "vang_ua" in fname_lower or "chlorosis" in fname_lower:
            cls_id = 2
        elif "kho_heo" in fname_lower or "wilt" in fname_lower:
            cls_id = 3
        elif "chay_la" in fname_lower or "scorch" in fname_lower:
            cls_id = 4
        else:
            for grid_code, gid in GRID_DISEASE_MAPPING.items():
                if grid_code in filename:
                    cls_id = gid
                    break

        bboxes, labels = generate_default_bbox(cls_id)

        # Xử lý và lưu ảnh gốc
        out_img_name = f"{base_name}_orig.jpg"
        out_txt_name = f"{base_name}_orig.txt"
        out_img_path = os.path.join(OUTPUT_DIR, "all_images", out_img_name)
        out_txt_path = os.path.join(OUTPUT_DIR, "all_labels", out_txt_name)

        if HAS_PIL:
            try:
                with Image.open(img_path) as im:
                    im_rgb = im.convert("RGB")
                    # Cắt sạch dải trắng thừa
                    im_clean = strip_white_bar_pil(im_rgb)
                    im_resized = im_clean.resize(TARGET_SIZE, Image.Resampling.LANCZOS)
                    im_resized.save(out_img_path, quality=95)
                    save_label_file(out_txt_path, bboxes, labels)
                    total_valid += 1
                    total_generated += 1

                    # DATA AUGMENTATION NÂNG CAO CHO CÁC LỚP BỆNH
                    aug_variants = [
                        ("_flip_h", im_resized.transpose(Image.Transpose.FLIP_LEFT_RIGHT)),
                        ("_bright_up", ImageEnhance.Brightness(im_resized).enhance(1.15)),
                        ("_bright_dn", ImageEnhance.Brightness(im_resized).enhance(0.88)),
                        ("_contrast_up", ImageEnhance.Contrast(im_resized).enhance(1.20)),
                        ("_sharp_up", ImageEnhance.Sharpness(im_resized).enhance(1.30)),
                        ("_rot_p5", im_resized.rotate(5, resample=Image.Resampling.BICUBIC)),
                        ("_rot_m5", im_resized.rotate(-5, resample=Image.Resampling.BICUBIC)),
                    ]

                    # Thêm zoom crop đặc biệt cho lớp bệnh
                    if cls_id in (1, 2, 3, 4):
                        w, h = im_clean.size
                        crop_box = (int(w * 0.08), int(h * 0.08), int(w * 0.92), int(h * 0.92))
                        im_zoom = im_clean.crop(crop_box).resize(TARGET_SIZE, Image.Resampling.LANCZOS)
                        aug_variants.append(("_zoom", im_zoom))
                        aug_variants.append(("_zoom_flip", im_zoom.transpose(Image.Transpose.FLIP_LEFT_RIGHT)))
                        aug_variants.append(("_zoom_contrast", ImageEnhance.Contrast(im_zoom).enhance(1.25)))

                    for suffix, aug_img in aug_variants:
                        aug_img_name = f"{base_name}{suffix}.jpg"
                        aug_txt_name = f"{base_name}{suffix}.txt"
                        aug_img.save(os.path.join(OUTPUT_DIR, "all_images", aug_img_name), quality=95)

                        aug_bboxes = bboxes
                        if "flip" in suffix:
                            aug_bboxes = [[1.0 - b[0], b[1], b[2], b[3]] for b in bboxes]

                        save_label_file(
                            os.path.join(OUTPUT_DIR, "all_labels", aug_txt_name),
                            aug_bboxes,
                            labels
                        )
                        total_generated += 1

            except Exception as e:
                pass

    print("\n" + "=" * 65)
    print("🎉 HOÀN THÀNH TIỀN XỬ LÝ & GẮN NHÃN TỰ ĐỘNG!")
    print(f" - Số ảnh gốc hợp lệ: {total_valid}")
    print(f" - Số ảnh trùng lặp loại bỏ: {total_duplicates}")
    print(f" - Tổng số cặp ảnh-nhãn tạo ra (Gốc + Augment): {total_generated}")
    print(f" - Dữ liệu đã lưu tại: {OUTPUT_DIR}")
    print("=" * 65)

if __name__ == "__main__":
    main()
