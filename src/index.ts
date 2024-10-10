import express, { Request, Response } from 'express';
import { Keypair, Server, Networks } from 'soroban-client';
import fetch from 'node-fetch';

const server = new Server('https://horizon-testnet.stellar.org');
const networkPassphrase = Networks.TESTNET;

interface Balance {
  balance: string;
  buying_liabilities: string;
  selling_liabilities: string;
  asset_type: string;
}

interface AccountData {
  id: string;
  account_id: string;
  sequence: string;
  balances: Balance[];
}

async function createWallet(): Promise<{ publicKey: string, secretKey: string }> {
  const keypair = Keypair.random();
  const publicKey = keypair.publicKey();
  const secretKey = keypair.secret();

  console.log('New Wallet:');
  console.log('Public Key:', publicKey);
  console.log('Secret Key:', secretKey);

  return { publicKey, secretKey };
}

async function fundWallet(publicKey: string): Promise<void> {
  const fundResponse = await fetch(
    `https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`
  );

  if (fundResponse.ok) {
    console.log('Wallet funded:', await fundResponse.json());
  } else {
    console.error('Funding error:', await fundResponse.text());
    throw new Error('Funding error');
  }
}

async function getWalletBalance(publicKey: string): Promise<any> {
  try {
    const response = await fetch(`https://horizon-testnet.stellar.org/accounts/${publicKey}`);
    if (!response.ok) {
      throw new Error('Account information could not be retrieved.');
    }

    const accountData: AccountData = await response.json() as AccountData;
    const balanceInfo = accountData.balances.find((b: { asset_type: string }) => b.asset_type === 'native');
    if (balanceInfo) {
      console.log(`XLM Balance: ${balanceInfo.balance}`);
      return balanceInfo.balance;
    } else {
      console.log('Balance not found.');
      return 0;
    }
  } catch (error) {
    console.error('An error occurred while checking the balance:', error);
    return 0;
  }
}

const app = express();
const port = 3000;
app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.get('/healthCheck', (req: Request, res: Response) => {
  res.status(200).send({ message: 'API is healthy!' });
});

app.post('/createWallet', async (req: Request, res: Response) => {
  try {
    const { publicKey, secretKey } = await createWallet();
    res.status(200).send({ publicKey, secretKey });
  } catch (error) {
    console.error('An error occurred while creating the wallet:', error);
    res.status(500).send({ message: 'An error occurred while creating the wallet:' });
  }
});

app.post('/fundWallet', async (req: Request, res: Response) => {
  try {
    const { publicKey } = req.body;
    await fundWallet(publicKey);
    res.status(200).send({ message: 'Wallet funded.' });
  } catch (error) {
    console.error('An error occurred while funding the wallet:', error);
    res.status(500).send({ message: 'An error occurred while funding the wallet.' });
  }
});

app.get('/getBalance', async (req: Request, res: Response) => {
  try {
    const { publicKey } = req.body;
    const balance = await getWalletBalance(publicKey);
    res.status(200).send({ message: 'Your balance has been checked.', balance: balance });
  } catch (error) {
    console.error('An error occurred while checking the balance:', error);
    res.status(500).send({ message: 'An error occurred while checking the balance' });
  }
});

