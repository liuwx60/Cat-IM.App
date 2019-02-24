import { Component } from '@angular/core';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-main',
  templateUrl: '../views/main.component.html'
})
export class MainComponent {

  constructor(private loginService: LoginService) {}
}
