# Webex Contact Center Desktop Widget Template

This template provides a complete foundation for creating custom widgets for Webex Contact Center Desktop. It's based on the proven architecture of the hello-widget and includes all necessary files, configurations, and patterns for rapid widget development.

## ⚡ Quick Setup (9 Steps)

1. **Clone repository:** `git clone https://github.com/JardaMartan/webexcc-widget-template.git my-widget && cd my-widget`
2. **Run setup:** `./setup.sh` (Linux/macOS) or `setup.bat` (Windows)
3. **Install deps:** `npm install`
4. **Build widget:** `npm run build:standalone`
5. **Start server:** `npm run serve`
6. **Test locally:** Open `http://127.0.0.1:4137/standalone-test.html`
7. **Configure in WebexCC:** Add widget to Desktop Layout JSON (localhost first)
8. **Test in Desktop:** Verify widget loads and functions in WebexCC Desktop
9. **Deploy to CDN:** Upload to CDN, update layout JSON, deploy to production

Ready to build your widget in minutes! 🚀

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/JardaMartan/webexcc-widget-template.git my-widget
cd my-widget
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

### 7. Configure Widget in WebexCC Desktop Layout
First, test with localhost before deploying to CDN:

1. **Update layout.standalone.json** with your localhost URL:
   ```json
   {
     "comp": "md-tab-panel",
     "attributes": {
       "slot": "panel",
       "class": "widget-pane"
     },
     "children": [
       {
         "comp": "my-widget",
         "script": "http://127.0.0.1:4137/dist/my-widget-standalone.js",
         "attributes": {
           "darkmode": "$STORE.app.darkMode",
           "accesstoken": "$STORE.auth.accessToken"
         },
         "properties": {
           "task": "$STORE.agentContact.taskSelected",
           "selectedtaskid": "$STORE.agentContact.selectedTaskId",
           "cad": "$STORE.agentContact.taskMap",
           "details": "$STORE.agentContact.taskMap",
           "wrap": "$STORE.agent.wrapUpData",
           "avatar": "https://randomuser.me/api/portraits/med/lego/1.jpg",
           "name": "Your Widget - Loaded from Layout JSON",
           "orgid": "$STORE.agent.orgId",
           "datacenter": "$STORE.app.datacenter",
           "agent": "$STORE.agent",
           "agentid": "$STORE.agent.agentDbId"
         }
       }
     ]
   }
   ```

2. **Upload layout to WebexCC Desktop:**
   - Log into Webex Contact Center Management Portal
   - Navigate to **Provisioning > Desktop Layout**
   - Create new layout or edit existing one
   - Upload your modified `layout.standalone.json`
   - Assign layout to teams/agents

