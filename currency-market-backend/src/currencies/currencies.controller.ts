import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { ApiException } from '../shared/api-exception.model';
import { CurrenciesService } from './currencies.service';
import { Currency } from './models/currency.model';

@Controller('currencies')
@ApiUseTags(Currency.modelName)
export class CurrenciesController {

  constructor(private readonly currenciesService: CurrenciesService) {
  }

  @Post('saveAll')
  @ApiResponse({ status: 201 })
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation({ title: 'Save currencies', description: 'Save current currencies from nbp to the database' })
  async saveAll() {
    return await this.currenciesService.saveCurrencies();
  }

  @Get('getCurrency')
  @ApiResponse({status: 200})
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation({ title: 'Get currency', description: 'Returns currency object depends on given code' })
  async getCurrency(@Query() query) {
    return await this.currenciesService.getCurrency(query.code);
  }

  @Get('fetchAll')
  @ApiResponse({ status: 200 })
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation({ title: 'Fetch currencies', description: 'Fetch all currencies from the database' })
  async fetchAll() {
   return await this.currenciesService.getAll();
  }

  @Get('getLatestCurrencies')
  @ApiResponse({ status: 200 })
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation({ title: 'Get latest currencies', description: 'Get all latest currencies from database' })
  async getLatestCurrencies() {
   return await this.currenciesService.getLatestCurrencies();
  }

  @Get('getLatestCurrency')
  @ApiResponse({ status: 200 })
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation({ title: 'Get latest currencies', description: 'Get latest currency from database (query parameter -> code)' })
  async getLatestCurrency(@Query() query) {
   return await this.currenciesService.getLatestCurrency(query.code);
  }

  @Get('getperiodicCurrencies')
  @ApiResponse({ status: 200 })
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation({ title: 'Get today currencies', description: 'Get periodic currencies data from database (query parameter -> code, period. Ex. period = 0 -> today currencies)' })
  async getTodaysCurrencies(@Query() query) {
   return await this.currenciesService.getPeriodicCurrencies(query.code, query.period);
  }

  @Get('getLatestToPreviousCurrencyRatio')
  @ApiResponse({ status: 200 })
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation({ title: 'Get latest to previous currency ratio', description: 'Get latest to previous currency ratio with its growth. (query parameter -> code)' })
  async getLatestToPreviousCurrencyRatio(@Query() query) {
   return await this.currenciesService.getLatestToPreviousCurrencyRatio(query.code);
  }

  @Get('getMonthlyCurrencyArray')
  @ApiResponse({ status: 200 })
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation({ title: 'Get monthly currency array', description: 'Get monthly currency array for given query paramaters -> code, month' })
  async getMonthlyCurrencyArray(@Query() query) {
   return await this.currenciesService.getMonthlyCurrencyArray(query.code, query.month);
  }

  @Get('getUniqueCurrencies')
  @ApiResponse({ status: 200 })
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation({ title: 'Get unique currencies', description: 'Get unique currencies from database' })
  async getUniqueCurrencies() {
   return await this.currenciesService.getUniqueCurrencies();
  }

  @Get('getCurrencyHistory')
  @ApiResponse({ status: 200 })
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation({ title: 'Get history of currency', description: 'Get history of currency from database' })
  async getCurrencyHistory(@Query() query) {
   return await this.currenciesService.getCurrencyHistory(query.code);
  }
}
