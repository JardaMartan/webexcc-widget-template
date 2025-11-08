# Copilot Instructions for {{WIDGET_TITLE}}

## Project Overview

A **Webex Contact Center Desktop widget** built with **React 18 + Redux Toolkit** wrapped in a Web Component (`<{{WIDGET_KEBAB_CASE}}>`). Integrates with `@wxcc-desktop/sdk` for agent contact operations. Features i18n support (en/es with extensibility), dual build system (development/production), and comprehensive debugging tools.

## Key Architecture Patterns

### Web Component + React Hybrid
React app wrapped in custom element (NOT React rendering the element). Each widget instance creates its own Redux store (no shared state). Web component properties flow to React via props.

```javascript
// index.jsx - Web component wraps React
class {{WIDGET_PASCAL_CASE}}Element extends HTMLElement {
  connectedCallback() {
    const container = document.createElement('div');
    if (ReactDOM.createRoot) {
      this.root = ReactDOM.createRoot(container);
      this.root.render(<Provider store={store}><I18nProvider><{{WIDGET_PASCAL_CASE}} /></I18nProvider></Provider>);
    } else {
      ReactDOM.render(<Provider store={store}><I18nProvider><{{WIDGET_PASCAL_CASE}} /></I18nProvider></Provider>, container);
    }
  }
}
```

### Critical Files
- **`src/index.jsx`**: Web component entry with getters/setters, CSS injection, React 17/18 compatibility
- **`src/{{WIDGET_PASCAL_CASE}}.jsx`**: Main UI component with custom business logic
- **`src/store.js`**: Redux store with async thunks, demo mode fallback, non-serializable SDK handling
- **`src/agentx-globals.js`**: MUST import first - shims `AGENTX_SERVICE` to prevent ReferenceErrors
- **`src/i18n/`**: Translation system with browser locale detection (en/es/cs extensible)
- **`layout*.json`**: Desktop integration configs (standalone/production/debug/minimal)

### Data Flow
```
Contact Center Desktop Layout → Web Component (index.jsx) → {{WIDGET_PASCAL_CASE}} ({{WIDGET_PASCAL_CASE}}.jsx)
  → Redux Store (store.js) → Desktop SDK / API (api.js) → External Services (webhooks)
```

### Property Binding & Parsing
Web component exposes getters/setters that Contact Center Desktop binds to:
- **`task`**, **`agent`**: Can be JSON strings or objects - always use `parseJsonSafely()` helper
- **`accesstoken`**, **`orgid`**: Used for API calls (observed attributes)
- **`locale`**: Language override (falls back to `navigator.language` detection)
- All properties log to console (critical for debugging opaque Desktop integration)

```javascript
// Always parse properties defensively
const parseJsonSafely = (maybeJson) => {
  if (typeof maybeJson !== 'string') return maybeJson;
  try { return JSON.parse(maybeJson); } 
  catch (err) { return {}; }
};
```

## Redux Store Architecture

### State Structure (`src/store.js`)
```javascript
widget: {
  agentName: string,           // Agent display name
  agent: object,               // Full agent object with agentProfileID, agentDbId
  status: string,              // Translation key for status messages
  statusType: 'success' | 'info' | 'error',
  isLoading: boolean,          // SDK initialization state
  desktopSDK: object,          // Desktop SDK instance (non-serializable)
  // TODO: Add your custom state properties here
  // customData: array,
  // selectedOption: string,
  // isFetchingData: boolean
}
```

### Async Thunk Pattern
**All SDK operations use this pattern:**
```javascript
export const customAction = (params) => async (dispatch, getState) => {
  try {
    const { desktopSDK } = getState().widget;
    if (!desktopSDK) {
      dispatch(setStatus({ message: 'status.demo', type: 'info' }));
      return; // Demo mode fallback
    }
    // Perform action
    dispatch(setStatus({ message: 'status.success', type: 'success' }));
  } catch (error) {
    console.error('Action failed:', error);
    dispatch(setStatus({ message: 'status.fail', type: 'error' }));
  } finally {
    setTimeout(() => dispatch(clearStatus()), 3000); // Auto-clear
  }
};
```

