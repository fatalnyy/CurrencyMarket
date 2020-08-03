import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  public readonly loggedIn$: Observable<boolean>;
  user = this.authService.getUser();
  mailText: string = "";

  constructor(private readonly authService: AuthService, private toastr: ToastrService) {
    this.loggedIn$ = this.authService.isLoggedIn();
  }

  mailTo(){
    this.mailText = "mailto:support@currencymarket.com?subject=Issue&body=";
    window.location.href = this.mailText;
  }


  ngOnInit() {
    this.loggedIn$.subscribe(logged => {
      if (!logged) {
        return;
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.toastr.success('Wylogowałeś się pomyślnie!', 'Sukces');
  }

}
