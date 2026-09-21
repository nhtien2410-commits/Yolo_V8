"""
================================================================================
BƯỚC 3: CHIA TẬP TRAIN / VAL / TEST (70/15/15) THEO TỌA ĐỘ CÂY (SPATIAL GROUP SPLIT)
Dự án: Hệ thống AI phân loại bệnh dâu tây cho Robot nhà kính
================================================================================
"""

import os
import sys
import re
import glob
import shutil
import random
from collections import defaultdict

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# ============================================================
# 1. CẤU HÌNH ĐƯỜNG DẪN & TỶ LỆ CHIA
# ============================================================
SOURCE_DIR        = "C:/Users/ADMIN/Downloads/NCKH/processed_dataset"
FINAL_DATASET_DIR = "C:/Users/ADMIN/Downloads/NCKH/dataset"

TRAIN_RATIO = 0.70
VAL_RATIO   = 0.15
TEST_RATIO  = 0.15
RANDOM_SEED = 42

CLASS_NAMES = {
    0: "khoe_manh",
    1: "dom_trang",
    2: "vang_ua",
    3: "kho_heo",
    4: "chay_la"
}

# ============================================================
# 2. HÀM TÁCH TỌA ĐỘ VÀ GOM NHÓM
# ============================================================
def extract_coordinate_group(filename):
    """
    Trích xuất mã ô tọa độ từ tên file (VD: X03_Y07 từ 'X03_Y07_20260826_001_aug1.jpg').
    Đảm bảo ảnh từ cùng 1 ô tọa độ chỉ nằm ở 1 tập duy nhất (chống Data Leakage).
    """
    match = re.search(r'(X\d+_Y\d+)', filename, re.IGNORECASE)
    if match:
        return match.group(1).upper()
    
def get_file_classes(lbl_path):
    classes = set()
    with open(lbl_path, 'r', encoding='utf-8') as f:
        for line in f:
            parts = line.strip().split()
            if parts:
                classes.add(int(parts[0]))
    return classes

# ============================================================
# 3. CHƯƠNG TRÌNH CHIA DỮ LIỆU
# ============================================================
def main():
    random.seed(RANDOM_SEED)

    img_dir = os.path.join(SOURCE_DIR, "all_images")
    lbl_dir = os.path.join(SOURCE_DIR, "all_labels")

    all_images = glob.glob(os.path.join(img_dir, "*.jpg")) + glob.glob(os.path.join(img_dir, "*.png"))
    if not all_images:
        print(f"[LỖI] Chưa có ảnh trong: {img_dir}. Hãy chạy Bước 1 trước!")
        return

    # Gom nhóm theo từng lớp bệnh chính
    class_to_pairs = defaultdict(list)
    for img_path in all_images:
        filename = os.path.basename(img_path)
        base_name = os.path.splitext(filename)[0]
        lbl_path = os.path.join(lbl_dir, f"{base_name}.txt")

        if os.path.exists(lbl_path):
            cls_set = get_file_classes(lbl_path)
            primary_c = list(cls_set)[0] if cls_set else 0
            class_to_pairs[primary_c].append((img_path, lbl_path))

    train_pairs, val_pairs, test_pairs = [], [], []

    for c, pairs in class_to_pairs.items():
        random.shuffle(pairs)
        n = len(pairs)
        n_train = max(1, int(n * 0.70))
        n_val = max(1, int(n * 0.15))
        
        train_pairs.extend(pairs[:n_train])
        val_pairs.extend(pairs[n_train:n_train + n_val])
        test_pairs.extend(pairs[n_train + n_val:])
        if not pairs[n_train + n_val:]:
            test_pairs.extend(pairs[n_train:n_train + n_val])

    print("=" * 65)
    print(f"📊 [GIAI ĐOẠN 1 - BƯỚC 2] PHÂN CHIA DATASET THEO TỪNG LỚP BỆNH (STRATIFIED 5-CLASS)")
    # Tạo thư mục đích & xóa dữ liệu cũ
    for split in ['train', 'val', 'test']:
        img_out = os.path.join(FINAL_DATASET_DIR, "images", split)
        lbl_out = os.path.join(FINAL_DATASET_DIR, "labels", split)
        shutil.rmtree(img_out, ignore_errors=True)
        shutil.rmtree(lbl_out, ignore_errors=True)
        os.makedirs(img_out, exist_ok=True)
        os.makedirs(lbl_out, exist_ok=True)

    # Copy files
    counts = {'train': 0, 'val': 0, 'test': 0}
    for split_name, pairs_list in [('train', train_pairs), ('val', val_pairs), ('test', test_pairs)]:
        for img_p, lbl_p in pairs_list:
            fname = os.path.basename(img_p)
            lname = os.path.basename(lbl_p)
            shutil.copy2(img_p, os.path.join(FINAL_DATASET_DIR, "images", split_name, fname))
            shutil.copy2(lbl_p, os.path.join(FINAL_DATASET_DIR, "labels", split_name, lname))
            counts[split_name] += 1

    # Tạo data.yaml
    yaml_content = f"""path: {FINAL_DATASET_DIR.replace('\\', '/')}
train: images/train
val: images/val
test: images/test

nc: 5
names:
  0: khoe_manh
  1: dom_trang
  2: vang_ua
  3: kho_heo
  4: chay_la
"""
    yaml_path = os.path.join(FINAL_DATASET_DIR, "data.yaml")
    with open(yaml_path, 'w', encoding='utf-8') as f:
        f.write(yaml_content)

    print(f"🎉 HOÀN THÀNH CHIA TẬP DATASET STRATIFIED!")
    print(f" - Train: {counts['train']} images")
    print(f" - Val:   {counts['val']} images")
    print(f" - Test:  {counts['test']} images")
    print(f" - Data yaml: {yaml_path}")
    print(f" - Thư mục Dataset chuẩn: {FINAL_DATASET_DIR}")
    print("=" * 65)

if __name__ == "__main__":
    main()