### Critical Redux Patterns
- **Translation keys in state**: Store `'status.action.success'` not translated text (translate at render time)
- **Non-serializable SDK**: Middleware config `ignoredPaths: ['widget.desktopSDK']`
- **Demo mode**: Graceful fallback when Desktop SDK unavailable (`!Desktop.agentContact`)
- **VTeam operations**: `desktopSDK.agentContact.vteamList()` requires `agentProfileId` from agent object

## Development Workflow

### Build Commands
```bash
npm run build              # Rollup production build → dist/{{WIDGET_NAME}}.js (IIFE, external React)
npm run build:standalone   # Self-contained build → dist/{{WIDGET_NAME}}-standalone.js (bundles React)
npm start                  # Webpack dev server on :8080, opens /dev.html
npm run preview            # Build + serve on :4137 with CORS
npm run serve              # Serve existing build on :4137
```

### Local Development Setup
- **React externals**: Uses global `React`/`ReactDOM` from `public/js/` files in dev build
- **Mock SDK**: `dev.html` provides `globalThis.wxccDesktop` with realistic async behavior and mock agent data
- **Dual rendering modes**: Both web component (`<{{WIDGET_KEBAB_CASE}}>`) and direct React mount (div id="react-root")
- **Local assets**: Momentum UI CSS with corrected font paths in `public/css/momentum-ui-local-corrected.min.css`
- **Font loading**: CSS uses relative paths `../fonts/` and `../icons/` - fonts copied to root `/fonts/` and `/icons/` for local serving
- **AgentX globals**: `agentx-globals.js` provides mock `AGENTX_SERVICE` global to prevent ReferenceErrors when SDK expects it

## Build System Specifics

### Dual Build System Architecture
The project uses **two separate build systems** for different purposes:

#### Webpack (Development)
- **Purpose**: Fast local development with hot reload
- **Port**: 8080 (configured in `webpack.config.js`)
- **Output**: `dist/{{WIDGET_NAME}}-dev.js`
- **React handling**: Externalizes React/ReactDOM (expects global variables)
- **Entry point**: Opens `/dev.html` automatically
- **CSS**: style-loader injects CSS into DOM
- **Usage**: `npm start` for active development

#### Rollup (Production)
- **Purpose**: Production-ready bundles for deployment
- **Outputs**: Two build modes controlled by `BUILD_MODE` env var
  - `dist/{{WIDGET_NAME}}.js` (default): Expects global React/ReactDOM (~462KB)
  - `dist/{{WIDGET_NAME}}-standalone.js` (`BUILD_MODE=self-contained`): Bundles everything (~1.8MB)
- **Format**: IIFE (Immediately Invoked Function Expression) for browser compatibility
- **CSS**: PostCSS bundles and injects via `window.__MOMENTUM_UI_CSS__`
- **Usage**: `npm run build` or `npm run build:standalone`

### Rollup Configuration Details (`rollup.config.js`)
- **External React handling**: Conditionally externalizes React based on `BUILD_MODE`
- **Process replacement**: Critical for browser compatibility - replaces all Node.js `process` references
- **CommonJS transformation**: `transformMixedEsModules: true` handles mixed module formats
- **CSS injection strategy**: CSS stored in global `window.__MOMENTUM_UI_CSS__` for manual shadow DOM injection
- **Warning suppression**: Filters circular dependency warnings from React/Redux/Momentum UI
- **Dedupe config**: Prevents multiple React versions via `dedupe: ['react', 'react-dom']`

### Layout File Pattern
- **`layout.json`**: Local development (127.0.0.1:4137) with external React
- **`layout.standalone.json`**: Contact Center Desktop with self-contained build
- **Context binding**: `"contextFromStore": "$STORE.agent.name"` pattern for Desktop data injection

