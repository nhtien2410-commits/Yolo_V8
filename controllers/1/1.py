
import os
import sys
import math
from controller import Robot

# ============================================================
# 1. THAM SỐ CẤU HÌNH
# ============================================================
BASE_SPEED       = 3.0    # Tốc độ đi thẳng
TURN_SPEED       = 1.8    # Tốc độ xoay
DARK_THRESH      = 450
MARKER_THRESH    = 600
CAPTURE_DIR      = "C:/NCKH/captured_images"

DEBUG_SENSORS    = False  # Tắt log sensor để dễ nhìn các thông báo điều hướng

WHEEL_RADIUS     = 0.0205
AXLE_LENGTH      = 0.052
SENSOR_TO_AXLE   = 0.035

ALIGN_SPEED_FACTOR = 0.7
CENTER_ALIGN_TIME = SENSOR_TO_AXLE / (BASE_SPEED * ALIGN_SPEED_FACTOR * WHEEL_RADIUS)
TURN_90_TIME      = (math.pi / 2.0) * AXLE_LENGTH / (2.0 * TURN_SPEED * WHEEL_RADIUS)

MIN_TURN_TIME = TURN_90_TIME * 0.75 # Tăng thời gian mù lên 75% để thoát hẳn vạch cũ
MAX_TURN_TIME = TURN_90_TIME * 1.5

# FIX 1: Chỉ cần 1 frame quét trúng vạch đen là phanh khẩn cấp để không trượt lố
TURN_STOP_CONFIRM_FRAMES = 1

MARKER_SEQUENCE = (
    ['RED'] * 3 + ['BLUE'] * 2 +
    ['RED'] * 3 + ['BLUE'] * 2 +
    ['RED'] * 3 + ['BLUE'] * 4
)

# Robot đi theo tuyến: Nam trên x=-0.9 → Đông → Bắc trên x=-0.3 → Đông
# → Nam trên x=0.3 → Đông → Bắc trên x=0.9 → Tây về home (-0.9, 0.9)
BLUE_TURN_MAP = {1: 'LEFT',  2: 'LEFT',  3: 'RIGHT', 4: 'RIGHT',
                 5: 'LEFT',  6: 'LEFT',  7: 'LEFT',  8: 'STOP'}

# ============================================================
# 2. KHỞI TẠO ROBOT
# ============================================================
robot = Robot()
TIME_STEP = int(robot.getBasicTimeStep())
DT = TIME_STEP / 1000.0

left_motor  = robot.getDevice("left wheel motor")
right_motor = robot.getDevice("right wheel motor")
left_motor.setPosition(float("inf"))
right_motor.setPosition(float("inf"))
left_motor.setVelocity(0.0)
right_motor.setVelocity(0.0)

gs = []
for name in ["gs0", "gs1", "gs2"]:
    sensor = robot.getDevice(name)
    if sensor:
        sensor.enable(TIME_STEP)
        gs.append(sensor)

camera = robot.getDevice("camera")
if camera:
    camera.enable(TIME_STEP)

if not os.path.exists(CAPTURE_DIR):
    os.makedirs(CAPTURE_DIR)

# Hướng nhìn chụp ảnh (luôn hướng Đông để thấy cây dâu tây):
# - Đi Nam (x=-0.9 & x=0.3): rẽ LEFT = quay Đông
# - Đi Bắc (x=-0.3): rẽ RIGHT = quay Đông
PLANTS = [
    {'id': 1, 'look': 'LEFT'},  {'id': 2, 'look': 'LEFT'},  {'id': 3, 'look': 'LEFT'},
    {'id': 4, 'look': 'RIGHT'}, {'id': 5, 'look': 'RIGHT'}, {'id': 6, 'look': 'RIGHT'},
    {'id': 7, 'look': 'LEFT'},  {'id': 8, 'look': 'LEFT'},  {'id': 9, 'look': 'LEFT'},
]

# ============================================================
# 3. ĐỊNH NGHĨA TRẠNG THÁI VÀ HÀM BÁM LINE
# ============================================================
(STATE_FOLLOWING_LINE, STATE_ALIGN_RED, STATE_TURN_TO_PLANT, STATE_CAPTURE,
 STATE_TURN_BACK, STATE_LEAVE_RED_ZONE, STATE_ALIGN_BLUE, STATE_TURN_CORNER,
 STATE_LEAVE_BLUE_ZONE, STATE_FINISHED) = range(10)

def set_motors(lv, rv):
    left_motor.setVelocity(lv)
    right_motor.setVelocity(rv)

