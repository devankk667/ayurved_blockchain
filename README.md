# AyurChain - Herb Authenticity Tracker

This project is a full-stack application that uses a blockchain to track the authenticity of Ayurvedic herbs.

## Running the Application Locally

Due to potential issues with Docker Hub rate limiting, it is recommended to run the application locally without Docker.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)

### Setup for macOS/Linux

1.  **Install Node.js v18:**

    It is recommended to use `nvm` (Node Version Manager) to manage your Node.js versions.

    ```bash
    nvm install 18
    nvm use 18
    ```

2.  **Install Ganache CLI:**

    ```bash
    npm install -g ganache-cli
    ```

3.  **Install Backend Dependencies:**

    ```bash
    cd backend
    npm install
    ```

4.  **Install Frontend Dependencies:**

    ```bash
    cd frontend
    npm install
    ```

### Setup for Windows

1.  **Install Node.js v18:**

    Download and install Node.js v18 or higher from the [official Node.js website](https://nodejs.org/en/download/). The Windows Installer (`.msi`) is the easiest option.

2.  **Install Ganache CLI:**

    Open Command Prompt or PowerShell and run:
    ```powershell
    npm install -g ganache-cli
    ```

3.  **Install Backend Dependencies:**

    Navigate to the `backend` directory in your terminal and run:
    ```powershell
    cd backend
    npm install
    ```

4.  **Install Frontend Dependencies:**

    Navigate to the `frontend` directory in your terminal and run:
    ```powershell
    cd frontend
    npm install
    ```

### Running the Application

1.  **Start Ganache:**

    Open a new terminal window (Command Prompt or PowerShell on Windows) and run:

    ```bash
    ganache-cli
    ```

2.  **Start the Backend Server:**

    In another terminal window, navigate to the `backend` directory and run:

    ```bash
    npm start
    ```

    The backend server will be running on `http://localhost:3001`.

3.  **Start the Frontend Development Server:**

    In a third terminal window, navigate to the `frontend` directory and run:

    ```bash
    npm start
    ```

    The frontend will be running on `http://localhost:3000`.

You can now access the application in your browser at `http://localhost:3000`.