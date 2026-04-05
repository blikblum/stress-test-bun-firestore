const admin = require('firebase-admin');

// Initialize Firebase Admin with emulator settings
function initializeFirestore() {
  // Use default credentials (emulator doesn't need real credentials)
  if (!admin.apps.length) {
    admin.initializeApp({
      projectId: 'stress-test-project',
    });
  }

  const db = admin.firestore();
  
  // Connect to emulator
  db.settings({
    host: 'localhost:8080',
    ssl: false,
  });

  return db;
}

module.exports = { initializeFirestore };
