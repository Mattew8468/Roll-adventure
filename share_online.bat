@echo off
title Roll Quest - Online Sharing Launcher
echo =======================================================================
echo              ROLL QUEST: SHARE ONLINE (PUBLIC INTERNET)
echo =======================================================================
echo.
echo This script will start LM Studio, load the AI model, start the game server,
echo and create a secure public tunnel so you can access the game from
echo ANY device (phone, tablet, computer) anywhere in the world!
echo.
echo Please keep this window and the tunnel window open while playing.
echo.
pause
echo.

:: 1. Start LM Studio Server via the official 'lms' CLI tool
echo [1/4] Checking and starting LM Studio Server...
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
echo [2/4] Checking if Gemma model is already loaded...
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

:: 3. Launch the secure tunnel in a separate window
echo [3/4] Starting secure public tunnel in a new window...
start "Roll Quest Public Tunnel" cmd /c "echo ============================================================= & echo   ESTABLISHING SECURE PUBLIC TUNNEL... & echo   Look for the link ending in '.localhost.run' below. & echo   Open that link on your other device to play! & echo ============================================================= & echo. & ssh -o StrictHostKeyChecking=no -R 80:localhost:8080 nokey@localhost.run & echo. & echo Tunnel closed. & pause"
echo.

:: 4. Run python local web server
echo [4/4] Starting local web server...
echo =======================================================================
echo   Proxy Web Server is running on: http://localhost:8080
echo   To play on other devices on the same Wi-Fi, look at the IPs below.
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