def line_track(L, C, R, speed=BASE_SPEED):
    left_dark   = L < DARK_THRESH
    center_dark = C < DARK_THRESH
    right_dark  = R < DARK_THRESH

    if center_dark:
        if not left_dark and not right_dark:   set_motors(speed, speed)
        elif left_dark and not right_dark:     set_motors(speed * 0.4, speed)
        elif not left_dark and right_dark:     set_motors(speed, speed * 0.4)
        else:                                  set_motors(speed, speed)
    elif left_dark:                            set_motors(speed * 0.1, speed)
    elif right_dark:                           set_motors(speed, speed * 0.1)
    else:                                      set_motors(speed * 0.6, speed * 0.6)

# ============================================================
# 4. VÒNG LẶP CHÍNH (PURE STATE MACHINE)
# ============================================================
state = STATE_FOLLOWING_LINE
plant_idx = 0
timer = 0.0
turn_direction = 'RIGHT'
marker_hit_count = 0      
turn_dark_count = 0       
marker_seq_idx = 0        
blue_visit_count = 0      # Đếm riêng số lần gặp vạch BLUE (tính đúng turn key)
debug_sensor_timer = 0.0

startup_timer = 0.0
is_startup = True

print("=" * 65)
print("[INIT] Da khoi dong he thong. Thoat khoi zone xuat phat...")
print(f"[INIT] Thu tu vach du kien:\n {MARKER_SEQUENCE}")
print("=" * 65)

