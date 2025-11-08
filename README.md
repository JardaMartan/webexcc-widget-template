# Webex Contact Center Desktop Widget Template

This template provides a complete foundation for creating custom widgets for Webex Contact Center Desktop. It's based on the proven architecture of the hello-widget and includes all necessary files, configurations, and patterns for rapid widget development.

## ⚡ Quick Setup (7 Steps)

1. **Clone repository:** `git clone https://github.com/JardaMartan/webexcc-widget-template.git`
2. **Run setup:** `./setup.sh` (Linux/macOS) or `setup.bat` (Windows)
3. **Install deps:** `npm install`
4. **Build widget:** `npm run build:standalone`
5. **Start server:** `npm run serve`
6. **Test locally:** Open `http://127.0.0.1:4137/standalone-test.html`
7. **Deploy to WebexCC:** Upload to CDN, update layout JSON, test in Desktop

Ready to build your widget in minutes! 🚀

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/JardaMartan/webexcc-widget-template.git
cd webexcc-widget-template
```

### 2. Run Setup Script
**Linux/macOS:**
```bash
./setup.sh
```

**Windows (Command Prompt):**
```cmd
setup.bat
```

**Windows (PowerShell):**
```powershell
.\setup.ps1
```

The setup script will:
- Prompt for your widget name (e.g., `customer-info`)
- Replace all template placeholders automatically
- Rename files appropriately

### 3. Install Dependencies
```bash
npm install
```

### 4. Build Standalone Version
```bash
npm run build:standalone
```

### 5. Start Development Server
```bash
npm run serve
```

### 6. Test Your Widget
Open `http://127.0.0.1:4137/standalone-test.html` in your browser to test the widget.

### 7. Deploy to Webex Contact Center Desktop
1. Upload `dist/your-widget-name-standalone.js` to your CDN
2. Update `layout.standalone.json` with your CDN URL
3. Upload the layout JSON to Webex Contact Center Desktop
4. Test in the Desktop environment

## 📋 Template Placeholders

The setup scripts replace these placeholders automatically:

| Placeholder | Description | Example |
|-------------|-------------|---------|
| `{{WIDGET_NAME}}` | Kebab-case widget name | `customer-info` |
| `{{WIDGET_PASCAL_CASE}}` | PascalCase component name | `CustomerInfo` |
| `{{WIDGET_SNAKE_CASE}}` | Snake_case variant | `customer_info` |
| `{{WIDGET_TITLE_CASE}}` | Human-readable title | `Customer Info` |

## 🛠️ Development Workflow

For active development with hot reload:
```bash
npm start
# Opens dev.html at http://localhost:8080
```

## 📁 Template Structure

```
template/
├── package.json                    # Dependencies and scripts
├── rollup.config.js               # Production build configuration
├── webpack.config.js              # Development build configuration
├── layout.json                    # Development layout (external React)
├── layout.standalone.json         # Production layout (bundled React)
├── dev.html                       # Development test page
├── standalone-test.html           # Standalone build test page
├── .github/
│   └── copilot-instructions.md    # GitHub Copilot development guidance
├── src/
│   ├── index.jsx                  # Web component entry point
│   ├── {{WIDGET_PASCAL_CASE}}.jsx # Main React component (rename after placeholder replacement)
│   ├── store.js                   # Redux store and actions
│   ├── api.js                     # External API integration functions
│   ├── agentx-globals.js         # AgentX environment shims
│   └── i18n/                     # Internationalization
│       ├── index.js              # i18n barrel exports
│       ├── I18nContext.jsx       # React context for translations
│       └── translations.js       # Translation dictionaries
└── public/
    ├── css/
    │   └── momentum-ui-local-corrected.min.css  # Momentum UI styles
    └── js/
        ├── react.production.min.js              # React for development
        └── react-dom.production.min.js          # ReactDOM for development
```

## 🤖 GitHub Copilot Integration

The template includes comprehensive Copilot instructions in `.github/copilot-instructions.md` that provide:

- **Architecture guidance**: Web component + React hybrid patterns, Redux store structure, build system details
- **Development patterns**: SDK integration, async thunk patterns, property binding, CSS injection strategies  
- **Code conventions**: Translation keys, console logging, error handling, demo mode fallbacks
- **Common solutions**: Debugging workflows, troubleshooting guides, performance considerations
- **Customization examples**: Adding state, actions, UI components, translations, API integrations

