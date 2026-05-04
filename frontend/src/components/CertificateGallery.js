import React from 'react';
import './CertificateGallery.css';

const CertificateGallery = ({ certificates }) => {
  if (!certificates || certificates.length === 0) {
    return (
      <div className="empty-gallery">
        <p>No certificates uploaded yet.</p>
        <button className="btn btn-secondary">Upload your first certificate</button>
      </div>
    );
  }

  return (
    <div className="certificate-grid">
      {certificates.map((cert, index) => (
        <div key={index} className="certificate-card">
          <div className="cert-preview">
            {cert.imageUrl ? (
              <img src={cert.imageUrl} alt={cert.title} />
            ) : (
              <div className="cert-placeholder">📜</div>
            )}
          </div>
          <div className="cert-info">
            <h4>{cert.title}</h4>
            <p className="cert-issuer">{cert.issuer}</p>
            <p className="cert-date">{new Date(cert.date).toLocaleDateString()}</p>
            {cert.link && (
              <a href={cert.link} target="_blank" rel="noopener noreferrer" className="cert-link">
                Verify Certificate ↗
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CertificateGallery;
