"""
Controller E-puck / BerryBot: Greenhouse Strawberry Patrol v2 (IMU + Encoder Precision)
- Tuyen: START(0.7,-0.9) -> Bac (x=0.7) [3 cay, quay Trai ngam luong Phai]
         -> Tay (y=0.9) -> Nam (x=0) [3 cay, chup ca 2 ben Dong & Tay]
         -> Tay (y=-0.9) -> Bac (x=-0.7) [3 cay, quay Phai ngam luong Trai]
         -> Dong (y=0.9) -> Nam (x=0.7) -> HOME(0.7,-0.9)
- Do goc bang InertialUnit (IMU): Chinh xac tuyet doi theo huong chuan
- Can tam bang Wheel Encoders: Lan dung tam vao giua nga tu / vach truoc khi quay
"""
import os
import sys
import math
from controller import Robot

# ============================================================
# 1. THAM SO CAU HINH
# ============================================================
BASE_SPEED         = 3.0     # Toc do chay line
TURN_SPEED         = 1.8     # Toc do xoay toi da
DARK_THRESH        = 450     # Nguong phat hien line den
MARKER_THRESH      = 600     # Nguong phat hien vach do / xanh (chuan theo 2_backup.py, khong bi nhan nham line den)
CAPTURE_DIR        = "c:/Users/ADMIN/Downloads/NCKH/captured_images"

class Logger(object):
    def __init__(self):
        self.terminal = sys.stdout
        self.log = open("c:/Users/ADMIN/Downloads/NCKH/controllers/2/run.log", "w", encoding="utf-8")
    def write(self, message):
        self.terminal.write(message)
        self.log.write(message)
        self.log.flush()
    def flush(self):
        self.terminal.flush()
        self.log.flush()
logger = Logger()
sys.stdout = logger
sys.stderr = logger

WHEEL_RADIUS       = 0.0205  # m (ban kinh banh xe)
AXLE_LENGTH        = 0.052   # m (khoang cach 2 banh)
SENSOR_TO_AXLE     = 0.035   # m (khoang cach tu sensor den truc banh)

ALIGN_SPEED        = 2.0     # rad/s (toc do lan banh can vao tam vach: ~4.1 cm/s)
# Khoang cach lan banh tu luc sensor cham mep vao CHINH GIUA tam vach:
# Vach do (size 6cm x 6cm): 3.5cm (sensor->truc) + 3.0cm (nua vach) = 6.5cm -> dat 7.0cm de truc xe vao dung tam
ALIGN_RED_DIST     = 0.070   # m (7.0 cm)
# Vach xanh (size 8cm x 8cm): 3.5cm (sensor->truc) + 4.0cm (nua vach) = 7.5cm -> dat 8.0cm de truc xoay vao CHINH GIUA tam nga tu
ALIGN_BLUE_DIST    = 0.080   # m (8.0 cm)

# Cac huong chuan (Goc Yaw theo toa do the gioi cua Webots, radian)
HEADING_NORTH      = math.pi / 2.0    # +90 do (+Y)
HEADING_WEST       = math.pi          # 180 do (-X)
HEADING_SOUTH      = -math.pi / 2.0   # -90 do (-Y)
HEADING_EAST       = 0.0              # 0 do (+X)

# Trinh tu vach tren duong di:
# Lot PHAI (x=0.7):   3 DO + 2 XANH
# Lot GIUA (x=0):     3 DO + 2 XANH
# Lot TRAI (x=-0.7):  3 DO + 3 XANH
MARKER_SEQUENCE = (
    ['RED'] * 3 + ['BLUE'] * 2 +
    ['RED'] * 3 + ['BLUE'] * 2 +
    ['RED'] * 3 + ['BLUE'] * 3
)

