import { Component } from '@angular/core';
import { LoginService } from './login.service';
import { LoginRequest } from './models/LoginResquest';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form: LoginRequest = new LoginRequest();

  constructor(private loginService: LoginService) {

  }

  private submitForm(): void {
    this.loginService.Login(this.form);
  }
}
