import { AbstractControl } from '@angular/forms';

export class PasswordValidator {
  static MatchPassword(AC: AbstractControl): null | { matchPassword: boolean } {
    const password = AC.get('password').value;
    const confirmPassword = AC.get('matchingPassword').value;
    return password !== confirmPassword ? { matchPassword: true } : null;
  }

  static PasswordStrength(AC: AbstractControl): null | { passwordStrength: boolean } {
    const password = AC.value;
    if (!password) {
      return;
    }
    const match = password.match(/^(?=.*?[0-9]).{7,}$/);
    return match ? null : { passwordStrength: true };
  }
}
