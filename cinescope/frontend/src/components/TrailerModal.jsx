import React from 'react';
import { Modal } from 'react-bootstrap';
import { X } from 'lucide-react';

export default function TrailerModal({ show, onHide, trailerKey, title }) {
  if (!trailerKey) return null;

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      centered
      style={{ zIndex: 9999 }}
    >
      <Modal.Header 
        style={{ 
          background: '#1A1A1D', 
          border: 'none',
          color: 'white'
        }}
      >
        <Modal.Title className="fs-5">{title} - Trailer</Modal.Title>
        <button
          onClick={onHide}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            padding: '0.5rem'
          }}
        >
          <X size={24} />
        </button>
      </Modal.Header>
      <Modal.Body 
        style={{ 
          background: '#0C0C0F',
          padding: 0,
          aspectRatio: '16/9'
        }}
      >
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ display: 'block' }}
        />
      </Modal.Body>
    </Modal>
  );
}