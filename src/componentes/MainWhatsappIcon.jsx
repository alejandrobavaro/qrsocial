import React from 'react'; 
import '../assets/scss/_03-Componentes/_MainWhatsappIcon.scss'; 

function MainWhatsappIcon() {
  return (
    // Contenedor principal con clase para estilos posicionados fijos
    <div className='telefonoWhatsappPanelPublico'>

      {/* Enlace que abre WhatsApp en una nueva pestaña con mensaje predeterminado */}
      <a
        href="https://api.whatsapp.com/send?phone=+542235455451&text=Hola!,%20en%20que%20puedo%20ayudarte?"
        rel="link whatsapp"  // atributo rel para indicar tipo de enlace
        target="_blank"       // abre en nueva pestaña
      >
        {/* Imagen del logo de WhatsApp con clase para estilizar */}
        <img
          alt="WhatsApp Icon"                     // Texto alternativo para accesibilidad
          className="logoWhatsappPanelPublico"   // Clase para estilos específicos
          src="/img/02-logos/logowhattsapp1.png" // Ruta de la imagen
        />
      </a>
    </div>
  );
}

// Exporta el componente para usarlo en otros archivos
export default MainWhatsappIcon;