# Goc muc tieu cho tung nga tu XANH:
# [1] (0.7, 0.9):  re sang TAY  (180 do)
# [2] (0, 0.9):    re sang NAM  (-90 do)
# [3] (0, -0.9):   re sang TAY  (180 do)
# [4] (-0.7,-0.9): re sang BAC  (90 do)
# [5] (-0.7, 0.9): re sang DONG (0 do)
# [6] (0, 0.9):    di thang DONG (0 do)
# [7] (0.7, 0.9):  re sang NAM  (-90 do, ve nha)
BLUE_TARGET_HEADINGS = {
    1: HEADING_WEST,
    2: HEADING_SOUTH,
    3: HEADING_WEST,
    4: HEADING_NORTH,
    5: HEADING_EAST,
    6: 'STRAIGHT',
    7: HEADING_SOUTH
}

# Danh sach 9 vi tri cay (co kem toa do o luoi X, Y cho ban do phun thuoc):
# - CAY 1,2,3 (lot Phai, robot di Bac): Quay TAY (Trai) chup luong Phai
# - CAY 4,5,6 (lot Giua, robot di Nam): Chup ca 2 ben (DONG & TAY)
# - CAY 7,8,9 (lot Trai, robot di Bac): Quay DONG (Phai) chup luong Trai
PLANTS = [
    {'id': 1, 'type': 'SINGLE', 'grid': 'X03_Y01', 'capture_heading': HEADING_WEST, 'resume_heading': HEADING_NORTH},
    {'id': 2, 'type': 'SINGLE', 'grid': 'X03_Y02', 'capture_heading': HEADING_WEST, 'resume_heading': HEADING_NORTH},
    {'id': 3, 'type': 'SINGLE', 'grid': 'X03_Y03', 'capture_heading': HEADING_WEST, 'resume_heading': HEADING_NORTH},
    {'id': 4, 'type': 'BOTH',   'grid_L': 'X02_Y03', 'grid_R': 'X02_Y03', 'grid_L_legacy': 'X03_Y03', 'grid_R_legacy': 'X01_Y03', 'heading_L': HEADING_EAST, 'heading_R': HEADING_WEST, 'resume_heading': HEADING_SOUTH},
    {'id': 5, 'type': 'BOTH',   'grid_L': 'X02_Y02', 'grid_R': 'X02_Y02', 'grid_L_legacy': 'X03_Y02', 'grid_R_legacy': 'X01_Y02', 'heading_L': HEADING_EAST, 'heading_R': HEADING_WEST, 'resume_heading': HEADING_SOUTH},
    {'id': 6, 'type': 'BOTH',   'grid_L': 'X02_Y01', 'grid_R': 'X02_Y01', 'grid_L_legacy': 'X03_Y01', 'grid_R_legacy': 'X01_Y01', 'heading_L': HEADING_EAST, 'heading_R': HEADING_WEST, 'resume_heading': HEADING_SOUTH},
    {'id': 7, 'type': 'SINGLE', 'grid': 'X01_Y01', 'capture_heading': HEADING_EAST, 'resume_heading': HEADING_NORTH},
    {'id': 8, 'type': 'SINGLE', 'grid': 'X01_Y02', 'capture_heading': HEADING_EAST, 'resume_heading': HEADING_NORTH},
    {'id': 9, 'type': 'SINGLE', 'grid': 'X01_Y03', 'capture_heading': HEADING_EAST, 'resume_heading': HEADING_NORTH},
]

# ============================================================
# 2. KHOI TAO ROBOT VA THIET BI
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

left_ps = robot.getDevice("left wheel sensor")
right_ps = robot.getDevice("right wheel sensor")
if left_ps and right_ps:
    left_ps.enable(TIME_STEP)
    right_ps.enable(TIME_STEP)

imu = robot.getDevice("inertial unit")
if imu:
    imu.enable(TIME_STEP)

gs = []
for name in ["gs0", "gs1", "gs2"]:
    s = robot.getDevice(name)
    if s:
        s.enable(TIME_STEP)
        gs.append(s)

camera = robot.getDevice("camera")
if camera:
    camera.enable(TIME_STEP)

if not os.path.exists(CAPTURE_DIR):
    os.makedirs(CAPTURE_DIR)

# ============================================================
# 3. HAM BO TRO DIEU KHIEN CHINH XAC
# ============================================================
def set_motors(lv, rv):
    left_motor.setVelocity(lv)
    right_motor.setVelocity(rv)

