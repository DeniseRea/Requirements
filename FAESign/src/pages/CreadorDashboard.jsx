import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreadorDashboard.css';

export default function CreadorDashboard() {
  const [userEmail, setUserEmail] = useState('');
  const [documents, setDocuments] = useState([
    { id: 1, nombre: 'Contrato_Servicios_2024.pdf', estado: 'Borrador', firmantes: 3, creado: '2024-01-15' },
    { id: 2, nombre: 'Acuerdo_Confidencialidad.pdf', estado: 'En Proceso', firmantes: 2, creado: '2024-01-12' },
    { id: 3, nombre: 'Propuesta_Comercial.pdf', estado: 'Firmado', firmantes: 4, creado: '2024-01-10' },
  ]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem('fae_user_email');
    const role = localStorage.getItem('fae_user_role');
    
    if (!email || role !== 'Creador') {
      navigate('/');
      return;
    }
    
    setUserEmail(email);
  }, [navigate]);

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
      default: return '#6b7280';
    }
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
            <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
              Crear Documento
            </button>
            <button className="btn-secondary" onClick={logout}>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        {/* Estadísticas del Creador */}
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

        {/* Funciones del Creador */}
        <div className="functions-section">
          <h2>Funciones del Creador</h2>
          <div className="functions-grid">
            <div className="function-card">
              <h3>Crear Documento</h3>
              <p>Iniciar el ciclo de vida del documento</p>
              <button className="function-btn">Nuevo Documento</button>
            </div>
            <div className="function-card">
              <h3>Definir Flujo de Firma</h3>
              <p>Configurar orden jerárquico o paralelo</p>
              <button className="function-btn">Configurar Flujo</button>
            </div>
            <div className="function-card">
              <h3>Asignar Firmantes</h3>
              <p>Seleccionar usuarios que deben firmar</p>
              <button className="function-btn">Gestionar Firmantes</button>
            </div>
            <div className="function-card">
              <h3>Consultar Estado</h3>
              <p>Revisar el progreso del proceso de firma</p>
              <button className="function-btn">Ver Estados</button>
            </div>
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
                  {doc.estado === 'Borrador' && (
                    <>
                      <button className="action-btn edit">Editar</button>
                      <button className="action-btn send">Enviar</button>
                      <button className="action-btn delete">Cancelar</button>
                    </>
                  )}
                  {doc.estado === 'En Proceso' && (
                    <>
                      <button className="action-btn view">Ver</button>
                      <button className="action-btn cancel">Cancelar</button>
                    </>
                  )}
                  {doc.estado === 'Firmado' && (
                    <button className="action-btn view">Ver</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
