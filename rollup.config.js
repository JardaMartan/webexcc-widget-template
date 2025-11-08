import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import replace from '@rollup/plugin-replace';
import json from '@rollup/plugin-json';
import postcss from 'rollup-plugin-postcss';

// Check if we want a self-contained build (for Contact Center Desktop)
const isSelfContained = process.env.BUILD_MODE === 'self-contained';

export default {
  input: 'src/index.jsx',
  output: {
    file: isSelfContained ? 'dist/{{WIDGET_NAME}}-standalone.js' : 'dist/{{WIDGET_NAME}}.js',
    format: 'iife',
    name: '{{WIDGET_PASCAL_CASE}}',
    globals: isSelfContained ? {} : {
      'react': 'React',
      'react-dom': 'ReactDOM',
      'react-dom/client': 'ReactDOM'
    }
  },
  // External dependencies - only externalize when not self-contained
  external: isSelfContained ? [] : (id) => {
    // Externalize all react packages from any source
    return id === 'react' || 
           id === 'react-dom' || 
           id === 'react-dom/client';
  },
  onwarn: (warning, warn) => {
    // Suppress "Cannot call a namespace" warnings for React components
    if (warning.code === 'NAMESPACE_REDEFINE') {
      return;
    }
    
    // Suppress "this has been rewritten to undefined" warnings
    if (warning.code === 'THIS_IS_UNDEFINED') {
      return;
    }
    
    // Suppress circular dependency warnings for React/Redux
    if (warning.code === 'CIRCULAR_DEPENDENCY') {
      if (warning.message.includes('react') || 
          warning.message.includes('redux') ||
          warning.message.includes('@momentum-ui')) {
        return;
      }
    }
    
    // Show all other warnings
    warn(warning);
  },
  plugins: [
    // Replace process variables with browser-compatible values
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env': '{}',
      'process': 'undefined',
      'typeof process': '"undefined"',
      'process !== undefined': 'false',
      'process != undefined': 'false',
      'process == undefined': 'true',
      'process === undefined': 'true',
      '!process': 'true',
      'process &&': 'false &&',
      'process ||': 'false ||',
      'global.process': 'undefined',
      'window.process': 'undefined',
      // Only replace React requires when NOT self-contained (when externalizing)
      ...(isSelfContained ? {} : {
        'require("react")': 'React',
        'require(\'react\')': 'React',
        'require("react-dom")': 'ReactDOM',
        'require(\'react-dom\')': 'ReactDOM',
        'require("react-dom/client")': 'ReactDOM',
        'require(\'react-dom/client\')': 'ReactDOM',
      }),
      // Replace Node.js util with a minimal polyfill
      'require("util")': '{ inspect: function(obj) { return JSON.stringify(obj); } }',
      'require(\'util\')': '{ inspect: function(obj) { return JSON.stringify(obj); } }',
      preventAssignment: true
    }),
    resolve({
      browser: true,
      preferBuiltins: false,
      extensions: ['.js', '.jsx'],
      // Deduplicate React to prevent multiple versions
      dedupe: ['react', 'react-dom']
    }),
    commonjs({
      include: ['node_modules/**'],
      transformMixedEsModules: true,
      sourceMap: false,
      // Fix "this is undefined" warnings
      defaultIsModuleExports: 'auto',
      // Transform all CommonJS modules properly, even those referencing React
      requireReturnsDefault: 'auto'
    }),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled',
      presets: [
        ['@babel/preset-env', { targets: { browsers: '> 1%' } }],
        ['@babel/preset-react', { runtime: 'classic' }]
      ]
    }),
    json(),
    postcss({
      extract: false, // Don't create external CSS file
      inject: (cssVariableName) => {
        // Custom injection - return the CSS as a string that can be manually handled
        return `
          if (typeof window !== 'undefined') {
            window.__MOMENTUM_UI_CSS__ = ${cssVariableName};
          }
        `;
      },
      minimize: true
    }),
    terser({
      compress: {
        drop_console: false,
        drop_debugger: false
      }
    })
  ]
};