## Deployment Strategies

### Contact Center Desktop Deployment
- **Use standalone build**: `{{WIDGET_NAME}}-standalone.js` (bundles React/ReactDOM/CSS)
- **Single file deployment**: No external dependencies required
- **Layout**: Reference `layout.standalone.json` for self-contained widget
- **File size**: ~1.8MB (includes React 18 + Redux + Momentum UI CSS)
- **CSS bundling**: Momentum UI CSS imported in component and bundled via PostCSS
- **Shadow DOM compatibility**: CSS injected manually into shadow root for Contact Center Desktop

### Development Environment
- **Use external build**: `{{WIDGET_NAME}}.js` (expects global React)
- **External dependencies**: Loaded via script tags in HTML
- **Layout**: Reference `layout.json` for development
- **File size**: ~462KB (excludes React dependencies)

## Testing Workflow

### Test Files Structure
The project includes multiple specialized test files:

#### `dev.html` - Full Development Test
- **Purpose**: Complete development environment with mock SDK
- **Loads**: External React from `public/js/`, widget from `dist/`
- **Mock SDK**: Provides `globalThis.wxccDesktop` with realistic async behavior
- **Mock AgentX**: Injects `AGENTX_SERVICE` global to prevent ReferenceErrors
- **Features**: Dual rendering (web component + direct React mount with id "react-root")
- **Usage**: Run `npm start` or `npm run serve` and open `http://127.0.0.1:8080/dev.html`

#### `standalone-test.html` - Production Simulation
- **Purpose**: Simulates Contact Center Desktop environment
- **Loads**: Only `{{WIDGET_NAME}}-standalone.js` (self-contained bundle)
- **Verifies**: Zero external dependencies, complete CSS bundling
- **Expected**: Full Momentum UI styling and functionality without external React
- **Usage**: `npm run build:standalone` then open in browser

### Testing Strategy by Environment

#### Local Development
1. Start dev server: `npm start`
2. Opens `dev.html` automatically with webpack dev server
3. Hot reload enabled for rapid iteration
4. Check console for SDK initialization and mock agent data

#### Pre-Production Verification
1. Build standalone: `npm run build:standalone`
2. Serve: `npm run serve`
3. Open `standalone-test.html`
4. Verify no 404s in Network tab (all assets bundled)
5. Check Momentum UI components render correctly

#### Contact Center Desktop Integration
1. Build: `npm run build:standalone`
2. Update layout file with correct URL
3. Upload layout to Contact Center Desktop
4. **If widget empty**: Create debug widget for troubleshooting
5. Use browser console for detailed analysis

## Widget Integration Patterns

### Web Component Implementation
```javascript
class {{WIDGET_PASCAL_CASE}}Element extends HTMLElement {
  connectedCallback() {
    const container = document.createElement('div');
    // React 18/17 compatibility
    if (ReactDOM.createRoot) {
      this.root = ReactDOM.createRoot(container);
      this.root.render(<Provider store={store}><I18nProvider><{{WIDGET_PASCAL_CASE}} /></I18nProvider></Provider>);
    } else {
      ReactDOM.render(<Provider store={store}><I18nProvider><{{WIDGET_PASCAL_CASE}} /></I18nProvider></Provider>, container);
      this.container = container;
    }
  }
  disconnectedCallback() { 
    this.root ? this.root.unmount() : ReactDOM.unmountComponentAtNode(this.container);
  }
}
```

### Property Binding Pattern
Web component exposes getters/setters for Contact Center Desktop integration:
- **`task`**: Current interaction task object (parsed from JSON string or object)
- **`agent`**: Agent data with `agentProfileID`, `agentDbId`, `agentEmailId` (synced to Redux store)
- **`accesstoken`**: OAuth token for API calls (observed attribute)
- **`orgid`**: Organization ID for API calls
- **`locale`**: Language override (falls back to browser detection via `navigator.language`)
- All properties log to console for debugging and trigger `updateComponent()` to re-render

