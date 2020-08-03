import { InstanceType, ModelType, prop } from 'typegoose';
import { BaseModel, schemaOptions } from '../../shared/base.model';
import { TransactionType} from './transactions.enum';

export class Transaction extends BaseModel {

    @prop()
    name: string;
    @prop()
    type: TransactionType;
    @prop()
    exchange: number;
    @prop()
    amount: number;
    @prop()
    username: string;

    static get model(): ModelType<Transaction> {
        return new Transaction().getModelForClass(Transaction, { schemaOptions });
      }

      static get modelName(): string {
        return this.model.modelName;
      }
    
      static createModel(): InstanceType<Transaction> {
        return new this.model();
      }
}