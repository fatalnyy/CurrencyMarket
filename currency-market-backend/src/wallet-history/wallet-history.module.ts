import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WalletHistoryService } from './wallet-history.service';
import { WalletHistory } from './models/wallet-history.model';
import { WalletHistoryController } from './wallet-history.controller';


@Module({
  controllers: [WalletHistoryController],
  imports: [HttpModule, MongooseModule.forFeature([{name: WalletHistory.modelName, schema: WalletHistory.model.schema}])],
  providers: [WalletHistoryService],
  exports: [WalletHistoryService]
})
export class WalletHistoryModule {}