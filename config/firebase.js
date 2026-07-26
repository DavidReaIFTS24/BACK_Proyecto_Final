const admin = require('firebase-admin');
const path = require('path');

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  // Producción (Render): la key viene como variable de entorno en formato JSON
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  // Desarrollo local: se lee el archivo físico
  serviceAccount = require(path.join(__dirname, 'firebase-key.json'));
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });

console.log('🔥 Firebase inicializado correctamente');

module.exports = { admin, db };