# Steller Create Hackathon Project

A decentralized video-sharing platform built on Stellar, featuring Soroban smart contracts for video share investments, live stream investments, and a watch-to-earn token system.

## Features

- **Freighter Wallet Integration**: Seamless connection with user's Stellar wallet
- **Video Share Investment**: Buy and sell shares in videos using Soroban contracts
- **Live Stream Investment**: Invest in upcoming streams with dynamic pricing
- **Watch-to-Earn**: Earn platform tokens by watching content
- **Token Shop**: Swap earned tokens for XLM or creator shares
- **Decentralized Authentication**: Sign in with your Stellar wallet

## Technical Stack

- Frontend: React, Vite, TailwindCSS
- Backend: Node.js, Express
- Smart Contracts: Soroban (Rust)
- Database: PostgreSQL
- Authentication: JWT + Stellar signatures
- Testing: Jest, Playwright

## Quick Start

1. Clone the repository and switch to the feature branch:
```bash
git clone https://github.com/freakyyirus/Steller-Create.git
cd Steller-Create
git checkout feature/freighter-integrate-and-soroban
```

2. Install dependencies:
```bash
# Frontend
npm install

# Backend
cd backend
npm install
```

3. Set up environment variables:
```bash
# Frontend (.env)
VITE_API_URL=http://localhost:3001
VITE_HORIZON_URL=https://horizon-testnet.stellar.org
VITE_NETWORK=TESTNET

# Backend (.env)
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=steller_create
JWT_SECRET=your-secret-key
STELLAR_NETWORK=TESTNET
PLATFORM_TOKEN_CODE=CST
PLATFORM_TOKEN_ISSUER=your_issuer_public_key
PLATFORM_TOKEN_ISSUER_SECRET=your_issuer_secret_key
```

4. Start development servers:
```bash
# Frontend
npm run dev

# Backend
cd backend
npm run dev
```

## Smart Contracts

The project uses two Soroban smart contracts:

1. **Video Share Contract** (`contracts/src/lib.rs`):
   - Manages video share offerings
   - Handles share purchases
   - Distributes revenue to shareholders

2. **Live Stream Contract** (`contracts/src/live_stream.rs`):
   - Manages stream investments
   - Implements dynamic pricing before stream start
   - Prevents investments after stream begins

### Building Contracts

```bash
cd contracts
cargo build --target wasm32-unknown-unknown --release
```

The compiled WASM files will be in `target/wasm32-unknown-unknown/release/`.

## Running Tests

1. Smart Contract Tests:
```bash
cd contracts
cargo test
```

2. Backend Tests:
```bash
cd backend
npm test
```

3. End-to-End Tests:
```bash
# Install Playwright
npx playwright install

# Run tests
npm run e2e
```

## Versa Deployment

1. Set up environment variables on Versa:
   - Copy all variables from `.env.example`
   - Add secure values for production

2. Push your Docker images:
```bash
docker-compose build
docker tag steller-create-frontend:latest versa.registry/your-org/steller-create-frontend
docker tag steller-create-backend:latest versa.registry/your-org/steller-create-backend
docker push versa.registry/your-org/steller-create-frontend
docker push versa.registry/your-org/steller-create-backend
```

3. Deploy on Versa:
   - Use the provided `docker-compose.yml`
   - Configure your Versa deployment to use the custom domain
   - Set up SSL certificates

4. Initialize the database:
```bash
# Connect to your Versa instance
ssh versa.your-instance

# Run migrations
docker-compose exec backend npm run migrate
```

## Architecture Decisions

1. **Authentication Flow**:
   - Challenge-response using Stellar signatures
   - JWT for session management
   - No custodial wallets - users retain control

2. **Smart Contract Design**:
   - Video shares implemented on-chain via Soroban
   - Revenue distribution handled by contract
   - Dynamic pricing for live stream investments

3. **Watch-to-Earn System**:
   - Platform token issued on Stellar
   - Automated rewards via server-side transactions
   - Integration with Stellar DEX for token swaps

## Known Limitations & Future Improvements

1. **Soroban Limitations**:
   - Complex revenue distribution might need batching
   - Consider off-chain indexing for better query performance

2. **Scalability**:
   - Add Redis for caching challenges and rate limiting
   - Implement webhook system for transaction notifications

3. **Security**:
   - Add more extensive transaction validation
   - Implement withdrawal cooldowns
   - Add multi-signature support for large transfers

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
