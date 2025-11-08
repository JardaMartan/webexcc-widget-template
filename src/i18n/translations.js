// Translation dictionaries for supported locales
// Add new locales by extending this object with the same key structure.
export const translations = {
  en: {
    ui: {
      loading: 'Loading widget...',
      widget: {
        title: '{{WIDGET_TITLE}}',
        description: '{{WIDGET_DESCRIPTION}}'
      },
      notes: {
        label: 'Notes',
        placeholder: 'Enter notes here...'
      },
      accept: 'Accept',
      reject: 'Reject',
      props: {
        header: 'Properties from Webex CC Desktop:',
        darkmode: 'Dark Mode',
        accessToken: 'Access Token',
        name: 'Name',
        avatar: 'Avatar',
        orgId: 'Org ID',
        dataCenter: 'Data Center',
        selectedTaskId: 'Selected Task ID',
        task: 'Task',
        agent: 'Agent',
        cad: 'CAD',
        details: 'Details',
        wrap: 'Wrap'
      },
      value: {
        notSet: 'not set'
      }
      // TODO: Add your custom UI translation keys here
      // Example:
      // customAction: {
      //   label: 'Custom Action',
      //   placeholder: 'Select an option...',
      //   option1: 'Option 1',
      //   option2: 'Option 2'
      // }
    },
    status: {
      sdk: {
        init: { success: 'Desktop SDK initialized successfully!' },
        demo: 'Demo mode - SDK not available',
        initFail: 'Failed to initialize Desktop SDK',
        unavailable: 'SDK not available'
      },
      agent: { unavailable: 'Agent data not available' },
      action: {
        success: 'Action completed successfully!',
        fail: 'Action failed: {{error}}'
      }
      // TODO: Add your custom status translation keys here
      // Example:
      // customData: {
      //   fetched: 'Data fetched successfully',
      //   fail: 'Failed to fetch data: {{error}}'
      // }
    }
  },
  es: {
    ui: {
      loading: 'Cargando widget...',
      widget: {
        title: '{{WIDGET_TITLE}}',
        description: '{{WIDGET_DESCRIPTION}}'
      },
      notes: {
        label: 'Notas',
        placeholder: 'Ingrese notas aquí...'
      },
      accept: 'Aceptar',
      reject: 'Rechazar',
      props: {
        header: 'Propiedades de Webex CC Desktop:',
        darkmode: 'Modo oscuro',
        accessToken: 'Token de acceso',
        name: 'Nombre',
        avatar: 'Avatar',
        orgId: 'ID de la organización',
        dataCenter: 'Centro de datos',
        selectedTaskId: 'ID de tarea seleccionada',
        task: 'Tarea',
        agent: 'Agente',
        cad: 'CAD',
        details: 'Detalles',
        wrap: 'Wrap'
      },
      value: { notSet: 'no establecido' }
      // TODO: Add your custom UI translation keys here in Spanish
    },
    status: {
      sdk: {
        init: { success: '¡SDK de Desktop inicializado con éxito!' },
        demo: 'Modo demostración - SDK no disponible',
        initFail: 'Error al inicializar el SDK de Desktop',
        unavailable: 'SDK no disponible'
      },
      agent: { unavailable: 'Datos del agente no disponibles' },
      action: {
        success: '¡Acción completada con éxito!',
        fail: 'Acción fallida: {{error}}'
      }
      // TODO: Add your custom status translation keys here in Spanish
    }
  }
  // TODO: Add more locales as needed (cs, fr, de, etc.)
};

export const DEFAULT_LOCALE = 'en';

/**
 * Detect browser's preferred language and return supported locale
 * @returns {string} Supported locale code (falls back to DEFAULT_LOCALE)
 */
export function detectBrowserLocale() {
  // Get browser language (e.g., 'en-US', 'es-ES', 'es')
  const browserLang = navigator.language || navigator.userLanguage;
  
  if (!browserLang) return DEFAULT_LOCALE;
  
  // Extract primary language code (e.g., 'en' from 'en-US')
  const primaryLang = browserLang.toLowerCase().split(/[-_]/)[0];
  
  // Check if we have translations for this language
  if (translations[primaryLang]) {
    return primaryLang;
  }
  
  // Fallback to default
  return DEFAULT_LOCALE;
}