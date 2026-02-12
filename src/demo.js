#!/usr/bin/env node

/**
 * Demo script that simulates the performance comparison
 * This runs a simplified version without requiring the Firestore emulator
 */

const fs = require('fs');
const path = require('path');

const TEST_SCENARIOS = [100, 500, 1000, 10000];

/**
 * Simulate document operations with artificial delays
 */
async function simulateOperation(count, operationType) {
  const startTime = process.hrtime.bigint();
  
  // Simulate some work
  const data = [];
  for (let i = 0; i < count; i++) {
    data.push({
      id: i,
      name: `Document ${i}`,
      description: `Test document ${i}`,
      timestamp: new Date().toISOString(),
      randomValue: Math.random(),
    });
  }
  
  // Add a small delay to simulate network/IO
  await new Promise(resolve => setTimeout(resolve, Math.floor(count / 100)));
  
  const endTime = process.hrtime.bigint();
  const duration = Number(endTime - startTime) / 1_000_000;
  
  return duration;
}

async function runDemo() {
  const runtime = typeof Bun !== 'undefined' ? 'Bun' : 'Node.js';
  const version = typeof Bun !== 'undefined' ? Bun.version : process.version;
  
  console.log(`\n=== Demo Performance Test with ${runtime} ${version} ===\n`);
  console.log('NOTE: This is a simulation without actual Firestore emulator.\n');
  
  const results = {
    runtime,
    version,
    timestamp: new Date().toISOString(),
    tests: [],
  };
  
  for (const count of TEST_SCENARIOS) {
    console.log(`Testing with ${count} documents...`);
    
    const addDuration = await simulateOperation(count, 'add');
    console.log(`  ✓ Added in ${addDuration.toFixed(2)}ms (${(count / (addDuration / 1000)).toFixed(2)} docs/sec)`);
    
    const readDuration = await simulateOperation(count, 'read');
    console.log(`  ✓ Read in ${readDuration.toFixed(2)}ms (${(count / (readDuration / 1000)).toFixed(2)} docs/sec)`);
    
    results.tests.push({
      documentCount: count,
      addDuration,
      readDuration,
      addRate: count / (addDuration / 1000),
      readRate: count / (readDuration / 1000),
    });
  }
  
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
}

runDemo()
  .then(() => {
    console.log('\n✓ Demo completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n✗ Error running demo:', error);
    process.exit(1);
  });
