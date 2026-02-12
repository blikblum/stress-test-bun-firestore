# Firestore Performance: Node.js vs Bun

A performance comparison project to benchmark Firestore operations (firebase-admin) between Node.js and Bun runtimes using the Firebase Firestore emulator.

## Features

- 🔥 Tests Firestore operations using firebase-admin SDK
- 📊 Compares performance between Node.js and Bun
- 🧪 Tests multiple scenarios: 100, 500, 1000, and 10000 documents
- 📈 Measures both write (add) and read operations
- 🎯 Uses Firebase Firestore emulator for consistent testing
- 📋 Generates detailed performance reports
- 🎪 Includes demo mode for quick testing without emulator

## Prerequisites

- Node.js (v18 or higher recommended)
- Bun (latest version)
- Firebase CLI and Java 21+ (for running the actual emulator)

### Installing Prerequisites

**Install Bun:**
```bash
curl -fsSL https://bun.sh/install | bash
```

**Install Firebase CLI:**
```bash
npm install -g firebase-tools
```

## Installation

```bash
npm install
```

## Running the Tests

You can run the tests in two modes:

### Quick Demo Mode (No Emulator Required)

The demo mode provides a quick way to see the performance comparison framework in action without setting up the Firestore emulator. It simulates document operations with artificial data.

#### 1. Run Demo with Node.js

```bash
npm run demo:node
```

#### 2. Run Demo with Bun

```bash
npm run demo:bun
```

#### 3. Compare Demo Results

```bash
npm run compare
```

This will display a detailed comparison showing performance differences between Node.js and Bun.

### Full Mode with Firestore Emulator

For actual Firestore testing with the emulator:

#### 1. Start the Firestore Emulator

In a separate terminal, start the Firestore emulator:

```bash
npm run emulator
```

The emulator will start on `localhost:8080`. Keep this running while you execute the tests.

**Note:** The emulator requires Java 21 or higher. If you have an older version, you may need to upgrade Java or use the demo mode.

#### 2. Run Tests with Node.js

```bash
npm run test:node
```

This will run all performance tests using Node.js and save results to `results/node.js-results.json`.

#### 3. Run Tests with Bun

```bash
npm run test:bun
```

This will run all performance tests using Bun and save results to `results/bun-results.json`.

#### 4. Compare Results

After running tests with both runtimes:

```bash
npm run compare
```

This will display a detailed comparison showing:
- Add document performance for each scenario
- Read document performance for each scenario
- Overall averages and winner determination

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run demo:node` | Run demo performance test with Node.js (no emulator) |
| `npm run demo:bun` | Run demo performance test with Bun (no emulator) |
| `npm run test:node` | Run full Firestore tests with Node.js (requires emulator) |
| `npm run test:bun` | Run full Firestore tests with Bun (requires emulator) |
| `npm run emulator` | Start Firebase Firestore emulator |
| `npm run compare` | Compare results from Node.js and Bun tests |

## Test Scenarios

The project tests the following scenarios:

| Scenario | Documents | Operations Tested |
|----------|-----------|-------------------|
| Small    | 100       | Add, Read         |
| Medium   | 500       | Add, Read         |
| Large    | 1,000     | Add, Read         |
| XLarge   | 10,000    | Add, Read         |

## Project Structure

```
.
├── src/
│   ├── firestore-init.js  # Firestore initialization with emulator config
│   ├── test-utils.js      # Performance testing utilities
│   ├── run-tests.js       # Main test runner (requires emulator)
│   ├── demo.js            # Demo test runner (no emulator needed)
│   └── compare.js         # Results comparison script
├── results/               # Generated test results (gitignored)
├── firebase.json          # Firebase emulator configuration
├── package.json
└── README.md
```

## Sample Output

### Test Execution

```
=== Running tests with Node.js v20.x.x ===

Testing with 100 documents...
  Adding 100 documents...
  ✓ Added in 245.32ms (407.63 docs/sec)
  Reading 100 documents...
  ✓ Read in 89.45ms (1118.23 docs/sec)

Testing with 500 documents...
  Adding 500 documents...
  ✓ Added in 892.17ms (560.48 docs/sec)
  Reading 500 documents...
  ✓ Read in 312.78ms (1598.67 docs/sec)
...
```

### Comparison Report

```
╔════════════════════════════════════════════════════════════════════════════╗
║       Firestore Performance Comparison: Node.js vs Bun                    ║
╚════════════════════════════════════════════════════════════════════════════╝

Node.js Version: v20.x.x
Bun Version: 1.x.x

ADD DOCUMENTS PERFORMANCE:
──────────────────────────────────────────────────────────────────────────────
Documents | Node.js (ms) | Bun (ms)     | Difference  | Winner
──────────────────────────────────────────────────────────────────────────────
100       | 245.32       | 198.45       | +19.1%      | Bun (19.1% faster)
500       | 892.17       | 756.23       | +15.2%      | Bun (15.2% faster)
...
```

## How It Works

1. **Initialization**: Connects to the Firestore emulator running on localhost:8080
2. **Document Generation**: Creates test documents with various fields (strings, numbers, nested objects, arrays)
3. **Batch Operations**: Uses Firestore batch operations for efficient writes
4. **Performance Measurement**: Uses high-resolution timers to measure operation duration
5. **Results Storage**: Saves detailed JSON results for each runtime
6. **Comparison**: Analyzes both result files and generates comparison reports

## Notes

- Tests are run against the Firestore emulator, not production Firestore
- Each test scenario clears the collection before and after execution
- Results may vary based on system performance and load
- The emulator must be running before executing tests

## License

ISC
