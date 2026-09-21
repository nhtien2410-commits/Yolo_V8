"""
Controller E-puck Sensor-Driven (Full 9-Plant Patrol + Blue Corner Turning + Return to Home)
- Canh dung TAM VACH DO truoc khi xoay 90 do chup anh (chup dung 1 lan duy nhat / cay).
- Nhan dien GOC CUA XANH DUONG de queo 90 do chuyen luong ziczac.
- Tu dong quay ve vi tri xuat phat (-0.9, -0.9) va dung han.
"""
import os
import sys
import math
from controller import Robot

# ============================================================
# THAM SO
# ============================================================
BASE_SPEED       = 2.0    # Toc do di thang (rad/s) ~ 4.1 cm/s
TURN_SPEED       = 1.8    # Toc do quay (rad/s)
DARK_THRESH      = 450    # Duoi gia tri nay la vach den (< 450)
MARKER_THRESH    = 600    # Tren gia tri nay la vach do / vach xanh (> 600)
CAPTURE_DIR      = "C:/NCKH/captured_images"

# Thong so vat ly E-puck
WHEEL_RADIUS     = 0.0205 # 20.5 mm
AXLE_LENGTH      = 0.052  # 52 mm
SENSOR_TO_AXLE   = 0.035  # Khoang cach tu sensor gs1 den truc banh xe (3.5 cm)

# Thoi gian di 3.5cm de tam banh xe vao dung tam vach
CENTER_ALIGN_TIME = SENSOR_TO_AXLE / (BASE_SPEED * WHEEL_RADIUS)  # ~0.85s

# Thoi gian quay 90 do chuan
TURN_90_TIME = (math.pi / 2.0) * AXLE_LENGTH / (2.0 * TURN_SPEED * WHEEL_RADIUS)

# ============================================================
# KHOI TAO ROBOT
# ============================================================
robot = Robot()
TIME_STEP = int(robot.getBasicTimeStep())
DT = TIME_STEP / 1000.0

left_motor  = robot.getDevice("left wheel motor")
right_motor = robot.getDevice("right wheel motor")
if not left_motor or not right_motor:
    print("[ERROR] Khong tim thay dong co!")
    sys.exit(1)
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

PLANTS = [
    # Luong 0 (x = -0.9, di len +Y): dâu tay o ben PHAI (x = -0.6)
    {'id': 1, 'name': 'DauTay_0_0 (Cot 0, Hang 0)', 'look': 'RIGHT'},
    {'id': 2, 'name': 'DauTay_0_1 (Cot 0, Hang 1)', 'look': 'RIGHT'},
    {'id': 3, 'name': 'DauTay_0_2 (Cot 0, Hang 2)', 'look': 'RIGHT'},

    # Luong 1 (x = -0.3, di xuong -Y): dâu tay o ben TRAI (x = 0.0)
    {'id': 4, 'name': 'DauTay_1_2 (Cot 1, Hang 2)', 'look': 'LEFT'},
    {'id': 5, 'name': 'DauTay_1_1 (Cot 1, Hang 1)', 'look': 'LEFT'},
    {'id': 6, 'name': 'DauTay_1_0 (Cot 1, Hang 0)', 'look': 'LEFT'},

    # Luong 2 (x = +0.3, di len +Y): dâu tay o ben PHAI (x = +0.6)
    {'id': 7, 'name': 'DauTay_2_0 (Cot 2, Hang 0)', 'look': 'RIGHT'},
    {'id': 8, 'name': 'DauTay_2_1 (Cot 2, Hang 1)', 'look': 'RIGHT'},
    {'id': 9, 'name': 'DauTay_2_2 (Cot 2, Hang 2)', 'look': 'RIGHT'},
]

print("=" * 65)
print("[INIT] E-puck: Strawberry Patrol + Blue Corner Recognition")
print(f"[INIT] Center Align Time = {CENTER_ALIGN_TIME:.3f}s | Turn 90 Time = {TURN_90_TIME:.3f}s")
print("=" * 65)

def set_motors(lv, rv):
    left_motor.setVelocity(lv)
    right_motor.setVelocity(rv)

def line_track(L, C, R, speed=BASE_SPEED):
    """Bam line co ban"""
    left_dark   = L < DARK_THRESH
    center_dark = C < DARK_THRESH
    right_dark  = R < DARK_THRESH

    if center_dark:
        if not left_dark and not right_dark:
            set_motors(speed, speed)
        elif left_dark and not right_dark:
            set_motors(speed * 0.3, speed)
        elif not left_dark and right_dark:
            set_motors(speed, speed * 0.3)
        else:
            set_motors(speed, speed)
    elif left_dark:
        set_motors(speed * 0.1, speed)
    elif right_dark:
        set_motors(speed, speed * 0.1)
    else:
        set_motors(speed * 0.5, speed * 0.5)

