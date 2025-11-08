# Webex Contact Center Widget Template Setup Script
# PowerShell version for Windows

param(
    [string]$WidgetName = ""
)

# Color functions
function Write-Header($message) {
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host " $message" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
}

function Write-Success($message) {
    Write-Host $message -ForegroundColor Green
}

function Write-Warning($message) {
    Write-Host $message -ForegroundColor Yellow
}

function Write-Error($message) {
    Write-Host $message -ForegroundColor Red
}

Write-Header "Webex Contact Center Widget Template Setup"

# Check if we're in a cloned repository
if (-not (Test-Path ".git")) {
    Write-Error "Error: This doesn't appear to be a git repository."
    Write-Host "Please clone the repository first:" -ForegroundColor Yellow
    Write-Host "  git clone https://github.com/JardaMartan/webexcc-widget-template.git" -ForegroundColor White
    Write-Host "  cd webexcc-widget-template" -ForegroundColor White
    Write-Host "  .\setup.ps1" -ForegroundColor White
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# Widget name input with validation
while ([string]::IsNullOrWhiteSpace($WidgetName)) {
    Write-Host "Enter your widget name (lowercase, no spaces, e.g., 'customer-info'):" -ForegroundColor Yellow
    $WidgetName = Read-Host
    
    if ([string]::IsNullOrWhiteSpace($WidgetName)) {
        Write-Error "Error: Widget name cannot be empty"
    }
}

# Convert to different cases
$WIDGET_PASCAL_CASE = ($WidgetName -split '-' | ForEach-Object { 
    $_.Substring(0,1).ToUpper() + $_.Substring(1) 
}) -join ''

$WIDGET_SNAKE_CASE = $WidgetName -replace '-', '_'

$WIDGET_TITLE_CASE = ($WidgetName -replace '-', ' ' | ForEach-Object { 
    (Get-Culture).TextInfo.ToTitleCase($_) 
})

Write-Host ""
Write-Host "Widget Configuration:" -ForegroundColor Green
Write-Host "  Name: $WidgetName" -ForegroundColor White
Write-Host "  PascalCase: $WIDGET_PASCAL_CASE" -ForegroundColor White
Write-Host "  snake_case: $WIDGET_SNAKE_CASE" -ForegroundColor White
Write-Host "  Title Case: $WIDGET_TITLE_CASE" -ForegroundColor White
Write-Host ""

# Confirm setup
$confirm = Read-Host "Continue with setup? (Y/N)"
if ($confirm -notmatch "^[Yy]") {
    Write-Warning "Setup cancelled."
    Read-Host "Press Enter to exit"
    exit 0
}

Write-Host ""
Write-Header "Replacing template placeholders..."

# List of files to process
$filesToProcess = @(
    "package.json", "rollup.config.js", "webpack.config.js", "README.md",
    ".github\copilot-instructions.md",
    "src\index.jsx", "src\store.js",
    "layout.json", "layout.standalone.json", "layout.production.json",
    "layout.debug.json", "layout.minimal.json",
    "index.html", "standalone-test.html", "dev.html"
)

# Process each file
foreach ($file in $filesToProcess) {
    if (Test-Path $file) {
        Write-Host "Processing $file..." -ForegroundColor Cyan
        
        $content = Get-Content $file -Raw
        $content = $content -replace '\{\{WIDGET_NAME\}\}', $WidgetName
        $content = $content -replace '\{\{WIDGET_PASCAL_CASE\}\}', $WIDGET_PASCAL_CASE
        $content = $content -replace '\{\{WIDGET_SNAKE_CASE\}\}', $WIDGET_SNAKE_CASE
        $content = $content -replace '\{\{WIDGET_TITLE_CASE\}\}', $WIDGET_TITLE_CASE
        
        Set-Content $file $content -NoNewline
    } else {
        Write-Warning "Warning: $file not found, skipping..."
    }
}

# Rename the main component file
$templateComponentFile = "src\{{WIDGET_PASCAL_CASE}}.jsx"
$newComponentFile = "src\$WIDGET_PASCAL_CASE.jsx"

if (Test-Path $templateComponentFile) {
    Write-Host "Renaming $templateComponentFile to $newComponentFile..." -ForegroundColor Cyan
    Move-Item $templateComponentFile $newComponentFile -Force
}

# Process the renamed component file
if (Test-Path $newComponentFile) {
    Write-Host "Processing $newComponentFile..." -ForegroundColor Cyan
    
    $content = Get-Content $newComponentFile -Raw
    $content = $content -replace '\{\{WIDGET_NAME\}\}', $WidgetName
    $content = $content -replace '\{\{WIDGET_PASCAL_CASE\}\}', $WIDGET_PASCAL_CASE
    $content = $content -replace '\{\{WIDGET_SNAKE_CASE\}\}', $WIDGET_SNAKE_CASE
    $content = $content -replace '\{\{WIDGET_TITLE_CASE\}\}', $WIDGET_TITLE_CASE
    
    Set-Content $newComponentFile $content -NoNewline
}

# Process translation files
$translationFile = "src\i18n\translations.js"
if (Test-Path $translationFile) {
    Write-Host "Processing $translationFile..." -ForegroundColor Cyan
    
    $content = Get-Content $translationFile -Raw
    $content = $content -replace '\{\{WIDGET_NAME\}\}', $WidgetName
    $content = $content -replace '\{\{WIDGET_PASCAL_CASE\}\}', $WIDGET_PASCAL_CASE
    $content = $content -replace '\{\{WIDGET_SNAKE_CASE\}\}', $WIDGET_SNAKE_CASE
    $content = $content -replace '\{\{WIDGET_TITLE_CASE\}\}', $WIDGET_TITLE_CASE
    
    Set-Content $translationFile $content -NoNewline
}

Write-Host ""
Write-Header "Setup completed successfully!"

Write-Success "Your widget '$WidgetName' is now ready for development."
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. npm install          (Install dependencies)" -ForegroundColor White
Write-Host "  2. npm run build:standalone (Build for production)" -ForegroundColor White
Write-Host "  3. npm run serve        (Start development server)" -ForegroundColor White
Write-Host "  4. Open standalone-test.html in browser to test" -ForegroundColor White
Write-Host ""
Write-Host "For development with hot reload:" -ForegroundColor Yellow
Write-Host "  npm start               (Starts webpack dev server)" -ForegroundColor White
Write-Host ""
Write-Success "Happy coding! 🚀"
Write-Host ""
Read-Host "Press Enter to exit"