import React, { useState } from 'react';
import { ref, onValue } from '../../firebase';
import { saveAs } from 'file-saver';
import '../../assets/scss/_03-Componentes/_DataExporter.scss';

const DataExporter = () => {
  const [exporting, setExporting] = useState(false);
  const [exportType, setExportType] = useState('all');
  const [progress, setProgress] = useState(0);

  const exportData = async () => {
    setExporting(true);
    setProgress(0);
    
    try {
      // Obtener datos de Firebase
      const dataRef = exportType === 'all' ? ref(db, '/') : ref(db, exportType);
      const snapshot = await new Promise((resolve) => {
        onValue(dataRef, (snap) => resolve(snap), { onlyOnce: true });
      });
      
      setProgress(50);
      
      const data = snapshot.val();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json'
      });
      
      saveAs(blob, `qrsocial_export_${exportType}_${new Date().toISOString()}.json`);
      setProgress(100);
    } catch (error) {
      console.error("Error exporting data:", error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="data-exporter">
      <h2>Exportar Datos del Evento</h2>
      
      <div className="export-options">
        <div className="option-group">
          <label>Tipo de Exportación:</label>
          <select 
            value={exportType} 
            onChange={(e) => setExportType(e.target.value)}
            disabled={exporting}
          >
            <option value="all">Todos los datos</option>
            <option value="guests">Lista de invitados</option>
            <option value="posts">Publicaciones</option>
            <option value="stories">Historias</option>
            <option value="comments">Comentarios</option>
          </select>
        </div>
        
        <button 
          onClick={exportData}
          disabled={exporting}
          className="btn-export"
        >
          {exporting ? 'Exportando...' : 'Exportar Datos'}
        </button>
      </div>
      
      {exporting && (
        <div className="export-progress">
          <progress value={progress} max="100"></progress>
          <span>{progress}% completado</span>
        </div>
      )}
      
      <div className="export-info">
        <h3>Instrucciones:</h3>
        <ul>
          <li>Selecciona el tipo de datos a exportar</li>
          <li>Haz clic en "Exportar Datos"</li>
          <li>Se descargará un archivo JSON con la información</li>
          <li>Los datos incluyen toda la información hasta el momento de la exportación</li>
        </ul>
      </div>
    </div>
  );
};

export default DataExporter;