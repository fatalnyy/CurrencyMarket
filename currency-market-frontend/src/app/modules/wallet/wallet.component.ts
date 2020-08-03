import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { WalletService } from 'src/app/core/services/wallet.service';
import { Wallet } from 'src/app/shared/models/wallet.interface';
import { MdbTableDirective, MDBModalRef, MDBModalService, ModalContainerComponent } from 'angular-bootstrap-md';
import { AuthService } from 'src/app/core/services/auth.service';
import { User } from 'src/app/shared/models/user.interface';
import { CurrenciesService } from 'src/app/core/services/currencies.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';


@Component({
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {
  username: string = this.authService.getUser().username;
  wallets: Wallet[];
  walletsInfoDisplay: string[] = ['Nazwa', 'Waluta', 'Kwota', 'Szczegóły'];
  uniqueCurrencies: string[];
  newWalletName: string;
  newWalletCurrency: string;
  @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective;
  constructor(private readonly walletService: WalletService,
              private readonly authService: AuthService,
              private readonly currenciesService: CurrenciesService,
              private modalService: NgbModal,
              private toastr: ToastrService) { }

  ngOnInit() {
    this.getWallets();

    this.currenciesService.getUniqueCurrencies().subscribe(response =>{
      this.uniqueCurrencies = response;
    })
  }

  getWallets() {
    this.walletService.getWallets(this.username).subscribe(response => {
      this.wallets = response;
    });
  }

  addWallet() {
    const walletJson: Wallet = {username: this.username, name: this.newWalletName, currency: this.newWalletCurrency, amount: 0};
    this.walletService.addWallet(walletJson).subscribe(response => {
      this.getWallets();
      this.toastr.success('Poprawnie dodany portfel!', 'Sukces!');
      this.modalService.dismissAll();
    }, error => {
        this.toastr.error(error.error.message, 'Problem!');
    });
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
  }
}
