import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { getFormErrors } from '../../helpers/get-form-errors';
import { PasswordValidator } from '../../core/validators/password.validator';
import { User } from '../../shared/models/user.interface';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public form: FormGroup;
  public getErrors = getFormErrors;
  public sendingRequest = false;
  private defaultRole = 'User';

  constructor(private readonly formBuilder: FormBuilder, private readonly authService: AuthService, private readonly router: Router, private readonly toastr: ToastrService) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required]],
      passwordForm: this.formBuilder.group(
        {
          password: ['', [Validators.required, PasswordValidator.PasswordStrength]],
          matchingPassword: ['', Validators.required]
        },
        { validator: PasswordValidator.MatchPassword }
      )
    });
  }

  register(): void {
    const userToRegister = {username: this.form.value.username, password: this.form.value.passwordForm.password, role: this.defaultRole};
    this.authService.register(userToRegister).subscribe(response => {
      if (response) {
        this.authService.login({username: response.username, password: this.form.value.passwordForm.password}).subscribe(user => {
          this.authService.isUserLoggedIn.next(true);
          this.authService.saveToken(user.token);
          this.authService.saveUser(user.user);
          this.toastr.success('Poprawnie stworzyłeś konto!', 'Sukces!');
          this.router.navigate(['/list']);
        })
      }
    }, error => {
      if (error.status === 400) {
        this.toastr.error('Użytkownik o wybranej nazwie już istnieje!', 'Problem!');
      }
    });
  }

  get username() { return this.form.get('username'); }
  get password() { return this.form.get('password'); }
}
