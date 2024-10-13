# Stellar Payment Messaging

## Description

Stellar Payment Messaging is a Node.js application that provides an API for creating and managing Stellar wallets. This project allows users to create wallets, fund them with XLM (Stellar Lumens), check their balances, and perform various operations, such as transferring XLM to multiple recipients, adding messages to transactions, and setting up automated regular payments. Users can also view their transaction history for better financial tracking.

## Features

- Create a new Stellar wallet
- Fund a Stellar wallet using Friendbot
- Retrieve the balance of a Stellar wallet
- Transfer XLM between wallets
- Add a short message to transfer transactions
- Multiple Recipient Transfers: Send XLM to multiple addresses in a single transaction.
- Transaction History Viewing: Enable users to view their past transfers and associated messages.


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

---

### 4. Get Balance

- **Endpoint**: `/getBalance`
- **Method**: `GET`
- **Description**: The /getBalance API endpoint allows users to check the balance of their Stellar wallet.
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
      "message": "Your balance has been checked.",
      "balance": "value_in_xlm"
    }
    ```
- **Error Response**:
  - **Status Code**: 500 Internal Server Error
  - **Response Body**:
    ```json
    {
      "message": "An error occurred while checking the balance."
    }
    ```

---

### 5. Send XLM

- **Endpoint**: `/sendXLM`
- **Method**: `POST`
- **Description**: The /sendXLM API endpoint facilitates the transfer of XLM (Lumens) from one Stellar wallet to another. Users provide their sender secret key, the recipient's public key, the amount to be transferred, and an optional message. 
- **Request Body**:
    ```json
    {
      "senderSecretKey": "your_secret_key_here",
      "recipientPublicKey": "recipient_public_key",
      "amount": "value_in_xlm",
      "message":"message_for_recipient"
    }
    ```
- **Response**:
  - **Status Code**: 200 OK
  - **Response Body**:
    ```json
    {
      "message": "Transfer successful"
    }
    ```
- **Error Response**:
  - **Status Code**: 500 Internal Server Error
  - **Response Body**:
    ```json
    {
      "message": "Transfer failed"
    }
    ```

---

### 6. Send XLM to Multiple Recipients

- **Endpoint**: `/sendXLMToMultipleRecipients`
- **Method**: `POST`
- **Description**: The /sendXLMToMultipleRecipients API endpoint allows users to transfer XLM (Lumens) to multiple recipients in a single transaction. Users must provide their sender secret key and an array of recipient details, including public keys and amounts. The endpoint responds with a success message upon completion.
- **Request Body**:
    ```json
  { 
    "senderSecretKey":"your_sender_secret_key",
    "recipients":[
       {
          "recipientPublicKey":"recipient_public_key_1",
          "amount":"value_in_xlm_1",
          "message":"message_for_recipient_1"
       },
       {
          "recipientPublicKey":"recipient_public_key_2",
          "amount":"value_in_xlm_2",
          "message":"message_for_recipient_2"
       }
    ]
  }
    ```
- **Response**:
  - **Status Code**: 200 OK
  - **Response Body**:
    ```json
    {
      "message": "Transfer successful"
    }
    ```
- **Error Response**:
  - **Status Code**: 500 Internal Server Error
  - **Response Body**:
    ```json
    {
      "message": "Transfer failed"
    }
    ```

---

### 7. Transaction History

- **Endpoint**: `/transactionHistory`
- **Method**: `GET`
- **Description**: Fetches the transaction history for a specified wallet using the provided public key. Returns a list of transactions associated with the given public key.
- **Request Body**:
    ```json
    {
     "publicKey":"your_public_key_here"
    }
    ```
- **Response**:
  - **Status Code**: 200 OK
  - **Response Body**:
    ```json
    {
      "transactions": []
    }
    ```
- **Error Response**:
  - **Status Code**: 500 Internal Server Error
  - **Response Body**:
    ```json
    {
      "message": "Transfer failed"
    }
    ```
