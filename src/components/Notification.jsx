import React from 'react';

function Notification({ message, isError }) {
  if (!message) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: isError ? '#f8d7da' : '#d1e7dd',
        color: isError ? '#842029' : '#0f5132',
        border: `1px solid ${isError ? '#f5c2c7' : '#badbcc'}`,
        padding: '10px 20px',
        borderRadius: 6,
        zIndex: 2000,
        textAlign: 'center',
      }}
    >
      {message}
    </div>
  );
}

export default Notification;
