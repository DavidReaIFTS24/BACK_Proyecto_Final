const admin = require('firebase-admin');
const path = require('path');

let serviceAccount;

if (process.env.FIREBASE_PROJECT_ID) {
  // Producción (Render): credenciales armadas desde variables sueltas
  serviceAccount = {
    type: 'service_account',
    project_id: process.env.FIREBASE_PROJECT_ID,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  };
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