📖 **References:**
- [Create Custom Desktop Layout Guide](https://help.webex.com/en-us/article/ng08gqeb/Create-custom-desktop-layout)
- [Desktop Developer Documentation](https://developer.webex.com/webex-contact-center/docs/desktop)

### 8. Test in WebexCC Desktop
1. Ensure your development server is running: `npm run serve`
2. Open WebexCC Desktop with your custom layout
3. Verify the widget loads and displays correctly
4. Test widget functionality with real agent/task data
5. Check browser console for any errors

### 9. Deploy to Production CDN
Once testing is complete, deploy to your CDN:

1. **Upload to CDN:** Upload `dist/my-widget-name-standalone.js` to your CDN
2. **Update layout JSON:** Replace localhost URL with CDN URL:
   ```json
   "src": "https://your-cdn.com/widgets/my-widget-standalone.js"
   ```
3. **Deploy layout:** Upload updated layout JSON to WebexCC Desktop
4. **Production test:** Verify widget works from CDN in production environment

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

## 📝 WebexCC Desktop Layout Configuration

### Layout Structure Overview
WebexCC Desktop layouts define where and how widgets appear in the agent interface. The template includes several layout files for different deployment scenarios.

### Available Layout Files
- **`layout.json`**: Development with external React (localhost testing)
- **`layout.standalone.json`**: Production with bundled React (CDN deployment)
- **`layout.debug.json`**: Minimal debug widget for troubleshooting
- **`layout.minimal.json`**: Simplified widget configuration

### Widget Placement in Desktop Layout
This template is configured as a **panel widget** that gets embedded within existing Desktop UI components. The widget configuration is typically placed within:

```
Agent Layout → Area → Panel → Children
```

Example placement in Desktop layout structure:
```json
{
  "agent": {
    "areas": {
      "task-area": {
        "panels": {
          "task-panel": {
            "comp": "md-tab-panel",
            "children": [
              // Your widget configuration goes here
            ]
          }
        }
      }
    }
  }
}
```

### Widget Configuration Structure
```json
{
  "comp": "my-widget-name",
  "script": "http://127.0.0.1:4137/dist/my-widget-standalone.js",
  "attributes": {
    "darkmode": "$STORE.app.darkMode",
    "accesstoken": "$STORE.auth.accessToken"
  },
  "properties": {
    "task": "$STORE.agentContact.taskSelected",
    "selectedtaskid": "$STORE.agentContact.selectedTaskId", 
    "cad": "$STORE.agentContact.taskMap",
    "details": "$STORE.agentContact.taskMap",
    "wrap": "$STORE.agent.wrapUpData",
    "avatar": "https://your-cdn.com/avatar.jpg",
    "name": "Your Widget Display Name",
    "orgid": "$STORE.agent.orgId",
    "datacenter": "$STORE.app.datacenter",
    "agent": "$STORE.agent",
    "agentid": "$STORE.agent.agentDbId"
  }
}
```

### Context Data Binding
WebexCC Desktop passes data to your widget through `attributes` and `properties`:

#### Attributes (HTML attributes)
| Attribute | Description | Desktop Store Path |
|-----------|-------------|-------------------|
| `darkmode` | Current theme mode | `$STORE.app.darkMode` |
| `accesstoken` | OAuth access token | `$STORE.auth.accessToken` |

#### Properties (Web component properties)
| Property | Description | Desktop Store Path |
|----------|-------------|-------------------|
| `task` | Current selected task data | `$STORE.agentContact.taskSelected` |
| `selectedtaskid` | Currently selected task ID | `$STORE.agentContact.selectedTaskId` |
| `cad` | Task map / Call Associated Data | `$STORE.agentContact.taskMap` |
| `details` | Task details and metadata | `$STORE.agentContact.taskMap` |
| `wrap` | Wrap-up data for current task | `$STORE.agent.wrapUpData` |
| `orgid` | Organization ID | `$STORE.agent.orgId` |
| `datacenter` | Data center information | `$STORE.app.datacenter` |
| `agent` | Complete agent object | `$STORE.agent` |
| `agentid` | Agent database ID | `$STORE.agent.agentDbId` |

### Development vs Production URLs
**Development (localhost):**
```json
"script": "http://127.0.0.1:4137/dist/my-widget-standalone.js"
```

**Production (CDN):**
```json
"script": "https://your-cdn.com/widgets/my-widget-standalone.js"
```

### Layout Deployment Process
1. **Management Portal**: Log into WebexCC Management Portal
2. **Navigation**: Go to **Provisioning > Desktop Layout**
3. **Create/Edit**: Create new layout or edit existing one
4. **Upload**: Upload your JSON layout file
5. **Assign**: Assign layout to teams, sites, or individual agents
6. **Activate**: Save and activate the layout

### Testing Strategy
1. **Localhost First**: Test with `http://127.0.0.1:4137` URL
2. **Verify Loading**: Ensure widget appears in Desktop interface
3. **Check Context**: Verify widget receives proper context data
4. **Test Functionality**: Test all widget features with real data
5. **CDN Deployment**: Move to CDN only after localhost testing succeeds

📖 **Official Documentation:**
- [Desktop Layout Guide](https://help.webex.com/en-us/article/ng08gqeb/Create-custom-desktop-layout)
- [Desktop Developer Docs](https://developer.webex.com/webex-contact-center/docs/desktop)
- [Widget Development Guide](https://developer.webex.com/webex-contact-center/docs/desktop-widgets)

## 🚀 Deployment Checklist

### Development Setup
- [ ] Clone repository: `git clone https://github.com/JardaMartan/webexcc-widget-template.git my-widget && cd my-widget`
- [ ] Run setup script: `./setup.sh` (Linux/macOS) or `setup.bat` (Windows)
- [ ] Install dependencies: `npm install`
- [ ] Build standalone version: `npm run build:standalone`
- [ ] Start server: `npm run serve`
- [ ] Test locally: Open `http://127.0.0.1:4137/standalone-test.html`

### WebexCC Desktop Integration
- [ ] Update `layout.standalone.json` with localhost URL (`http://127.0.0.1:4137/dist/my-widget-standalone.js`)
- [ ] Configure widget context properties (task, agent, accesstoken, orgid)
- [ ] Upload layout JSON to WebexCC Management Portal
- [ ] Assign layout to test team/agents
- [ ] Test widget in WebexCC Desktop environment
- [ ] Verify widget receives proper context data
- [ ] Test widget functionality with real agent sessions

### Production Deployment
- [ ] Customize widget functionality in `src/MyWidget.jsx`
- [ ] Add proper translations in `src/i18n/translations.js`
- [ ] Configure API endpoints in `src/api.js`
- [ ] Build final version: `npm run build:standalone`
- [ ] Upload `dist/my-widget-name-standalone.js` to CDN
- [ ] Update `layout.standalone.json` with CDN URL
- [ ] Deploy updated layout JSON to WebexCC Desktop
- [ ] Test production deployment
- [ ] Monitor for errors and performance

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