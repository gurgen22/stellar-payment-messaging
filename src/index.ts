import express, { Request, Response } from 'express';
import { Keypair, Server, Networks, TransactionBuilder, Operation, Asset, Memo, Account } from 'soroban-client';
import fetch from 'node-fetch';
import { send } from 'process';

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

interface TransactionRecord {
  id: string;
  paging_token: string;
  created_at: string;
  source_account: string;
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

async function getAccount(accountId: string): Promise<any> {
  const url = `https://horizon-testnet.stellar.org/accounts/${accountId}`;
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching account information:', error);
  }
}

async function sendXLM(senderSecretKey: string, recipientPublicKey: string, amount: string, message: string): Promise<void> {
  try {
    const senderKeypair = Keypair.fromSecret(senderSecretKey);
    const publicKey = senderKeypair.publicKey();

    const accountResponse = await getAccount(publicKey);

    const account = new Account(accountResponse.id, accountResponse.sequence);

    const transaction = new TransactionBuilder(account, {
      fee: '100',
      networkPassphrase,
    })
      .addOperation(Operation.payment({
        destination: recipientPublicKey,
        asset: Asset.native(),
        amount: amount,
      }))
      .addMemo(Memo.text(message))
      .setTimeout(30)
      .build();
    transaction.sign(senderKeypair);

    const response = await fetch('https://horizon-testnet.stellar.org/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ tx: transaction.toXDR() }),
    });

    const responseData = await response.json();

    if (response.ok) {
      console.log('Transfer successful:', responseData);
    } else {
      console.error('Transfer error:', responseData);
      throw new Error('Transfer failed');
    }
  } catch (error) {
    console.error('Transfer error:', error);
    throw new Error('Transfer failed');
  }
}

async function sendXLMToMultipleRecipients(
  senderSecretKey: string,
  recipients: { recipientPublicKey: string; amount: string; message?: string }[],
): Promise<void> {
  try {
    const senderKeypair = Keypair.fromSecret(senderSecretKey);
    console.log('senderKeypair publicKey', senderKeypair.publicKey());
    const publicKey = senderKeypair.publicKey();

    const accountResponse = await getAccount(publicKey);
    const account = new Account(accountResponse.id, accountResponse.sequence);

    const transactionBuilder = new TransactionBuilder(account, {
      fee: '100',
      networkPassphrase,
    });

    for (const recipient of recipients) {
      const amountString = recipient.amount.toString();
      transactionBuilder.addOperation(Operation.payment({
        destination: recipient.recipientPublicKey,
        asset: Asset.native(),
        amount: amountString,
      }));

      if (recipient.message) {
        transactionBuilder.addMemo(Memo.text(recipient.message));
      }
    }

    const transaction = transactionBuilder.setTimeout(30).build();
    transaction.sign(senderKeypair);

    const response = await fetch('https://horizon-testnet.stellar.org/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ tx: transaction.toXDR() }),
    });

    const responseData = await response.json();

    if (response.ok) {
      console.log('Transfer successful:', responseData);
    } else {
      console.error('Transfer error:', responseData);
      throw new Error('Transfer failed');
    }
  } catch (error) {
    console.error('Transfer error:', error);
    throw new Error('Transfer failed');
  }
}

async function getTransactionHistory(publicKey: string): Promise<TransactionRecord[]> {
  try {
    const response = await fetch(`https://horizon-testnet.stellar.org/accounts/${publicKey}/transactions`);
    if (!response.ok) {
      throw new Error('Transaction history could not be retrieved.');
    }
    const transactionData = await response.json() as { _embedded: { records: TransactionRecord[] } };
    return transactionData._embedded.records;
  } catch (error) {
    console.error('An error occurred while retrieving transaction history:', error);
    return [];
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

app.post('/sendXLM', async (req: Request, res: Response) => {
  try {
    const { senderSecretKey, recipientPublicKey, message } = req.body;
    let amount = req.body.amount;
    amount = amount.toString();
    const response = await sendXLM(senderSecretKey, recipientPublicKey, amount, message);
    res.status(200).send({ message: 'Transfer successful', response });
  } catch (error) {
    res.status(500).send({ message: 'Transfer failed', error });
  }
});
interface Recipient {
  recipientPublicKey: string;
  amount: string;
  message?: string;
}

app.post('/sendXLMToMultipleRecipients', async (req: Request, res: Response) => {
  try {
    const { senderSecretKey, recipients }: { senderSecretKey: string; recipients: Recipient[] } = req.body;
    const response = await sendXLMToMultipleRecipients(senderSecretKey, recipients);

    res.status(200).send({ message: 'Transfers successful', response });
  } catch (error) {
    res.status(500).send({ message: 'Error sendXLMToMultipleRecipients:', error });
  }
});


app.get('/transactionHistory', async (req: Request, res: Response) => {
  try {
    const { publicKey } = req.body;
    const transactions = await getTransactionHistory(publicKey);
    res.status(200).send({ transactions });
  } catch (error) {
    console.error('An error occurred while fetching transaction history:', error);
    res.status(500).send({ message: 'An error occurred while fetching transaction history.' });
  }
});


