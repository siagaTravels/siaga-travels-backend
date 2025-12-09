# Siyoga Backend

Node.js backend API for Siyoga Travels using Express, TypeScript, and Prisma.

## Quick Start

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run development server
npm run dev
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Run production build

## Environment Variables

Copy `.env.example` to `.env` and configure:

```
DATABASE_URL="postgresql://..."
PORT=5000
NODE_ENV=development
```
