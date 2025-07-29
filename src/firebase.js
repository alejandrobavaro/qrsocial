// import { 
//   initializeApp 
// } from 'firebase/app';
// import { 
//   getDatabase, 
//   ref, 
//   onValue, 
//   push, 
//   set, 
//   update,
//   remove // Añade esta importación
// } from 'firebase/database';
// import { 
//   getStorage, 
//   ref as storageRef, 
//   uploadBytes, 
//   getDownloadURL 
// } from 'firebase/storage';

// const firebaseConfig = {
//   apiKey: "TU_API_KEY",
//   authDomain: "TU_PROYECTO.firebaseapp.com",
//   databaseURL: "https://TU_PROYECTO.firebaseio.com",
//   projectId: "TU_PROYECTO",
//   storageBucket: "TU_PROYECTO.appspot.com",
//   messagingSenderId: "TU_SENDER_ID",
//   appId: "TU_APP_ID"
// };

// const app = initializeApp(firebaseConfig);
// const db = getDatabase(app);
// const storage = getStorage(app);

// const postsRef = ref(db, 'posts');
// const storiesRef = ref(db, 'stories');
// const eventRef = ref(db, 'event');

// export { 
//   db, 
//   storage,
//   ref, 
//   onValue, 
//   push, 
//   set, 
//   update,
//   remove, // Exporta la función remove
//   storageRef,
//   uploadBytes,
//   getDownloadURL,
//   postsRef,
//   storiesRef,
//   eventRef
// };


/**
 * CONFIGURACIÓN DE FIREBASE - Documentación línea por línea
 * 
 * Propósito:
 * 1. Inicializar la conexión con Firebase
 * 2. Exportar referencias a los servicios necesarios
 * 3. Proporcionar acceso a la base de datos y storage
 * 
 * Nota: Reemplazar TODOS los valores de TU_* con tus credenciales reales
 */

// ======================
// IMPORTACIONES DE FIREBASE
// ======================
import { initializeApp } from 'firebase/app';
import { 
  getDatabase,  // Servicio de Realtime Database
  ref,          // Para crear referencias a ubicaciones
  onValue,      // Escuchar cambios en tiempo real
  push,         // Crear nuevas entradas
  set,          // Escribir datos
  update,       // Actualizar datos parcialmente
  remove        // Eliminar datos
} from 'firebase/database';

import { 
  getStorage,    // Servicio de Firebase Storage
  ref as storageRef, // Ref para storage (alias para evitar conflicto)
  uploadBytes,   // Subir archivos
  getDownloadURL // Obtener URL pública
} from 'firebase/storage';

// ======================
// CONFIGURACIÓN DE FIREBASE
// ======================
const firebaseConfig = {
  apiKey: "TU_API_KEY", // Clave API web
  authDomain: "TU_PROYECTO.firebaseapp.com", // Dominio para autenticación
  databaseURL: "https://TU_PROYECTO.firebaseio.com", // URL de la base de datos
  projectId: "TU_PROYECTO", // ID del proyecto
  storageBucket: "TU_PROYECTO.appspot.com", // Bucket de almacenamiento
  messagingSenderId: "TU_SENDER_ID", // ID para mensajería
  appId: "TU_APP_ID" // ID de la aplicación
};

// ======================
// INICIALIZACIÓN DE SERVICIOS
// ======================
const app = initializeApp(firebaseConfig); // Inicializa Firebase
const db = getDatabase(app); // Obtiene instancia de la base de datos
const storage = getStorage(app); // Obtiene instancia de storage

// ======================
// REFERENCIAS COMUNES (OPCIONAL)
// ======================
const postsRef = ref(db, 'posts'); // Referencia a la colección de posts
const storiesRef = ref(db, 'stories'); // Referencia a stories
const eventRef = ref(db, 'event'); // Referencia a datos del evento

// ======================
// EXPORTACIÓN DE SERVICIOS
// ======================
export { 
  db,           // Base de datos completa
  storage,      // Servicio de storage
  ref,          // Para crear referencias a DB
  onValue,      // Para escuchar cambios
  push,         // Para crear nuevos nodos
  set,          // Para escribir datos
  update,       // Para actualizar datos
  remove,       // Para eliminar datos
  storageRef,   // Para referencias en storage
  uploadBytes,  // Para subir archivos
  getDownloadURL, // Para obtener URLs públicas
  postsRef,     // Referencia directa a posts
  storiesRef,   // Referencia directa a stories
  eventRef      // Referencia directa a evento
};