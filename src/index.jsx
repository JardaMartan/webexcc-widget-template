// Ensure AgentX globals exist before anything else imports SDK expectations
import './agentx-globals';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import {{WIDGET_PASCAL_CASE}} from './{{WIDGET_PASCAL_CASE}}';
import { I18nProvider, detectBrowserLocale } from './i18n';

/**
 * Inject Momentum UI CSS into the container (shadow DOM or document head)
 * @param {HTMLElement} container - Container element to inject CSS into
 */
const injectCSS = (container) => {
  const cssText = globalThis.__MOMENTUM_UI_CSS__;
  
  if (!cssText) return;
  
  const targetDocument = container?.getRootNode?.() || document;
  const targetHead = targetDocument === document ? document.head : targetDocument;
  
  if (targetHead.querySelector('#momentum-ui-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'momentum-ui-styles';
  style.textContent = cssText;
  
  if (targetDocument === document) {
    document.head.appendChild(style);
  } else {
    targetDocument.insertBefore(style, targetDocument.firstChild);
  }
};

if (globalThis.document?.getElementById('react-root')) {
  const container = globalThis.document.getElementById('react-root');
  
  injectCSS(container);
  
  if (ReactDOM.createRoot) {
    const root = ReactDOM.createRoot(container);
    root.render(
      <Provider store={store}>
        <{{WIDGET_PASCAL_CASE}} />
      </Provider>
    );
  } else {
    ReactDOM.render(
      <Provider store={store}>
        <{{WIDGET_PASCAL_CASE}} />
      </Provider>,
      container
    );
  }
}

/**
 * {{WIDGET_PASCAL_CASE}}Element - Custom Web Component wrapper for the React widget
 * Provides property getters/setters for integration with Webex Contact Center Desktop
 */
class {{WIDGET_PASCAL_CASE}}Element extends HTMLElement {
  constructor() {
    super();
    this.root = null;
    this.widgetAttributes = {
      darkmode: null,
      accesstoken: null
    };
    this._task = null;
    this._selectedtaskid = null;
    this._cad = null;
    this._details = null;
    this._wrap = null;
    this._avatar = null;
    this._name = null;
    this._orgid = null;
    this._datacenter = null;
    this._agent = null;
    this._locale = null; // Will be set from attribute or browser detection
  }

  static get observedAttributes() {
    return ['darkmode', 'accesstoken', 'locale'];
  }

  set task(value) {
    console.log('Task setter:', value);
    this._task = value;
    this.updateComponent();
  }

  get task() {
    console.log('Task getter:', this._task);
    return this._task;
  }

  set selectedtaskid(value) {
    console.log('SelectedTaskId setter:', value);
    this._selectedtaskid = value;
    this.updateComponent();
  }

  get selectedtaskid() {
    console.log('SelectedTaskId getter:', this._selectedtaskid);
    return this._selectedtaskid;
  }

  set cad(value) {
    console.log('CAD setter:', JSON.stringify(value));
    this._cad = value;
    this.updateComponent();
  }

  get cad() {
    console.log('CAD getter:', this._cad);
    return this._cad;
  }

  set details(value) {
    console.log('Details setter:', JSON.stringify(value));
    this._details = value;
    this.updateComponent();
  }

  get details() {
    console.log('Details getter:', this._details);
    return this._details;
  }

  set wrap(value) {
    console.log('Wrap setter:', JSON.stringify(value));
    this._wrap = value;
    this.updateComponent();
  }

  get wrap() {
    console.log('Wrap getter:', this._wrap);
    return this._wrap;
  }

  set avatar(value) {
    console.log('Avatar setter:', value);
    this._avatar = value;
    this.updateComponent();
  }

  get avatar() {
    console.log('Avatar getter:', this._avatar);
    return this._avatar;
  }

  set name(value) {
    console.log('Name setter:', value);
    this._name = value;
    this.updateComponent();
  }

  get name() {
    console.log('Name getter:', this._name);
    return this._name;
  }

  set orgid(value) {
    console.log('OrgId setter:', value);
    this._orgid = value;
    this.updateComponent();
  }

  get orgid() {
    console.log('OrgId getter:', this._orgid);
    return this._orgid;
  }

  set datacenter(value) {
    console.log('DataCenter setter:', value);
    this._datacenter = value;
    this.updateComponent();
  }

  get datacenter() {
    console.log('DataCenter getter:', this._datacenter);
    return this._datacenter;
  }

  set agent(value) {
    console.log('Agent setter:', value);
    this._agent = value;
    this.updateComponent();
  }

  get agent() {
    console.log('Agent getter:', this._agent);
    return this._agent;
  }

  set locale(value) {
    console.log('Locale setter:', value);
    this._locale = value || detectBrowserLocale();
    this.updateComponent();
  }

  get locale() {
    return this._locale || detectBrowserLocale();
  }

  /**
   * Update component when properties change
   */
  updateComponent() {
    if (this.root || this.container) {
      this.renderComponent();
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`{{WIDGET_PASCAL_CASE}}: Attribute ${name} changed from "${oldValue}" to "${newValue}"`);
    this.widgetAttributes[name] = newValue;
    if (name === 'locale') {
      this._locale = newValue || detectBrowserLocale();
    }
    
    if (this.root || this.container) {
      this.renderComponent();
    }
  }

  /**
   * Render the React component with current props
   */
  renderComponent() {
    const container = this.querySelector('#{{WIDGET_KEBAB_CASE}}-container');
    if (!container) return;

    // Determine effective locale: explicit attribute > browser detection
    const effectiveLocale = this._locale || detectBrowserLocale();

    const componentProps = {
      darkmode: this.widgetAttributes.darkmode,
      accesstoken: this.widgetAttributes.accesstoken,
      task: this._task,
      selectedtaskid: this._selectedtaskid,
      cad: this._cad,
      details: this._details,
      wrap: this._wrap,
      avatar: this._avatar,
      name: this._name,
      orgid: this._orgid,
      datacenter: this._datacenter,
      agent: this._agent,
      locale: effectiveLocale
    };

    if (ReactDOM.createRoot && this.root) {
      this.root.render(
        <Provider store={store}>
          <I18nProvider initialLocale={effectiveLocale}>
            <{{WIDGET_PASCAL_CASE}} {...componentProps} />
          </I18nProvider>
        </Provider>
      );
    } else if (this.container) {
      ReactDOM.render(
        <Provider store={store}>
          <I18nProvider initialLocale={effectiveLocale}>
            <{{WIDGET_PASCAL_CASE}} {...componentProps} />
          </I18nProvider>
        </Provider>,
        container
      );
    }
  }

  connectedCallback() {
    console.log('{{WIDGET_PASCAL_CASE}}: Connected to DOM');
    
    this.widgetAttributes.darkmode = this.getAttribute('darkmode');
    this.widgetAttributes.accesstoken = this.getAttribute('accesstoken');
    
    // Detect locale: explicit attribute > browser preference > default
    const localeAttr = this.getAttribute('locale');
    this._locale = localeAttr || detectBrowserLocale();
    
    console.log('{{WIDGET_PASCAL_CASE}}: Initial attributes:', this.widgetAttributes);
    console.log('{{WIDGET_PASCAL_CASE}}: Detected locale:', this._locale);

    const container = globalThis.document.createElement('div');
    container.id = '{{WIDGET_KEBAB_CASE}}-container';
    this.appendChild(container);

    injectCSS(this);

    const componentProps = {
      darkmode: this.widgetAttributes.darkmode,
      accesstoken: this.widgetAttributes.accesstoken,
      task: this._task,
      selectedtaskid: this._selectedtaskid,
      cad: this._cad,
      details: this._details,
      wrap: this._wrap,
      avatar: this._avatar,
      name: this._name,
      orgid: this._orgid,
      datacenter: this._datacenter,
      agent: this._agent,
      locale: this._locale
    };

    if (ReactDOM.createRoot) {
      this.root = ReactDOM.createRoot(container);
      this.root.render(
        <Provider store={store}>
          <I18nProvider initialLocale={this._locale}>
            <{{WIDGET_PASCAL_CASE}} {...componentProps} />
          </I18nProvider>
        </Provider>
      );
    } else {
      ReactDOM.render(
        <Provider store={store}>
          <I18nProvider initialLocale={this._locale}>
            <{{WIDGET_PASCAL_CASE}} {...componentProps} />
          </I18nProvider>
        </Provider>,
        container
      );
      this.container = container;
    }
  }

  disconnectedCallback() {
    if (this.root) {
      this.root.unmount();
    } else if (this.container) {
      ReactDOM.unmountComponentAtNode(this.container);
    }
  }
}

if (globalThis.customElements && !globalThis.customElements.get('{{WIDGET_KEBAB_CASE}}')) {
  globalThis.customElements.define('{{WIDGET_KEBAB_CASE}}', {{WIDGET_PASCAL_CASE}}Element);
}