When working with GitHub Copilot in your new widget, it will automatically reference these instructions to provide context-aware suggestions that follow the established patterns and best practices.

## 🛠️ Customization Guide

### 1. Main Component (`src/{{WIDGET_PASCAL_CASE}}.jsx`)

Replace the TODO comments with your custom logic:

```jsx
// TODO: Add your custom state properties to useSelector
const { 
  isLoading, 
  agent: storeAgent,
  // Add: customData, selectedOption, etc.
} = useSelector(state => state.widget);

// TODO: Add your custom useEffect hooks
useEffect(() => {
  if (someCondition) {
    dispatch(fetchCustomData());
  }
}, [someCondition, dispatch]);

// TODO: Add your custom handlers
const handleCustomAction = useCallback(() => {
  dispatch(executeCustomAction(customData));
}, [dispatch, customData]);
```

### 2. Redux Store (`src/store.js`)

Add your custom state and actions:

```javascript
// In initialState
const widgetSlice = createSlice({
  name: 'widget',
  initialState: {
    // ... existing state
    customData: [],
    selectedOption: null,
    isFetchingData: false
  },
  reducers: {
    // ... existing reducers
    setCustomData: (state, action) => {
      state.customData = action.payload;
    },
    setSelectedOption: (state, action) => {
      state.selectedOption = action.payload;
    }
  }
});

// Add custom async thunks
export const fetchCustomData = () => async (dispatch, getState) => {
  // Your custom logic here
};
```

### 3. API Integration (`src/api.js`)

Add your custom API functions for external service integration:

```javascript
// Example: Custom data fetching
export const fetchCustomData = async (accessToken, orgId) => {
  const API_BASE_URL = 'https://your-api-endpoint.com/api';
  
  const response = await fetch(`${API_BASE_URL}/data`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Org-Id': orgId
    }
  });
  
  if (!response.ok) {
    throw new Error(`API request failed with status: ${response.status}`);
  }
  
  return await response.json();
};
```

### 4. Translations (`src/i18n/translations.js`)

Add your custom UI strings:

```javascript
export const translations = {
  en: {
    ui: {
      // ... existing translations
      customAction: {
        label: 'Custom Action',
        placeholder: 'Select an option...',
        option1: 'Option 1',
        option2: 'Option 2'
      }
    },
    status: {
      // ... existing status messages
      customData: {
        fetched: 'Data fetched successfully',
        fail: 'Failed to fetch data: {{error}}'
      }
    }
  }
  // Add same structure for other locales (es, cs, etc.)
};
```

## 🔧 Build System

### Development Build (Webpack)
- **Purpose**: Fast development with hot reload
- **React**: External (loaded via script tags)
- **Output**: `dist/{{WIDGET_NAME}}-dev.js`
- **Command**: `npm start`

### Production Build (Rollup)
- **External React**: `npm run build` → `dist/{{WIDGET_NAME}}.js`
- **Standalone**: `npm run build:standalone` → `dist/{{WIDGET_NAME}}-standalone.js`

### Build Commands
```bash
npm run build              # External React build (smaller, needs React loaded)
npm run build:standalone   # Self-contained build (larger, no dependencies)
npm start                  # Development server with hot reload
npm run serve              # Serve built files for testing
```

## 🧪 Testing

### Development Testing
1. `npm start` - Opens dev.html with mock SDK
2. Test all widget functionality in development environment
3. Use browser console to inspect widget properties and Redux state

### Production Testing
1. `npm run build:standalone`
2. `npm run serve`
3. Open `standalone-test.html` to test bundled build
4. Verify no external dependencies are required

### Contact Center Desktop Integration
1. Build standalone: `npm run build:standalone`
2. Upload `dist/{{WIDGET_NAME}}-standalone.js` to your CDN
3. Update `layout.standalone.json` with correct CDN URL
4. Upload layout to Contact Center Desktop

## 🌐 Internationalization

