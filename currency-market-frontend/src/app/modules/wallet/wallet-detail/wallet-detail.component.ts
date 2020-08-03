import { Component, OnInit, ChangeDetectorRef, ViewChild, AfterViewInit } from '@angular/core';
import { WalletService } from 'src/app/core/services/wallet.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { User } from 'src/app/shared/models/user.interface';
import { Wallet } from 'src/app/shared/models/wallet.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionsService } from 'src/app/core/services/transactions.service';
import { TransactionType } from 'src/app/helpers/enums/transaction-type.enum';
import { Transaction } from 'src/app/shared/models/transaction.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MdbTableDirective, MdbTablePaginationComponent } from 'angular-bootstrap-md';
import { BehaviorSubject } from 'rxjs';
import * as Chart from 'chart.js'
import { WalletHistory } from 'src/app/shared/models/wallet-history.interface';
import { WalletHistoryService } from 'src/app/core/services/wallet-history.service';

@Component({
  templateUrl: './wallet-detail.component.html',
  styleUrls: ['./wallet-detail.component.scss']
})
export class WalletDetailComponent implements OnInit, AfterViewInit {
  //private readonly user: User = this.authService.getUser();
  //username: string = this.user.username;
  wallet: Wallet;
  walletTransactions: Transaction[];
  walletHistory: any[] = [];
  walletTransactions$ = new BehaviorSubject<Transaction[]>([]);
  previous: Transaction[] = [];
  walletCurrency: string;
  walletTransactionsInfoDisplay = ['Nazwa transakcji', 'Kwota', 'Data'];
  operationType: string;
  operationAmount: number;
  ownedAmount: number;
  currencyCode: string;
  username: string;

  walletAmounts: number[] = [];
  walletDates: any[] = []; 
  canvas: any;
  ctx: any;
  myChart: Chart;
  @ViewChild(MdbTablePaginationComponent, { static: true }) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective;


  constructor(private route: ActivatedRoute,
    private router: Router,
    private readonly walletService: WalletService,
    private readonly transactionsService: TransactionsService,
    private readonly walletHistoryService: WalletHistoryService,
    private modalService: NgbModal,
    private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.currencyCode = this.route.snapshot.paramMap.get('currency');
    this.username = this.route.snapshot.paramMap.get('username');

    this.getWallet(this.username, this.currencyCode);
    this.getWalletTransactionsHistory(this.username, this.currencyCode);
    this.getWalletHistory(this.username, this.currencyCode);
  }

  ngAfterViewInit(): void {
    this.currencyCode = this.route.snapshot.paramMap.get('currency');
    this.mdbTablePagination.setMaxVisibleItemsNumberTo(5);
    this.mdbTablePagination.calculateFirstItemIndex();
    this.mdbTablePagination.calculateLastItemIndex();
    this.cdRef.detectChanges();

    this.canvas = document.getElementById('myChart');
    this.ctx = this.canvas.getContext('2d');
    this.generateWalletChart(this.ctx, this.currencyCode);


  }

  getWallet(username: string, currency: string): void{
    this.walletService.getWallet(username, currency).subscribe( wallet =>{
      this.wallet = wallet
      this.ownedAmount = wallet.amount
    });
  }

  getWalletTransactionsHistory(username: string, currencyCode: string){
    this.transactionsService.getWalletTransactions(username, currencyCode).subscribe(transactions =>{
      this.walletTransactions$.next(transactions);
      this.mdbTable.setDataSource(transactions);
      this.previous = transactions;
    });
  }

  manageWallet() {
    const manageWalletJson = {'username': this.username, 'currency': this.currencyCode, 'amount': this.operationAmount.toString(), 'type': this.operationType};

    this.transactionsService.makeTransaction(manageWalletJson).subscribe(response =>{
      this.getWallet(this.username, this.currencyCode);
      this.getWalletTransactionsHistory(this.username, this.currencyCode);
      this.getWalletHistory(this.username, this.currencyCode);
    });
  }

  getWalletHistory(username: string, currency: string) {
    this.walletHistoryService.getWalletHistory(username, currency).subscribe( walletHistory =>{
      this.walletHistory = walletHistory

      this.getWalletHistorySeries(walletHistory);
      this.myChart.data.datasets[0].data = this.walletHistory;
      this.myChart.update();
    });
  }

  getWalletHistorySeries(walletHistory: WalletHistory[]) {
    this.walletHistory = [];
    walletHistory.forEach(p => this.walletHistory.push({x: p.createdAt.toString(), y: p.amount}));
  }

  generateWalletChart(ctx, currency: string) {
    this.myChart = new Chart(ctx, {
      type: 'line',
      data: {
          datasets: [{
              label: 'Kwota',
              backgroundColor: "blue",
              borderColor: "lightblue",
              fill: false,
              lineTension: 0,
              radius: 5,
              borderWidth: 1,
              
          }]
      },
      options: {
        responsive: true,
        title: {
          display: true,
          position: "top",
          text: "Historia zmiany środków " + this.currencyCode +" Wallet",
          fontSize: 18,
          fontColor: "#111"
        },
        legend: {
          display: true,
          position: "bottom",
          labels: {
            fontColor: "#333",
            fontSize: 16
          }
        },
        scales:{
          xAxes: [{
            type: 'time',
            time: {
                unit: 'day'
            }
        }]
        }
      }
    });
  }

  open(content, operationType) {
    this.operationType = operationType;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
  }

  onBack(): void {
    this.router.navigate(['/wallets']);
  }
}
