import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import {AuthService} from '../../core/services/auth.service';
import { User } from 'src/app/shared/models/user.interface';
import { TransactionsService } from 'src/app/core/services/transactions.service';
import { BehaviorSubject } from 'rxjs';
import { Transaction } from 'src/app/shared/models/transaction.interface';
import { MdbTablePaginationComponent, MdbTableDirective } from 'angular-bootstrap-md';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit, AfterViewInit {
  user: User = this.authService.getUser();
  transactions$ = new BehaviorSubject<Transaction[]>([]);
  previous: Transaction[] = [];
  transactionsInfoDisplay = ['Nazwa transakcji', 'Kwota', 'Data'];
  @ViewChild(MdbTablePaginationComponent, { static: true }) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective;

  constructor(private readonly authService: AuthService,
              private readonly transactionsService: TransactionsService,
              private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.getUserTransactions(this.user.username);
  }
  
  ngAfterViewInit(): void {
    this.mdbTablePagination.setMaxVisibleItemsNumberTo(10);
    this.mdbTablePagination.calculateFirstItemIndex();
    this.mdbTablePagination.calculateLastItemIndex();
    this.cdRef.detectChanges();
  }

  getUserTransactions(username: string) {
    this.transactionsService.getTransactionsByUsername(username).subscribe(transactions =>{
      this.transactions$.next(transactions);
      this.mdbTable.setDataSource(transactions);
      this.previous = transactions;
    })
  }

}
