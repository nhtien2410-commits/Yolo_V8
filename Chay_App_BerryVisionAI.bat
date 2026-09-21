@echo off
chcp 65001 > nul
title BerryVision AI - Khoi Dong Ung Dung
echo =================================================================
echo   🍓 BERRYVISION AI - UNG DUNG GIAM SAT DAU TAY NHA KINH
echo =================================================================
echo.
echo [1/2] Dang kiem tra moi truong Python...
python --version > nul 2>&1
if errorlevel 1 (
    echo [LOI] Khong tim thay Python tren may tinh!
    pause
    exit /b
)

echo [2/2] Dang khoi dong cua so ung dung Desktop...
start "" python desktop_app.py

exit
