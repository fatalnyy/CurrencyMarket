import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public form: FormGroup;
  public sendingRequest = false;
  public loginFailure = false;

  constructor(private readonly formBuilder: FormBuilder, private readonly authService: AuthService, private readonly router: Router, private readonly toastr: ToastrService) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  login(): void {
    this.authService.login(this.form.value).subscribe(response => {
      this.authService.isUserLoggedIn.next(true);
      this.authService.saveToken(response.token);
      this.authService.saveUser(response.user);
      this.toastr.success('Poprawne logowanie', 'Sukces!');
      this.router.navigate(['/list']);
    }, error => {
      if (error.status === 400) {
        this.toastr.error('Złe dane logowania!', 'Spróbuj ponownie!');
      } else {
        this.toastr.error('Coś poszło nie tak!', 'Spróbuj ponownie lub skontaktuj się z supportem!')
      }
    })
  }

}
