@echo off
:: Get the current date and time in a format suitable for git commit messages
for /f "tokens=2 delims==" %%i in ('wmic os get localdatetime /value') do set dt=%%i
set commit_message=Commit - %dt:~0,4%-%dt:~4,2%-%dt:~6,2% %dt:~8,2%:%dt:~10,2%:%dt:~12,2%

:: Add changes
git add .
if %errorlevel% neq 0 (
    echo Failed to add files. Exiting.
    exit /b %errorlevel%
)

:: Commit with current date and time
git commit -m "%commit_message%"
if %errorlevel% neq 0 (
    echo Commit failed. Exiting.
    exit /b %errorlevel%
)

:: Push changes
git push
if %errorlevel% neq 0 (
    echo Push failed. Exiting.
    exit /b %errorlevel%
)

:: Success message
echo Git operations completed successfully.
