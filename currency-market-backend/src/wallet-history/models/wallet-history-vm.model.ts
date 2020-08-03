import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

export class WalletHistoryVm{

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

  @ApiModelProperty({
    required: true,
  })
  name: string;

}
