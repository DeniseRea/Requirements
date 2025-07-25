import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './FirmanteDashboard.css';

export default function FirmanteDashboard() {
  const [userEmail, setUserEmail] = useState('');
  const [pendingDocs, setPendingDocs] = useState([
    { id: 1, nombre: 'Contrato_Servicios_2024.pdf', creador: 'Juan Pérez', prioridad: 'Alta', fechaLimite: '2024-01-20' },
    { id: 2, nombre: 'Acuerdo_Confidencialidad.pdf', creador: 'María García', prioridad: 'Media', fechaLimite: '2024-01-25' },
  ]);
  const [signedDocs, setSignedDocs] = useState([
    { id: 3, nombre: 'Propuesta_Comercial.pdf', fechaFirma: '2024-01-10', estado: 'Firmado' },
    { id: 4, nombre: 'Acta_Reunion.pdf', fechaFirma: '2024-01-08', estado: 'Rechazado' },
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem('fae_user_email');
    const role = localStorage.getItem('fae_user_role');
    
    if (!email || role !== 'Firmante') {
      navigate('/');
      return;
    }
    
    setUserEmail(email);
  }, [navigate]);

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  const getPriorityColor = (prioridad) => {
    switch (prioridad) {
      case 'Alta': return '#ef4444';
      case 'Media': return '#f59e0b';
      case 'Baja': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'Firmado': return '#10b981';
      case 'Rechazado': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className="firmante-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Panel del Firmante</h1>
            <span className="user-info">{userEmail}</span>
          </div>
          <div className="header-actions">
            <button className="btn-secondary" onClick={logout}>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        {/* Estadísticas del Firmante */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Documentos Pendientes</h3>
            <p className="stat-number">{pendingDocs.length}</p>
            <span className="stat-desc">Esperando su firma</span>
          </div>
          <div className="stat-card">
            <h3>Firmados Este Mes</h3>
            <p className="stat-number">
              {signedDocs.filter(doc => doc.estado === 'Firmado').length}
            </p>
            <span className="stat-desc">Documentos completados</span>
          </div>
          <div className="stat-card">
            <h3>Rechazados</h3>
            <p className="stat-number">
              {signedDocs.filter(doc => doc.estado === 'Rechazado').length}
            </p>
            <span className="stat-desc">Documentos rechazados</span>
          </div>
          <div className="stat-card">
            <h3>Total Procesados</h3>
            <p className="stat-number">{signedDocs.length}</p>
            <span className="stat-desc">Historial completo</span>
          </div>
        </div>

        {/* Funciones del Firmante */}
        <div className="functions-section">
          <h2>Funciones del Firmante</h2>
          <div className="functions-grid">
            <div className="function-card">
              <h3>Visualizar Documentos</h3>
              <p>Ver los documentos asignados para firma</p>
              <button className="function-btn">Ver Pendientes</button>
            </div>
            <div className="function-card">
              <h3>Firmar Documento</h3>
              <p>Emitir firma digital con certificado válido</p>
              <button className="function-btn">Firmar</button>
            </div>
            <div className="function-card">
              <h3>Rechazar Documento</h3>
              <p>Oponerse a firmar, justificando el motivo</p>
              <button className="function-btn">Rechazar</button>
            </div>
            <div className="function-card">
              <h3>Validar Identidad</h3>
              <p>Confirmar con certificado digital</p>
              <button className="function-btn">Validar</button>
            </div>
          </div>
        </div>

        {/* Documentos Pendientes */}
        <div className="documents-section">
          <h2>Documentos Pendientes de Firma</h2>
          <div className="documents-table">
            <div className="table-header">
              <span>Documento</span>
              <span>Creador</span>
              <span>Prioridad</span>
              <span>Fecha Límite</span>
              <span>Acciones</span>
            </div>
            {pendingDocs.map(doc => (
              <div key={doc.id} className="table-row">
                <span className="doc-name">{doc.nombre}</span>
                <span className="doc-creator">{doc.creador}</span>
                <span 
                  className="doc-priority" 
                  style={{ color: getPriorityColor(doc.prioridad) }}
                >
                  {doc.prioridad}
                </span>
                <span className="doc-deadline">{doc.fechaLimite}</span>
                <div className="doc-actions">
                  <button className="action-btn view">Ver</button>
                  <button className="action-btn sign">Firmar</button>
                  <button className="action-btn reject">Rechazar</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Historial de Firmas */}
        <div className="documents-section">
          <h2>Historial de Documentos</h2>
          <div className="documents-table">
            <div className="table-header">
              <span>Documento</span>
              <span>Fecha de Acción</span>
              <span>Estado</span>
              <span>Acciones</span>
            </div>
            {signedDocs.map(doc => (
              <div key={doc.id} className="table-row">
                <span className="doc-name">{doc.nombre}</span>
                <span className="doc-date">{doc.fechaFirma}</span>
                <span 
                  className="doc-status" 
                  style={{ color: getStatusColor(doc.estado) }}
                >
                  {doc.estado}
                </span>
                <div className="doc-actions">
                  <button className="action-btn view">Ver</button>
                  <button className="action-btn download">Descargar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
