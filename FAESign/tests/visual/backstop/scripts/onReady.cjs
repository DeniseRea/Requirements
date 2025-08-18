/**
 * Script ejecutado cuando la página está lista para screenshot
 * Estabilización completa compatible con multiserver - CommonJS + Puppeteer API
 */

module.exports = async (page, scenario, vp) => {
  console.log('BACKSTOP > onReady: Stabilizing page elements');
  
  // Detener carruseles y elementos dinámicos
  await page.evaluate(() => {
    // Detener todos los intervalos y timeouts activos
    for (let i = 1; i < 99999; i++) {
      window.clearInterval(i);
      window.clearTimeout(i);
    }
    
    // Buscar y detener carruseles comunes
    const carousels = document.querySelectorAll([
      '.carousel', '.slider', '.swiper', 
      '[data-carousel]', '[data-slider]',
      '.owl-carousel', '.slick-slider',
      '.hero-carousel', '.image-slider'
    ].join(','));
    
    carousels.forEach(carousel => {
      // Detener Swiper si existe
      if (carousel.swiper) {
        carousel.swiper.autoplay.stop();
        carousel.swiper.slideTo(0);
      }
      
      // Detener Bootstrap Carousel si existe
      if (window.bootstrap && carousel.classList.contains('carousel')) {
        const instance = bootstrap.Carousel.getInstance(carousel);
        if (instance) {
          instance.pause();
          instance.to(0);
        }
      }
      
      // Forzar detener animaciones CSS
      carousel.style.animationPlayState = 'paused';
      carousel.style.transition = 'none';
      carousel.style.transform = 'none';
    });
    
    // Forzar primera slide visible
    const firstSlides = document.querySelectorAll([
      '.carousel-item:first-child',
      '.slide:first-child', 
      '.swiper-slide:first-child',
      '.hero-slide:first-child'
    ].join(','));
    
    firstSlides.forEach(slide => {
      slide.classList.add('active');
      slide.style.display = 'block';
      slide.style.opacity = '1';
      
      // Ocultar slides hermanos
      const siblings = slide.parentElement.children;
      Array.from(siblings).forEach((sibling, index) => {
        if (index > 0) {
          sibling.classList.remove('active');
          sibling.style.display = 'none';
        }
      });
    });
    
    // Detener videos y elementos multimedia
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      video.pause();
      video.currentTime = 0;
    });
    
    // Remover focus activo de formularios
    const focusedElements = document.querySelectorAll(':focus');
    focusedElements.forEach(el => el.blur());
  });
  
  // Aplicar CSS de estabilización adicional (Puppeteer API)
  await page.addStyleTag({
    content: `
      /* Ocultar indicadores de carrusel */
      .carousel-indicators, .slider-dots, .swiper-pagination,
      .owl-dots, .slick-dots {
        display: none !important;
      }
      
      /* Forzar primera imagen visible en carruseles */
      .carousel-item:not(:first-child),
      .slide:not(:first-child),
      .swiper-slide:not(:first-child) {
        display: none !important;
      }
      
      .carousel-item:first-child,
      .slide:first-child,
      .swiper-slide:first-child {
        display: block !important;
        opacity: 1 !important;
        transform: translateX(0) !important;
      }
      
      /* Ocultar tooltips, popovers y dropdowns */
      .tooltip, .popover, .dropdown-menu {
        display: none !important;
      }
      
      /* Estabilizar elementos específicos por tipo de página */
      /* Para Storybook */
      .sb-show-main, .docs-story {
        animation: none !important;
        transition: none !important;
      }
      
      /* Para Frontend */
      .loading-spinner, .skeleton-loader {
        display: none !important;
      }
    `
  });
  
  // Verificar readySelector si está especificado en el scenario
  if (scenario.readySelector) {
    try {
      await page.waitForSelector(scenario.readySelector, {
        visible: true,
        timeout: 10000
      });
      console.log(`ReadySelector found: ${scenario.readySelector}`);
    } catch (error) {
      console.warn(`ReadySelector not found: ${scenario.readySelector}`);
    }
  }
  
  console.log('BACKSTOP > onReady: Page stabilization completed');
};
