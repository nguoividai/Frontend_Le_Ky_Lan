# Currency Swap - Crypto Asset Management Platform

A modern web application for managing cryptocurrency assets, enabling users to view their portfolio, swap between currencies, and track transaction history.

## 🚀 Features

- **Asset Portfolio Management**: View and manage your cryptocurrency assets
- **Currency Swapping**: Exchange between different cryptocurrencies
- **Transaction History**: Track all your transactions
- **Responsive Design**: Works seamlessly on both desktop and mobile devices

## 📋 Project Structure

```
currency-swap/
├── app/                  # Next.js application pages
│   ├── globals.css       # Global CSS styles
│   ├── layout.tsx        # Root layout component
│   ├── page.tsx          # Home page component
│   └── wallet/           # Wallet page
├── components/           # Reusable UI components
│   ├── tech-background.tsx     # Background component
│   ├── transaction-history.tsx  # Transaction history component
│   ├── bussiness/        # Business logic components
│   │   ├── transaction/  # Transaction related components
│   │   └── wallet/       # Wallet related components
│   └── ui/               # UI components (shadcn/ui)
├── helpers/              # Helper functions
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── public/               # Static assets
└── styles/               # CSS styles
```

## 🛠️ Technical Stack

- **Framework**: [Next.js](https://nextjs.org/) (React framework)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (Reusable UI components)
- **State Management**: React Hooks

## 📊 Design Patterns

- **Component-based Architecture**: Modular components for better code organization and reusability
- **Custom Hooks Pattern**: Encapsulated business logic in custom React hooks (`use-wallet.ts`, `use-tokens.ts`, `use-swap.ts`, etc.)
- **Container/Presentational Pattern**: Separation of business logic from UI components
- **Responsive Design Pattern**: Mobile-first approach with responsive components

## 🔧 Installation & Setup

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Getting Started

1. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

2. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

3. **Open your browser**
   Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🔍 Project Specifics

### Custom Hooks

- `use-wallet.ts`: Manages wallet connection and state
- `use-tokens.ts`: Handles token data and operations
- `use-swap.ts`: Manages currency swap operations
- `use-transactions.ts`: Processes and retrieves transaction history
- `use-toast.ts`: Manages toast notifications
- `use-mobile.tsx`: Handles responsive design logic

### Key Components

- `components/bussiness/wallet/swap-dialog.tsx`: Handles the currency swap interface
- `components/bussiness/wallet/asset-list.tsx`: Displays user's crypto assets
- `components/transaction-history.tsx`: Shows transaction history

## 📜 Scripts

- `npm run dev`: Starts development server
- `npm run build`: Builds the application for production
- `npm run start`: Starts the production server
- `npm run lint`: Runs linting checks

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
