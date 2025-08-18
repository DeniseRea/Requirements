#!/bin/bash

# =============================================================================
# SCRIPT DE AUTOMATIZACIÓN COMPLETA DE PRUEBAS VISUALES - PLAYWRIGHT
# =============================================================================
# 
# Script completo para ejecutar toda la suite de automatización de pruebas
# visuales con Playwright en el proyecto FAESign
#
# Uso:
#   ./run-complete-automation.sh
#   ./run-complete-automation.sh --ci
#   ./run-complete-automation.sh --headed
#   ./run-complete-automation.sh --coverage-only
#
# =============================================================================

set -e  # Exit on any error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuración
PROJECT_NAME="FAESign Visual Automation"
STORYBOOK_PORT=6006
DEV_SERVER_PORT=5173
MAX_WAIT_TIME=30
REPORT_DIR="playwright-report"

# Variables de modo
CI_MODE=false
HEADED_MODE=false
COVERAGE_ONLY=false

# Parsear argumentos
while [[ $# -gt 0 ]]; do
  case $1 in
    --ci)
      CI_MODE=true
      shift
      ;;
    --headed)
      HEADED_MODE=true
      shift
      ;;
    --coverage-only)
      COVERAGE_ONLY=true
      shift
      ;;
    -h|--help)
      echo "Uso: $0 [--ci] [--headed] [--coverage-only]"
      echo ""
      echo "Opciones:"
      echo "  --ci             Ejecutar en modo CI/CD"
      echo "  --headed         Ejecutar con navegador visible"
      echo "  --coverage-only  Solo ejecutar tests de cobertura"
      echo "  -h, --help       Mostrar esta ayuda"
      exit 0
      ;;
    *)
      echo "Opción desconocida: $1"
      exit 1
      ;;
  esac
done

# Función de logging
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

log_success() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] ✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] ⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ❌ $1${NC}"
}

log_section() {
    echo ""
    echo -e "${PURPLE}================================${NC}"
    echo -e "${PURPLE}$1${NC}"
    echo -e "${PURPLE}================================${NC}"
    echo ""
}

# Función para verificar si un puerto está en uso
is_port_in_use() {
    if command -v nc >/dev/null 2>&1; then
        nc -z localhost $1 >/dev/null 2>&1
    elif command -v netstat >/dev/null 2>&1; then
        netstat -an | grep ":$1 " | grep LISTEN >/dev/null 2>&1
    else
        # Fallback usando curl
        curl -s http://localhost:$1 >/dev/null 2>&1
    fi
}

# Función para esperar que un servicio esté disponible
wait_for_service() {
    local port=$1
    local service_name=$2
    local max_attempts=$3
    local attempt=1

    log "Esperando que $service_name esté disponible en puerto $port..."
    
    while [ $attempt -le $max_attempts ]; do
        if is_port_in_use $port; then
            log_success "$service_name está disponible en puerto $port"
            return 0
        fi
        
        log "Intento $attempt/$max_attempts: $service_name no disponible aún..."
        sleep 2
        ((attempt++))
    done
    
    log_error "$service_name no está disponible después de $max_attempts intentos"
    return 1
}

# Función para limpiar procesos
cleanup() {
    log_section "LIMPIEZA DE PROCESOS"
    
    # Terminar Storybook
    if [ -f .storybook.pid ]; then
        local storybook_pid=$(cat .storybook.pid)
        if kill -0 $storybook_pid 2>/dev/null; then
            log "Terminando Storybook (PID: $storybook_pid)..."
            kill $storybook_pid 2>/dev/null || true
        fi
        rm -f .storybook.pid
    fi
    
    # Terminar servidor de desarrollo
    if [ -f .dev-server.pid ]; then
        local dev_pid=$(cat .dev-server.pid)
        if kill -0 $dev_pid 2>/dev/null; then
            log "Terminando servidor de desarrollo (PID: $dev_pid)..."
            kill $dev_pid 2>/dev/null || true
        fi
        rm -f .dev-server.pid
    fi
    
    # Limpiar procesos por puerto
    if is_port_in_use $STORYBOOK_PORT; then
        log "Liberando puerto $STORYBOOK_PORT..."
        npx kill-port $STORYBOOK_PORT 2>/dev/null || true
    fi
    
    if is_port_in_use $DEV_SERVER_PORT; then
        log "Liberando puerto $DEV_SERVER_PORT..."
        npx kill-port $DEV_SERVER_PORT 2>/dev/null || true
    fi
    
    log_success "Limpieza completada"
}

