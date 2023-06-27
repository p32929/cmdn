@echo off

REM Check if the configuration file exists
if exist config.txt (
    REM Read the configuration file to set the SOUND_DIR variable
    for /f "usebackq tokens=1* delims==" %%G in ("config.txt") do (
        if /i "%%G"=="SOUND_DIR" set "SOUND_DIR=%%H"
    )
)

REM Check if the SOUND_DIR variable is set or empty
if not defined SOUND_DIR (
    REM Sound file directory not set or empty, prompt for it and save in the configuration file
    set /p SOUND_DIR=Enter the directory path to the sound file:
    echo SOUND_DIR=%SOUND_DIR% > config.txt
) else (
    REM Sound file directory already set, use the stored value
    echo Using sound file directory: %SOUND_DIR%
)

REM Run the notifier command to play the sound
start "" /wait /min /b "%SOUND_DIR%"
