@echo off
setlocal enabledelayedexpansion

echo ========================================
echo  Webex Contact Center Widget Template Setup
echo ========================================
echo.

REM Check if we're in a cloned repository
if not exist ".git" (
    echo Error: This doesn't appear to be a git repository.
    echo Please clone the repository first:
    echo   git clone https://github.com/JardaMartan/webexcc-widget-template.git
    echo   cd webexcc-widget-template
    echo   setup.bat
    echo.
    pause
    exit /b 1
)

REM Widget name input with validation
:get_widget_name
echo Enter your widget name ^(lowercase, no spaces, e.g., 'customer-info'^):
set /p WIDGET_NAME=
if "!WIDGET_NAME!"=="" (
    echo Error: Widget name cannot be empty
    goto get_widget_name
)

REM Convert to different cases using PowerShell
for /f "usebackq delims=" %%i in (`powershell -command "('!WIDGET_NAME!' -split '-' | ForEach-Object { $_.Substring(0,1).ToUpper() + $_.Substring(1) }) -join ''"`) do set WIDGET_PASCAL_CASE=%%i
for /f "usebackq delims=" %%i in (`powershell -command "'!WIDGET_NAME!' -replace '-', '_'"`) do set WIDGET_SNAKE_CASE=%%i
for /f "usebackq delims=" %%i in (`powershell -command "'!WIDGET_NAME!' -replace '-', ' ' | ForEach-Object { (Get-Culture).TextInfo.ToTitleCase($_) }"`) do set WIDGET_TITLE_CASE=%%i

echo.
echo Widget Configuration:
echo   Name: !WIDGET_NAME!
echo   PascalCase: !WIDGET_PASCAL_CASE!
echo   snake_case: !WIDGET_SNAKE_CASE!
echo   Title Case: !WIDGET_TITLE_CASE!
echo.

REM Confirm setup
set /p CONFIRM=Continue with setup? ^(Y/N^): 
if /i not "!CONFIRM!"=="Y" if /i not "!CONFIRM!"=="YES" (
    echo Setup cancelled.
    pause
    exit /b 0
)

echo.
echo ========================================
echo  Replacing template placeholders...
echo ========================================

REM Create list of files to process
set FILES_TO_PROCESS=package.json rollup.config.js webpack.config.js README.md
set FILES_TO_PROCESS=!FILES_TO_PROCESS! .github\copilot-instructions.md
set FILES_TO_PROCESS=!FILES_TO_PROCESS! src\index.jsx src\store.js
set FILES_TO_PROCESS=!FILES_TO_PROCESS! layout.json layout.standalone.json layout.production.json
set FILES_TO_PROCESS=!FILES_TO_PROCESS! layout.debug.json layout.minimal.json
set FILES_TO_PROCESS=!FILES_TO_PROCESS! index.html standalone-test.html dev.html

REM Process each file
for %%f in (!FILES_TO_PROCESS!) do (
    if exist "%%f" (
        echo Processing %%f...
        powershell -command "^
        $content = Get-Content '%%f' -Raw; ^
        $content = $content -replace '\{\{WIDGET_NAME\}\}', '!WIDGET_NAME!'; ^
        $content = $content -replace '\{\{WIDGET_PASCAL_CASE\}\}', '!WIDGET_PASCAL_CASE!'; ^
        $content = $content -replace '\{\{WIDGET_SNAKE_CASE\}\}', '!WIDGET_SNAKE_CASE!'; ^
        $content = $content -replace '\{\{WIDGET_TITLE_CASE\}\}', '!WIDGET_TITLE_CASE!'; ^
        Set-Content '%%f' $content -NoNewline"
    ) else (
        echo Warning: %%f not found, skipping...
    )
)

REM Rename the main component file
if exist "src\{{WIDGET_PASCAL_CASE}}.jsx" (
    echo Renaming src\{{WIDGET_PASCAL_CASE}}.jsx to src\!WIDGET_PASCAL_CASE!.jsx...
    move "src\{{WIDGET_PASCAL_CASE}}.jsx" "src\!WIDGET_PASCAL_CASE!.jsx" >nul
)

REM Process the renamed component file
if exist "src\!WIDGET_PASCAL_CASE!.jsx" (
    echo Processing src\!WIDGET_PASCAL_CASE!.jsx...
    powershell -command "^
    $content = Get-Content 'src\!WIDGET_PASCAL_CASE!.jsx' -Raw; ^
    $content = $content -replace '\{\{WIDGET_NAME\}\}', '!WIDGET_NAME!'; ^
    $content = $content -replace '\{\{WIDGET_PASCAL_CASE\}\}', '!WIDGET_PASCAL_CASE!'; ^
    $content = $content -replace '\{\{WIDGET_SNAKE_CASE\}\}', '!WIDGET_SNAKE_CASE!'; ^
    $content = $content -replace '\{\{WIDGET_TITLE_CASE\}\}', '!WIDGET_TITLE_CASE!'; ^
    Set-Content 'src\!WIDGET_PASCAL_CASE!.jsx' $content -NoNewline"
)

REM Process translation files
if exist "src\i18n\translations.js" (
    echo Processing src\i18n\translations.js...
    powershell -command "^
    $content = Get-Content 'src\i18n\translations.js' -Raw; ^
    $content = $content -replace '\{\{WIDGET_NAME\}\}', '!WIDGET_NAME!'; ^
    $content = $content -replace '\{\{WIDGET_PASCAL_CASE\}\}', '!WIDGET_PASCAL_CASE!'; ^
    $content = $content -replace '\{\{WIDGET_SNAKE_CASE\}\}', '!WIDGET_SNAKE_CASE!'; ^
    $content = $content -replace '\{\{WIDGET_TITLE_CASE\}\}', '!WIDGET_TITLE_CASE!'; ^
    Set-Content 'src\i18n\translations.js' $content -NoNewline"
)

echo.
echo ========================================
echo  Setup completed successfully!
echo ========================================
echo.
echo Your widget '!WIDGET_NAME!' is now ready for development.
echo.
echo Next steps:
echo   1. npm install          ^(Install dependencies^)
echo   2. npm run build:standalone ^(Build for production^)
echo   3. npm run serve        ^(Start development server^)
echo   4. Open standalone-test.html in browser to test
echo.
echo For development with hot reload:
echo   npm start               ^(Starts webpack dev server^)
echo.
echo Happy coding! 🚀
echo.
pause