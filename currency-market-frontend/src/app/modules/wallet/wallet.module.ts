import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletComponent } from './wallet.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { WalletDetailComponent } from './wallet-detail/wallet-detail.component';
import { RouterModule } from '@angular/router';
import { ModalContainerComponent } from 'angular-bootstrap-md';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [WalletComponent, WalletDetailComponent],
  imports: [
    CommonModule,
    SharedModule,
    CoreModule,
    RouterModule,
    NgbModule,
    FormsModule
  ],
  entryComponents: [WalletComponent],
  exports: [WalletComponent]
})
export class WalletModule { }
