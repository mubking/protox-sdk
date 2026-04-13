# Contributing to Protox SDK

We welcome contributions! Whether you're fixing a bug, adding a feature, or improving documentation, we're glad to have your help.

## How to Contribute

### 1. Find an Issue
Check out our [GitHub Issues](https://github.com/protox/protox-sdk/issues) for tasks labeled `good first issue` or `help wanted`.

### 2. Fork and Clone
Fork the repository and clone it to your local machine:
```bash
git clone https://github.com/YOUR_USERNAME/protox-sdk.git
cd protox-sdk
```

### 3. Install Dependencies
Install all necessary packages:
```bash
npm install
```

### 4. Create a Branch
Always create a new branch for your feature or bug fix:
```bash
git checkout -b feature/your-feature-name
```

### 5. Make Changes
Implement your changes and ensure they follow our coding standards.

### 6. Run Tests
Ensure all tests pass before submitting a pull request:
```bash
npm test
```

### 7. Submit a Pull Request
Once you're ready, submit a PR with a clear description of your changes and reference any related issues.

## Coding Standards

- **TypeScript**: Use TypeScript for all new code.
- **Documentation**: All new functions and public APIs must be documented with JSDoc comments.
- **Unit Tests**: Every new feature or bug fix must include unit tests in the `tests/` directory.
- **Linting**: Run `npm run lint` to ensure your code follows our style guidelines.

## Example Contribution Areas (TODOs)

We've marked several areas in the code with `// TODO` to help you find where we need improvements:
- **Wallet Support**: Add integration for Freighter, Albedo, and other Stellar wallets.
- **Contract Modules**: Implement support for additional Protox smart contracts.
- **Gas Optimization**: Improve transaction building and fee estimation.
- **Examples**: Add more usage examples for different developer scenarios.

## Community

Join our [Discord/Slack/Telegram] to chat with the maintainers and other contributors.

Thank you for being part of Protox SDK!
