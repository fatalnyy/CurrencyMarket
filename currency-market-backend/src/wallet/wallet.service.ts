import { HttpException, HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { BaseService } from '../shared/base.service';
import { Wallet } from './models/wallet.model';
import { InjectModel } from '@nestjs/mongoose';
import { InstanceType, ModelType } from 'typegoose';
import { WalletVm } from './models/view-models/wallet-vm.model';
import { WalletOperation } from './models/wallet-operation.enum';
import { EnumToArray } from 'src/shared/utilities/enum-to-array';

@Injectable()
export class WalletService extends BaseService<Wallet> {
    constructor(
        private readonly http: HttpService,
        @InjectModel(Wallet.modelName) private readonly _walletModel: ModelType<Wallet>) {
        super();
        this._model = _walletModel;
      }

      async getWallets(username: string): Promise<InstanceType<Wallet>[]>{
          return await this.findAll({ username });
      }

      async getWallet(username: string, currency: string): Promise<InstanceType<Wallet>>{
        try{
          const result = await this.findOne({ username: username, currency: currency });
          return result.toJSON() as InstanceType<Wallet>;
        }catch{
          throw new HttpException("Nie posiadasz portfela walutowego ".concat(currency), HttpStatus.NOT_FOUND);
        }
      }

      async addWallet(vm: WalletVm) {

        try {
            const {amount, currency, username, name} = vm;
            const newWallet = Wallet.createModel();

            newWallet.name = currency + " Wallet";
            newWallet.currency = currency;
            newWallet.amount = Number(amount);
            newWallet.username = username;

            const userWallets = await this.getWallets(username);
            let isDuplicated = this.isWalletDuplicated(userWallets, newWallet);
            if(!isDuplicated){
                await this.create(newWallet);
            }
            else {
              throw new HttpException("Posiadasz już portfel o takiej walucie!", HttpStatus.BAD_REQUEST);
            }
        }
        catch (e)
        {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }

      async updateWallet(wallet: InstanceType<Wallet>){
          try{
            wallet.amount = Number(wallet.amount.toFixed(2));
            const result = await this.update(wallet.id, wallet);
            return result.toJSON() as Wallet;
          }catch (e){
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
          }
      }

      isWalletDuplicated(wallets: InstanceType<Wallet>[], walletToCheck: Wallet): boolean {
        let isWalletDuplicated: boolean = false;
        wallets.forEach(wallet => {
          if (wallet.currency === walletToCheck.currency) {
            isWalletDuplicated = true;
          }
        });
        return isWalletDuplicated;
      }
}