# ============================================================
# STATE MACHINE CHINH
# ============================================================
state = 'SEEK_RED_MARKER'
plant_idx = 0
timer = 0.0
step_count = 0
stage = 'LANE_0'  # 'LANE_0', 'CROSS_TOP', 'LANE_1', 'CROSS_BOT', 'LANE_2', 'RETURN_1', 'RETURN_2', 'RETURN_3', 'FINISHED'
turn_direction = 'RIGHT'

while robot.step(TIME_STEP) != -1:
    step_count += 1
    gv = [gs[i].getValue() for i in range(3)]
    L, C, R = gv[0], gv[1], gv[2]

    # --- 1. BAM LINE VA TIM VACH DO TIEP THEO ---
    if state == 'SEEK_RED_MARKER':
        line_track(L, C, R)

        # Phat hien mep dau vach do: sensor giua sang (> MARKER_THRESH)
        if C > MARKER_THRESH:
            p = PLANTS[plant_idx]
            print(f"\n[DETECT_RED] Mui xe cham vach do #{p['id']} -> Dang nhich vao GIUA TAM VACH DO...")
            state = 'MOVE_TO_RED_CENTER'
            timer = 0.0

    # --- 2. NHICH THEM 3.5CM DE TAM TRUC XE VAO DUNG CHINH GIUA TAM VACH DO ---
    elif state == 'MOVE_TO_RED_CENTER':
        timer += DT
        line_track(L, C, R, speed=BASE_SPEED * 0.8)
        if timer >= CENTER_ALIGN_TIME:
            set_motors(0, 0)
            p = PLANTS[plant_idx]
            print(f"[CENTER_STOP] -> Tam robot da dung CHINH GIUA TAM vach do #{p['id']}: {p['name']}")
            state = 'ROTATE_TO_PLANT'
            timer = 0.0

    # --- 3. XOAY 90 DO HUONG VAO DAU TAY ---
    elif state == 'ROTATE_TO_PLANT':
        p = PLANTS[plant_idx]
        timer += DT
        if p['look'] == 'RIGHT':
            set_motors(TURN_SPEED, -TURN_SPEED)
        else:
            set_motors(-TURN_SPEED, TURN_SPEED)

        if timer >= TURN_90_TIME:
            set_motors(0, 0)
            state = 'CAPTURE_PHOTO'
            timer = 0.0

    # --- 4. DUNG YEN VA CHUP DUNG 1 TAM ANH ---
    elif state == 'CAPTURE_PHOTO':
        set_motors(0, 0)
        timer += DT
        if timer >= 0.3:
            p = PLANTS[plant_idx]
            filename = f"{CAPTURE_DIR}/strawberry_{p['id']:02d}.jpg"
            if camera:
                camera.saveImage(filename, 95)
                print(f"[CAPTURE] [OK] Da chup 1 anh cay #{p['id']}: {filename}")
            state = 'ROTATE_BACK'
            timer = 0.0

    # --- 5. XOAY 90 DO TRO LAI DUONG LINE ---
    elif state == 'ROTATE_BACK':
        p = PLANTS[plant_idx]
        timer += DT
        if p['look'] == 'RIGHT':
            set_motors(-TURN_SPEED, TURN_SPEED)
        else:
            set_motors(TURN_SPEED, -TURN_SPEED)

        if timer >= TURN_90_TIME:
            set_motors(0, 0)
            state = 'LEAVE_RED_ZONE'
            timer = 0.0

    # --- 6. CHAY THANG 2.0s RA KHOI VUNG VACH DO (KHOA NHAN DIEN CHO DEN KHI RA NGOAI) ---
    elif state == 'LEAVE_RED_ZONE':
        timer += DT
        line_track(L, C, R)
        if timer >= 2.0:
            plant_idx += 1
            # Kiem tra xem da chup het cay trong luong hien tai chua
            if (stage == 'LANE_0' and plant_idx == 3) or \
               (stage == 'LANE_1' and plant_idx == 6) or \
               (stage == 'LANE_2' and plant_idx == 9):
                print(f"\n[LANE_DONE] Da chup xong toan bo cay trong luong {stage}! Chuyen sang TIM GOC CUA XANH DUONG...")
                state = 'SEEK_BLUE_CORNER'
                timer = 0.0
            else:
                print(f"[RESUME] Di tiep tren line tim cay tiep theo #{plant_idx + 1}...")
                state = 'SEEK_RED_MARKER'
                timer = 0.0

    # --- 7. BAM LINE TIM GOC CUA XANH DUONG ---
    elif state == 'SEEK_BLUE_CORNER':
        line_track(L, C, R)
        # Phat hien vach goc cua xanh duong (sensor giua sang hoac cam bien 2 ben cham vach ngang)
        if C > MARKER_THRESH or L < DARK_THRESH or R < DARK_THRESH:
            set_motors(0, 0)
            print(f"[BLUE_CORNER_DETECTED] Da phat hien goc cua xanh duong tai {stage}!")
            state = 'ALIGN_CORNER_CENTER'
            timer = 0.0

    # --- 8. NHICH VAO GIUA GOC CUA XANH DUONG ---
    elif state == 'ALIGN_CORNER_CENTER':
        timer += DT
        set_motors(BASE_SPEED * 0.7, BASE_SPEED * 0.7)
        if timer >= CENTER_ALIGN_TIME * 0.9:
            set_motors(0, 0)
            state = 'TURN_CORNER'
            timer = 0.0

            # Xac dinh huong queo
            if stage == 'LANE_0':
                turn_direction = 'RIGHT'
            elif stage == 'CROSS_TOP':
                turn_direction = 'RIGHT'
            elif stage == 'LANE_1':
                turn_direction = 'LEFT'
            elif stage == 'CROSS_BOT':
                turn_direction = 'LEFT'
            elif stage == 'LANE_2':
                turn_direction = 'RIGHT'
            elif stage == 'RETURN_1':
                turn_direction = 'RIGHT'
            elif stage == 'RETURN_2':
                turn_direction = 'RIGHT'
            elif stage == 'RETURN_3':
                turn_direction = 'RIGHT'

            print(f"[TURN] Dang queo {turn_direction}...")

    # --- 9. QUAY GOC 90 DO ---
    elif state == 'TURN_CORNER':
        timer += DT
        if turn_direction == 'RIGHT':
            set_motors(TURN_SPEED, -TURN_SPEED)
        else:
            set_motors(-TURN_SPEED, TURN_SPEED)

        if timer >= TURN_90_TIME:
            set_motors(0, 0)
            timer = 0.0

            # Chuyen tiep giai doan
            if stage == 'LANE_0':
                stage = 'CROSS_TOP'
                state = 'LEAVE_CORNER_ZONE'
                print("[NAV] Dang di ngang qua dau Luong 1...")
            elif stage == 'CROSS_TOP':
                stage = 'LANE_1'
                state = 'LEAVE_CORNER_ZONE'
                print(f"[NAV] Da vao Luong 1! Tim cay #{plant_idx + 1}...")
            elif stage == 'LANE_1':
                stage = 'CROSS_BOT'
                state = 'LEAVE_CORNER_ZONE'
                print("[NAV] Dang di ngang qua dau Luong 2...")
            elif stage == 'CROSS_BOT':
                stage = 'LANE_2'
                state = 'LEAVE_CORNER_ZONE'
                print(f"[NAV] Da vao Luong 2! Tim cay #{plant_idx + 1}...")
            elif stage == 'LANE_2':
                stage = 'RETURN_1'
                state = 'LEAVE_CORNER_ZONE'
                print("\n[RETURN] 1/3: Dang di sang goc tren phai (0.9, 0.9)...")
            elif stage == 'RETURN_1':
                stage = 'RETURN_2'
                state = 'LEAVE_CORNER_ZONE'
                print("[RETURN] 2/3: Dang di doc xuong goc duoi phai (0.9, -0.9)...")
            elif stage == 'RETURN_2':
                stage = 'RETURN_3'
                state = 'LEAVE_CORNER_ZONE'
                print("[RETURN] 3/3: Dang di ve vi tri xuat phat (-0.9, -0.9)...")
            elif stage == 'RETURN_3':
                stage = 'FINISHED'
                state = 'FINISHED'

    # --- 10. CHAY 2.0s RA KHOI VUNG GOC CUA VUA QUEO ---
    elif state == 'LEAVE_CORNER_ZONE':
        timer += DT
        line_track(L, C, R)
        if timer >= 2.0:
            if stage in ['CROSS_TOP', 'CROSS_BOT', 'RETURN_1', 'RETURN_2', 'RETURN_3']:
                state = 'SEEK_BLUE_CORNER'
            else:
                state = 'SEEK_RED_MARKER'
            timer = 0.0

    # --- 11. HOAN THANH VA DUNG XE ---
    elif state == 'FINISHED':
        set_motors(0, 0)
        print("\n" + "=" * 65)
        print("[SUCCESS] DA VE DUNG VI TRI XUAT PHAT BAN DAU (-0.9, -0.9)!")
        print("[SUCCESS] ROBOT HOAN THANH XUAT SAC TOAN BO 9 CAY DAU TAY.")
        print("=" * 65 + "\n")
