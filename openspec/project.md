# Project Context

## Purpose

DODOEX is a decentralized exchange (DEX) protocol providing embeddable React widgets for DeFi applications. The widgets enable:

- **Token Swaps**: Cross-chain token exchange with best-price routing
- **Liquidity Management**: AMM V2 & V3 pool creation and management
- **Crowdpooling**: Token sale and crowdfunding campaigns
- **Mining**: Yield farming and liquidity mining interfaces

The widgets support 9+ blockchain networks including Ethereum, BNB Chain, Polygon, Arbitrum, Avalanche, Optimism, and more.

## Tech Stack

- **Language**: TypeScript (strict mode)
- **Framework**: React 17+ with Next.js support
- **Build Tools**: Rollup (bundling), Lerna (monorepo)
- **Styling**: Emotion (CSS-in-JS)
- **State Management**: Redux Toolkit, Zustand
- **Data Fetching**: React Query (@tanstack/react-query)
- **Web3**: ethers.js, @web3-react/core
- **Math**: bignumber.js (precision for financial calculations)
- **i18n**: Lingui (English & Chinese)
- **Testing**: Jest with jsdom environment
- **Documentation**: Storybook

## Project Conventions

### Code Style

- **Formatting**: Prettier with single quotes, trailing commas, 2-space indentation, semicolons
- **Linting**: ESLint with Next.js presets
- **Naming**:
  - Components: PascalCase (`SwapWidget.tsx`)
  - Functions/Variables: camelCase (`handleSubmit`)
  - Types/Interfaces: PascalCase (`TokenInfo`)
  - Constants: UPPER_SNAKE_CASE (`MAX_UINT256`)
- **File Organization**: Co-locate tests with source (`Component.tsx` + `Component.test.ts`)

### Architecture Patterns

- **Monorepo**: Lerna-managed with exact version matching across packages
- **Widget Structure**:
  - `src/components/` - Shared UI components
  - `src/widgets/` - Feature-specific widgets (Swap, Pool, Crowdpooling)
  - `src/hooks/` - Custom React hooks
  - `src/constants/` - Chain IDs, addresses, API endpoints
- **State**: Local component state with Zustand for global state, React Query for server state
- **Routing**: Custom router with typed routes
- **Error Handling**: Try-catch with user-friendly error messages, no console errors in production

### Testing Strategy

- **Framework**: Jest with jsdom for DOM testing
- **Coverage**: Unit tests for utilities (address, wallet, time calculations)
- **Test Location**: Next to source files with `.test.ts` suffix
- **Timeout**: 20 seconds default for async operations
- **Requirements**: New features require test coverage for business logic, especially financial calculations

### Git Workflow

- **Main Branch**: `main` (production releases)
- **Feature Branches**: `feat/`, `fix/`, `refactor/` prefixes
- **Commit Convention**: Conventional commits with commitlint enforcement
  - `feat:` New features
  - `fix:` Bug fixes
  - `docs:` Documentation changes
  - `refactor:` Code restructuring without behavior change
- **Versioning**: Semantic release with automated changelog
- **Publishing**: Lerna with npm client to public registry

## Domain Context

### Blockchain/DeFi Concepts

- **AMM**: Automated Market Maker (Uniswap V2/V3 protocol compatibility)
- **Liquidity Pool**: Smart contract containing token pairs for trading
- **Slippage**: Price impact tolerance during swaps
- **RPC**: Remote Procedure Call endpoints for blockchain node communication
- **Chain ID**: Unique network identifier (e.g., Ethereum = 1, BSC = 56)
- **Token Decimals**: Precision for token amounts (usually 18 for ERC20)
- **Gas Fees**: Transaction costs paid in native tokens
- **Wallet Integration**: MetaMask, WalletConnect v2 for signing transactions

### Financial Calculations

- All price calculations use `bignumber.js` to avoid floating-point precision errors
- Exchange rates displayed with 2-6 decimal places depending on value magnitude
- Minimum/maximum thresholds for pool creation and swaps

## Important Constraints

### Security

- **Never expose private keys** - all signing handled by wallet provider
- **Validate all user inputs** - addresses, amounts, slippage tolerance
- **Handle BigNumber math correctly** - no floating-point for financial calculations
- **Rate limiting** for API calls to prevent abuse
- **CSP headers** for iframe embed scenarios

### Blockchain Limitations

- **Transaction finality** - not all chains have instant finality
- **Gas estimation** - may fail during network congestion
- **Reorgs** - possible on some chains, handle with block confirmations
- **RPC failures** - implement fallback providers

### Performance

- Bundle size < 500KB per widget for fast loading
- Lazy load non-critical components
- Optimize images and icons
- Use React Query for efficient data caching

### Regulatory

- Widgets are UI-only - no custody of user funds
- Display appropriate disclaimers for trading risks
- Geographic restrictions may apply (configurable)

## External Dependencies

### Blockchain RPC Providers

- Primary RPC endpoints for each supported chain
- Fallback RPC providers for redundancy
- WebSocket support for real-time updates

### Data APIs

- DODOEX backend API for pool data and prices
- GraphQL endpoints for crowdpooling queries
- Token list APIs (CoinGecko, or custom lists)

### Third-Party Integrations

- **Uniswap SDK**: AMM calculations and router interactions
- **WalletConnect**: Mobile wallet support
- **Ethers.js**: Blockchain transaction signing
- **Recharts**: Financial data visualization

### Infrastructure

- npm registry for package distribution
- GitHub Actions for CI/CD
- Storybook for component documentation hosting

## Development Notes

### Adding New Widget Features

1. Create feature folder in `src/widgets/[WidgetName]/`
2. Add types to `src/widgets/[WidgetName]/types.ts`
3. Create Redux slice or Zustand store if state management needed
4. Add translations to `src/locales/en-US.po` and `src/locales/zh-CN.po`
5. Extract to `src/index.tsx` for public API export
6. Add Storybook stories in `packages/doc/src/stories/widgets/`

### Adding New Chain Support

1. Update `src/constants/api.ts` with RPC endpoints
2. Add chain ID to type definitions
3. Include in supported chains list
4. Test swap/pool creation on new chain testnet first

### Common Patterns

- Wrap transactions in `useExecution` hook for consistent error handling
- Format currency with `formatTokenAmountNumber()` utility

### Important Restrictions

- **Do NOT modify locale files** (`src/locales/`) - translations are managed separately
- **New chains or GraphQL requests** - add in `@dodoex/api` package
- **Use existing components** - prioritize components from `widgets/` or `@dodoex/components`:
  - Token selection popup → use `TokenPicker`
  - Token display → use `TokenCard` for consistent styling
  - Dialogs → use `src/components/Dialog.tsx`
  - Always search existing components before creating new ones
