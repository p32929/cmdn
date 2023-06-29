@echo off
setlocal

REM Get the directory of the batch file
set "SCRIPT_DIR=%~dp0"

REM Build the complete path to the sound file
set "SOUND_FILE=%SCRIPT_DIR%\alarm.mp3"

REM Play the sound file
start "" "%SOUND_FILE%"
