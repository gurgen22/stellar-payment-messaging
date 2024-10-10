# Stellar Payment Messaging


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
