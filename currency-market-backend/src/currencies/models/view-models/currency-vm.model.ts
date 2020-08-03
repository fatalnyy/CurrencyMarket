import { ApiModelProperty } from '@nestjs/swagger';

export class CurrencyVm {
  @ApiModelProperty({
    required: true,
  })
  name: string;

  @ApiModelProperty({
    required: true,
  })
  code: string;
}
