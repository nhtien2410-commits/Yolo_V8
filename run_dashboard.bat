@echo off
title AI Greenhouse Strawberry Dashboard
echo ============================================================
echo   KHOI DONG AI SMART GREENHOUSE STRAWBERRY WEB DASHBOARD
echo ============================================================
echo.
echo Dang khoi dong Web Server tai cong 5000...
start http://localhost:5000
python web_app/server.py
pause
