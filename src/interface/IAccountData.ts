import { IBalance } from "./IBalance";

export interface IAccountData {
    id: string;
    account_id: string;
    sequence: string;
    balances: IBalance[];
}