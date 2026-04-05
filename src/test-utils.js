/**
 * Measure execution time of an async function
 * @param {Function} fn - Async function to measure
 * @returns {Promise<{duration: number, result: any}>}
 */
async function measureTime(fn) {
  const startTime = process.hrtime.bigint();
  const result = await fn();
  const endTime = process.hrtime.bigint();
  const duration = Number(endTime - startTime) / 1_000_000; // Convert to milliseconds
  
  return { duration, result };
}

/**
 * Generate random document data
 * @param {number} index - Document index
 * @returns {Object}
 */
function generateDocumentData(index) {
  return {
    id: index,
    name: `Document ${index}`,
    description: `This is a test document with index ${index}`,
    timestamp: new Date().toISOString(),
    randomValue: Math.random(),
    metadata: {
      created: Date.now(),
      tags: ['test', 'performance', `doc-${index}`],
      active: true,
    },
  };
}

/**
 * Add documents to Firestore
 * @param {Firestore} db - Firestore instance
 * @param {string} collectionName - Collection name
 * @param {number} count - Number of documents to add
 * @returns {Promise<number>} Duration in milliseconds
 */
async function addDocuments(db, collectionName, count) {
  const { duration } = await measureTime(async () => {
    const batch = db.batch();
    const collection = db.collection(collectionName);
    
    for (let i = 0; i < count; i++) {
      const docRef = collection.doc(`doc-${i}`);
      batch.set(docRef, generateDocumentData(i));
    }
    
    await batch.commit();
  });
  
  return duration;
}

/**
 * Read documents from Firestore
 * @param {Firestore} db - Firestore instance
 * @param {string} collectionName - Collection name
 * @param {number} count - Number of documents to read
 * @returns {Promise<number>} Duration in milliseconds
 */
async function readDocuments(db, collectionName, count) {
  const { duration } = await measureTime(async () => {
    const collection = db.collection(collectionName);
    const snapshot = await collection.limit(count).get();
    
    // Actually iterate through docs to ensure they're read
    const docs = [];
    snapshot.forEach(doc => {
      docs.push(doc.data());
    });
    
    return docs;
  });
  
  return duration;
}

/**
 * Clear a collection
 * @param {Firestore} db - Firestore instance
 * @param {string} collectionName - Collection name
 */
async function clearCollection(db, collectionName) {
  const collection = db.collection(collectionName);
  const snapshot = await collection.get();
  
  const batch = db.batch();
  snapshot.docs.forEach(doc => {
    batch.delete(doc.ref);
  });
  
  await batch.commit();
}

module.exports = {
  measureTime,
  generateDocumentData,
  addDocuments,
  readDocuments,
  clearCollection,
};
