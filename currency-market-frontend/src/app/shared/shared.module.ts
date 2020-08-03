import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { FooterComponent } from './components/footer/footer.component';
import { MDBBootstrapModule, WavesModule } from 'angular-bootstrap-md';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [NavBarComponent, FooterComponent],
  imports: [
    CommonModule,
    MDBBootstrapModule,
    WavesModule,
    RouterModule,
  ],
  exports: [NavBarComponent, FooterComponent, MDBBootstrapModule, WavesModule]
})
export class SharedModule { }
