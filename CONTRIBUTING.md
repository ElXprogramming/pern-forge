# Contributing to PERN Forge

Thank you for your interest in contributing to **PERN Forge**!

## Development Setup

```bash
git clone https://github.com/<your-username>/pern-forge.git
cd pern-forge
cd server && npm install
```

## Verification Checks

Before opening a pull request, validate syntax across backend entry points:

```bash
node --check api/index.js
node --check server/server.js
node --check server/db.js
```

## Code of Conduct

Please adhere to our [Code of Conduct](CODE_OF_CONDUCT.md) in all interactions.
