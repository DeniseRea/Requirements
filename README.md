# FAESign - Sistema de Firma Electrónica Avanzada

[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-green.svg)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-16+-brightgreen.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

FAESign es una aplicación web moderna diseñada para la gestión integral de procesos de firma electrónica avanzada, garantizando máxima trazabilidad, seguridad y eficiencia operativa. El sistema está estructurado en roles específicos, cada uno con funcionalidades y responsabilidades claramente definidas según las mejores prácticas de seguridad digital.

##  Características Principales

### **Sistema de Roles Diferenciados**

#### 1. **CREADOR** 
Encargado de generar y preparar documentos para firma.
- Crear y editar documentos
- Definir flujo de firma (jerárquico o paralelo)
- Asignar firmantes específicos
- Consultar estado de documentos en tiempo real
- Cancelar procesos antes de la firma

#### 2. **FIRMANTE** 
Responsable de firmar digitalmente documentos según jerarquía.
- Visualizar documentos pendientes de firma
- Firmar documentos con certificado digital válido
- Rechazar documentos con justificación detallada
- Validar identidad mediante autenticación robusta
- Consultar historial de firmas y rechazos

#### 3. **ADMINISTRADOR** 
Encargado del control del sistema y configuración general.
- Gestionar usuarios (crear, editar, desactivar)
- Asignar roles y permisos
- Configurar políticas del sistema
- Administrar certificados digitales
- Supervisar procesos globales
- Gestionar notificaciones automáticas

#### 4. **AUDITOR** 
Encargado de la trazabilidad, inspección y legalidad del sistema.
- Consultar historial completo de firmas
- Generar reportes personalizados (PDF, CSV, Excel)
- Exportar logs de auditoría detallados
- Analizar métricas y tiempos de proceso
- Verificar cumplimiento normativo y legal

##  Arquitectura del Proyecto

```
FAESign/
├── 📁 public/
│   ├── 📁 assets/              # Recursos estáticos (imágenes, logos, íconos)
│   └── 📄 index.html           # Archivo HTML principal
├── 📁 src/
│   ├── 📁 app/                 # Configuración global de la aplicación
│   │   └── 📁 routes/          # Sistema de rutas (AppRoutes.jsx)
│   ├── 📁 core/                # Lógica de negocio central
│   │   ├── 📁 auth/            # Autenticación y autorización
│   │   ├── 📁 documents/       # Gestión de documentos
│   │   └── 📁 signatures/      # Procesamiento de firmas
│   ├── 📁 features/            # Módulos funcionales por característica
│   │   ├── 📁 document-signing/ # Flujos de firma de documentos
│   │   ├── 📁 admin/           # Panel administrativo
│   │   └── 📁 user-management/ # Gestión de usuarios
│   ├── 📁 shared/              # Componentes y utilidades reutilizables
│   │   ├── 📁 components/      # Componentes UI globales
│   │   ├── 📁 hooks/           # Custom React hooks
│   │   └── 📁 utils/           # Funciones utilitarias
│   ├── 📁 pages/               # Vistas principales del sistema
│   │   ├── 📄 LoginPage.jsx    # Página de autenticación
│   │   ├── 📄 CreadorDashboard.jsx
│   │   ├── 📄 FirmanteDashboard.jsx
│   │   └── 📄 Dashboard.jsx    # Dashboard genérico
│   ├── 📁 tests/               # Suite de pruebas
│   ├── 📄 App.jsx              # Componente raíz
│   └── 📄 main.jsx             # Punto de entrada de React
├── 📄 .gitignore               # Exclusiones de Git
├── 📄 package.json             # Dependencias y scripts
├── 📄 vite.config.js           # Configuración de Vite
└── 📄 README.md                # Documentación del proyecto
```

##  Instalación y Configuración

### **Prerrequisitos**
- **Node.js** v16.0 o superior
- **npm** v8.0 o superior
- **Git** para control de versiones

### **Instalación Paso a Paso**

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/DeniseRea/Requirements.git
   cd Requirements/FAESign
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno** (opcional)
   ```bash
   cp .env.example .env
   # Editar .env con tus configuraciones
   ```

4. **Iniciar servidor de desarrollo**
   ```bash
   npm run dev
   ```

5. **Acceder a la aplicación**
   ```
   http://localhost:5173
   ```

## Sistema de Autenticación

### **Flujo de Autenticación FAE**
1. **Login**: Correo electrónico + código de acceso (no contraseña tradicional)
2. **Validación**: Verificación de credenciales con registro de auditoría
3. **Token JWT**: Generación de token válido por 8 horas
4. **Redirección**: Automática al dashboard específico del rol
5. **Trazabilidad**: Registro completo (IP, dispositivo, timestamp)

### **Cuentas de Demostración**
```
Creador:       creador@fae.ec       | Código: cualquiera
Firmante:      firmante@fae.ec      | Código: cualquiera  
Administrador: administrador@fae.ec | Código: cualquiera
Auditor:       auditor@fae.ec       | Código: cualquiera
```


## Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo
npm run build        # Construye versión de producción
npm run preview      # Vista previa de build de producción

# Calidad de Código
npm run test         # Ejecuta suite de pruebas
npm run test:watch   # Pruebas en modo watch
npm run lint         # Análisis de código con ESLint
npm run lint:fix     # Corrige problemas de linting automáticamente

# Utilidades
npm run clean        # Limpia archivos de build
```

## 📊 Trazabilidad y Auditoría


### **Información de Auditoría**
- **Timestamp**: Fecha y hora exacta UTC
- **Usuario**: Email y rol del usuario
- **IP Address**: Dirección IP de origen
- **User Agent**: Información del navegador/dispositivo
- **Acción**: Descripción detallada del evento
- **Resultado**: Éxito o fallo con detalles

## Contribuciones

¡Las contribuciones son bienvenidas! Por favor, sigue estos pasos:

1. Fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de tus cambios (`git commit -m 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.


<div align="center">
  <br>
  <sub>FAESign © 2025 - Todos los derechos reservados</sub>
</div>