while robot.step(TIME_STEP) != -1:
    gv = [gs[i].getValue() for i in range(3)]
    L, C, R = gv[0], gv[1], gv[2]

    if DEBUG_SENSORS:
        debug_sensor_timer += DT
        if debug_sensor_timer >= 0.5:
            debug_sensor_timer = 0.0
            print(f"    [DEBUG_SENSORS] L={L:.0f} C={C:.0f} R={R:.0f}")

    if is_startup:
        line_track(L, C, R)
        startup_timer += DT
        if startup_timer > 2.0:
            is_startup = False
            print("[NAV] Da vao line chinh. Bat dau quet vach...")
        continue

    # --------------------------------------------------------
    if state == STATE_FOLLOWING_LINE:
        line_track(L, C, R)

        if C > MARKER_THRESH:
            marker_hit_count += 1
        else:
            marker_hit_count = 0

        if marker_hit_count >= 2:
            marker_hit_count = 0
            set_motors(0, 0)
            timer = 0.0

            if marker_seq_idx < len(MARKER_SEQUENCE):
                expected = MARKER_SEQUENCE[marker_seq_idx]
            else:
                expected = 'NONE' 

            print(f"\n[MARKER] Vach #{marker_seq_idx + 1}/{len(MARKER_SEQUENCE)} -> {expected}")
            marker_seq_idx += 1

            if expected == 'RED':
                if plant_idx < len(PLANTS):
                    print(f"[NAV] Dang nhich vao tam cay #{plant_idx + 1}...")
                    state = STATE_ALIGN_RED
                else:
                    print("[IGNORE] Da chup het dau tay, bo qua vach do nay.")
                    state = STATE_LEAVE_RED_ZONE
            elif expected == 'BLUE':
                # Tính turn_direction NGAY TẠI ĐÂY để tránh đếm sai sau khi marker_seq_idx đã tăng
                blue_visit_count += 1
                turn_direction = BLUE_TURN_MAP.get(blue_visit_count, 'RIGHT')
                print(f"[NAV] Ngã tư BLUE lần {blue_visit_count} -> Rẽ {turn_direction}")
                state = STATE_ALIGN_BLUE
            else:
                print("[WARN] Vach ngoai du kien, tiep tuc bam line.")
                state = STATE_FOLLOWING_LINE

    # ------------------ XỬ LÝ VẠCH ĐỎ -----------------------
    elif state == STATE_ALIGN_RED:
        timer += DT
        # FIX 2: Bỏ line_track, đi thẳng mù để không bị đánh lái khi đè lên vạch ngang
        set_motors(BASE_SPEED * ALIGN_SPEED_FACTOR, BASE_SPEED * ALIGN_SPEED_FACTOR)
        if timer >= CENTER_ALIGN_TIME:
            set_motors(0, 0)
            timer = 0.0
            print(f"[NAV] Da vao tam cay #{plant_idx + 1}. Dang xoay 90 do...")
            state = STATE_TURN_TO_PLANT

    elif state == STATE_TURN_TO_PLANT:
        timer += DT
        p = PLANTS[plant_idx]
        if p['look'] == 'RIGHT': set_motors(TURN_SPEED, -TURN_SPEED)
        else:                    set_motors(-TURN_SPEED, TURN_SPEED)

        if timer >= TURN_90_TIME:
            set_motors(0, 0)
            timer = 0.0
            state = STATE_CAPTURE

    elif state == STATE_CAPTURE:
        timer += DT
        if timer >= 0.3:
            p = PLANTS[plant_idx]
            filename = f"{CAPTURE_DIR}/strawberry_{p['id']:02d}.jpg"
            if camera:
                camera.saveImage(filename, 95)
                print(f"[CAPTURE] [OK] Da chup cay #{p['id']}")
            timer = 0.0
            state = STATE_TURN_BACK

    elif state == STATE_TURN_BACK:
        timer += DT
        p = PLANTS[plant_idx]
        if p['look'] == 'RIGHT': set_motors(-TURN_SPEED, TURN_SPEED)
        else:                    set_motors(TURN_SPEED, -TURN_SPEED)

        if timer >= TURN_90_TIME:
            set_motors(0, 0)
            timer = 0.0
            plant_idx += 1
            state = STATE_LEAVE_RED_ZONE

    elif state == STATE_LEAVE_RED_ZONE:
        timer += DT
        line_track(L, C, R)
        if timer >= 1.5:
            timer = 0.0
            state = STATE_FOLLOWING_LINE

    # ------------------ XỬ LÝ VẠCH XANH ---------------------
    elif state == STATE_ALIGN_BLUE:
        timer += DT
        # Đi thẳng mù vào giữa ngã tư (không bám line để tránh bị đánh lái)
        set_motors(BASE_SPEED * ALIGN_SPEED_FACTOR, BASE_SPEED * ALIGN_SPEED_FACTOR)

        if timer >= (CENTER_ALIGN_TIME * 0.95):
            set_motors(0, 0)
            timer = 0.0
            # turn_direction đã được tính sẵn trong STATE_FOLLOWING_LINE khi phát hiện BLUE
            print(f"[NAV] Vao tam nga tu. Bat dau re {turn_direction}...")
            state = STATE_TURN_CORNER

    elif state == STATE_TURN_CORNER:
        if turn_direction == 'STOP':
            state = STATE_FINISHED
            continue

        timer += DT

        if timer < MIN_TURN_TIME:
            turn_dark_count = 0
            cur_turn_speed = TURN_SPEED
        else:
            # FIX 1: Khi đang tìm vạch, tốc độ giữ nguyên. Chỉ khi bắt được vạch mới giảm tốc đột ngột.
            cur_turn_speed = TURN_SPEED
            
            if C < DARK_THRESH:
                turn_dark_count += 1
            else:
                turn_dark_count = 0

        if turn_direction == 'RIGHT': set_motors(cur_turn_speed, -cur_turn_speed)
        else:                         set_motors(-cur_turn_speed, cur_turn_speed)

        # Phanh ngay khi chạm mép vạch đen
        if turn_dark_count >= TURN_STOP_CONFIRM_FRAMES:
            set_motors(0, 0)
            print(f"[NAV] Bắt line thành công ({timer:.2f}s). Thoát ngã tư...")
            timer = 0.0
            turn_dark_count = 0
            state = STATE_LEAVE_BLUE_ZONE
            
        elif timer >= MAX_TURN_TIME:
            set_motors(0, 0)
            print(f"[WARN] Quá {MAX_TURN_TIME:.2f}s chưa thấy line! Ép dừng.")
            timer = 0.0
            turn_dark_count = 0
            state = STATE_LEAVE_BLUE_ZONE

    elif state == STATE_LEAVE_BLUE_ZONE:
        timer += DT
        line_track(L, C, R)
        # Giai đoạn 1 (0 -> 0.6s): Chạy mù thoát hoàn toàn khỏi vạch ngang của ngã tư
        # Giai đoạn 2 (0.6s -> 2.5s): Bám line bình thường cho đến khi chuyển trạng thái
        if timer >= 2.5:
            timer = 0.0
            print("[NAV] Da thoat nga tu. Tro lai bam line...")
            state = STATE_FOLLOWING_LINE

    # ------------------ HOÀN THÀNH --------------------------
    elif state == STATE_FINISHED:
        set_motors(0, 0)
        print("\n=================================================================")
        print("[SUCCESS] ĐÃ VỀ ĐÚNG VỊ TRÍ XUẤT PHÁT (-0.9, -0.9)!")
        print("=================================================================")
        break