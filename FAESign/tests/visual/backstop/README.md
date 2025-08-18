# Sistema de Pruebas Visuales BackstopJS - FAESign

## Descripción General

Este documento describe la implementación completa del sistema de pruebas de regresión visual usando BackstopJS para el proyecto FAESign. El sistema está optimizado para detectar diferencias visuales mientras mantiene estabilidad y reduce falsos positivos.

## Estructura del Proyecto

```
FAESign/
├── tests/visual/backstop/
│   ├── reference/           # Imágenes de referencia
│   ├── test/               # Capturas de prueba
│   ├── html_report/        # Reportes HTML
│   ├── ci_report/          # Reportes para CI/CD
│   ├── scripts/            # Scripts personalizados
│   │   ├── onBefore.js     # Configuración previa
│   │   ├── onReady.js      # Estabilización de página
│   │   └── check-services.js # Verificación de servicios
│   ├── test-pages/         # Páginas HTML estáticas
│   └── cookies.json        # Cookies para autenticación
├── backstop.config.json    # Configuración principal
└── .storybook/main.js      # Configuración de Storybook optimizada
```

## Comandos Principales

### Comandos Básicos
```bash
# Verificar servicios disponibles
npm run visual:check

# Iniciar servicios multiservidor
npm run visual:setup

# Crear referencias iniciales
npm run visual:reference

# Ejecutar pruebas visuales
npm run visual:test

# Aprobar cambios como nuevas referencias
npm run visual:approve

# Ver reportes
npm run visual:report
```

### Comandos Avanzados
```bash
# Flujo completo automatizado
npm run visual:full

# Pruebas por categoría
npm run visual:components    # Solo componentes de Storybook
npm run visual:frontend      # Solo páginas del frontend
npm run visual:static        # Solo páginas HTML estáticas
```

## Configuración de Escenarios

### Tipos de Escenarios Implementados

1. **Frontend Pages** - Páginas completas del frontend
   - Header/Navigation
   - Main Content (con carruseles estabilizados)
   - Footer

2. **Storybook Components** - Componentes aislados
   - StatusMessage variants (Success, Error, Warning)
   - Otros componentes según necesidades

3. **Static Pages** - Páginas HTML de prueba
   - Páginas de prueba controladas

### Configuración de Umbrales

```json
{
  "misMatchThreshold": 0.3,  // Componentes estables (0.3%)
  "misMatchThreshold": 0.5,  // Headers/footers (0.5%)
  "misMatchThreshold": 1.5,  // Contenido principal con carruseles (1.5%)
  "misMatchThreshold": 0.2   // Páginas estáticas (0.2%)
}
```

## Características de Estabilización

### 1. Scripts onBefore.js
- Deshabilita animaciones y transiciones CSS
- Configura fecha/hora mockada para consistencia
- Aplica CSS de estabilización global
- Configura cookies de autenticación

### 2. Scripts onReady.js
- Detiene carruseles automáticamente
- Fuerza primera imagen en sliders
- Estabiliza elementos multimedia
- Espera carga completa de componentes

### 3. Configuración de Storybook
- Fast Refresh deshabilitado
- HMR completamente desactivado
- Configuración optimizada para pruebas visuales

## Elementos Estabilizados

### CSS Automático
- Todas las animaciones y transiciones deshabilitadas
- Timestamps y fechas ocultos
- Estados de hover/focus neutralizados
- Elementos de carga ocultos

### JavaScript Automático
- Carruseles detenidos en primera imagen
- Videos pausados en frame inicial
- Intervalos y timeouts cancelados
- Math.random() y Date() mockeados

## Integración Multi-Servidor

### Servicios Soportados
1. **Frontend Vite** (puerto 5173)
2. **Storybook** (puerto 6006)
3. **Archivos HTML estáticos** (protocolo file://)

### Verificación Automática
El script `check-services.js` verifica:
- Disponibilidad de servicios HTTP
- Existencia de archivos estáticos
- Estado de dependencias

## Buenas Prácticas Implementadas

### 1. Selectores Específicos
- Se evita capturar `body` completo
- Selectores por responsabilidad funcional
- hideSelectors para áreas problemáticas

### 2. Umbrales Adaptativos
- Umbrales bajos para componentes estables
- Umbrales más altos para áreas con carruseles
- Configuración por tipo de contenido

### 3. Nomenclatura Consistente
- Formato: `Categoria-Componente-Variante`
- Ejemplos: `Frontend-Homepage-Header`, `Components-StatusMessage-Success`

### 4. Reportes Mejorados
- Reportes HTML y CI
- Comparaciones lado a lado
- Métricas detalladas de diferencias

## Solución de Problemas Comunes

### Carruseles Dinámicos
**Problema**: Imágenes cambian entre capturas
**Solución**: Script onReady.js detiene automáticamente carruseles

### Timestamps Variables
**Problema**: Fechas/horas causan diferencias
**Solución**: CSS oculta elementos temporales + Date mockeado

### Estados de Hover
**Problema**: Estados inconsistentes de UI
**Solución**: CSS neutraliza todos los estados de hover/focus

### Carga Lenta
**Problema**: Elementos no cargados completamente
**Solución**: Esperas adaptativas + networkidle + readySelector

## Mantenimiento

### Actualización de Referencias
```bash
# Cuando cambios visuales son intencionales
npm run visual:approve
```

### Ajuste de Umbrales
Modificar `misMatchThreshold` en `backstop.config.json` según:
- Análisis de falsos positivos
- Criticidad del componente
- Variabilidad esperada

### Monitoreo Continuo
- Revisar reportes periódicamente
- Documentar cambios visuales importantes
- Ajustar configuración según patrones observados

## CI/CD Integration

### GitHub Actions (Ejemplo)
```yaml
- name: Visual Testing
  run: |
    npm run visual:setup &
    sleep 15
    npm run visual:test
    npm run visual:stop
```

### Reportes en CI
- Los reportes se generan en `ci_report/`
- Compatible con artifacts de CI/CD
- JSON output para análisis automático

---

**Fecha de última actualización**: 17 de agosto de 2025
**Versión**: 1.0.0
**Mantenido por**: Equipo QA FAESign
