import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreadorDashboard.css';

export default function CreadorDashboard() {
  const [userEmail, setUserEmail] = useState('');
  const [documents, setDocuments] = useState([
    { id: 1, nombre: 'Contrato_Servicios_2024.pdf', estado: 'Borrador', firmantes: 0, creado: '2024-01-15', hash: 'abc123...', fileId: 'doc_001' },
    { id: 2, nombre: 'Acuerdo_Confidencialidad.pdf', estado: 'En Proceso', firmantes: 2, creado: '2024-01-12', hash: 'def456...', fileId: 'doc_002' },
    { id: 3, nombre: 'Propuesta_Comercial.pdf', estado: 'Firmado', firmantes: 4, creado: '2024-01-10', hash: 'ghi789...', fileId: 'doc_003' },
  ]);
  
  // Estados para el workflow integrado
  const [currentView, setCurrentView] = useState('dashboard'); // dashboard, upload, preview, assign, search
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadState, setUploadState] = useState('idle');
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedSigners, setSelectedSigners] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [documentContent, setDocumentContent] = useState(null);
  
  const navigate = useNavigate();

  // Datos simulados de usuarios FAE
  const availableUsers = [
    { id: 1, nombre: 'Carlos', apellido: 'Mendoza', rango: 'Coronel', reparto: 'Comando Conjunto', email: 'carlos.mendoza@fae.mil.ec' },
    { id: 2, nombre: 'Ana', apellido: 'Rodriguez', rango: 'Teniente Coronel', reparto: 'Fuerza Aérea', email: 'ana.rodriguez@fae.mil.ec' },
    { id: 3, nombre: 'Miguel', apellido: 'Torres', rango: 'Mayor', reparto: 'Ejército', email: 'miguel.torres@fae.mil.ec' },
    { id: 4, nombre: 'Elena', apellido: 'Castro', rango: 'Capitán', reparto: 'Armada', email: 'elena.castro@fae.mil.ec' },
    { id: 5, nombre: 'Roberto', apellido: 'Silva', rango: 'Teniente', reparto: 'Fuerza Aérea', email: 'roberto.silva@fae.mil.ec' },
    { id: 6, nombre: 'Laura', apellido: 'Vega', rango: 'Subteniente', reparto: 'Ejército', email: 'laura.vega@fae.mil.ec' },
    { id: 7, nombre: 'Fernando', apellido: 'López', rango: 'General', reparto: 'Comando Conjunto', email: 'fernando.lopez@fae.mil.ec' },
    { id: 8, nombre: 'Isabel', apellido: 'Morales', rango: 'Coronel', reparto: 'Armada', email: 'isabel.morales@fae.mil.ec' }
  ];

  useEffect(() => {
    const email = localStorage.getItem('fae_user_email');
    const role = localStorage.getItem('fae_user_role');
    
    if (!email || role !== 'Creador') {
      navigate('/');
      return;
    }
    
    setUserEmail(email);
  }, [navigate]);

  // Limpiar URLs de objetos al desmontar el componente
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'Firmado': return '#10b981';
      case 'En Proceso': return '#f59e0b';
      case 'Borrador': return '#6b7280';
      case 'Rechazado': return '#ef4444';
      case 'Cancelado': return '#ef4444';
      default: return '#6b7280';
    }
  };

  // Función para iniciar creación de documento
  const startDocumentCreation = () => {
    setCurrentView('upload');
    setSelectedFile(null);
    setUploadState('idle');
    setUploadProgress(0);
  };

  // Función para manejar selección de archivo
  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validar archivo
    if (file.type !== 'application/pdf') {
      alert('Solo se permiten archivos PDF');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      alert('El archivo excede el tamaño máximo de 25MB');
      return;
    }

    setSelectedFile(file);
    await processFile(file);
  };

  // Función para procesar archivo
  const processFile = async (file) => {
    setUploadState('processing');
    setUploadProgress(20);

    // Crear URL del objeto para previsualización
    const fileUrl = URL.createObjectURL(file);
    setPdfUrl(fileUrl);

    // Simular procesamiento
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUploadProgress(50);

    // Simular cifrado
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUploadProgress(80);

    // Simular hash y finalización
    await new Promise(resolve => setTimeout(resolve, 800));
    setUploadProgress(100);
    setUploadState('completed');

    // Crear documento con URL del PDF
    const newDoc = {
      id: Date.now(),
      nombre: file.name,
      estado: 'Borrador',
      firmantes: 0,
      creado: new Date().toISOString().split('T')[0],
      hash: 'sha256_' + Math.random().toString(36).substr(2, 9),
      fileId: 'file_' + Date.now(),
      pdfUrl: fileUrl,
      fileSize: file.size,
      lastModified: file.lastModified
    };

    setDocuments(prev => [...prev, newDoc]);
    setSelectedDocument(newDoc);
    setDocumentContent({
      name: file.name,
      size: file.size,
      type: file.type,
      url: fileUrl
    });

    setTimeout(() => {
      setCurrentView('preview');
    }, 1500);
  };

  // Función para previsualizar documento
  const previewDocument = (doc) => {
    setSelectedDocument(doc);
    setCurrentView('preview');
    
    // Si el documento tiene una URL de PDF, usarla
    if (doc.pdfUrl) {
      setPdfUrl(doc.pdfUrl);
      setDocumentContent({
        name: doc.nombre,
        size: doc.fileSize || 0,
        type: 'application/pdf',
        url: doc.pdfUrl
      });
    } else {
      // Para documentos existentes sin archivo real, limpiar la previsualización
      setPdfUrl(null);
      setDocumentContent(null);
    }
  };

  // Función para asignar firmantes
  const startSignerAssignment = (doc) => {
    setSelectedDocument(doc);
    setSelectedSigners([]);
    setCurrentView('assign');
  };

  // Función para agregar firmante
  const addSigner = (user) => {
    if (selectedSigners.length >= 10) {
      alert('Máximo 10 firmantes permitidos');
      return;
    }

    if (selectedSigners.find(s => s.id === user.id)) {
      alert('Este usuario ya está asignado');
      return;
    }

    const newSigner = {
      ...user,
      role: 'Firmante',
      order: selectedSigners.length + 1
    };

    setSelectedSigners(prev => [...prev, newSigner]);
  };

  // Función para remover firmante
  const removeSigner = (id) => {
    setSelectedSigners(prev => {
      const updated = prev.filter(s => s.id !== id);
      return updated.map((signer, index) => ({
        ...signer,
        order: index + 1
      }));
    });
  };

  // Función para cambiar rol
  const changeSignerRole = (id, newRole) => {
    setSelectedSigners(prev =>
      prev.map(signer =>
        signer.id === id ? { ...signer, role: newRole } : signer
      )
    );
  };

  // Función para confirmar asignación
  const confirmSignerAssignment = () => {
    if (selectedSigners.length === 0) {
      alert('Debe asignar al menos un firmante');
      return;
    }

    const hasFirmante = selectedSigners.some(s => s.role === 'Firmante');
    if (!hasFirmante) {
      alert('Debe haber al menos un firmante');
      return;
    }

    const confirmed = window.confirm(
      `¿Confirma la asignación de ${selectedSigners.length} miembro(s) del personal?`
    );

    if (confirmed) {
      setDocuments(prev =>
        prev.map(doc =>
          doc.id === selectedDocument.id
            ? { ...doc, firmantes: selectedSigners.length, estado: 'En Proceso' }
            : doc
        )
      );

      alert('Personal asignado exitosamente. Se han enviado las notificaciones oficiales.');
      setCurrentView('dashboard');
    }
  };

  // Función para cancelar documento
  const cancelDocument = (docId) => {
    const confirmed = window.confirm('¿Está seguro de anular este documento oficial?');
    
    if (confirmed) {
      const motivo = prompt('Motivo de anulación (requerido):');
      
      setDocuments(prev =>
        prev.map(doc =>
          doc.id === docId ? { ...doc, estado: 'Cancelado' } : doc
        )
      );
      
      alert('Documento anulado exitosamente.');
    }
  };

  // Función para volver al dashboard
  const backToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedDocument(null);
    setSelectedFile(null);
    setSelectedSigners([]);
    setSearchQuery('');
    setFilteredDocuments([]);
    
    // Limpiar URL del objeto para liberar memoria
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
    setDocumentContent(null);
  };

  // Función para búsqueda avanzada
  const startAdvancedSearch = () => {
    setCurrentView('search');
    setFilteredDocuments(documents);
  };

  // Función para manejar búsqueda
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredDocuments(documents);
    } else {
      const filtered = documents.filter(doc => 
        doc.nombre.toLowerCase().includes(query.toLowerCase()) ||
        doc.estado.toLowerCase().includes(query.toLowerCase()) ||
        doc.fileId.toLowerCase().includes(query.toLowerCase()) ||
        doc.hash.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredDocuments(filtered);
    }
  };

  // Funciones de zoom para previsualización
  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 200));
  };

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 50));
  };

  const resetZoom = () => {
    setZoomLevel(100);
  };

  return (
    <div className="creador-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Panel del Creador</h1>
            <span className="user-info">{userEmail}</span>
          </div>
          <div className="header-actions">
            {currentView !== 'dashboard' && (
              <button className="btn-secondary" onClick={backToDashboard}>
                <i className="fa-solid fa-arrow-left"></i> Volver al Panel
              </button>
            )}
            <button className="btn-secondary" onClick={logout}>
              <i className="fa-solid fa-sign-out-alt"></i> Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        {/* Vista Dashboard */}
        {currentView === 'dashboard' && (
          <>
            {/* Estadísticas */}
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Documentos Creados</h3>
                <p className="stat-number">{documents.length}</p>
                <span className="stat-desc">Total en el sistema</span>
              </div>
              <div className="stat-card">
                <h3>En Proceso</h3>
                <p className="stat-number">
                  {documents.filter(doc => doc.estado === 'En Proceso').length}
                </p>
                <span className="stat-desc">Esperando firmas</span>
              </div>
              <div className="stat-card">
                <h3>Completados</h3>
                <p className="stat-number">
                  {documents.filter(doc => doc.estado === 'Firmado').length}
                </p>
                <span className="stat-desc">Totalmente firmados</span>
              </div>
              <div className="stat-card">
                <h3>Borradores</h3>
                <p className="stat-number">
                  {documents.filter(doc => doc.estado === 'Borrador').length}
                </p>
                <span className="stat-desc">Sin enviar</span>
              </div>
            </div>

            {/* Acciones Rápidas */}
            <div className="quick-actions">
              <h2>Acciones de Comando</h2>
              <div className="actions-grid">
                <button className="action-card" onClick={startDocumentCreation}>
                  <div className="action-icon">
                    <i className="fa-solid fa-folder-open"></i>
                  </div>
                  <h3>Crear Documento</h3>
                  <p>Iniciar proceso de documentación oficial</p>
                </button>
                <button className="action-card" onClick={startAdvancedSearch}>
                  <div className="action-icon">
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </div>
                  <h3>Búsqueda Avanzada</h3>
                  <p>Localizar documentación específica</p>
                </button>
              </div>
            </div>

            {/* Lista de Documentos */}
            <div className="documents-section">
              <h2>Mis Documentos</h2>
              <div className="documents-table">
                <div className="table-header">
                  <span>Documento</span>
                  <span>Estado</span>
                  <span>Firmantes</span>
                  <span>Creado</span>
                  <span>Acciones</span>
                </div>
                {documents.map(doc => (
                  <div key={doc.id} className="table-row">
                    <span className="doc-name">{doc.nombre}</span>
                    <span 
                      className="doc-status" 
                      style={{ color: getStatusColor(doc.estado) }}
                    >
                      {doc.estado}
                    </span>
                    <span className="doc-signers">{doc.firmantes} firmantes</span>
                    <span className="doc-date">{doc.creado}</span>
                    <div className="doc-actions">
                      <button 
                        className="action-btn preview"
                        onClick={() => previewDocument(doc)}
                      >
                        Revisar
                      </button>
                      {doc.estado === 'Borrador' && (
                        <button 
                          className="action-btn assign"
                          onClick={() => startSignerAssignment(doc)}
                        >
                          Asignar Personal
                        </button>
                      )}
                      {doc.estado === 'En Proceso' && (
                        <button 
                          className="action-btn info"
                          onClick={() => previewDocument(doc)}
                        >
                          {doc.firmantes} asignado(s)
                        </button>
                      )}
                      {(doc.estado === 'Borrador' || doc.estado === 'En Proceso') && (
                        <button 
                          className="action-btn cancel"
                          onClick={() => cancelDocument(doc.id)}
                        >
                          Anular
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Vista de Carga de Documento */}
        {currentView === 'upload' && (
          <div className="upload-section">
            <h2>Iniciar Nuevo Documento Oficial</h2>
            
            {uploadState === 'idle' && (
              <div className="upload-area">
                <div className="upload-box">
                  <div className="upload-icon">
                    <i className="fa-solid fa-file-pdf"></i>
                  </div>
                  <h3>Cargar Documento PDF</h3>
                  <p>Seleccione el archivo oficial para procesamiento</p>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="file-input"
                    id="fileInput"
                  />
                  <label htmlFor="fileInput" className="upload-btn">
                    Seleccionar Archivo
                  </label>
                  <div className="upload-requirements">
                    <p>• Formato: PDF únicamente</p>
                    <p>• Tamaño máximo: 25MB</p>
                    <p>• Seguridad: Cifrado AES-256</p>
                  </div>
                </div>
              </div>
            )}

            {uploadState === 'processing' && (
              <div className="processing-area">
                <h3>Procesando documento oficial...</h3>
                <div className="progress-container">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p>{uploadProgress}% completado</p>
                </div>
                <div className="processing-steps">
                  <div className={`step ${uploadProgress >= 20 ? 'completed' : ''}`}>
                    <i className="fa-solid fa-check"></i> Validación de formato y seguridad
                  </div>
                  <div className={`step ${uploadProgress >= 50 ? 'completed' : ''}`}>
                    <i className="fa-solid fa-check"></i> Aplicando cifrado militar AES-256
                  </div>
                  <div className={`step ${uploadProgress >= 80 ? 'completed' : ''}`}>
                    <i className="fa-solid fa-check"></i> Generando hash de integridad SHA-256
                  </div>
                  <div className={`step ${uploadProgress >= 100 ? 'completed' : ''}`}>
                    <i className="fa-solid fa-check"></i> Almacenando en repositorio seguro FAE
                  </div>
                </div>
              </div>
            )}

            {uploadState === 'completed' && (
              <div className="success-area">
                <div className="success-icon">
                  <i className="fa-solid fa-circle-check"></i>
                </div>
                <h3>Documento procesado exitosamente</h3>
                <p>Archivo: {selectedFile?.name}</p>
                <p>El documento ha sido cifrado y almacenado según protocolos FAE</p>
                <p>Redirigiendo a inspección...</p>
              </div>
            )}
          </div>
        )}

        {/* Vista de Preview */}
        {currentView === 'preview' && selectedDocument && (
          <div className="preview-section">
            <h2>Inspección del Documento</h2>
            
            <div className="document-details">
              <div className="doc-header">
                <div className="doc-icon">
                  <i className="fa-solid fa-file-lines"></i>
                </div>
                <div className="doc-info">
                  <h3>{selectedDocument.nombre}</h3>
                  <p>Fecha de carga: {selectedDocument.creado}</p>
                  <p>Estado operacional: <span style={{ color: getStatusColor(selectedDocument.estado) }}>
                    {selectedDocument.estado}
                  </span></p>
                </div>
              </div>

              <div className="security-info">
                <h4>
                  <i className="fa-solid fa-shield-halved"></i> Información de Seguridad FAE
                </h4>
                <div className="security-grid">
                  <div className="security-item">
                    <span className="label">Hash de Integridad:</span>
                    <span className="value">{selectedDocument.hash}</span>
                  </div>
                  <div className="security-item">
                    <span className="label">Cifrado Militar:</span>
                    <span className="value">AES-256-GCM <i className="fa-solid fa-check-circle"></i></span>
                  </div>
                  <div className="security-item">
                    <span className="label">Personal asignado:</span>
                    <span className="value">{selectedDocument.firmantes}</span>
                  </div>
                </div>
              </div>

              <div className="pdf-preview">
                <div className="preview-header">
                  <h4>
                    <i className="fa-solid fa-file-pdf"></i> Vista de Inspección
                  </h4>
                  <div className="preview-controls">
                    <button className="zoom-btn" onClick={zoomOut} disabled={zoomLevel <= 50}>
                      <i className="fa-solid fa-magnifying-glass-minus"></i>
                    </button>
                    <span className="zoom-level">{zoomLevel}%</span>
                    <button className="zoom-btn" onClick={zoomIn} disabled={zoomLevel >= 200}>
                      <i className="fa-solid fa-magnifying-glass-plus"></i>
                    </button>
                    <button className="zoom-btn" onClick={resetZoom}>
                      <i className="fa-solid fa-arrows-to-circle"></i>
                    </button>
                  </div>
                </div>
                
                <div className="pdf-viewer-container">
                  {pdfUrl && documentContent ? (
                    <div className="real-pdf-viewer">
                      <div className="pdf-info">
                        <p><strong>Archivo:</strong> {documentContent.name}</p>
                        <p><strong>Tamaño:</strong> {(documentContent.size / 1024 / 1024).toFixed(2)} MB</p>
                        <p><strong>Tipo:</strong> {documentContent.type}</p>
                      </div>
                      <div className="pdf-embed-container" style={{ transform: `scale(${zoomLevel / 100})` }}>
                        <embed
                          src={pdfUrl}
                          type="application/pdf"
                          width="100%"
                          height="600px"
                          className="pdf-embed"
                        />
                      </div>
                      <div className="pdf-fallback">
                        <p>
                          Si no puede ver el PDF, puede 
                          <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="download-link">
                            <i className="fa-solid fa-download"></i> descargarlo aquí
                          </a>
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="pdf-placeholder">
                      <div className="pdf-page" style={{ transform: `scale(${zoomLevel / 100})` }}>
                        <div className="document-header">
                          <div className="fae-logo">
                            <strong>FUERZAS ARMADAS DEL ECUADOR</strong>
                          </div>
                          <div className="document-type">
                            DOCUMENTO OFICIAL
                          </div>
                        </div>
                        
                        <div className="document-content">
                          <div className="document-title">
                            <h2>{selectedDocument.nombre.replace('.pdf', '').replace(/_/g, ' ')}</h2>
                          </div>
                          
                          <div className="document-body">
                            <div className="content-section">
                              <h3>ANTECEDENTES</h3>
                              <div className="content-line full"></div>
                              <div className="content-line full"></div>
                              <div className="content-line medium"></div>
                            </div>
                            
                            <div className="content-section">
                              <h3>CONSIDERANDO</h3>
                              <div className="content-line full"></div>
                              <div className="content-line full"></div>
                              <div className="content-line short"></div>
                            </div>
                            
                            <div className="content-section">
                              <h3>RESUELVE</h3>
                              <div className="content-line full"></div>
                              <div className="content-line medium"></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="signature-section">
                          <div className="signature-placeholder">
                            <div className="signature-line">
                              <span>____________________________</span>
                              <p>Área de Firma Electrónica FAE</p>
                              <small>Firma Digital Certificada</small>
                            </div>
                          </div>
                          
                          <div className="document-metadata">
                            <p><strong>ID Documento:</strong> {selectedDocument.fileId}</p>
                            <p><strong>Hash:</strong> {selectedDocument.hash}</p>
                            <p><strong>Fecha:</strong> {selectedDocument.creado}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="preview-actions">
                {selectedDocument.estado === 'Borrador' && (
                  <button 
                    className="btn-primary"
                    onClick={() => startSignerAssignment(selectedDocument)}
                  >
                    <i className="fa-solid fa-users"></i> Asignar Personal
                  </button>
                )}
                <button className="btn-secondary" onClick={backToDashboard}>
                  <i className="fa-solid fa-arrow-left"></i> Volver al Panel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Vista de Asignación de Firmantes */}
        {currentView === 'assign' && selectedDocument && (
          <div className="assign-section">
            <h2>
              <i className="fa-solid fa-user-gear"></i> Asignación de Personal Militar
            </h2>
            <p>Documento oficial: <strong>{selectedDocument.nombre}</strong></p>

            <div className="assign-grid">
              <div className="available-users">
                <h3>Personal FAE Disponible</h3>
                <div className="users-list">
                  {availableUsers.map(user => (
                    <div 
                      key={user.id} 
                      className={`user-card ${selectedSigners.find(s => s.id === user.id) ? 'selected' : ''}`}
                      onClick={() => addSigner(user)}
                    >
                      <div className="user-info">
                        <strong>{user.nombre} {user.apellido}</strong>
                        <span className="user-rank">{user.rango}</span>
                        <span className="user-unit">{user.reparto}</span>
                        <span className="user-email">{user.email}</span>
                      </div>
                      <button className="add-user-btn">
                        {selectedSigners.find(s => s.id === user.id) ? 
                          <i className="fa-solid fa-check"></i> : 
                          <i className="fa-solid fa-plus"></i>
                        }
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="selected-signers">
                <h3>Personal Asignado ({selectedSigners.length}/10)</h3>
                
                {selectedSigners.length === 0 ? (
                  <div className="no-signers">
                    <p>Sin personal asignado</p>
                    <p>Seleccione personal del panel izquierdo</p>
                  </div>
                ) : (
                  <div className="signers-list">
                    {selectedSigners.map((signer, index) => (
                      <div key={signer.id} className="signer-card">
                        <div className="signer-order">{signer.order}</div>
                        <div className="signer-details">
                          <strong>{signer.nombre} {signer.apellido}</strong>
                          <span>{signer.rango} • {signer.reparto}</span>
                        </div>
                        <select 
                          value={signer.role}
                          onChange={(e) => changeSignerRole(signer.id, e.target.value)}
                          className="role-select"
                        >
                          <option value="Firmante">Firmante</option>
                          <option value="Aprobador">Aprobador</option>
                          <option value="Testigo">Testigo</option>
                        </select>
                        <button 
                          className="remove-signer-btn"
                          onClick={() => removeSigner(signer.id)}
                        >
                          <i className="fa-solid fa-times"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="assign-actions">
                  <button 
                    className="btn-primary"
                    onClick={confirmSignerAssignment}
                    disabled={selectedSigners.length === 0}
                  >
                    <i className="fa-solid fa-check-circle"></i> Confirmar Asignación ({selectedSigners.length})
                  </button>
                  <button className="btn-secondary" onClick={backToDashboard}>
                    <i className="fa-solid fa-ban"></i> Cancelar Operación
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Vista de Búsqueda Avanzada */}
        {currentView === 'search' && (
          <div className="search-section">
            <h2>
              <i className="fa-solid fa-magnifying-glass"></i> Búsqueda Avanzada de Documentos
            </h2>
            
            <div className="search-container">
              <div className="search-input-container">
                <i className="fa-solid fa-search search-icon"></i>
                <input
                  type="text"
                  placeholder="Buscar por nombre, estado, ID o hash del documento..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="search-input"
                />
                {searchQuery && (
                  <button 
                    className="clear-search"
                    onClick={() => handleSearch('')}
                  >
                    <i className="fa-solid fa-times"></i>
                  </button>
                )}
              </div>
              
              <div className="search-results">
                <div className="results-header">
                  <h3>
                    Resultados de búsqueda ({filteredDocuments.length} documento{filteredDocuments.length !== 1 ? 's' : ''})
                  </h3>
                </div>
                
                {filteredDocuments.length === 0 ? (
                  <div className="no-results">
                    <i className="fa-solid fa-folder-open"></i>
                    <p>No se encontraron documentos que coincidan con su búsqueda</p>
                    <p>Intente con otros términos de búsqueda</p>
                  </div>
                ) : (
                  <div className="search-documents-table">
                    <div className="table-header">
                      <span>Documento</span>
                      <span>Estado</span>
                      <span>Firmantes</span>
                      <span>Creado</span>
                      <span>Acciones</span>
                    </div>
                    {filteredDocuments.map(doc => (
                      <div key={doc.id} className="table-row">
                        <span className="doc-name">{doc.nombre}</span>
                        <span 
                          className="doc-status" 
                          style={{ color: getStatusColor(doc.estado) }}
                        >
                          {doc.estado}
                        </span>
                        <span className="doc-signers">{doc.firmantes} firmantes</span>
                        <span className="doc-date">{doc.creado}</span>
                        <div className="doc-actions">
                          <button 
                            className="action-btn preview"
                            onClick={() => previewDocument(doc)}
                          >
                            <i className="fa-solid fa-eye"></i> Revisar
                          </button>
                          {doc.estado === 'Borrador' && (
                            <button 
                              className="action-btn assign"
                              onClick={() => startSignerAssignment(doc)}
                            >
                              <i className="fa-solid fa-users"></i> Asignar Personal
                            </button>
                          )}
                          {doc.estado === 'En Proceso' && (
                            <button 
                              className="action-btn info"
                              onClick={() => previewDocument(doc)}
                            >
                              <i className="fa-solid fa-info-circle"></i> {doc.firmantes} asignado(s)
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