### Adding New Locales
1. Add locale to `src/i18n/translations.js`:
```javascript
export const translations = {
  en: { /* existing */ },
  es: { /* existing */ },
  fr: {  // New locale
    ui: {
      widget: {
        title: 'Mon Widget',
        description: 'Description du widget'
      }
    }
  }
};
```

2. The widget automatically detects browser locale and falls back to English.

### Using Translations
```jsx
const { t } = useI18n();
// Simple translation
<label>{t('ui.notes.label')}</label>
// With variables
<span>{t('ui.delay.selected', { seconds: 3600 })}</span>
```

## 🔌 Desktop SDK Integration

### Available SDK Objects
- **Desktop.agentContact**: Contact operations (transfer, conference, etc.)
- **Desktop.agentStateInfo**: Agent state management
- **Desktop.config**: SDK configuration

### Common Patterns
```javascript
// Check SDK availability
const { desktopSDK } = getState().widget;
if (!desktopSDK) {
  // Demo mode fallback
  return;
}

// Use SDK
await desktopSDK.agentContact.someMethod(data);
```

### Property Binding
Widget automatically receives these properties from Contact Center Desktop:
- `task`: Current interaction data
- `agent`: Agent information
- `accesstoken`: OAuth token for API calls
- `orgid`: Organization ID

## 📝 Layout Configuration

### Development Layout (`layout.json`)
- Uses external React build
- Points to `http://127.0.0.1:4137/dist/{{WIDGET_NAME}}.js`
- For local development only

### Production Layout (`layout.standalone.json`)
- Uses standalone build
- Points to your CDN URL
- Self-contained, no external dependencies

### Context Binding
```json
{
  "context": {
    "task": "$STORE.task",
    "agent": "$STORE.agent", 
    "accesstoken": "$STORE.auth.accessToken",
    "orgid": "$STORE.auth.orgId"
  }
}
```

## 🚀 Deployment Checklist

### Development Setup
- [ ] Clone repository: `git clone https://github.com/JardaMartan/webexcc-widget-template.git`
- [ ] Run setup script: `./setup.sh` (Linux/macOS) or `setup.bat` (Windows)
- [ ] Install dependencies: `npm install`
- [ ] Build standalone version: `npm run build:standalone`
- [ ] Test locally: `npm run serve` and open `standalone-test.html`

### Production Deployment
- [ ] Customize widget functionality in `src/YourWidget.jsx`
- [ ] Add proper translations in `src/i18n/translations.js`
- [ ] Configure API endpoints in `src/api.js`
- [ ] Build final version: `npm run build:standalone`
- [ ] Upload `dist/your-widget-name-standalone.js` to CDN
- [ ] Update `layout.standalone.json` with CDN URL
- [ ] Upload layout JSON to Webex Contact Center Desktop
- [ ] Test in Desktop environment

## 🐛 Troubleshooting

### Widget Not Loading
1. Check browser console for errors
2. Verify CDN URL is accessible
3. Test with `standalone-test.html`
4. Ensure layout JSON is valid

### Empty Widget
1. Verify CSS is bundled (check `window.__MOMENTUM_UI_CSS__`)
2. Check React version compatibility
3. Inspect shadow DOM for CSS injection

### SDK Issues
1. Check if `Desktop` global exists
2. Verify agent properties are being passed
3. Check console for SDK initialization errors

## 📚 Key Files Reference

### Core Files
- **`src/index.jsx`**: Web component wrapper, property binding, CSS injection
- **`src/{{WIDGET_PASCAL_CASE}}.jsx`**: Main React component, UI logic
- **`src/store.js`**: Redux store, async thunks, SDK integration
- **`src/api.js`**: External service integration

### Configuration Files
- **`package.json`**: Dependencies, scripts, metadata
- **`rollup.config.js`**: Production build (both external and standalone)
- **`webpack.config.js`**: Development build with hot reload

### Integration Files
- **`layout.json`**: Development layout configuration
- **`layout.standalone.json`**: Production layout configuration
- **`src/agentx-globals.js`**: Environment compatibility shims

### Testing Files
- **`dev.html`**: Full development environment with mock SDK
- **`standalone-test.html`**: Production build verification

This template provides everything you need to create professional, production-ready widgets for Webex Contact Center Desktop. Follow the customization guide and build system documentation to develop your custom functionality efficiently.