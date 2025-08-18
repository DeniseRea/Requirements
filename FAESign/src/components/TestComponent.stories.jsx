import React from 'react';

// Crear el componente TestComponent si no existe
const TestComponent = () => {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f0f0f0', 
      borderRadius: '8px',
      fontFamily: 'Arial, sans-serif' 
    }}>
      <h2>Test Component for BackstopJS</h2>
      <p>This is a simple test component to verify BackstopJS integration.</p>
    </div>
  );
};

export default {
  title: 'Test/TestComponent',
  component: TestComponent,
  parameters: {
    layout: 'centered',
  },
};

export const Default = {
  render: () => <TestComponent />,
};
