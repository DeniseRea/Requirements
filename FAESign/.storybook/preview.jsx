

// Importar estilos globales
import '../src/index.css';

const preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    // Configuración para pruebas visuales estables
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1280px',
            height: '720px',
          },
        },
      },
    },
    // Deshabilitar animaciones para pruebas visuales
    chromatic: {
      pauseAnimationAtEnd: true,
    },
    layout: 'centered',
  },
  
  // Decoradores globales para estabilización visual
  decorators: [
    (Story) => {
      // Inyectar CSS para estabilizar elementos
      if (typeof document !== 'undefined') {
        const style = document.createElement('style');
        style.textContent = `
          *, *::before, *::after {
            animation-duration: 0s !important;
            animation-delay: 0s !important;
            transition-duration: 0s !important;
            transition-delay: 0s !important;
          }
          
          /* Ocultar elementos dinámicos */
          .timestamp, .date-time, .current-time,
          [data-testid="timestamp"], [data-testid="current-time"] {
            visibility: hidden !important;
          }
          
          /* Estabilizar carruseles */
          .carousel, .slider, .swiper {
            animation-play-state: paused !important;
          }
          
          /* Remover efectos hover durante capturas */
          *:hover {
            transform: none !important;
            box-shadow: none !important;
          }
        `;
        document.head.appendChild(style);
      }
      
      return Story();
    },
  ],
};

export default preview;