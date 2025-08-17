import React from 'react';
import DocumentUploadModal from '../components/DocumentUploadModal.jsx';
import '../index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default {
  title: 'Components/DocumentUploadModal',
  component: DocumentUploadModal,
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'desktop',
    },
  },
  argTypes: {
    show: { control: 'boolean' },
    onClose: { action: 'closed' },
    onDocumentUploaded: { action: 'document uploaded' },
  },
};

// Template básico
const Template = (args) => <DocumentUploadModal {...args} />;

export const Default = Template.bind({});
Default.args = {
  show: true,
  onClose: () => {},
  onDocumentUploaded: () => {},
};

export const Hidden = Template.bind({});
Hidden.args = {
  show: false,
  onClose: () => {},
  onDocumentUploaded: () => {},
};

export const MobileView = Template.bind({});
MobileView.args = {
  show: true,
  onClose: () => {},
  onDocumentUploaded: () => {},
};
MobileView.parameters = {
  viewport: {
    defaultViewport: 'mobile',
  },
};

export const TabletView = Template.bind({});
TabletView.args = {
  show: true,
  onClose: () => {},
  onDocumentUploaded: () => {},
};
TabletView.parameters = {
  viewport: {
    defaultViewport: 'tablet',
  },
};
