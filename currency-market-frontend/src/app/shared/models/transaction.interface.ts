import { TransactionType } from '../../helpers/enums/transaction-type.enum';

export interface Transaction {
  createdAt?: Date;
  updatedAt?: Date;
  name?: string;
  currency: string;
  type: TransactionType;
  exchange: number;
  amount: number;
  username: string;
  ownedCurrency: string;
  obtainedCurrency: string;
}
