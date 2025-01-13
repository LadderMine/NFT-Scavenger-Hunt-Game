# NFT Scavenger Hunt Game 🎯

**The NFT Scavenger Hunt Game** is a blockchain-powered, gamified dApp built on the StarkNet ecosystem. It challenges players to solve puzzles, follow clues, and earn exclusive NFTs as rewards, while seamlessly introducing them to the StarkNet blockchain and its ecosystem.

![Logo](https://github.com/DistinctCodes/NFT-Scavenger-Hunt-Game/blob/main/frontend/public/NFTT.PNG)

## 📌 Features

- **Interactive Gameplay**: Solve puzzles and follow blockchain-related clues to earn NFT rewards.
- **Transparent Progress**: Game progress is recorded on-chain for transparency.
- **Customizable Hunts**: Ecosystem projects can create and embed their own challenges.
- **Educational Content**: Learn StarkNet features through engaging gameplay.
- **Dynamic Leaderboard**: Track player achievements in real-time.

## 🚀 Project Structure

The project is divided into frontend and backend:

\`\`\`
nft-scavenger-hunt/
├── frontend/ # Next.js frontend
│ ├── app/ # Next.js 13 app directory
│ ├── components/ # React components
│ ├── lib/ # Utility functions
│ └── public/ # Static assets
├── backend/ # Node.js & Express backend
│ ├── src/
│ │ ├── routes/ # API routes
│ │ ├── models/ # Database models
│ │ ├── middleware/ # Express middleware
│ │ └── config/ # Configuration files
├── contracts/ # StarkNet smart contracts
└── README.md
\`\`\`

## 🛠 Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js (v14 or later)
- npm (v6 or later)
- A StarkNet-compatible wallet (e.g., Argent, Braavos)
- MongoDB

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/your-username/nft-scavenger-hunt.git
   cd nft-scavenger-hunt
   \`\`\`

2. Install dependencies for both frontend and backend:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables:
   - In the `backend` folder, create a `.env` file with the following:
     \`\`\`
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     \`\`\`

### Running the Application

1. Start both frontend and backend in development mode:
   \`\`\`bash
   npm run dev
   \`\`\`

2. Open [http://localhost:3000](http://localhost:3000) in your browser to see the frontend.

The backend API will be available at `http://localhost:5000`.

## 🔗 Smart Contract Deployment

1. Install Protostar (if not already installed):
   \`\`\`bash
   curl -L https://raw.githubusercontent.com/software-mansion/protostar/master/install.sh | bash
   \`\`\`

2. Compile contracts:
   \`\`\`bash
   cd contracts
   protostar build
   \`\`\`

3. Deploy to StarkNet:
   \`\`\`bash
   protostar deploy ./build/main.json
   \`\`\`

## 🧪 Testing

Run the test suite for both frontend and backend:

\`\`\`bash
npm test
\`\`\`

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/your-username/nft-scavenger-hunt/issues).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