### SDK Integration Strategy
- **Multi-path detection**: Checks `wxccDesktop`, `CiscoDesktop`, `WebexDesktop` globals
- **Graceful fallback**: Demo mode with mock agent data when SDK unavailable
- **Async initialization**: Loading states during SDK setup via `initializeDesktopSDK()` thunk
- **Event listeners**: Agent state change handling via `Desktop.agentStateInfo.onAgentStateChange`

## Internationalization (i18n) System

### Architecture
- **Translation files**: `src/i18n/translations.js` with nested keys (`ui.widget.title`, `status.action.success`)
- **Context provider**: `I18nProvider` wraps component tree, `useI18n()` hook provides `{ t, locale, setLocale }`
- **Browser detection**: `detectBrowserLocale()` parses `navigator.language` (e.g., "es-ES" → "es")
- **Interpolation**: `t('ui.message', { variable: value })` replaces `{{variable}}` in templates
- **Supported locales**: English (en), Spanish (es) - extensible to more languages
- **Fallback**: Always falls back to English if locale not found

### Usage Pattern
```javascript
const { t } = useI18n();
// UI strings
<Button>{t('ui.submit')}</Button>
// With variables
<Label>{t('ui.message', { name: agentName })}</Label>
// Status messages use translation keys stored in Redux
dispatch(setStatus({ message: 'status.action.success', type: 'success' }));
```

### Adding New Locales
```javascript
// In src/i18n/translations.js
export const translations = {
  en: { /* existing */ },
  es: { /* existing */ },
  fr: {  // New locale
    ui: {
      widget: {
        title: '{{WIDGET_TITLE}}',
        description: 'Description en français'
      }
    }
  }
};
```

## Momentum UI Usage Patterns

The widget serves as a **comprehensive showcase** of Momentum UI React components:
- Form controls (Input, Select, Checkbox, Radio, ToggleSwitch)
- Navigation (Tabs, Accordion, Lists)
- Feedback (AlertBanner, Badge, ProgressBar, Loading, Spinner)
- Layout (Card, CardSection, Avatar, Icons)
- Action (Button variants with colors and sizes)

### Momentum UI Select Pattern
Momentum UI Select returns values in multiple formats depending on context:
```javascript
// Handle all return formats from Momentum UI Select
const handleOptionChange = (value) => {
  const optionValue = Array.isArray(value) ? value[0]?.value : (value?.value || value);
  dispatch(setSelectedOption(optionValue));
};
```

## API Integration

### External API Integration
- **Purpose**: Template provides structure for custom API integrations in `src/api.js`
- **Pattern**: Centralized API functions with error handling and logging
- **Usage**: Customize `fetchCustomData()` example or add new API functions as needed
- **Authentication**: Use `accesstoken` and `orgid` props for API calls

### Custom API Integration
```javascript
// In src/api.js
export const fetchCustomData = async (accessToken, orgId) => {
  const response = await fetch(`${API_BASE_URL}/data`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Org-Id': orgId
    }
  });
  return response.json();
};
```

## Custom Development Patterns

### Adding Custom State
```javascript
// In src/store.js initialState
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
    }
  }
});
```

### Adding Custom Actions
```javascript
// In src/store.js
export const fetchCustomData = () => async (dispatch, getState) => {
  try {
    dispatch(setFetchingData(true));
    const { desktopSDK } = getState().widget;
    
    if (!desktopSDK) {
      dispatch(setStatus({ message: 'status.demo', type: 'info' }));
      return;
    }
    
    const response = await desktopSDK.agentContact.someMethod();
    dispatch(setCustomData(response.data));
    dispatch(setStatus({ message: 'status.data.fetched', type: 'success' }));
  } catch (error) {
    console.error('Failed to fetch data:', error);
    dispatch(setStatus({ message: 'status.data.fail', type: 'error' }));
  } finally {
    dispatch(setFetchingData(false));
    setTimeout(() => dispatch(clearStatus()), 3000);
  }
};
```

