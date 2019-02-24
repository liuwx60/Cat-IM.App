import { Component } from '@angular/core';
import { LoginRequest } from '../models/login/LoginResquest';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: '../views/login.component.html',
  styleUrls: ['../styles/login.component.scss']
})
export class LoginComponent {
  request: LoginRequest = new LoginRequest();

  constructor(private loginService: LoginService) {

  }

  private login(): void {
    this.loginService.Login(this.request);
  }
}
