import os
import time
from controller import Robot

# ==========================================
# 1. KHỞI TẠO ROBOT & CẢM BIẾN
# ==========================================
robot = Robot()
TIME_STEP = int(robot.getBasicTimeStep())  # Chu kỳ cập nhật (thường là 32ms)

# --- Khởi tạo động cơ bánh xe ---
left_motor = robot.getDevice("left wheel motor")
right_motor = robot.getDevice("right wheel motor")
left_motor.setPosition(float("inf"))
right_motor.setPosition(float("inf"))
left_motor.setVelocity(0.0)
right_motor.setVelocity(0.0)

# --- Khởi tạo cảm biến dò line gầm (E-puck Ground Sensors) ---
# gs0: Trái | gs1: Giữa | gs2: Phải
gs = []
gs_names = ["gs0", "gs1", "gs2"]
for name in gs_names:
    sensor = robot.getDevice(name)
    sensor.enable(TIME_STEP)
    gs.append(sensor)

# --- Khởi tạo Camera Macro ---
camera = robot.getDevice("camera")  # Nếu đổi tên camera thì chỉnh ở đây
camera.enable(TIME_STEP)

# Tạo thư mục lưu ảnh chụp nếu chưa có
IMAGE_FOLDER = "captured_dataset"
if not os.path.exists(IMAGE_FOLDER):
    os.makedirs(IMAGE_FOLDER)

# ==========================================
# 2. KHAI BÁO BIẾN TỌA ĐỘ VÀ TRẠNG THÁI
# ==========================================
# Tọa độ Lưới ma trận
current_X = 1  # Luống số 1
current_Y = 0  # Vị trí gốc xuất phát

# Các trạng thái vận hành (State Machine)
STATE_LINE_FOLLOWING = "LINE_FOLLOWING"
STATE_STOP_AND_SHOOT = "STOP_AND_SHOOT"
STATE_COOLDOWN = "COOLDOWN"

current_state = STATE_LINE_FOLLOWING

# Biến đếm thời gian dừng chụp ảnh và chống trùng vạch
stop_timer = 0
cooldown_timer = 0

# Tốc độ xe (rad/s)
MAX_SPEED = 3.0
BLACK_THRESHOLD = 500  # Giá trị cảm biến < 500 là phát hiện vạch đen

print("=== HỆ THỐNG AGV GIÁM SÁT NHÀ KÍNH ĐÃ KHỞI ĐỘNG ===")
print(f"Đang ở Luống X = {current_X}. Bắt đầu di chuyển...")


# ==========================================
# 3. HÀM TRỢ GIÚP (HELPER FUNCTIONS)
# ==========================================
def set_wheels_speed(left_speed, right_speed):
    """Cài đặt tốc độ cho 2 bánh xe"""
    left_motor.setVelocity(left_speed)
    right_motor.setVelocity(right_speed)


def capture_and_save_image(x, y):
    """Chụp ảnh từ camera và lưu tên file chứa tọa độ X, Y"""
    file_name = f"{IMAGE_FOLDER}/DauTay_X{x}_Y{y}.png"
    # Lệnh lưu ảnh của Webots (tên file, độ chất lượng 1-100)
    camera.saveImage(file_name, 100)
    print(
        f" [ẢNH] Đã chụp và lưu ảnh thành công: {file_name} tại ô ({x}, {y})"
    )


# ==========================================
# 4. VÒNG LẶP ĐIỀU KHIỂN CHÍNH (MAIN LOOP)
# ==========================================
while robot.step(TIME_STEP) != -1:

    # Đọc giá trị 3 cảm biến gầm
    val_left = gs[0].getValue()
    val_center = gs[1].getValue()
    val_right = gs[2].getValue()

    # ----------------------------------------------------
    # TRẠNG THÁI 1: BÁM LINE & PHÁT HIỆN VẠCH NGANG $Y$
    # ----------------------------------------------------
    if current_state == STATE_LINE_FOLLOWING:

        # MẸO ĐỊNH VỊ: Khi cả 3 cảm biến đều đè lên vạch đen -> Gặp vạch ngang ô đất (Y)
        if (
            val_left < BLACK_THRESHOLD
            and val_center < BLACK_THRESHOLD
            and val_right < BLACK_THRESHOLD
        ):
            # Tăng tọa độ Y
            current_Y += 1
            print(f"\n[PHÁT HIỆN Ô ĐẤT] Đã đến tọa độ ô: X={current_X}, Y={current_Y}")

            # Dừng xe khẩn cấp để chụp ảnh
            set_wheels_speed(0.0, 0.0)

            # Chuyển sang trạng thái dừng chụp ảnh
            current_state = STATE_STOP_AND_SHOOT
            stop_timer = 0  # Đặt lại bộ đếm thời gian dừng

        # THUẬT TOÁN BÁM LINE (Line Following)
        else:
            if val_center < BLACK_THRESHOLD:
                # Vạch đen ở giữa -> Đi thẳng
                set_wheels_speed(MAX_SPEED, MAX_SPEED)
            elif val_left < BLACK_THRESHOLD:
                # Xe bị lệch sang phải -> Rẽ trái nhẹ để căn chỉnh
                set_wheels_speed(MAX_SPEED * 0.3, MAX_SPEED)
            elif val_right < BLACK_THRESHOLD:
                # Xe bị lệch sang trái -> Rẽ phải nhẹ để căn chỉnh
                set_wheels_speed(MAX_SPEED, MAX_SPEED * 0.3)
            else:
                # Nếu mất vạch, giữ chạy thẳng chậm
                set_wheels_speed(MAX_SPEED * 0.5, MAX_SPEED * 0.5)

    # ----------------------------------------------------
    # TRẠNG THÁI 2: DỪNG XE CHÍNH XÁC VÀ CHỤP ẢNH
    # ----------------------------------------------------
    elif current_state == STATE_STOP_AND_SHOOT:
        set_wheels_speed(0.0, 0.0)  # Đảm bảo xe đứng yên hoàn toàn
        stop_timer += 1

        # Chờ xe dừng ổn định khoảng 0.5 giây (khoảng 15 timesteps) rồi mới chụp
        if stop_timer == 15:
            capture_and_save_image(current_X, current_Y)

        # Sau khi chụp xong (khoảng 1 giây dừng tổng cộng), tiếp tục chạy
        if stop_timer >= 30:
            current_state = STATE_COOLDOWN
            cooldown_timer = 0

    # ----------------------------------------------------
    # TRẠNG THÁI 3: CHỐNG ĐỌC LẶP VẠCH NGANG (COOLDOWN)
    # ----------------------------------------------------
    elif current_state == STATE_COOLDOWN:
        # Vẫn tiếp tục bám line bình thường
        if val_left < BLACK_THRESHOLD:
            set_wheels_speed(MAX_SPEED * 0.3, MAX_SPEED)
        elif val_right < BLACK_THRESHOLD:
            set_wheels_speed(MAX_SPEED, MAX_SPEED * 0.3)
        else:
            set_wheels_speed(MAX_SPEED, MAX_SPEED)

        cooldown_timer += 1
        # Chạy vọt qua khỏi vạch ngang trong khoảng 1-2 giây rồi mới mở lại chế độ quét vạch mới
        if cooldown_timer >= 40:
            current_state = STATE_LINE_FOLLOWING