### Adding Custom UI Components
```javascript
// In src/{{WIDGET_PASCAL_CASE}}.jsx
const { customData, selectedOption, isFetchingData } = useSelector(state => state.widget);

// Custom handlers
const handleCustomAction = useCallback(() => {
  dispatch(executeCustomAction(selectedOption));
}, [dispatch, selectedOption]);

// Custom UI
<Select placeholder={t('ui.customOption.placeholder')} onSelect={handleOptionChange}>
  {customData.map(item => (
    <SelectOption key={item.id} value={item.id} label={item.name} />
  ))}
</Select>
```

## Debugging Workflow

### Debug Tools
- **Browser console**: SDK detection logging and error tracking
- **Layout switching**: Use different layout files for various debugging scenarios
- **Mock data**: `dev.html` provides realistic mock SDK behavior

### Common Issues and Solutions

#### Empty Widget in Contact Center Desktop
1. **Symptoms**: Web component renders but shows empty content
2. **Common causes**:
   - React not bundled in standalone mode
   - CSS not injected into shadow DOM
   - Web component registration timing issue
3. **Solution**: Verify standalone build, check shadow DOM CSS injection

#### SDK Not Available
1. **Symptoms**: "Desktop SDK not available" in console
2. **Behavior**: Widget falls back to demo mode with mock data
3. **Expected**: Normal in local development environment
4. **Solution**: For production, verify Contact Center Desktop environment provides SDK

#### CSS Missing or Incorrect
1. **Symptoms**: Unstyled Momentum UI components
2. **Common causes**:
   - CSS not bundled in standalone mode
   - Shadow DOM blocking external CSS
   - Font paths incorrect
3. **Solution**: Use standalone build, verify `window.__MOMENTUM_UI_CSS__` exists

### Debug Console Commands
```javascript
// Check widget registration
customElements.get('{{WIDGET_KEBAB_CASE}}')

// Inspect Redux store
document.querySelector('{{WIDGET_KEBAB_CASE}}').__REDUX_STORE__

// Check CSS injection
console.log(window.__MOMENTUM_UI_CSS__)

// Verify agent data
document.querySelector('{{WIDGET_KEBAB_CASE}}').agent

// Test SDK availability
console.log(globalThis.wxccDesktop || globalThis.CiscoDesktop || globalThis.WebexDesktop)
```

## Critical Development Notes

### Architecture Patterns

#### Web Component + React Hybrid
- **Pattern**: React app wrapped in custom element, not React rendering the custom element
- **Mounting**: React mounts inside a container div created in `connectedCallback()`
- **Isolation**: Each widget instance creates its own Redux store (no shared state)
- **Props**: Web component properties flow into React via props passed to `<{{WIDGET_PASCAL_CASE}}>`

#### CSS Injection Strategy
- **Development**: External CSS loaded via `<link>` tag in HTML
- **Production**: CSS bundled into JS, stored in `window.__MOMENTUM_UI_CSS__`, manually injected
- **Shadow DOM**: Manual injection via `injectCSS()` function into shadow root or document head
- **Why**: Contact Center Desktop uses shadow DOM which blocks external stylesheets

#### Data Flow Pattern
```
Contact Center Desktop Layout
  ↓ (sets attributes/properties)
Web Component (index.jsx)
  ↓ (props)
{{WIDGET_PASCAL_CASE}} Component ({{WIDGET_PASCAL_CASE}}.jsx)
  ↓ (dispatches actions)
Redux Store (store.js)
  ↓ (async thunks)
Desktop SDK / API (api.js)
  ↓ (API calls)
External Services
```

#### Property Parsing Convention
- **Input**: Properties can be JSON strings or objects
- **Pattern**: Always use `parseJsonSafely()` helper
- **Reason**: Contact Center Desktop may serialize objects to JSON strings

