const { initializeFirestore } = require('./firestore-init');
const { addDocuments, readDocuments, clearCollection } = require('./test-utils');
const fs = require('fs');
const path = require('path');

const TEST_SCENARIOS = [100, 500, 1000, 10000];
const COLLECTION_NAME = 'performance-test';

/**
 * Run all performance tests
 */
async function runTests() {
  console.log('Initializing Firestore...');
  const db = initializeFirestore();
  
  const runtime = typeof Bun !== 'undefined' ? 'Bun' : 'Node.js';
  const version = typeof Bun !== 'undefined' 
    ? Bun.version 
    : process.version;
  
  console.log(`\n=== Running tests with ${runtime} ${version} ===\n`);
  
  const results = {
    runtime,
    version,
    timestamp: new Date().toISOString(),
    tests: [],
  };
  
  for (const count of TEST_SCENARIOS) {
    console.log(`\nTesting with ${count} documents...`);
    
    // Clear collection before test
    await clearCollection(db, COLLECTION_NAME);
    
    // Test adding documents
    console.log(`  Adding ${count} documents...`);
    const addDuration = await addDocuments(db, COLLECTION_NAME, count);
    console.log(`  ✓ Added in ${addDuration.toFixed(2)}ms (${(count / (addDuration / 1000)).toFixed(2)} docs/sec)`);
    
    // Test reading documents
    console.log(`  Reading ${count} documents...`);
    const readDuration = await readDocuments(db, COLLECTION_NAME, count);
    console.log(`  ✓ Read in ${readDuration.toFixed(2)}ms (${(count / (readDuration / 1000)).toFixed(2)} docs/sec)`);
    
    results.tests.push({
      documentCount: count,
      addDuration,
      readDuration,
      addRate: count / (addDuration / 1000),
      readRate: count / (readDuration / 1000),
    });
  }
  
  // Clean up
  await clearCollection(db, COLLECTION_NAME);
  
  // Save results
  const resultsDir = path.join(__dirname, '..', 'results');
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir);
  }
  
  const resultsFile = path.join(resultsDir, `${runtime.toLowerCase()}-results.json`);
  fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
  
  console.log(`\n✓ Results saved to ${resultsFile}`);
  console.log('\nTest Summary:');
  console.log('─'.repeat(80));
  console.log('Documents | Add Time (ms) | Add Rate (docs/sec) | Read Time (ms) | Read Rate (docs/sec)');
  console.log('─'.repeat(80));
  
  results.tests.forEach(test => {
    console.log(
      `${test.documentCount.toString().padEnd(9)} | ` +
      `${test.addDuration.toFixed(2).padEnd(13)} | ` +
      `${test.addRate.toFixed(2).padEnd(19)} | ` +
      `${test.readDuration.toFixed(2).padEnd(14)} | ` +
      `${test.readRate.toFixed(2)}`
    );
  });
  console.log('─'.repeat(80));
  
  return results;
}

// Run tests and handle errors
runTests()
  .then(() => {
    console.log('\n✓ All tests completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n✗ Error running tests:', error);
    process.exit(1);
  });
