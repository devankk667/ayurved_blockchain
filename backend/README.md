# Ayurvedic Herb Tracker - Backend

This is the backend service for the Ayurvedic Herb Tracker application, built with Node.js, Express, and Web3.js for blockchain integration.

## Features

- RESTful API for managing herb batches
- Blockchain integration for transparent supply chain tracking
- Secure authentication and authorization
- Rate limiting and request validation
- API documentation with Swagger
- Health check endpoint
- Error handling and logging

## Prerequisites

- Node.js v18 or higher
- npm or yarn
- Ganache (local blockchain)
- Git

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ayurved_bc/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the values in `.env` as needed

## Configuration

Edit the `.env` file to configure the application:

```env
# Server
PORT=3001
NODE_ENV=development

# CORS
CORS_ORIGIN=*

# Blockchain
WEB3_PROVIDER=http://ganache:7545
CONTRACT_ADDRESS=YOUR_CONTRACT_ADDRESS

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX=100
```

## Running the Application

### Development

Start the development server with hot-reload:

```bash
npm run dev
```

The server will be available at `http://localhost:3001`

### Production

Build and start the production server:

```bash
npm run build
npm start
```

## API Documentation

Access the interactive API documentation at:

```
http://localhost:3001/api-docs
```

## Testing

Run the test suite:

```bash
npm test
```

## Linting

Check code style:

```bash
npm run lint
```

## Formatting

Format code:

```bash
npm run format
```

## Project Structure

```
src/
├── config/           # Configuration files
├── controllers/      # Route controllers
├── middleware/       # Custom middleware
├── models/           # Database models
├── routes/           # API routes
├── services/         # Business logic
├── utils/            # Utility functions
├── app.js            # Express application
└── server.js         # Server entry point
```

## API Endpoints

### Batch

- `GET /api/batch/:batchId` - Get batch details

### Health Check

- `GET /health` - Health check endpoint

## License

MIT
