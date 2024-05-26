import React from 'react';
import './Loading.css'; // Estilo CSS para el componente

const Loading = () => {
  return (
    <div className="loading-overlay">
      <div className="loading-spinner"></div>
    </div>
  );
};

export default Loading;