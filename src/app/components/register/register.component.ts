import { Component, OnInit } from '@angular/core';
import { RegisterRequest } from 'src/app/models/RegisterRequest';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  form: RegisterRequest = new RegisterRequest();

  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void { }

  submitForm(): void {
    this.userService.register(this.form);
  }
}
