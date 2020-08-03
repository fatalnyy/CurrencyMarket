import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { WalletOperation } from '../wallet-operation.enum';

export class WalletVm{

  @ApiModelProperty({
    required: true,
  })
  currency: string;

  @ApiModelProperty({
    required: true,
  })
  amount: string;

  @ApiModelProperty({
    required: true,
  })
  username: string;

  @ApiModelPropertyOptional()
  name: string;

  @ApiModelPropertyOptional()
  operation: WalletOperation;
}
