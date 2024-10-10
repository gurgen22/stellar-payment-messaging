# Stellar Payment Messaging

## Description

Stellar Payment Messaging is a Node.js application that provides an API for creating and managing Stellar wallets. This project allows users to create wallets, fund them with XLM (Stellar Lumens), and check their balances.

## Features

- Create a new Stellar wallet
- Fund a Stellar wallet using Friendbot
- Retrieve the balance of a Stellar wallet

## Technologies Used

- **Node.js**: A JavaScript runtime for building server-side applications.
- **TypeScript**: A superset of JavaScript that adds static typing.
- **Express**: A web application framework for Node.js, used for building RESTful APIs.
- **node-fetch**: A lightweight module that enables making HTTP requests in Node.js.
- **soroban-client**: A library for interacting with the Stellar network and its functionalities.

## Installation

To get started with the project, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/gurgen22/stellar-payment-messaging.git
   ```

   ```bash
   cd stellar-payment-messaging
   ```

2. Install the dependencies:
   ```bash

   npm install

3. Build the TypeScript files:
   ```bash

   npm run build

4. Start the development server:
   ```bash

   npm run dev
   ```


## API Endpoints

### 1. Health Check

- **Endpoint**: `/healthCheck`
- **Method**: `GET`
- **Description**: Checks if the API is healthy.
- **Response**:
  - **Status Code**: 200 OK
  - **Response Body**:
    ```json
    {
      "message": "API is healthy!"
    }
    ```

---

### 2. Create Wallet

- **Endpoint**: `/createWallet`
- **Method**: `POST`
- **Description**: Creates a new Stellar wallet. Returns the public and secret keys.
- **Response**:
  - **Status Code**: 200 OK
  - **Response Body**:
    ```json
    {
      "publicKey": "your_public_key_here",
      "secretKey": "your_secret_key_here"
    }
    ```

---

### 3. Fund Wallet

- **Endpoint**: `/fundWallet`
- **Method**: `POST`
- **Description**: Funds a wallet with XLM. Requires the public key in the request body.
- **Request Body**:
    ```json
    {
      "publicKey": "your_public_key_here"
    }
    ```
- **Response**:
  - **Status Code**: 200 OK
  - **Response Body**:
    ```json
    {
      "message": "Wallet funded"
    }
    ```
- **Error Response**:
  - **Status Code**: 500 Internal Server Error
  - **Response Body**:
    ```json
    {
      "message": "An error occurred while checking the balance"
    }
    ```
