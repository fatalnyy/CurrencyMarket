import { HttpModule, Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction } from './models/transaction.model';
import { WalletModule } from '../wallet/wallet.module';
import { CurrenciesModule } from '../currencies/currencies.module';
import { WalletHistoryModule } from '../wallet-history/wallet-history.module';

@Module({
  controllers: [TransactionsController],
  imports: [HttpModule, MongooseModule.forFeature([{name: Transaction.modelName, schema: Transaction.model.schema}]), CurrenciesModule, WalletModule, WalletHistoryModule],
  providers: [TransactionsService]
})
export class TransactionsModule {}