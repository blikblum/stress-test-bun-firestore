const fs = require('fs');
const path = require('path');

/**
 * Compare performance results between Node.js and Bun
 */
function compareResults() {
  const resultsDir = path.join(__dirname, '..', 'results');
  
  const nodeResultsPath = path.join(resultsDir, 'node.js-results.json');
  const bunResultsPath = path.join(resultsDir, 'bun-results.json');
  
  // Check if both result files exist
  if (!fs.existsSync(nodeResultsPath)) {
    console.error('Node.js results not found. Run: npm run test:node');
    process.exit(1);
  }
  
  if (!fs.existsSync(bunResultsPath)) {
    console.error('Bun results not found. Run: npm run test:bun');
    process.exit(1);
  }
  
  const nodeResults = JSON.parse(fs.readFileSync(nodeResultsPath, 'utf8'));
  const bunResults = JSON.parse(fs.readFileSync(bunResultsPath, 'utf8'));
  
  console.log('\n╔════════════════════════════════════════════════════════════════════════════╗');
  console.log('║       Firestore Performance Comparison: Node.js vs Bun                    ║');
  console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');
  
  console.log(`Node.js Version: ${nodeResults.version}`);
  console.log(`Bun Version: ${bunResults.version}\n`);
  
  console.log('ADD DOCUMENTS PERFORMANCE:');
  console.log('─'.repeat(90));
  console.log('Documents | Node.js (ms) | Bun (ms)     | Difference  | Winner');
  console.log('─'.repeat(90));
  
  nodeResults.tests.forEach((nodeTest, index) => {
    const bunTest = bunResults.tests[index];
    const diff = ((nodeTest.addDuration - bunTest.addDuration) / nodeTest.addDuration * 100);
    const winner = bunTest.addDuration < nodeTest.addDuration ? 'Bun' : 'Node.js';
    const speedup = Math.abs(diff).toFixed(1);
    
    console.log(
      `${nodeTest.documentCount.toString().padEnd(9)} | ` +
      `${nodeTest.addDuration.toFixed(2).padEnd(12)} | ` +
      `${bunTest.addDuration.toFixed(2).padEnd(12)} | ` +
      `${(diff > 0 ? '+' : '') + diff.toFixed(1)}%`.padEnd(11) + ' | ' +
      `${winner} (${speedup}% ${diff > 0 ? 'faster' : 'slower'})`
    );
  });
  
  console.log('─'.repeat(90));
  
  console.log('\nREAD DOCUMENTS PERFORMANCE:');
  console.log('─'.repeat(90));
  console.log('Documents | Node.js (ms) | Bun (ms)     | Difference  | Winner');
  console.log('─'.repeat(90));
  
  nodeResults.tests.forEach((nodeTest, index) => {
    const bunTest = bunResults.tests[index];
    const diff = ((nodeTest.readDuration - bunTest.readDuration) / nodeTest.readDuration * 100);
    const winner = bunTest.readDuration < nodeTest.readDuration ? 'Bun' : 'Node.js';
    const speedup = Math.abs(diff).toFixed(1);
    
    console.log(
      `${nodeTest.documentCount.toString().padEnd(9)} | ` +
      `${nodeTest.readDuration.toFixed(2).padEnd(12)} | ` +
      `${bunTest.readDuration.toFixed(2).padEnd(12)} | ` +
      `${(diff > 0 ? '+' : '') + diff.toFixed(1)}%`.padEnd(11) + ' | ' +
      `${winner} (${speedup}% ${diff > 0 ? 'faster' : 'slower'})`
    );
  });
  
  console.log('─'.repeat(90));
  
  // Calculate overall averages
  const nodeAvgAdd = nodeResults.tests.reduce((sum, t) => sum + t.addDuration, 0) / nodeResults.tests.length;
  const bunAvgAdd = bunResults.tests.reduce((sum, t) => sum + t.addDuration, 0) / bunResults.tests.length;
  const nodeAvgRead = nodeResults.tests.reduce((sum, t) => sum + t.readDuration, 0) / nodeResults.tests.length;
  const bunAvgRead = bunResults.tests.reduce((sum, t) => sum + t.readDuration, 0) / bunResults.tests.length;
  
  console.log('\nOVERALL SUMMARY:');
  console.log('─'.repeat(90));
  console.log(`Average Add Time:  Node.js: ${nodeAvgAdd.toFixed(2)}ms | Bun: ${bunAvgAdd.toFixed(2)}ms`);
  console.log(`Average Read Time: Node.js: ${nodeAvgRead.toFixed(2)}ms | Bun: ${bunAvgRead.toFixed(2)}ms`);
  
  const addWinner = bunAvgAdd < nodeAvgAdd ? 'Bun' : 'Node.js';
  const readWinner = bunAvgRead < nodeAvgRead ? 'Bun' : 'Node.js';
  const addSpeedup = Math.abs((nodeAvgAdd - bunAvgAdd) / nodeAvgAdd * 100).toFixed(1);
  const readSpeedup = Math.abs((nodeAvgRead - bunAvgRead) / nodeAvgRead * 100).toFixed(1);
  
  console.log(`\n${addWinner} is ${addSpeedup}% ${bunAvgAdd < nodeAvgAdd ? 'faster' : 'slower'} at adding documents on average`);
  console.log(`${readWinner} is ${readSpeedup}% ${bunAvgRead < nodeAvgRead ? 'faster' : 'slower'} at reading documents on average`);
  console.log('─'.repeat(90));
}

compareResults();