### Code Conventions

#### Console Logging Strategy
- **Heavy logging**: All getters/setters log for debugging integration issues
- **Purpose**: Contact Center Desktop integration is opaque - logging is critical
- **Pattern**: Use descriptive prefixes (`{{WIDGET_PASCAL_CASE}}:`, `Redux:`, `SDK:`)
- **Production**: Do NOT remove console logs - they're essential for troubleshooting

#### Async Thunk Pattern
- **Structure**: All SDK operations use Redux Toolkit async thunks
- **Status handling**: Set status with translation key, clear after 3 seconds
- **Error handling**: Always catch, log, and set error status
- **Demo mode**: Provide fallback behavior when SDK unavailable

#### Translation Key Convention
- **Storage**: Store translation keys in Redux state, not translated strings
- **Translation**: Translate at render time using `t()` function
- **Interpolation**: Use `{{variable}}` syntax in translation strings
- **Fallback**: Always falls back to English if locale not found

#### Momentum UI Integration Quirks
- **Select component**: Returns inconsistent value formats (array, object, or string)
- **Solution**: Normalize with `Array.isArray(value) ? value[0]?.value : (value?.value || value)`
- **CSS dependency**: Must load Momentum UI CSS before components render
- **Icon paths**: Requires correct font and icon paths (use local-corrected version)

### File Naming Conventions
- **Layout files**: `layout.<variant>.json` (standalone, production, debug, minimal)
- **Build outputs**: `{{WIDGET_NAME}}.js` (external React), `{{WIDGET_NAME}}-standalone.js` (bundled)
- **Test files**: `*-test.html` for browser tests
- **i18n files**: `translations.js` (all locales), `I18nContext.jsx` (provider), `index.js` (barrel export)

### Important Implementation Details

#### React Version Compatibility
- **Supports**: Both React 17 and React 18
- **Check**: `ReactDOM.createRoot` exists → use React 18 API
- **Fallback**: Use legacy `ReactDOM.render` for React 17
- **Reason**: Contact Center Desktop may use different React versions

#### AgentX Global Shim
- **File**: `src/agentx-globals.js`
- **Purpose**: Prevents `ReferenceError: AGENTX_SERVICE is not defined`
- **When**: SDK code expects bare identifier, not `window.AGENTX_SERVICE`
- **Critical**: Must be imported first in `index.jsx` before any SDK imports

#### External API Integration
- **Pattern**: Use async functions in `src/api.js` for external service calls
- **Error handling**: Always catch and log errors, provide fallback behavior
- **Authentication**: Use `accesstoken` and `orgid` properties for authenticated requests
- **Best practices**: Centralize API logic, implement proper error boundaries

### Performance Considerations
- **Bundle size**: Standalone build ~1.8MB (React + Redux + Momentum UI + widget code)
- **Load time**: Acceptable for intranet/enterprise environments
- **Optimization**: Could code-split Momentum UI or tree-shake unused components
- **Trade-off**: Single-file deployment vs smaller size

### Security Notes
- **Access tokens**: Logged with masking (shows last 4 chars only)
- **Sensitive data**: Task and agent objects may contain PII - handle appropriately
- **API endpoints**: Use environment variables for production API URLs
- **CORS**: Required for local development, not needed in production (same-origin)

## Customization Guidelines

When extending this widget:

1. **Follow existing patterns**: Use the established Redux async thunk pattern for SDK operations
2. **Maintain demo mode**: Always provide fallback behavior when SDK is unavailable
3. **Use translation keys**: Store translation keys in Redux state, translate at render time
4. **Handle property parsing**: Always use `parseJsonSafely()` for incoming props
5. **Log extensively**: Console logging is critical for debugging Desktop integration
6. **Test both builds**: Verify functionality in both development and standalone builds
7. **Maintain CSS injection**: Ensure CSS works in both normal DOM and shadow DOM environments
8. **Follow naming conventions**: Use consistent file naming and component structure