# Configurar trap para limpieza en salida
trap cleanup EXIT

# Función principal
main() {
    log_section "AUTOMATIZACIÓN COMPLETA DE PRUEBAS VISUALES - PLAYWRIGHT"
    
    log "Proyecto: $PROJECT_NAME"
    log "Modo CI: $CI_MODE"
    log "Modo Headed: $HEADED_MODE"
    log "Solo Cobertura: $COVERAGE_ONLY"
    log "Directorio de reportes: $REPORT_DIR"
    echo ""
    
    # 1. Validación inicial
    log_section "1. VALIDACIÓN DEL ENTORNO"
    
    if [ ! -f "package.json" ]; then
        log_error "No se encontró package.json. Ejecutar desde el directorio raíz del proyecto."
        exit 1
    fi
    
    if [ ! -f "playwright.config.js" ]; then
        log_error "No se encontró playwright.config.js. Verificar configuración de Playwright."
        exit 1
    fi
    
    if [ ! -f "tests/visual/playwright/automated-visual-suite-complete.spec.js" ]; then
        log_error "No se encontró la suite de automatización completa."
        exit 1
    fi
    
    log_success "Archivos de configuración encontrados"
    
    # 2. Instalación de dependencias
    log_section "2. INSTALACIÓN DE DEPENDENCIAS"
    
    log "Instalando dependencias NPM..."
    npm install --silent || {
        log_error "Error al instalar dependencias NPM"
        exit 1
    }
    
    log "Instalando navegadores de Playwright..."
    npx playwright install --quiet || {
        log_error "Error al instalar navegadores de Playwright"
        exit 1
    }
    
    log_success "Dependencias instaladas correctamente"
    
    # 3. Limpieza previa
    log_section "3. LIMPIEZA PREVIA"
    cleanup
    
    # Limpiar reportes anteriores
    if [ -d "$REPORT_DIR" ]; then
        log "Limpiando reportes anteriores..."
        rm -rf "$REPORT_DIR"
    fi
    
    # 4. Inicio de servicios
    log_section "4. INICIO DE SERVICIOS"
    
    # Iniciar Storybook
    log "Iniciando Storybook en puerto $STORYBOOK_PORT..."
    nohup npm run storybook > storybook.log 2>&1 &
    echo $! > .storybook.pid
    
    # Esperar que Storybook esté disponible
    if ! wait_for_service $STORYBOOK_PORT "Storybook" $MAX_WAIT_TIME; then
        log_error "Storybook no pudo iniciarse"
        cat storybook.log 2>/dev/null || true
        exit 1
    fi
    
    # Iniciar servidor de desarrollo (opcional)
    if ! $COVERAGE_ONLY; then
        log "Iniciando servidor de desarrollo en puerto $DEV_SERVER_PORT..."
        nohup npm run dev > dev-server.log 2>&1 &
        echo $! > .dev-server.pid
        
        # Dar tiempo para que el servidor inicie
        sleep 5
        
        if is_port_in_use $DEV_SERVER_PORT; then
            log_success "Servidor de desarrollo iniciado"
        else
            log_warning "Servidor de desarrollo no disponible (algunos tests podrían fallar)"
        fi
    fi
    
    # 5. Ejecución de tests
    log_section "5. EJECUCIÓN DE TESTS AUTOMATIZADOS"
    
    # Construir comando de Playwright
    local playwright_cmd="npx playwright test tests/visual/playwright/automated-visual-suite-complete.spec.js"
    
    # Agregar opciones según modo
    if $CI_MODE; then
        playwright_cmd="$playwright_cmd --reporter=html --reporter=junit --reporter=json"
        playwright_cmd="$playwright_cmd --workers=1"
    else
        playwright_cmd="$playwright_cmd --reporter=html --reporter=line"
    fi
    
    if $HEADED_MODE; then
        playwright_cmd="$playwright_cmd --headed"
    fi
    
    if $COVERAGE_ONLY; then
        playwright_cmd="$playwright_cmd --grep='COVERAGE'"
    fi
    
    # Configurar variables de entorno
    if $CI_MODE; then
        export CI=true
        export CI_PROVIDER="script"
    fi
    
    # Ejecutar tests
    log "Ejecutando comando: $playwright_cmd"
    echo ""
    
    local test_start_time=$(date +%s)
    
    if $playwright_cmd; then
        local test_end_time=$(date +%s)
        local test_duration=$((test_end_time - test_start_time))
        
        log_success "Tests completados exitosamente en ${test_duration}s"
        
        # 6. Generación de reportes
        log_section "6. GENERACIÓN DE REPORTES"
        
        if [ -d "$REPORT_DIR" ]; then
            log "Reporte HTML disponible en: $REPORT_DIR/index.html"
            
            # Contar resultados
            if [ -f "$REPORT_DIR/results.json" ]; then
                local passed_tests=$(grep -o '"status":"passed"' "$REPORT_DIR/results.json" | wc -l)
                local failed_tests=$(grep -o '"status":"failed"' "$REPORT_DIR/results.json" | wc -l)
                local total_tests=$((passed_tests + failed_tests))
                
                log_success "Resultados: $passed_tests/$total_tests tests pasaron"
                
                if [ $failed_tests -gt 0 ]; then
                    log_warning "$failed_tests tests fallaron"
                fi
            fi
            
            # Abrir reporte si no estamos en CI
            if ! $CI_MODE && command -v open >/dev/null 2>&1; then
                log "Abriendo reporte HTML..."
                open "$REPORT_DIR/index.html" 2>/dev/null || true
            elif ! $CI_MODE && command -v xdg-open >/dev/null 2>&1; then
                log "Abriendo reporte HTML..."
                xdg-open "$REPORT_DIR/index.html" 2>/dev/null || true
            fi
        fi
        
        # 7. Análisis de métricas
        log_section "7. ANÁLISIS DE MÉTRICAS"
        
        if [ -f "storybook.log" ]; then
            local storybook_size=$(wc -l < storybook.log)
            log "Log de Storybook: $storybook_size líneas"
        fi
        
        if [ -f "dev-server.log" ]; then
            local dev_size=$(wc -l < dev-server.log)
            log "Log de servidor dev: $dev_size líneas"
        fi
        
        # 8. Resultados finales
        log_section "8. AUTOMATIZACIÓN COMPLETADA"
        
        log_success "🎉 AUTOMATIZACIÓN EXITOSA"
        log_success "⚡ Duración total: ${test_duration}s"
        log_success "📊 Reporte disponible en: $REPORT_DIR/"
        log_success "🔧 Configuración: Playwright optimizado para visual testing"
        
        if $CI_MODE; then
            log_success "✅ Preparado para integración CI/CD"
        fi
        
        echo ""
        echo -e "${GREEN}================================================${NC}"
        echo -e "${GREEN}AUTOMATIZACIÓN COMPLETA FINALIZADA EXITOSAMENTE${NC}"
        echo -e "${GREEN}================================================${NC}"
        echo ""
        
        return 0
        
    else
        local test_end_time=$(date +%s)
        local test_duration=$((test_end_time - test_start_time))
        
        log_error "Tests fallaron después de ${test_duration}s"
        
        # Mostrar logs de error
        log_section "LOGS DE ERROR"
        
        if [ -f "storybook.log" ]; then
            echo "=== STORYBOOK LOG ==="
            tail -20 storybook.log
            echo ""
        fi
        
        if [ -f "dev-server.log" ]; then
            echo "=== DEV SERVER LOG ==="
            tail -20 dev-server.log
            echo ""
        fi
        
        echo -e "${RED}===============================================${NC}"
        echo -e "${RED}AUTOMATIZACIÓN FALLÓ - REVISAR LOGS ANTERIORES${NC}"
        echo -e "${RED}===============================================${NC}"
        echo ""
        
        return 1
    fi
}

# Ejecutar función principal
main "$@"
