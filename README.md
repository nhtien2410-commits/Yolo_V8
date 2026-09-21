# ðŸ“ BerryVision AI â€” Smart Greenhouse Monitoring Robot & Vision Pipeline

> **Äá» tÃ i NghiÃªn cá»©u Khoa há»c (NCKH):** á»¨ng dá»¥ng cÃ´ng nghá»‡ thá»‹ giÃ¡c mÃ¡y tÃ­nh vÃ  xe tá»± hÃ nh bÃ¡m line khÃ´ng gian trong theo dÃµi sá»©c khá»e cá»§a cÃ¢y trá»“ng (DÃ¢u tÃ¢y / DÆ°a lÆ°á»›i) trong nhÃ  kÃ­nh cÃ´ng nghá»‡ cao.

[![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=flat&logo=python&logoColor=white)](https://python.org)
[![YOLOv8](https://img.shields.io/badge/AI-YOLOv8%20Object%20Detection-00FFFF?style=flat)](https://ultralytics.com)
[![Webots](https://img.shields.io/badge/Simulation-Cyberbotics%20Webots-E95420?style=flat)](https://cyberbotics.com)
[![React](https://img.shields.io/badge/Frontend-React%20%7C%20Three.js%20(R3F)-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev)
 [![License](https://img.shields.io/badge/License-Academic%20Research-green.svg)](#)

[![Live Demo](https://img.shields.io/badge/Live_Demo-BerryVision_Web_2D-FF0000?style=for-the-badge&logo=vercel)](https://yolo-v8-psi.vercel.app)

---

## ðŸ“Œ Giá»›i Thiá»‡u Äá» TÃ i

Trong canh tÃ¡c nÃ´ng nghiá»‡p cÃ´ng nghá»‡ cao, viá»‡c giÃ¡m sÃ¡t tá»«ng cÃ¡ thá»ƒ cÃ¢y thÆ°á»ng gáº·p trá»Ÿ ngáº¡i lá»›n:
1. **Láº¯p Ä‘áº·t hÃ ng loáº¡t camera gÃ³c rá»™ng cá»‘ Ä‘á»‹nh:** Tá»‘n kÃ©m chi phÃ­ Ä‘áº§u tÆ° háº¡ táº§ng, Ä‘i dÃ¢y phá»©c táº¡p vÃ  gÃ³c nhÃ¬n tá»« trÃªn cao khÃ´ng thá»ƒ soi rÃµ cÃ¡c á»• bá»‡nh náº¥m, Ä‘á»‘m lÃ¡ á»Ÿ máº·t dÆ°á»›i tÃ¡n.
2. **Kiá»ƒm tra thá»§ cÃ´ng:** Tá»‘n nhÃ¢n lá»±c, dá»… bá» sÃ³t giai Ä‘oáº¡n á»§ bá»‡nh ban Ä‘áº§u.

**BerryVision** Ä‘á» xuáº¥t giáº£i phÃ¡p Ä‘á»™t phÃ¡:
* **01 Robot tá»± hÃ nh bÃ¡m line cÆ¡ Ä‘á»™ng (BerryBot):** Di chuyá»ƒn tuáº§n tra theo lÆ°á»›i tá»a Ä‘á»™ $(X, Y)$ chuáº©n hÃ³a trong nhÃ  kÃ­nh, giáº£m tá»›i 80% chi phÃ­ so vá»›i há»‡ thá»‘ng camera cá»‘ Ä‘á»‹nh.
* **CÆ¡ cháº¿ chá»¥p cáº­n cáº£nh (Macro-imaging) káº¿t há»£p kÃ­nh phÃ¢n cá»±c CPL & LED Strobe:** Triá»‡t tiÃªu hiá»‡n tÆ°á»£ng lÃ³a nÆ°á»›c vÃ  tÃ¡n xáº¡ Ã¡nh sÃ¡ng máº·t trá»i, chá»¥p rÃµ tá»«ng Ä‘á»‘m náº¥m pháº¥n tráº¯ng hoáº·c rá»‰ sáº¯t nhá» dÆ°á»›i 0.5 mm.
* **AI YOLOv8 & Giao diá»‡n giÃ¡m sÃ¡t sá»‘ hÃ³a Web 3D:** Tá»± Ä‘á»™ng phÃ¡t hiá»‡n, Ä‘á»‹nh vá»‹ chÃ­nh xÃ¡c Ã´ cÃ¢y bá»‹ bá»‡nh, giÃºp nÃ´ng dÃ¢n phun thuá»‘c cá»¥c bá»™, tiáº¿t kiá»‡m 70% lÆ°á»£ng hÃ³a cháº¥t báº£o vá»‡ thá»±c váº­t.

---

## ðŸ›ï¸ Kiáº¿n TrÃºc Há»‡ Thá»‘ng

```mermaid
graph TD
    subgraph Hardware [Pháº§n cá»©ng Robot BerryBot]
        A[Nguá»“n: Pack Li-ion 6 Cell 18650 2S3P 7.4V 9600mAh] --> B[Máº¡ch Buck DC-DC 5V/5A]
        B --> C[Raspberry Pi Zero 2W / CM4]
        B --> D[STM32 / RP2040 Real-Time Controller]
        D --> E[Driver TB6612FNG + JGB37-520 Metal Gear Motors]
        C -->|MIPI CSI 2-Lane| F[Camera Sony IMX219 8MP Macro + KÃ­nh CPL]
        D -->|PWM Pulse| G[LED Flash Strobe 3W High-CRI]
        D -->|5 Channels| H[Cáº£m biáº¿n dÃ² Line TCRT5000 + IMU BNO085]
        A <-->|Tiáº¿p Ä‘iá»ƒm cÆ¡ khÃ­| Dock[Tráº¡m sáº¡c tá»± Ä‘á»™ng BLUE_HOME 8.4V/3A]
    end

    subgraph Software [Pháº§n má»m & AI]
        C -->|Dá»¯ liá»‡u áº£nh & Tá»a Ä‘á»™| Pipe[AI Pipeline - YOLOv8 Detection]
        Pipe --> DB[(Dá»¯ liá»‡u cháº©n Ä‘oÃ¡n bá»‡nh)]
        DB --> UI1[Desktop App: GiÃ¡m sÃ¡t cá»¥c bá»™]
        DB --> UI2[BerryVision 3D Universe: Web R3F Dashboard]
    end
```

---

## ðŸ“‚ Cáº¥u TrÃºc MÃ£ Nguá»“n (Repository Structure)

```text
â”œâ”€â”€ ai_pipeline/               # Pipeline huáº¥n luyá»‡n, dá»± Ä‘oÃ¡n & xá»­ lÃ½ mÃ´ hÃ¬nh AI
â”œâ”€â”€ controllers/               # MÃ£ Ä‘iá»u khiá»ƒn robot bÃ¡m line trong mÃ´i trÆ°á»ng Webots
â”œâ”€â”€ worlds/                    # KhÃ´ng gian mÃ´ phá»ng nhÃ  kÃ­nh 3D (.wbt)
â”œâ”€â”€ protos/                    # Äá»‹nh nghÄ©a cÃ¡c mÃ´ hÃ¬nh robot vÃ  Ä‘á»‘i tÆ°á»£ng 3D
â”œâ”€â”€ web_app/                   # Backend & API server quáº£n trá»‹
â”œâ”€â”€ berryvision_3d_web/        # Dashboard giÃ¡m sÃ¡t khÃ´ng gian 3D tÆ°Æ¡ng tÃ¡c (React + Three.js)
â”œâ”€â”€ berryvision_v2_react/      # á»¨ng dá»¥ng Web Dashboard phiÃªn báº£n React V2
â”œâ”€â”€ desktop_app.py             # á»¨ng dá»¥ng Desktop Ä‘iá»u khiá»ƒn vÃ  theo dÃµi cá»¥c bá»™
â”œâ”€â”€ hardware_design_bom.md     # Báº£n váº½ thiáº¿t káº¿ pháº§n cá»©ng & Danh má»¥c linh kiá»‡n (BOM)
â”œâ”€â”€ Chay_App_BerryVisionAI.bat # Script khá»Ÿi Ä‘á»™ng á»©ng dá»¥ng Desktop nhanh
â”œâ”€â”€ Chay_Web_3D_BerryVision.bat# Script khá»Ÿi Ä‘á»™ng Web 3D Dashboard nhanh
â””â”€â”€ README.md                  # TÃ i liá»‡u giá»›i thiá»‡u Ä‘á» tÃ i
```

---

## âš¡ HÆ°á»›ng Dáº«n CÃ i Äáº·t & Cháº¡y Thá»­ Nghiá»‡m

### 1. YÃªu Cáº§u MÃ´i TrÆ°á»ng
* **Há»‡ Ä‘iá»u hÃ nh:** Windows 10/11 hoáº·c Ubuntu 20.04/22.04 LTS
* **Python:** 3.9+ trá»Ÿ lÃªn
* **Node.js:** v18.0+ vÃ  npm
* **Cyberbotics Webots:** PhiÃªn báº£n R2023b hoáº·c má»›i hÆ¡n

### 2. Cháº¡y á»¨ng Dá»¥ng Desktop (BerryVision AI)
1. CÃ i Ä‘áº·t cÃ¡c thÆ° viá»‡n phá»¥ thuá»™c:
   ```bash
   pip install opencv-python ultralytics PyQt5 pillow
   ```
2. Cháº¡y trá»±c tiáº¿p qua file script hoáº·c terminal:
   ```bash
   python desktop_app.py
   # hoáº·c nháº¥p Ä‘Ãºp vÃ o Chay_App_BerryVisionAI.bat
   ```

### 3. Cháº¡y Web 3D Spatial Universe (React + Three.js)
1. Di chuyá»ƒn vÃ o thÆ° má»¥c Web 3D vÃ  cÃ i Ä‘áº·t node packages:
   ```bash
   cd berryvision_3d_web
   npm install
   ```
2. Khá»Ÿi cháº¡y mÃ¡y chá»§ phÃ¡t triá»ƒn cá»¥c bá»™:
   ```bash
   npm run dev
   ```
3. Truy cáº­p vÃ o trÃ¬nh duyá»‡t: `http://localhost:5173`

### 4. Khá»Ÿi Äá»™ng MÃ´ Phá»ng Webots
* Má»Ÿ pháº§n má»m **Cyberbotics Webots**.
* Chá»n `File` -> `Open World...` -> má»Ÿ file `worlds/NCKH_v2.wbt`.
* Nháº¥n nÃºt **Play** trÃªn thanh cÃ´ng cá»¥ Ä‘á»ƒ xem xe tá»± hÃ nh dÃ² line tuáº§n tra nhÃ  kÃ­nh vÃ  kÃ­ch hoáº¡t camera Macro.

---

## ðŸ“Š MÃ´ HÃ¬nh TrÃ­ Tuá»‡ NhÃ¢n Táº¡o (AI Pipeline)

* **Kiáº¿n trÃºc:** YOLOv8 (nano / small) tá»‘i Æ°u hÃ³a cháº¡y suy luáº­n thá»i gian thá»±c trÃªn vi xá»­ lÃ½ biÃªn.
* **CÃ¡c lá»›p bá»‡nh phÃ¡t hiá»‡n chÃ­nh:**
  * Bá»‡nh pháº¥n tráº¯ng (*Powdery Mildew*)
  * Bá»‡nh Ä‘á»‘m máº¯t chim / Ä‘á»‘m rá»‰ sáº¯t lÃ¡ (*Leaf Spot / Rust*)
  * Tráº¡ng thÃ¡i sÃ¢u bá» / rá»‡p háº¡i dÃ¢u tÃ¢y
  * TrÃ¡i chÃ­n / TrÃ¡i non Ä‘áº¡t Ä‘á»™ sinh trÆ°á»Ÿng
* **Trá»ng sá»‘ mÃ´ hÃ¬nh (Weights):** CÃ¡c file weights huáº¥n luyá»‡n sáºµn (`best.onnx`, `yolov8s.pt`) cÃ³ thá»ƒ Ä‘Æ°á»£c táº£i tá»« má»¥c **Releases** hoáº·c liÃªn káº¿t lÆ°u trá»¯ Ä‘Ã¡m mÃ¢y cá»§a dá»± Ã¡n.

---

## ðŸ› ï¸ Thiáº¿t Káº¿ Pháº§n Cá»©ng & Dá»± ToÃ¡n Linh Kiá»‡n (BOM)

Chi tiáº¿t danh má»¥c linh kiá»‡n, máº¡ch Ä‘iá»u khiá»ƒn, thÃ´ng sá»‘ Ä‘á»™ng cÆ¡ vÃ  tráº¡m sáº¡c tá»± Ä‘á»™ng `BLUE_HOME` Ä‘Æ°á»£c mÃ´ táº£ Ä‘áº§y Ä‘á»§ táº¡i:
ðŸ‘‰ Xem chi tiáº¿t táº¡i [hardware_design_bom.md](hardware_design_bom.md).

---

## ðŸ‘¥ TÃ¡c Giáº£ & Báº£n Quyá»n

* **Äá» tÃ i:** NghiÃªn cá»©u Khoa há»c Sinh viÃªn / CÃ¡n bá»™ nghiÃªn cá»©u
* **GitHub Repository:** [https://github.com/nhtien2410-commits/Tie](https://github.com/nhtien2410-commits/Tie)
* Má»i Ä‘Ã³ng gÃ³p vÃ  pháº£n há»“i há»c thuáº­t xin gá»­i vá» má»¥c **Issues** hoáº·c **Pull Requests** cá»§a dá»± Ã¡n.

