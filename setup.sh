#!/bin/bash

# Widget Template Setup Script
# This script helps replace template placeholders with your widget-specific values

set -e

echo "🚀 Webex Contact Center Widget Template Setup"
echo "============================================="
echo

# Function to prompt for input with default
prompt_with_default() {
    local prompt="$1"
    local default="$2"
    local result
    
    if [ -n "$default" ]; then
        read -p "$prompt [$default]: " result
        echo "${result:-$default}"
    else
        read -p "$prompt: " result
        echo "$result"
    fi
}

# Function to convert to kebab-case
to_kebab_case() {
    echo "$1" | sed 's/[A-Z]/-&/g' | sed 's/^-//' | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]/-/g' | sed 's/--*/-/g' | sed 's/-$//'
}

# Function to convert to PascalCase
to_pascal_case() {
    echo "$1" | sed 's/[^a-zA-Z0-9]/ /g' | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2))}1' | sed 's/ //g'
}

# Get widget information
echo "Please provide the following information for your widget:"
echo

widget_title=$(prompt_with_default "Widget title (human-readable)" "My Custom Widget")
widget_name=$(to_kebab_case "$widget_title")
widget_name=$(prompt_with_default "Widget name (kebab-case)" "$widget_name")
widget_pascal=$(to_pascal_case "$widget_name")
widget_pascal=$(prompt_with_default "Component name (PascalCase)" "$widget_pascal")
widget_description=$(prompt_with_default "Widget description" "A custom widget for Webex Contact Center Desktop")
widget_logo=$(prompt_with_default "Logo URL (optional)" "")
production_cdn=$(prompt_with_default "Production CDN URL (optional)" "https://cdn.example.com")

echo
echo "📋 Summary:"
echo "  Title: $widget_title"
echo "  Name: $widget_name"
echo "  Component: $widget_pascal"
echo "  Description: $widget_description"
echo "  Logo: ${widget_logo:-"(not set)"}"
echo "  CDN URL: $production_cdn"
echo

read -p "Continue with replacement? (y/N): " confirm
if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
    echo "❌ Setup cancelled"
    exit 1
fi

echo
echo "🔄 Replacing placeholders..."

# Create list of files to process
files_to_process=(
    "package.json"
    "rollup.config.js"
    "webpack.config.js"
    "layout.json"
    "layout.standalone.json"
    "dev.html"
    "standalone-test.html"
    "src/index.jsx"
    "src/store.js"
    "src/i18n/translations.js"
    ".github/copilot-instructions.md"
)

# Add the main component file (with placeholder name)
if [ -f "src/{{WIDGET_PASCAL_CASE}}.jsx" ]; then
    files_to_process+=("src/{{WIDGET_PASCAL_CASE}}.jsx")
fi

# Replace placeholders in each file
for file in "${files_to_process[@]}"; do
    if [ -f "$file" ]; then
        echo "  Processing: $file"
        
        # Create temporary file for replacements
        tmp_file=$(mktemp)
        
        # Perform all replacements
        sed \
            -e "s|{{WIDGET_NAME}}|$widget_name|g" \
            -e "s|{{WIDGET_KEBAB_CASE}}|$widget_name|g" \
            -e "s|{{WIDGET_PASCAL_CASE}}|$widget_pascal|g" \
            -e "s|{{WIDGET_TITLE}}|$widget_title|g" \
            -e "s|{{WIDGET_DESCRIPTION}}|$widget_description|g" \
            -e "s|{{WIDGET_LOGO_URL}}|$widget_logo|g" \
            -e "s|{{PRODUCTION_CDN_URL}}|$production_cdn|g" \
            "$file" > "$tmp_file"
        
        # Replace original file
        mv "$tmp_file" "$file"
    else
        echo "  ⚠️  Warning: $file not found"
    fi
done

# Rename the main component file
if [ -f "src/{{WIDGET_PASCAL_CASE}}.jsx" ]; then
    echo "  Renaming: src/{{WIDGET_PASCAL_CASE}}.jsx → src/$widget_pascal.jsx"
    mv "src/{{WIDGET_PASCAL_CASE}}.jsx" "src/$widget_pascal.jsx"
fi

echo
echo "✅ Template setup complete!"
echo
echo "🔧 Next steps:"
echo "  1. npm install"
echo "  2. npm start        # Start development server"
echo "  3. Customize your widget in src/$widget_pascal.jsx"
echo "  4. Add your custom Redux actions in src/store.js"
echo "  5. Update API integration in src/api.js"
echo
echo "📚 See README.md for detailed customization guide"
echo "🧪 Test your widget:"
echo "  - Development: npm start (opens dev.html)"
echo "  - Production: npm run build:standalone && npm run serve (test standalone-test.html)"