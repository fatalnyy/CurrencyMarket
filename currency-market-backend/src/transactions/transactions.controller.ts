import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { ApiException } from '../shared/api-exception.model';
import { TransactionsService } from './transactions.service';
import { TransactionVm } from './models/view-models/transaction-vm.model';
import { Transaction } from './models/transaction.model';


@Controller('transactions')
@ApiUseTags(Transaction.modelName)
export class TransactionsController {

    constructor(private readonly transactionsService: TransactionsService) {
    }
    

    @Get('getTransactions')
    @ApiResponse({status: 200})
    @ApiBadRequestResponse({ type: ApiException })
    @ApiOperation({ title: 'Get Transactions', description: 'Returns transaction object depends on given username' })
    async getTransactions(@Query() query) {
      return await this.transactionsService.getTransactions(query.username);
    }

    @Get('getTransactionsType')
    @ApiResponse({status: 200})
    @ApiBadRequestResponse({ type: ApiException })
    @ApiOperation({ title: 'Get Transactions', description: 'Returns transactions object depends on given username and type' })
    async getTransactionsType(@Query() query) {
      return await this.transactionsService.getTransactionsType(query.username, query.type);
    }

    @Get('getWalletTransactions')
    @ApiResponse({status: 200})
    @ApiBadRequestResponse({ type: ApiException })
    @ApiOperation({ title: 'Get Wallet Transactions', description: 'Returns wallet transactions object depends on given username' })
    async getWalletTransactions(@Query() query) {
      return await this.transactionsService.getWalletTransactions(query.username, query.code);
    }

    @Get('getManageWalletTransactions')
    @ApiResponse({status: 200})
    @ApiBadRequestResponse({ type: ApiException })
    @ApiOperation({ title: 'Get Manage Wallet Transactions', description: 'Returns manage wallet transactions object depends on given username' })
    async getManageWalletTransactions(@Query() query) {
      return await this.transactionsService.getManageWalletTransactions(query.username, query.code);
    }

    @Get('fetchAll')
    @ApiResponse({ status: 200 })
    @ApiBadRequestResponse({ type: ApiException })
    @ApiOperation({ title: 'Fetch transactions', description: 'Fetch all transactions from the database' })
    async fetchAll(){
        return await this.transactionsService.getAll();
    }

    @Post('makeTransaction')
    @ApiResponse({ status: 201 })
    @ApiBadRequestResponse({ type: ApiException })
    @ApiOperation({ title: 'Save transaction', description: 'Save transaction to the database' })
    async makeTransaction(@Body() vm: TransactionVm) {
        return await this.transactionsService.makeTransaction(vm);
    }

    @Post('saveTransaction')
    @ApiResponse({ status: 201 })
    @ApiBadRequestResponse({ type: ApiException })
    @ApiOperation({ title: 'Save transaction', description: 'Save transaction to the database' })
    async saveTransaction(@Body() vm: TransactionVm) {
        return await this.transactionsService.saveTransaction(vm);
    }
}