import { Controller, Get, Post, Param, Body, Query, HttpException, HttpStatus } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOperation, ApiResponse, ApiUseTags  } from '@nestjs/swagger';
import { ApiException } from '../shared/api-exception.model';
import { WalletService } from './wallet.service';
import { WalletVm } from './models/view-models/wallet-vm.model';
import { Wallet } from './models/wallet.model';

@Controller('wallet')
@ApiUseTags(Wallet.modelName)
export class WalletController {

    constructor(private readonly walletService: WalletService) {
    }

    @Get('getWallets')
    @ApiResponse({status: 200})
    @ApiBadRequestResponse({ type: ApiException })
    @ApiOperation({ title: 'Get Wallets', description: 'Returns wallet array object depends on given username' })
    async getWallets(@Query() query){
        return await this.walletService.getWallets(query.username);
    }

    @Get('getWallet')
    @ApiResponse({status: 200})
    @ApiBadRequestResponse({ type: ApiException })
    @ApiOperation({ title: 'Get Wallet', description: 'Returns wallet object depends on given username and currency' })
    async getWallet(@Query() query){
        return await this.walletService.getWallet(query.username, query.currency);
    }

    @Post('addWallet')
    @ApiResponse({status: 201})
    @ApiBadRequestResponse({ type: ApiException })
    @ApiOperation({ title: 'Add Wallet', description: 'Add wallet for given username and saves to database' })
    async addWallet(@Body() vm: WalletVm){
        return await this.walletService.addWallet(vm);
    }
}