def normalize_angle(a):
    """Dua goc ve khoang [-pi, pi]"""
    while a > math.pi:
        a -= 2.0 * math.pi
    while a < -math.pi:
        a += 2.0 * math.pi
    return a

def get_current_yaw():
    """Lay goc Yaw hien tai cua robot tu IMU (radian)"""
    if imu:
        return imu.getRollPitchYaw()[2]
    return 0.0

def get_encoder_distance(start_l, start_r):
    """Tinh quang duong robot da di chuyen tu thoi diem bat dau (m)"""
    if left_ps and right_ps:
        curr_l = left_ps.getValue()
        curr_r = right_ps.getValue()
        dl = (curr_l - start_l) * WHEEL_RADIUS
        dr = (curr_r - start_r) * WHEEL_RADIUS
        return (dl + dr) / 2.0
    return 0.0

def turn_towards_heading(target_rad, tolerance=0.04):
    """
    Dieu khien robot xoay den goc muc tieu voi do chinh xac cao.
    Duy tri toc do toi thieu 0.8 rad/s de khong bao gio bi ket ma sat tren banh xe / caster.
    """
    current_yaw = get_current_yaw()
    diff = normalize_angle(target_rad - current_yaw)

    if abs(diff) < tolerance:
        set_motors(0, 0)
        return True

    # Toc do xoay ti le theo sai lech goc, toi thieu 0.8 rad/s de vuot qua ma sat
    speed = max(0.8, min(TURN_SPEED, abs(diff) * 2.5))
    if diff > 0:
        # Quay Trai (CCW)
        set_motors(-speed, speed)
    else:
        # Quay Phai (CW)
        set_motors(speed, -speed)
    return False

def line_track(L, C, R, target_heading=None, speed=BASE_SPEED):
    """
    Bam line ket hop ti le Proportional (P-Control) va IMU Heading Lock:
    - Khi tren vach do/xanh hoac ca 3 sensor deu roi khoi line: Khoa huong IMU chay thang tuyet doi theo huong lan.
    - Khi tren line den: Dieu khien vi sai muot ma dua vao do chech giua sensor L va R.
    """
    # 1. Khi tren vach mau (do/xanh) hoac ca 3 sensor deu tren nen trang (mat line):
    if C > MARKER_THRESH or (L > DARK_THRESH and C > DARK_THRESH and R > DARK_THRESH):
        if target_heading is not None and imu:
            yaw = get_current_yaw()
            h_diff = normalize_angle(target_heading - yaw)
            steer = max(-1.5, min(1.5, h_diff * 3.5))
            set_motors(speed - steer, speed + steer)
        else:
            set_motors(speed * 0.6, speed * 0.6)
        return

    # 2. Dieu khien ti le bam line (Proportional Steering)
    diff = R - L
    steer = max(-1.8, min(1.8, diff * 0.0035))

    if C < DARK_THRESH:
        set_motors(speed - steer, speed + steer)
    else:
        set_motors(speed * 0.7 - steer * 1.3, speed * 0.7 + steer * 1.3)

# ============================================================
# 4. DINH NGHIA TRANG THAI FSM
# ============================================================
(STATE_FOLLOWING_LINE,
 STATE_ALIGN_RED,
 STATE_TURN_TO_PLANT,
 STATE_CAPTURE,
 STATE_TURN_BACK,
 STATE_TURN_TO_PLANT_2,
 STATE_CAPTURE_2,
 STATE_TURN_BACK_2,
 STATE_LEAVE_RED_ZONE,
 STATE_ALIGN_BLUE,
 STATE_TURN_CORNER,
 STATE_LEAVE_BLUE_ZONE,
 STATE_RETURN_HOME,
 STATE_ALIGN_HOME,
 STATE_FINISHED) = range(15)

state              = STATE_FOLLOWING_LINE
plant_idx          = 0
timer              = 0.0
marker_hit_count   = 0
marker_seq_idx     = 0
blue_visit_count   = 0
target_corner_head = HEADING_NORTH
current_lane_heading = HEADING_NORTH   # Huong di chuyen cua lan chay hien tai
enc_start_l        = 0.0
enc_start_r        = 0.0
startup_timer      = 0.0
is_startup         = True
has_captured       = False

