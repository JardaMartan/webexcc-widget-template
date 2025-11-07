# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Copy Template
```bash
cp -r template/ my-new-widget/
cd my-new-widget/
```

### 2. Run Setup Script
```bash
./setup.sh
```
This interactive script will:
- Ask for your widget details (name, title, description)
- Replace all template placeholders automatically
- Rename files appropriately

### 3. Install Dependencies
```bash
npm install
```

### 4. Start Development
```bash
npm start
```
This opens `dev.html` with your widget running in development mode with hot reload.

### 5. Customize Your Widget

Edit `src/YourWidget.jsx` to add your custom functionality:

```jsx
// Add custom state to Redux selector
const { 
  isLoading, 
  agent: storeAgent,
  customData,     // Add your state here
} = useSelector(state => state.widget);

// Add custom handlers
const handleCustomAction = useCallback(() => {
  dispatch(executeCustomAction(customData));
}, [dispatch, customData]);

// Add your UI components
return (
  <div style={{ padding: '20px' }}>
    <h2>{t('ui.widget.title')}</h2>
    
    {/* Add your custom UI here */}
    <Button onClick={handleCustomAction}>
      {t('ui.customAction.label')}
    </Button>
  </div>
);
```

### 6. Add Custom Redux Actions

Edit `src/store.js`:

```javascript
// Add to initialState
initialState: {
  // ... existing state
  customData: [],
  selectedOption: null,
},

// Add custom reducers
reducers: {
  // ... existing reducers
  setCustomData: (state, action) => {
    state.customData = action.payload;
  },
}

// Add async thunks
export const fetchCustomData = () => async (dispatch, getState) => {
  const { desktopSDK } = getState().widget;
  if (!desktopSDK) return;
  
  try {
    const response = await desktopSDK.agentContact.vteamList();
    dispatch(setCustomData(response.data));
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
};
```

### 7. Test Production Build

```bash
npm run build:standalone
npm run serve
# Open standalone-test.html to test bundled version
```

### 8. Deploy to Contact Center Desktop

1. Upload `dist/your-widget-standalone.js` to your CDN
2. Update `layout.standalone.json` with your CDN URL
3. Upload layout to Contact Center Desktop

## 📁 Template Files Overview

| File | Purpose |
|------|---------|
| `src/YourWidget.jsx` | Main React component - customize your UI here |
| `src/store.js` | Redux store - add your state and actions |
| `src/api.js` | External API calls - add webhook/API integration |
| `src/i18n/translations.js` | Add translations for your UI text |
| `layout.standalone.json` | Production layout for Contact Center Desktop |
| `dev.html` | Development test page with mock SDK |

## 🎯 Common Customizations

### Add Custom Form Fields
```jsx
<Select placeholder="Select option" onSelect={handleOptionChange}>
  <SelectOption value="option1" label="Option 1" />
  <SelectOption value="option2" label="Option 2" />
</Select>
```

### Add Custom API Integration
```javascript
// In src/api.js
export const fetchCustomData = async (accessToken, orgId) => {
  const response = await fetch(`https://api.example.com/data`, {
    headers: { 
      'Authorization': `Bearer ${accessToken}`,
      'X-Org-Id': orgId 
    }
  });
  return response.json();
};
```

### Add Custom Translations
```javascript
// In src/i18n/translations.js
en: {
  ui: {
    customAction: {
      label: 'Custom Action',
      success: 'Action completed!',
      error: 'Action failed'
    }
  }
}
```

That's it! You now have a fully functional widget template ready for customization. See `README.md` for detailed documentation on all features and patterns.