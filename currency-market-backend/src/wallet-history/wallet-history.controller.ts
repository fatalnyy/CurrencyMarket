import { Controller, Get, Post, Param, Body, Query, HttpException, HttpStatus } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOperation, ApiResponse, ApiUseTags  } from '@nestjs/swagger';
import { ApiException } from '../shared/api-exception.model';
import { WalletHistory } from './models/wallet-history.model';
import { WalletHistoryService } from './wallet-history.service';
import { WalletHistoryVm } from './models/wallet-history-vm.model';

@Controller('wallet-history')
@ApiUseTags(WalletHistory.modelName)
export class WalletHistoryController {

    constructor(private readonly walletHistoryService: WalletHistoryService) {
    }

    @Get('getWalletHistory')
    @ApiResponse({status: 200})
    @ApiBadRequestResponse({ type: ApiException })
    @ApiOperation({ title: 'Get Wallets', description: 'Returns history wallet array object depends on given username and currency' })
    async getWalletHistory(@Query() query){
        return await this.walletHistoryService.getWalletHistory(query.username, query.currency);
    }

    @Post('addWalletHistory')
    @ApiResponse({status: 201})
    @ApiBadRequestResponse({ type: ApiException })
    @ApiOperation({ title: 'Add Wallet History', description: 'Add wallet history for given username and saves to database' })
    async addWalletHistory(@Body() vm: WalletHistoryVm){
        return await this.walletHistoryService.addWalletHistory(vm);
    }
}