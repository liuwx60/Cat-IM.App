import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { LoginRequest } from '../../models/LoginResquest';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form: LoginRequest = new LoginRequest();

  constructor(private loginService: LoginService) {

  }

  submitForm(): void {
    this.loginService.Login(this.form);
  }
}
