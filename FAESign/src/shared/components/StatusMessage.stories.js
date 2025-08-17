import React from 'react';
import StatusMessage from '../shared/components/StatusMessage.jsx';
import '../index.css';

export default {
  title: 'Shared/StatusMessage',
  component: StatusMessage,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['success', 'error', 'warning', 'info'],
    },
    message: { control: 'text' },
    onClose: { action: 'closed' },
  },
};

const Template = (args) => <StatusMessage {...args} />;

export const Success = Template.bind({});
Success.args = {
  message: 'Documento subido correctamente',
  type: 'success',
  onClose: () => {},
};

export const Error = Template.bind({});
Error.args = {
  message: 'Error al procesar el documento',
  type: 'error',
  onClose: () => {},
};

export const Warning = Template.bind({});
Warning.args = {
  message: 'El documento requiere firma adicional',
  type: 'warning',
  onClose: () => {},
};

export const Info = Template.bind({});
Info.args = {
  message: 'Documento enviado para revisión',
  type: 'info',
  onClose: () => {},
};

export const WithoutCloseButton = Template.bind({});
WithoutCloseButton.args = {
  message: 'Mensaje sin botón de cierre',
  type: 'info',
};

export const LongMessage = Template.bind({});
LongMessage.args = {
  message: 'Este es un mensaje muy largo que podría ocupar múltiples líneas para probar cómo se comporta el componente con contenido extenso y verificar el responsive design',
  type: 'warning',
  onClose: () => {},
};
