@echo off
title Roll Quest - AI Dice Adventure Launcher
echo =======================================================================
echo              ROLL QUEST: AI DICE ADVENTURE LAUNCHER
echo =======================================================================
echo.

:: 1. Start LM Studio Server via the official 'lms' CLI tool
echo [1/3] Checking and starting LM Studio Server...
call lms server start >nul 2>&1
if errorlevel 1 goto lms_failed
echo [SUCCESS] LM Studio Server is running!
goto lms_ok

:lms_failed
echo [NOTE] The 'lms' command-line tool was not found or failed.
echo Please make sure:
echo  - LM Studio is open.
echo  - Go to the Server Tab (Double-arrow icon on the left).
echo  - Click the "Start Server" button.
goto lms_ok

:lms_ok
echo.

:: 2. Check if gemma-4-12b-it-uncensored is already loaded in memory
echo [2/3] Checking if Gemma model is already loaded...
powershell -Command "$resp = Invoke-RestMethod -Uri 'http://127.0.0.1:1234/v1/models' -ErrorAction SilentlyContinue; if ($resp.data.id -contains 'gemma-4-12b-it-uncensored') { exit 0 } else { exit 1 }"
if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] Model 'gemma-4-12b-it-uncensored' is ALREADY loaded in LM Studio!
    goto load_ok
)

echo Loading Gemma model onto GPU...
call lms load gemma-4-12b-it-uncensored --gpu max
if errorlevel 1 goto load_failed
echo [SUCCESS] Model 'gemma-4-12b-it-uncensored' loaded onto GPU!
goto load_ok

:load_failed
echo [NOTE] Could not automatically load the model.
echo Please select and load "gemma-4-12b-it-uncensored" manually from the
echo dropdown menu at the top of LM Studio.
goto load_ok

:load_ok
echo.

:: 3. Launch game in the default web browser
echo [3/3] Launching Roll Quest in your browser...
start http://localhost:8080
echo.

:: 4. Run python local web server
echo =======================================================================
echo   Proxy Web Server is running on: http://localhost:8080
echo.
echo   To play on other devices on the same Wi-Fi, look at the IPs printed
echo   below once the server starts.
echo.
echo   To share online (public internet), close this and run:
echo   share_online.bat
echo.
echo   KEEP THIS WINDOW OPEN WHILE PLAYING. Press Ctrl+C to close.
echo =======================================================================
echo.
python server.py

echo.
echo =======================================================================
echo   Cleaning up: Unloading models and stopping server to free GPU memory...
echo =======================================================================
call lms unload --all
call lms server stop

pause
