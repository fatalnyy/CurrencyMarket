import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { TransactionType } from '../transactions.enum';
import { BaseModelVm } from 'src/shared/base.model';

export class TransactionVm{

  @ApiModelPropertyOptional()
  name: string;

  @ApiModelProperty({
    required: true,
  })
  type: TransactionType;

  @ApiModelProperty({
    required: true,
  })
  amount: string;

  @ApiModelProperty({
    required: true,
  })
  username: string;

  @ApiModelPropertyOptional()
  currency: string;

  @ApiModelPropertyOptional()
  exchange: string;

  @ApiModelPropertyOptional()
    ownedCurrency: string;

  @ApiModelPropertyOptional()
    obtainedCurrency: string;
}
