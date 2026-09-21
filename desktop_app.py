"""
================================================================================
BERRYVISION AI - NATIVE DESKTOP APP LAUNCHER (WINDOWS STANDALONE)
Dự án: Hệ thống AI giám sát dâu tây ngoại nhập trong nhà kính
================================================================================
"""

import os
import sys
import time
import subprocess
import urllib.request
import webbrowser

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SERVER_SCRIPT = os.path.join(BASE_DIR, "web_app", "server.py")
APP_URL = "http://localhost:5000"

def is_server_running():
    try:
        res = urllib.request.urlopen(f"{APP_URL}/api/status", timeout=1)
        return res.status == 200
    except Exception:
        return False

def start_server_background():
    if not is_server_running():
        print("🚀 Đang khởi động AI Greenhouse Server trong nền...")
        subprocess.Popen(
            [sys.executable, SERVER_SCRIPT],
            cwd=BASE_DIR,
            creationflags=getattr(subprocess, 'CREATE_NO_WINDOW', 0) if os.name == 'nt' else 0
        )
        # Wait up to 5s for server to start
        for _ in range(15):
            time.sleep(0.3)
            if is_server_running():
                print("✅ Máy chủ AI đã sẵn sàng!")
                break

def launch_standalone_window():
    """
    Mở ứng dụng dưới dạng cửa sổ phần mềm độc lập (App Mode) bằng Microsoft Edge / Chrome.
    Nếu không tìm thấy, mở qua trình duyệt mặc định.
    """
    # 1. Thử mở bằng Microsoft Edge App Mode (có sẵn trên 100% Windows 10/11)
    edge_paths = [
        os.path.expandvars(r"%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"),
        os.path.expandvars(r"%ProgramFiles%\Microsoft\Edge\Application\msedge.exe")
    ]
    for edge in edge_paths:
        if os.path.exists(edge):
            print("🪟 Mở cửa sổ Desktop App bằng Microsoft Edge Webview Frame...")
            subprocess.Popen([edge, f"--app={APP_URL}", "--window-size=1200,860", f"--app-id=BerryVisionAI"])
            return

    # 2. Thử mở bằng Google Chrome App Mode
    chrome_paths = [
        os.path.expandvars(r"%ProgramFiles%\Google\Chrome\Application\chrome.exe"),
        os.path.expandvars(r"%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"),
        os.path.expandvars(r"%LocalAppData%\Google\Chrome\Application\chrome.exe")
    ]
    for chrome in chrome_paths:
        if os.path.exists(chrome):
            print("🪟 Mở cửa sổ Desktop App bằng Google Chrome Frame...")
            subprocess.Popen([chrome, f"--app={APP_URL}", "--window-size=1200,860"])
            return

    # 3. Fallback: Mở trình duyệt mặc định
    print("🌐 Mở ứng dụng trên trình duyệt mặc định...")
    webbrowser.open(APP_URL)

def main():
    print("=" * 65)
    print("🍓 BERRYVISION AI - KHỞI ĐỘNG PHẦN MỀM DESKTOP")
    print("=" * 65)
    start_server_background()
    launch_standalone_window()
    print("🎉 Ứng dụng đã được khởi chạy thành công!")

if __name__ == '__main__':
    main()
