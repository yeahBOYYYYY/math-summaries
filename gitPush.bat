@echo off

title Git Auto Push

:: Get the current date and time in a format suitable for git commit messages
for /f "tokens=2 delims==" %%i in ('wmic os get localdatetime /value') do set dt=%%i
set year=%dt:~0,4%
set month=%dt:~4,2%
set day=%dt:~6,2%
set hour=%dt:~8,2%
set minute=%dt:~10,2%
set second=%dt:~12,2%

:: Format the date to DD/MM/YYYY
set commit_message=Commit - %day%/%month%/%year% %hour%:%minute%:%second%


:: Add changes
git add .
if %errorlevel% neq 0 (
    echo Failed to add files. Exiting.
	pause
    exit /b %errorlevel%
)

:: Commit with current date and time
git commit -m "%commit_message%"
if %errorlevel% neq 0 (
    echo Commit failed. Exiting.
	pause
    exit /b %errorlevel%
)

:: Push changes
git push
if %errorlevel% neq 0 (
    echo Push failed. Exiting.
	pause
    exit /b %errorlevel%
)

:: Success message
echo Git operations completed successfully.
pause
