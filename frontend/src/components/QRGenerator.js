import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const QRGenerator = ({ value, size = 256 }) => {
  return (
    <div className="qr-generator-wrapper" style={{ padding: '20px', background: 'white', borderRadius: '10px', display: 'inline-block' }}>
      <QRCodeCanvas value={value} size={size} level="H" includeMargin={true} />
      <p style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>Scan this code to check-in</p>
    </div>
  );
};

export default QRGenerator;
