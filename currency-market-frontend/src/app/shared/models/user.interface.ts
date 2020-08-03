export interface User {
  username: string;
  password: string;
  passwordConfirmation?: string;
  firstName?: string;
  lastName?: string;
  role: string;
}
