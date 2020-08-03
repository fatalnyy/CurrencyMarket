import { HttpException, HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { BaseService } from '../shared/base.service';
import { InjectModel } from '@nestjs/mongoose';
import { InstanceType, ModelType } from 'typegoose';
import { WalletHistory } from './models/wallet-history.model';
import { WalletHistoryVm } from './models/wallet-history-vm.model';

@Injectable()
export class WalletHistoryService extends BaseService<WalletHistory> {
    constructor(
        private readonly http: HttpService,
        @InjectModel(WalletHistory.modelName) private readonly _walletModel: ModelType<WalletHistory>) {
        super();
        this._model = _walletModel;
      }

    async getWalletHistory(username: string, currency: string): Promise<InstanceType<WalletHistory>[]>{
        try{
            return await this.findAll({ username, currency: currency });
        }
        catch (e){
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);     
        }
    }

    async addWalletHistory(vm: WalletHistoryVm): Promise<WalletHistory> {
        try {
            const {amount, currency, username, name} = vm;
            const newWalletHistory = WalletHistory.createModel();

            newWalletHistory.name = name;
            newWalletHistory.currency = currency;
            newWalletHistory.amount = Number(amount);
            newWalletHistory.username = username;
            newWalletHistory.createdAt = new Date();
            newWalletHistory.updatedAt = new Date();

            const result = await this.create(newWalletHistory);
            return result.toJSON() as WalletHistory;
        }
        catch (e)
        {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }
}