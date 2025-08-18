module.exports = {
  version: 2,
  
  // Configuración de discovery (sin secrets)
  discovery: {
    allowedHostnames: ['localhost'],
    disallowedHostnames: [],
    networkIdleTimeout: 100
  },
  
  // Configuración de snapshots
  snapshot: {
    widths: [375, 768, 1280, 1920],
    minHeight: 1024,
    percyCSS: `
      .timestamp, .date, .current-time { 
        visibility: hidden !important; 
      }
      .loading-spinner { 
        display: none !important; 
      }
    `
  },
  
  // IMPORTANTE: Token debe venir de variable de entorno
  // NO hardcodear tokens aquí
  // Uso: export PERCY_TOKEN=tu_token_aqui
  //   O: crear archivo .env local (no commitear)
  
  // Configuración local (sin token requerido)
  defer: {
    "percy-upload": true
  }
};
