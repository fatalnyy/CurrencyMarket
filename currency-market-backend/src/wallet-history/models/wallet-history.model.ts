import { InstanceType, ModelType, prop } from 'typegoose';
import { BaseModel, schemaOptions } from '../../shared/base.model';

export class WalletHistory extends BaseModel {

    @prop()
    name: string;
    @prop()
    currency: string;
    @prop()
    amount: number;
    @prop()
    username: string;
    
    static get model(): ModelType<WalletHistory> {
        return new WalletHistory().getModelForClass(WalletHistory, { schemaOptions });
      }

      static get modelName(): string {
        return this.model.modelName;
      }
    
      static createModel(): InstanceType<WalletHistory> {
        return new this.model();
      }
}