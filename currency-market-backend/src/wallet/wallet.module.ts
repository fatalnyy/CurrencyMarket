import { HttpModule, Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Wallet } from './models/wallet.model';

@Module({
  controllers: [WalletController],
  imports: [HttpModule, MongooseModule.forFeature([{name: Wallet.modelName, schema: Wallet.model.schema}])],
  providers: [WalletService],
  exports: [WalletService]
})
export class WalletModule {}