import { HttpModule, Module } from '@nestjs/common';
import { CurrenciesController } from './currencies.controller';
import { CurrenciesService } from './currencies.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Currency } from './models/currency.model';

@Module({
  controllers: [CurrenciesController],
  imports: [HttpModule, MongooseModule.forFeature([{name: Currency.modelName, schema: Currency.model.schema}])],
  providers: [CurrenciesService],
  exports : [CurrenciesService]
})
export class CurrenciesModule {}
