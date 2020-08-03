import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { SchemaOptions } from 'mongoose';
import { prop, Typegoose } from 'typegoose';

export class BaseModel extends Typegoose {
  @prop({default: Date.now()})
  createdAt?: Date;

  @prop({default: Date.now()})
  updatedAt?: Date;

  id?: string;
}

export class BaseModelVm {
  @ApiModelPropertyOptional({ type: String, format: 'date-time' })
  createdAt?: Date;

  @ApiModelPropertyOptional({ type: String, format: 'date-time' })
  updatedAt?: Date;

  @ApiModelPropertyOptional() id?: string;
}

export const schemaOptions: SchemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
};
