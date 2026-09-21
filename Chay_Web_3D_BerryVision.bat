@echo off
title BerryVisionAI 3D Universe - Smart Greenhouse NCKH
chcp 65001 > nul
echo =================================================================
echo  🍓 BERRYVISION AI 3D SPATIAL UNIVERSE
echo  🏛️ Khởi chạy không gian 3D tương tác React + Three.js + R3F
echo =================================================================
echo.

set "PATH=C:\Users\ADMIN\AppData\Local\Programs\nodejs;%PATH%"

cd /d "%~dp0berryvision_3d_web"

echo 🚀 Đang khởi chạy máy chủ phát triển Vite 3D...
start http://localhost:5173
npm run dev
