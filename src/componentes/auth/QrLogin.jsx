// =============================================
// COMPONENTE QR LOGIN - QrLogin
// =============================================

/**
 * Propósito:
 * - Manejar autenticación mediante QR
 * - Mostrar interfaz de escaneo
 * - Proporcionar alternativa manual
 * 
 * Integraciones:
 * - AuthContext: Para loginWithQR
 * - jsQR: Para decodificación de QR
 */

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../../assets/scss/_03-Componentes/_QrLogin.scss';
import jsQR from 'jsqr';

const QrLogin = ({ onSwitchToGuest }) => {
  // Estados del componente
  const [error, setError] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const { loginWithQR } = useAuth();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Efecto para manejar la cámara
  useEffect(() => {
    let stream;
    
    const scanQR = () => {
      if (!videoRef.current || !canvasRef.current) return;
      
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      
      if (code) {
        processQR(code.data);
        return;
      }
      
      if (cameraActive) requestAnimationFrame(scanQR);
    };
    
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        requestAnimationFrame(scanQR);
      } catch (err) {
        setError(`Error de cámara: ${err.message}`);
        setCameraActive(false);
      }
    };
    
    if (cameraActive) {
      startCamera();
    }
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraActive]);

  /**
   * Procesa el código QR escaneado
   * @param {string} qrData - Datos del QR
   */
  const processQR = async (qrData) => {
    setCameraActive(false);
    try {
      const success = await loginWithQR(qrData);
      if (!success) {
        setError("QR no válido. Intenta nuevamente.");
      }
    } catch (err) {
      console.error("Error processing QR:", err);
      setError("Error al validar el QR");
    }
  };

  return (
    <div className="qr-login-container">
      <div className="qr-login-header">
        <h2>Acceso con QR</h2>
        <p>Escanea el código de tu invitación</p>
      </div>

      {cameraActive ? (
        <div className="qr-scanner-wrapper">
          <video ref={videoRef} playsInline className="qr-video" />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          <div className="qr-scanner-overlay">
            <div className="qr-scanner-frame"></div>
            <p>Enfoca el código QR dentro del marco</p>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => {
            setError(null);
            setCameraActive(true);
          }}
          className="qr-activate-btn"
        >
          Activar Cámara
        </button>
      )}

      {error && (
        <div className="qr-error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      <div className="qr-login-footer">
        <button 
          onClick={onSwitchToGuest}
          className="qr-guest-btn"
        >
          ¿Problemas con el QR? <span>Acceder manualmente</span>
        </button>
      </div>
    </div>
  );
};

export default QrLogin;