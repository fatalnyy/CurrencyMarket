import { InstanceType, ModelType, prop } from 'typegoose';
import { BaseModel, schemaOptions } from '../../shared/base.model';

export class Currency extends BaseModel {
  @prop({
    required: [true, 'Name is required']
  })
  name: string;

  @prop({
    required: [true, 'Symbol is required'],
  })
  code: string;

  @prop()
  rank: number;

  @prop()
  mid: number;

  @prop()
  bid: number;

  @prop()
  ask: number;

  static get model(): ModelType<Currency> {
    return new Currency().getModelForClass(Currency, { schemaOptions });
  }

  static get modelName(): string {
    return this.model.modelName;
  }

  static createModel(): InstanceType<Currency> {
    return new this.model();
  }
}
