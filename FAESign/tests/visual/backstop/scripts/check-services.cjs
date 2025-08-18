/**
 * Script de verificación de servicios para BackstopJS
 * Compatible con multiserver - CommonJS
 */

const http = require('http');
const fs = require('fs');

const services = [
  { 
    name: 'Frontend (Vite)',
    url: 'http://localhost:5173',
    port: 5173,
    required: true
  },
  { 
    name: 'Storybook',
    url: 'http://localhost:6006', 
    port: 6006,
    required: true
  }
];

const staticFiles = [
  {
    name: 'StatusMessage Test Page',
    path: 'C:\\Users\\denise\\Documents\\GitHub\\Requirements\\FAESign\\tests\\visual\\backstop\\test-pages\\statusmessage.html'
  }
];

async function checkService(service) {
  return new Promise((resolve) => {
    const req = http.get(service.url, (res) => {
      console.log(`✅ ${service.name} is running on port ${service.port} (Status: ${res.statusCode})`);
      resolve({ ...service, status: 'running', statusCode: res.statusCode });
    });
    
    req.on('error', () => {
      console.log(`❌ ${service.name} is NOT running on port ${service.port}`);
      resolve({ ...service, status: 'error' });
    });
    
    req.setTimeout(5000, () => {
      console.log(`⏰ ${service.name} timeout on port ${service.port}`);
      req.destroy();
      resolve({ ...service, status: 'timeout' });
    });
  });
}

function checkStaticFile(file) {
  try {
    if (fs.existsSync(file.path)) {
      console.log(`✅ ${file.name} exists`);
      return { ...file, status: 'exists' };
    } else {
      console.log(`❌ ${file.name} NOT found`);
      return { ...file, status: 'missing' };
    }
  } catch (error) {
    console.log(`❌ Error checking ${file.name}: ${error.message}`);
    return { ...file, status: 'error', error: error.message };
  }
}

async function checkAllServices() {
  console.log('🔍 BackstopJS - Checking services and dependencies...\n');
  
  // Verificar servicios
  const serviceResults = await Promise.all(services.map(checkService));
  
  // Verificar archivos estáticos
  console.log('\n📁 Checking static files...');
  const fileResults = staticFiles.map(checkStaticFile);
  
  // Resumen
  console.log('\n📊 SUMMARY:');
  const runningServices = serviceResults.filter(s => s.status === 'running');
  const errorServices = serviceResults.filter(s => s.status === 'error' || s.status === 'timeout');
  const requiredServices = services.filter(s => s.required);
  const requiredRunning = serviceResults.filter(s => s.required && s.status === 'running');
  
  console.log(`Services running: ${runningServices.length}/${services.length}`);
  console.log(`Required services running: ${requiredRunning.length}/${requiredServices.length}`);
  console.log(`Static files available: ${fileResults.filter(f => f.status === 'exists').length}/${fileResults.length}`);
  
  if (errorServices.length > 0) {
    console.log('\n⚠️  ISSUES DETECTED:');
    errorServices.forEach(service => {
      if (service.required) {
        console.log(`❌ REQUIRED: ${service.name} is not available`);
      } else {
        console.log(`⚠️  OPTIONAL: ${service.name} is not available`);
      }
    });
    
    if (errorServices.some(s => s.required)) {
      console.log('\n🚫 Cannot proceed - required services are missing!');
      console.log('💡 Start services with: npm run visual:setup');
      process.exit(1);
    }
  }
  
  console.log('\n✅ All checks passed! Ready for visual testing.');
  return true;
}

// Ejecutar si se llama directamente
if (require.main === module) {
  checkAllServices().catch(error => {
    console.error('Error during service check:', error);
    process.exit(1);
  });
}

module.exports = { checkAllServices, checkService, checkStaticFile };
