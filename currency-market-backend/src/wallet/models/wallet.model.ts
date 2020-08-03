import { InstanceType, ModelType, prop } from 'typegoose';
import { BaseModel, schemaOptions } from '../../shared/base.model';

export class Wallet extends BaseModel {

    @prop()
    name: string;
    @prop()
    currency: string;
    @prop()
    amount: number;
    @prop()
    username: string;
    
    static get model(): ModelType<Wallet> {
        return new Wallet().getModelForClass(Wallet, { schemaOptions });
      }

      static get modelName(): string {
        return this.model.modelName;
      }
    
      static createModel(): InstanceType<Wallet> {
        return new this.model();
      }
}