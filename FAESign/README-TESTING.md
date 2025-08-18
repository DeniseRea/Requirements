# 🎯 **Guía Completa de Testing Visual - FAESign**

## 📋 **Índice**
- [Configuración Inicial](#configuración-inicial)
- [Testing con---

## 🎨 **Testing con Percy (Seguro)**

### **🔐 Configuración Segura (SIN tokens en código)**

Percy funciona en **3 modos diferentes**:

#### **1. MODO### **📸 BackstopJS - Scripts Esenciales**
```bash
# === CONFIGURACIÓN STAGING (RECOMENDADA) ===
npm run visual:staging:reference    # Crear referencias
npm run visual:staging              # Ejecutar pruebas
npm run visual:approve              # Aprobar cambios

# === CONFIGURACIÓN COMPLETA ===
npm run visual:reference            # Crear referencias completas
npm run visual:test                 # Ejecutar pruebas completas
npm run visual:approve              # Aprobar cambios

# === UTILIDADES ===
npm run visual:check                # Verificar servicios
npm run visual:setup                # Iniciar servicios
npm run visual:stop                 # Detener servicios
npm run visual:minimal              # Test mínimo (solo estáticas)
```

### **🎨 Percy - Scripts Seguros (Sin tokens)**
```bash
npm run test:percy:local            # Testing local (sin uploads)
npm run test:percy:components       # Componentes específicos
npm run test:percy:responsive       # Diseño responsivo
npm run test:percy:core             # Páginas principales
npm run test:percy:dry-run          # Dry-run (simula uploads)
```

### **🎭 Playwright - Scripts Disponibles**para desarrollo)**
```bash
# No requiere token - Solo genera snapshots locales
export PERCY_SKIP_UPLOADS=true
npm run test:percy:local
```

#### **2. MODO DRY-RUN (Testing sin uploads)**
```bash
# Simula envío pero no sube a cloud
npm run test:percy:dry-run
```

#### **3. MODO CLOUD (Opcional - requiere token personal)**
```bash
# Solo si tienes cuenta Percy personal
# Crear archivo .env local (NO COMMITEAR):
echo "PERCY_TOKEN=tu_token_personal_aqui" > .env
npm run test:percy:local
```

### **🚀 Comandos Percy Seguros**
```bash
# Testing básico (local)
npm run test:percy:local

# Testing específico por componentes
npm run test:percy:components
npm run test:percy:responsive  
npm run test:percy:core

# Testing sin uploads (dry-run)
npm run test:percy:dry-run
```

### **✅ Ventajas de esta configuración:**
- ✅ **No expone tokens** en el repositorio
- ✅ **Funciona offline** para desarrollo
- ✅ **Compatible con CI/CD** (usando variables de entorno)
- ✅ **Percy opcional** - BackstopJS sigue siendo principal

---

## 🎭 **Testing con Playwright**ckstopJS](#testing-con-backstopjs)
- [Testing con Percy (Seguro)](#testing-con-percy-seguro)
- [Testing con Playwright](#testing-con-playwright) 
- [Testing con Loki](#testing-con-loki)
- [Resolución de Problemas](#resolución-de-problemas)
- [Comandos de Referencia](#comandos-de-referencia)

---

## 🚀 **Configuración Inicial**

### **1. Prerrequisitos**
```bash
# Instalar dependencias
npm install

# Verificar que Node.js sea v22.16.0 o superior
node --version
```

### **2. Estructura del Proyecto**
```
FAESign/
├── backstop-complete.config.cjs    # Configuración completa (Frontend + Storybook + Static)
├── backstop-staging.config.cjs     # Configuración estable (Frontend + Static)
├── backstop-minimal.config.cjs     # Configuración básica (Solo Static)
├── tests/visual/
│   ├── backstop/
│   │   ├── scripts/
│   │   │   ├── onBefore.cjs        # Setup antes de screenshots
│   │   │   ├── onReady.cjs         # Estabilización de páginas
│   │   │   └── check-services.cjs  # Verificación de servicios
│   │   ├── test-pages/
│   │   │   └── statusmessage.html  # Página de test estática
│   │   └── backstop_data/          # Imágenes de referencia y resultados
│   ├── percy/                      # Tests de Percy
│   ├── playwright/                 # Tests de Playwright
│   └── loki/                       # Tests de Loki
└── package.json                    # Scripts NPM configurados
```

---

## 📸 **Testing con BackstopJS**

### **🎯 Configuraciones Disponibles**

#### **1. Configuración Staging (Recomendada)**
- ✅ **Más estable y confiable**
- ✅ **Frontend + Páginas estáticas**
- ✅ **3 viewports: phone, tablet, desktop**
- ✅ **Tiempo de ejecución: ~25 segundos**

#### **2. Configuración Completa**
- ⚠️ **Incluye Storybook (puede fallar)**
- ✅ **Frontend + Storybook + Páginas estáticas**
- ✅ **5 viewports: phone, tablet, desktop, desktop-large, desktop-xl**
- ⚠️ **Tiempo de ejecución: ~45 segundos**

#### **3. Configuración Mínima**
- ✅ **Solo páginas estáticas**
- ✅ **Para debugging rápido**
- ✅ **3 viewports**
- ✅ **Tiempo de ejecución: ~8 segundos**

### **🚀 Comandos Principales**

#### **Testing Básico (Staging)**
```bash
# 1. Verificar servicios
npm run visual:check

# 2. Iniciar servicios (Frontend en localhost:5173)
npm run visual:setup

# 3. Crear imágenes de referencia (primera vez)
npm run visual:staging:reference

# 4. Ejecutar pruebas visuales
npm run visual:staging

# 5. Aprobar cambios (si todo está bien)
npm run visual:approve
```

#### **Testing Completo (con Storybook)**
```bash
# 1. Verificar servicios
npm run visual:check

# 2. Iniciar servicios (Frontend + Storybook)
npm run visual:setup

# 3. Esperar que servicios estén listos (15 segundos)
timeout /t 15

# 4. Crear referencias completas
npm run visual:reference

# 5. Ejecutar pruebas completas
npm run visual:test

# 6. Detener servicios
npm run visual:stop
```

#### **Testing Mínimo (Solo estáticas)**
```bash
# No requiere servicios externos
npm run visual:minimal
```

### **📊 Interpretación de Resultados**

#### **✅ Prueba Exitosa**
```
report | 3 Passed
report | 0 Failed
COMMAND | Command "test" successfully executed
```

#### **❌ Prueba con Diferencias**
```
report | 2 Passed  
report | 1 Failed
ERROR { size: isDifferent, content: 16.58%, threshold: 0.8% }
```

#### **🔧 Acciones según Resultados**
- **0 Failed**: ✅ Todo perfecto
- **1-2 Failed con % bajo**: ⚠️ Revisar cambios en reporte HTML
- **Multiple Failed**: ❌ Problema de configuración o servicios

---

##  **Testing con Playwright**

### **🚀 Comandos Playwright**
```bash
# Ejecutar todos los tests visuales Playwright
npx playwright test tests/visual/playwright/

# Ver reportes
npx playwright show-report

# Instalar navegadores
npm run playwright:install
```

---

## 📱 **Testing con Loki**

### **🚀 Comandos Loki**
```bash
# Configuración en loki.config.js
npm run test:loki
```

---

## ❗ **Resolución de Problemas**

### **🔍 Diagnóstico General**

#### **1. Verificar servicios**
```bash
npm run visual:check
```
**Salida esperada:**
```
✅ Frontend (Vite) is running on port 5173 (Status: 200)
✅ Storybook is running on port 6006 (Status: 200)
✅ StatusMessage Test Page exists
```

#### **2. Verificar configuraciones**
```bash
# Verificar que archivos .cjs existan
ls backstop*.cjs
ls tests/visual/backstop/scripts/*.cjs
```

### **🚫 Errores Comunes y Soluciones**

#### **Error: `ERR_CONNECTION_REFUSED`**
```bash
# Causa: Servicios no están ejecutándose
# Solución:
npm run visual:setup
timeout /t 15  # Esperar que se inicien
```

#### **Error: `Reference image not found`**
```bash
# Causa: No se han creado imágenes de referencia
# Solución:
npm run visual:staging:reference  # O visual:reference
```

#### **Error: `Cannot require() ES Module`**
```bash
# Causa: Usando archivos .js en lugar de .cjs
# Solución: Verificar que todos los scripts sean .cjs
ls tests/visual/backstop/scripts/
```

#### **Error: `Node has 0 width`**
```bash
# Causa: Problemas con selectores Storybook
# Solución: Usar configuración staging sin Storybook
npm run visual:staging
```

#### **Error: `backstop.json not found`**
```bash
# Causa: BackstopJS busca archivo por defecto
# Solución: Usar configuración específica
backstop test --config=backstop-staging.config.cjs
```

### **🔧 Debugging Avanzado**

#### **1. Verificar puerto específico**
```bash
netstat -an | findstr :5173
netstat -an | findstr :6006
```

#### **2. Logs detallados**
```bash
# Habilitar debug en configuración
# Cambiar "debug": false a "debug": true en .cjs
```

#### **3. Limpiar cache**
```bash
# Limpiar referencias y empezar de nuevo
Remove-Item tests\visual\backstop\backstop_data\bitmaps_reference\* -Recurse -Force
npm run visual:staging:reference
```

---

## 📚 **Comandos de Referencia**

### **📸 BackstopJS - Scripts Esenciales**
```bash
# === CONFIGURACIÓN STAGING (RECOMENDADA) ===
npm run visual:staging:reference    # Crear referencias
npm run visual:staging              # Ejecutar pruebas
npm run visual:approve              # Aprobar cambios

# === CONFIGURACIÓN COMPLETA ===
npm run visual:reference            # Crear referencias completas
npm run visual:test                 # Ejecutar pruebas completas
npm run visual:approve              # Aprobar cambios

# === UTILIDADES ===
npm run visual:check                # Verificar servicios
npm run visual:setup                # Iniciar servicios
npm run visual:stop                 # Detener servicios
npm run visual:minimal              # Test mínimo (solo estáticas)
```

### **� Playwright - Scripts Disponibles**
```bash
npx playwright test tests/visual/playwright/     # Todos los tests
npm run test:playwright                           # Tests con tracing
npm run playwright:install                       # Instalar navegadores
npx playwright show-report                       # Ver reportes
```

---

## 🎯 **Flujos de Trabajo Recomendados**

### **💡 Para Desarrollo Diario**
```bash
# Flujo rápido (5 minutos)
npm run visual:minimal              # Solo páginas estáticas
```

### **🚀 Para Features Nuevas**
```bash
# Flujo completo (10 minutos)
npm run visual:setup                # Iniciar servicios
timeout /t 15                       # Esperar inicialización
npm run visual:staging:reference    # Crear referencias
npm run visual:staging              # Ejecutar pruebas
npm run visual:stop                 # Detener servicios
```

### **🔍 Para Release/QA**
```bash
# Flujo exhaustivo (15 minutos)
npm run visual:setup                # Iniciar servicios
timeout /t 15                       # Esperar inicialización
npm run visual:reference            # Referencias completas
npm run visual:test                 # Pruebas completas
npm run test:percy                  # Percy adicional
npm run visual:stop                 # Detener servicios
```

---

## 📞 **Soporte**

### **🔗 Enlaces Útiles**
- [BackstopJS Documentación](https://github.com/garris/BackstopJS)
- [Percy Documentación](https://docs.percy.io/)
- [Playwright Testing](https://playwright.dev/docs/test-intro)

### **📝 Reportar Problemas**
Al reportar problemas, incluye:
1. Comando ejecutado
2. Mensaje de error completo
3. Salida de `npm run visual:check`
4. Versión de Node.js (`node --version`)

---

**✨ ¡Happy Testing! ✨**

> Esta guía está optimizada para la rama `feature-testing` del proyecto FAESign.
> Última actualización: Agosto 17, 2025