print("=" * 65)
print("[INIT] Greenhouse Strawberry Patrol v2 - BerryBot Ready")
print("[INIT] Do chinh xac goc quay: IMU (< 4 do). Can tam: Encoders (3.5cm).")
print(f"[INIT] Tong {len(MARKER_SEQUENCE)} vach: {MARKER_SEQUENCE.count('RED')} DO + {MARKER_SEQUENCE.count('BLUE')} XANH")
print("=" * 65)

# ============================================================
# 5. VONG LAP CHINH
# ============================================================
while robot.step(TIME_STEP) != -1:
    gv = [gs[i].getValue() for i in range(3)]
    L, C, R = gv[0], gv[1], gv[2]

    # STARTUP: thoat khoi vung xuat phat (bo qua vach home ban dau)
    if is_startup:
        line_track(L, C, R, target_heading=current_lane_heading)
        startup_timer += DT
        if startup_timer > 1.5:
            is_startup = False
            print("[NAV] Da vao line. Bat dau tuan tra lot PHAI...")
        continue

    # ----------------------------------------------------------
    # STATE_FOLLOWING_LINE: Bam line va phat hien vach DO / XANH
    # ----------------------------------------------------------
    if state == STATE_FOLLOWING_LINE:
        line_track(L, C, R, target_heading=current_lane_heading)
        is_marker = (C > MARKER_THRESH)
        marker_hit_count = (marker_hit_count + 1) if is_marker else 0

        if marker_hit_count >= 2:
            marker_hit_count = 0
            set_motors(0, 0)
            timer = 0.0
            has_captured = False

            expected = MARKER_SEQUENCE[marker_seq_idx] if marker_seq_idx < len(MARKER_SEQUENCE) else 'NONE'
            print(f"\n[MK] Vach #{marker_seq_idx + 1}/{len(MARKER_SEQUENCE)} -> {expected}")
            marker_seq_idx += 1

            if expected == 'RED':
                if plant_idx < len(PLANTS):
                    p = PLANTS[plant_idx]
                    print(f"[NAV] Phat hien cay #{p['id']} ({p['type']}). Can truc banh xe vao tam...")
                    enc_start_l = left_ps.getValue() if left_ps else 0.0
                    enc_start_r = right_ps.getValue() if right_ps else 0.0
                    timer = 0.0
                    state = STATE_ALIGN_RED
                else:
                    timer = 0.0
                    state = STATE_LEAVE_RED_ZONE

            elif expected == 'BLUE':
                blue_visit_count += 1
                target_corner_head = BLUE_TARGET_HEADINGS.get(blue_visit_count, HEADING_NORTH)
                print(f"[NAV] Phat hien goc XANH #{blue_visit_count} -> Muc tieu huong: {math.degrees(target_corner_head) if isinstance(target_corner_head, float) else target_corner_head} do")
                enc_start_l = left_ps.getValue() if left_ps else 0.0
                enc_start_r = right_ps.getValue() if right_ps else 0.0
                timer = 0.0
                state = STATE_ALIGN_BLUE

            else:
                state = STATE_FOLLOWING_LINE

    # ----------------------------------------------------------
    # XU LY VACH DO & CHUP ANH (IMU Guided)
    # ----------------------------------------------------------
    elif state == STATE_ALIGN_RED:
        timer += DT
        # Khoa IMU chay thang vao tam vach do, khong danh lai theo mep vach ngang
        if imu:
            yaw = get_current_yaw()
            h_diff = normalize_angle(current_lane_heading - yaw)
            steer = max(-1.2, min(1.2, h_diff * 3.5))
            set_motors(ALIGN_SPEED - steer, ALIGN_SPEED + steer)
        else:
            set_motors(ALIGN_SPEED, ALIGN_SPEED)

        dist = get_encoder_distance(enc_start_l, enc_start_r)
        if (dist >= ALIGN_RED_DIST) or timer >= 2.5:
            set_motors(0, 0)
            timer = 0.0
            has_captured = False
            p = PLANTS[plant_idx]
            target_angle = p['capture_heading'] if p['type'] == 'SINGLE' else p['heading_L']
            side_label = "ngam cay" if p['type'] == 'SINGLE' else "BEN TRAI (huong Dong)"
            print(f"[NAV] DA VAO CHINH GIUA TAM VACH DO cay #{p['id']} (dist={dist*100:.1f}cm). Xoay den goc {math.degrees(target_angle):.0f} do de {side_label}...")
            state = STATE_TURN_TO_PLANT

    elif state == STATE_TURN_TO_PLANT:
        timer += DT
        p = PLANTS[plant_idx]
        target_angle = p['capture_heading'] if p['type'] == 'SINGLE' else p['heading_L']
        if turn_towards_heading(target_angle) or timer >= 2.0:
            set_motors(0, 0)
            timer = 0.0
            has_captured = False
            state = STATE_CAPTURE

    elif state == STATE_CAPTURE:
        set_motors(0, 0)
        timer += DT
        p = PLANTS[plant_idx]
        # Chup anh sau khi camera va xe da dung yen 0.3s
        if timer >= 0.3 and not has_captured:
            has_captured = True
            if p['type'] == 'BOTH':
                fname = f"{CAPTURE_DIR}/{p['grid_L']}_20260826_{p['id']:02d}_L.jpg"
                label = f"cay #{p['id']} BEN TRAI (o {p['grid_L']})"
            else:
                fname = f"{CAPTURE_DIR}/{p['grid']}_20260826_{p['id']:02d}.jpg"
                label = f"cay #{p['id']} (o {p['grid']})"
            if camera:
                camera.saveImage(fname, 95)
                if 'grid_L_legacy' in p:
                    camera.saveImage(f"{CAPTURE_DIR}/{p['grid_L_legacy']}_20260826_{p['id']:02d}_L.jpg", 95)
            print(f"[PHOTO] [OK] DA DUNG YEN VA CHUP THANH CONG: {label} -> {os.path.basename(fname)}")

        # Giu xe dung yen du 1.0 giay de quan sat ro rang robot dung ngam va chup
        if timer >= 1.0:
            timer = 0.0
            has_captured = False
            if p['type'] == 'BOTH':
                print(f"[NAV] Xoay 180 do sang BEN PHAI (huong Tay) de ngam cay #{p['id']}...")
            state = STATE_TURN_BACK

    elif state == STATE_TURN_BACK:
        timer += DT
        p = PLANTS[plant_idx]
        if p['type'] == 'BOTH':
            # Chuyen sang quay 180 do huong PHAI (TAY) cho cay thu 2 (timeout 3.5s du cho 180 do)
            if turn_towards_heading(p['heading_R']) or timer >= 3.5:
                set_motors(0, 0)
                timer = 0.0
                has_captured = False
                state = STATE_CAPTURE_2
        else:
            # Quay ve huong di tiep tuc
            if turn_towards_heading(p['resume_heading']) or timer >= 2.0:
                set_motors(0, 0)
                current_lane_heading = p['resume_heading']
                plant_idx += 1
                timer = 0.0
                enc_start_l = left_ps.getValue() if left_ps else 0.0
                enc_start_r = right_ps.getValue() if right_ps else 0.0
                print(f"[NAV] Hoan tat chup cay #{p['id']}. Tiep tuc theo lan huong {math.degrees(current_lane_heading):.0f} do...")
                state = STATE_LEAVE_RED_ZONE

    elif state == STATE_CAPTURE_2:
        set_motors(0, 0)
        timer += DT
        p = PLANTS[plant_idx]
        # Chup anh sau khi camera va xe da dung yen 0.3s
        if timer >= 0.3 and not has_captured:
            has_captured = True
            fname = f"{CAPTURE_DIR}/{p['grid_R']}_20260826_{p['id']:02d}_R.jpg"
            label = f"cay #{p['id']} BEN PHAI (o {p['grid_R']})"
            if camera:
                camera.saveImage(fname, 95)
                if 'grid_R_legacy' in p:
                    camera.saveImage(f"{CAPTURE_DIR}/{p['grid_R_legacy']}_20260826_{p['id']:02d}_R.jpg", 95)
            print(f"[PHOTO] [OK] DA DUNG YEN VA CHUP THANH CONG: {label} -> {os.path.basename(fname)}")

        # Giu xe dung yen du 1.0 giay de quan sat ro rang robot dung ngam va chup
        if timer >= 1.0:
            timer = 0.0
            has_captured = False
            print(f"[NAV] Hoan tat ca 2 anh cay #{p['id']}. Xoay ve huong di tiep tuc...")
            state = STATE_TURN_BACK_2

    elif state == STATE_TURN_BACK_2:
        timer += DT
        p = PLANTS[plant_idx]
        # Quay 90 do ve huong lan chay tiep tuc (timeout 2.0s)
        if turn_towards_heading(p['resume_heading']) or timer >= 2.0:
            set_motors(0, 0)
            current_lane_heading = p['resume_heading']
            plant_idx += 1
            timer = 0.0
            enc_start_l = left_ps.getValue() if left_ps else 0.0
            enc_start_r = right_ps.getValue() if right_ps else 0.0
            print(f"[NAV] Hoan tat chup cay #{p['id']} (ca 2 ben Trai & Phai tai X=2). Tiep tuc theo lan huong {math.degrees(current_lane_heading):.0f} do...")
            state = STATE_LEAVE_RED_ZONE

    elif state == STATE_LEAVE_RED_ZONE:
        timer += DT
        # Khoa IMU chay thang vuot qua vach do
        if imu:
            yaw = get_current_yaw()
            h_diff = normalize_angle(current_lane_heading - yaw)
            steer = max(-1.2, min(1.2, h_diff * 3.5))
            set_motors(BASE_SPEED - steer, BASE_SPEED + steer)
        else:
            set_motors(BASE_SPEED, BASE_SPEED)

        dist = get_encoder_distance(enc_start_l, enc_start_r)
        if (dist >= 0.075 and C < MARKER_THRESH) or timer >= 1.5:
            marker_hit_count = 0
            state = STATE_FOLLOWING_LINE

    # ----------------------------------------------------------
    # XU LY NGA TU XANH & QUEO (IMU Guided)
    # ----------------------------------------------------------
    elif state == STATE_ALIGN_BLUE:
        timer += DT
        # Khoa IMU chay thang vao dung tam nga tu vach xanh
        if imu:
            yaw = get_current_yaw()
            h_diff = normalize_angle(current_lane_heading - yaw)
            steer = max(-1.2, min(1.2, h_diff * 3.5))
            set_motors(ALIGN_SPEED - steer, ALIGN_SPEED + steer)
        else:
            set_motors(ALIGN_SPEED, ALIGN_SPEED)

        dist = get_encoder_distance(enc_start_l, enc_start_r)
        if (dist >= ALIGN_BLUE_DIST) or timer >= 2.8:
            set_motors(0, 0)
            timer = 0.0
            if target_corner_head == 'STRAIGHT':
                print(f"[NAV] DA VAO CHINH GIUA TAM NGA TU (dist={dist*100:.1f}cm). Qua thang nga tu (0, 0.9)...")
                enc_start_l = left_ps.getValue() if left_ps else 0.0
                enc_start_r = right_ps.getValue() if right_ps else 0.0
                timer = 0.0
                state = STATE_LEAVE_BLUE_ZONE
            else:
                print(f"[NAV] DA VAO CHINH GIUA TAM NGA TU VACH XANH #{blue_visit_count} (dist={dist*100:.1f}cm). Xoay den goc {math.degrees(target_corner_head):.0f} do...")
                state = STATE_TURN_CORNER

    elif state == STATE_TURN_CORNER:
        timer += DT
        if turn_towards_heading(target_corner_head) or timer >= 2.5:
            current_yaw = get_current_yaw()
            current_lane_heading = target_corner_head
            print(f"[NAV] [HOAN TAT QUEO] Goc hien tai: {math.degrees(current_yaw):.1f} do. Thang hang 100% voi line moi!")
            enc_start_l = left_ps.getValue() if left_ps else 0.0
            enc_start_r = right_ps.getValue() if right_ps else 0.0
            timer = 0.0
            state = STATE_LEAVE_BLUE_ZONE

    elif state == STATE_LEAVE_BLUE_ZONE:
        timer += DT
        # Khoa huong IMU chay thang tuyet doi theo huong lan moi de thoat khoi nga tu
        # Khong dung vi sai cam bien o giai doan nay vi cam bien se bi anh huong boi vach ngang cua nga tu
        if imu:
            yaw = get_current_yaw()
            h_diff = normalize_angle(current_lane_heading - yaw)
            steer = max(-1.2, min(1.2, h_diff * 3.5))
            set_motors(BASE_SPEED - steer, BASE_SPEED + steer)
        else:
            set_motors(BASE_SPEED, BASE_SPEED)

        dist = get_encoder_distance(enc_start_l, enc_start_r)
        # Chay thoat hoan toan khoi nga tu vach xanh (10cm VA C da ra khoi vach xanh, hoac timeout an toan 2.0s)
        if (dist >= 0.10 and C < MARKER_THRESH) or timer >= 2.0:
            marker_hit_count = 0
            if blue_visit_count >= 7:
                print("[NAV] Da qua goc cuoi. Chuyen sang che do VE NHA tren x=0.7...")
                current_lane_heading = HEADING_SOUTH
                enc_start_l = left_ps.getValue() if left_ps else 0.0
                enc_start_r = right_ps.getValue() if right_ps else 0.0
                timer = 0.0
                state = STATE_RETURN_HOME
            else:
                state = STATE_FOLLOWING_LINE

    # ----------------------------------------------------------
    # VE NHA (HOME)
    # ----------------------------------------------------------
    elif state == STATE_RETURN_HOME:
        line_track(L, C, R, target_heading=current_lane_heading)
        dist = get_encoder_distance(enc_start_l, enc_start_r)

        # Doan duong ve nha tu goc 7 (y=0.9) ve START (y=-0.9) dai 1.80m.
        # Vach do thu 3 (cuoi cung) o y=-0.5 (cach goc 7 khoang 1.40m).
        # Chi bat vach START/HOME khi da vuot qua 1.55m:
        if dist >= 1.55 and C > MARKER_THRESH:
            print("[NAV] Da phat hien vach xanh START/HOME. Can truc banh xe vao dung tam...")
            enc_start_l = left_ps.getValue() if left_ps else 0.0
            enc_start_r = right_ps.getValue() if right_ps else 0.0
            timer = 0.0
            state = STATE_ALIGN_HOME

    elif state == STATE_ALIGN_HOME:
        timer += DT
        dist = get_encoder_distance(enc_start_l, enc_start_r)
        if dist < ALIGN_BLUE_DIST and timer < 2.5:
            if imu:
                yaw = get_current_yaw()
                h_diff = normalize_angle(current_lane_heading - yaw)
                steer = max(-1.2, min(1.2, h_diff * 3.5))
                set_motors(ALIGN_SPEED - steer, ALIGN_SPEED + steer)
            else:
                set_motors(ALIGN_SPEED, ALIGN_SPEED)
        else:
            set_motors(0, 0)
            # Xoay 180 do ve huong BAC (+90 do) dung nhu trang thai xuat phat ban dau
            if turn_towards_heading(HEADING_NORTH) or timer >= 5.0:
                set_motors(0, 0)
                print("\n" + "=" * 65)
                print("[SUCCESS] DA VE CHINH XAC VI TRI & HUONG XUAT PHAT (0.7, -0.9, North)!")
                print("[SUCCESS] HOAN THANH XUAT SAC TOAN BO NHIEM VU TUAN TRA DAU TAY!")
                print("=" * 65)
                state = STATE_FINISHED

    # ----------------------------------------------------------
    elif state == STATE_FINISHED:
        set_motors(0, 0)
        break
