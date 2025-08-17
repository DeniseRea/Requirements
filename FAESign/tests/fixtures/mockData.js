/**
 * Mock data for visual testing consistency
 * All dates and dynamic content should be fixed to ensure visual consistency
 */

export const mockDocuments = [
  {
    id: 'DOC-001',
    name: 'Contrato de Servicios Profesionales',
    status: 'draft',
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
    owner: 'María García',
    signers: ['Juan Pérez', 'Ana López'],
    progress: 25,
    type: 'contract',
    size: '2.3 MB'
  },
  {
    id: 'DOC-002',
    name: 'Acuerdo de Confidencialidad',
    status: 'signed',
    createdAt: '2025-01-10T14:30:00Z',
    updatedAt: '2025-01-12T16:45:00Z',
    owner: 'Carlos Rodriguez',
    signers: ['Elena Torres'],
    progress: 100,
    type: 'nda',
    size: '1.8 MB'
  },
  {
    id: 'DOC-003',
    name: 'Propuesta Comercial Q1 2025',
    status: 'pending',
    createdAt: '2025-01-08T09:15:00Z',
    updatedAt: '2025-01-14T11:20:00Z',
    owner: 'Laura Martín',
    signers: ['Roberto Silva', 'Carmen Vega', 'Diego Morales'],
    progress: 66,
    type: 'proposal',
    size: '4.1 MB'
  },
  {
    id: 'DOC-004',
    name: 'Términos y Condiciones',
    status: 'rejected',
    createdAt: '2025-01-05T16:00:00Z',
    updatedAt: '2025-01-13T13:30:00Z',
    owner: 'Patricia Jiménez',
    signers: ['Miguel Santos'],
    progress: 50,
    type: 'terms',
    size: '3.2 MB'
  }
];

export const mockUsers = [
  {
    id: 'USER-001',
    name: 'María García',
    email: 'maria.garcia@test.com',
    role: 'creator',
    avatar: '/assets/images/avatar-1.jpg',
    status: 'active',
    lastLogin: '2025-01-15T10:00:00Z'
  },
  {
    id: 'USER-002',
    name: 'Juan Pérez',
    email: 'juan.perez@test.com',
    role: 'signer',
    avatar: '/assets/images/avatar-2.jpg',
    status: 'active',
    lastLogin: '2025-01-14T18:30:00Z'
  },
  {
    id: 'USER-003',
    name: 'Ana López',
    email: 'ana.lopez@test.com',
    role: 'auditor',
    avatar: '/assets/images/avatar-3.jpg',
    status: 'active',
    lastLogin: '2025-01-15T08:45:00Z'
  },
  {
    id: 'USER-004',
    name: 'Carlos Rodriguez',
    email: 'carlos.rodriguez@test.com',
    role: 'admin',
    avatar: '/assets/images/avatar-4.jpg',
    status: 'active',
    lastLogin: '2025-01-15T09:15:00Z'
  }
];

export const mockNotifications = [
  {
    id: 'NOTIF-001',
    type: 'document_signed',
    title: 'Documento firmado',
    message: 'El documento "Contrato de Servicios" ha sido firmado por Juan Pérez',
    timestamp: '2025-01-15T10:00:00Z',
    read: false,
    priority: 'high'
  },
  {
    id: 'NOTIF-002',
    type: 'document_pending',
    title: 'Firma pendiente',
    message: 'Tienes 1 documento pendiente de firma',
    timestamp: '2025-01-14T16:30:00Z',
    read: true,
    priority: 'medium'
  }
];

export const mockStats = {
  totalDocuments: 124,
  documentsThisMonth: 18,
  pendingSignatures: 7,
  completedDocuments: 89,
  rejectedDocuments: 3,
  averageSigningTime: '2.5 días',
  successRate: '96.8%'
};
