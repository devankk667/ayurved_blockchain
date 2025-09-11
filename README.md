# Ayurvedic Herb Tracker dApp

This project is a full-stack decentralized application (dApp) for tracking the lifecycle of Ayurvedic herbs from farm to consumer, ensuring authenticity and transparency through a blockchain-based ledger.

This implementation was built from scratch using a modern toolchain including React, Vite, Node.js, Hardhat, and Docker.

## Prerequisites

Before you begin, ensure you have the following software installed on your Windows machine:

- **Git:** [https://git-scm.com/download/win](https://git-scm.com/download/win)
- **Node.js:** v18.x or later. [https://nodejs.org/en/download/](https://nodejs.org/en/download/)
- **Docker Desktop:** [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)
  - Ensure Docker Desktop is running in the background.

## Running the Application Locally (Without Docker)

This method allows you to run each component of the application separately for development and debugging. You will need three separate terminals (e.g., PowerShell, Command Prompt, or Windows Terminal).

### Terminal 1: Start the Blockchain
1.  Navigate to the backend directory:
    ```sh
    cd herb-tracker-backend
    ```
2.  Install dependencies:
    ```sh
    npm install
    ```
3.  Start the local Hardhat blockchain node:
    ```sh
    npx hardhat node
    ```
    This will start a local Ethereum node on `http://127.0.0.1:8545` and list several test accounts with private keys. Keep this terminal running.

### Terminal 2: Deploy & Seed the Smart Contract
1.  Navigate to the backend directory in a new terminal:
    ```sh
    cd herb-tracker-backend
    ```
2.  Deploy the smart contract to the local node:
    ```sh
    npx hardhat run scripts/deploy.js --network localhost
    ```
    This will output the address of the deployed contract.
3.  Seed the contract with test data:
    ```sh
    npx hardhat run scripts/seed.js --network localhost
    ```
    This will populate the contract with a sample herb batch.

### Terminal 3: Start the Backend Server
1.  In the same terminal as the previous step (or a new one, making sure you are in `herb-tracker-backend`), start the API server:
    ```sh
    node server.js
    ```
    The backend server will start on `http://localhost:3001`. Keep this terminal running.

### Terminal 4: Start the Frontend Application
1.  Navigate to the frontend directory in a new terminal:
    ```sh
    cd herb-tracker-frontend
    ```
2.  Install dependencies:
    ```sh
    npm install
    ```
3.  Start the Vite development server:
    ```sh
    npm run dev
    ```
4.  Open your browser and navigate to `http://localhost:5173` (or the URL provided in the terminal). You should now be able to use the application.

## Running the Application with Docker

This method uses Docker Compose to build and run the frontend and backend services. It's simpler for production-like environments but requires the local blockchain to be running on the host machine.

### Step 1: Start the Blockchain
Follow the steps in **Terminal 1** from the "Running Locally" section to start the Hardhat node. The Dockerized backend will connect to this node.

### Step 2: Build and Run Docker Containers
1.  In a new terminal, from the root of the project, run the following command:
    ```sh
    docker compose up --build
    ```
    This will build the Docker images for the frontend and backend and start the services.
2.  Once the build is complete and the containers are running, open your browser and navigate to `http://localhost:8080`.

**Note on Docker Permissions:** If you encounter a `permission denied` error related to the Docker daemon socket, you may need to run your terminal as an Administrator on Windows or ensure your user is part of the `docker-users` group.
