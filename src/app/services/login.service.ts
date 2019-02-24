import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { LoginRequest } from '../models/login/LoginResquest';
import { LoginResponse } from '../models/login/LoginResponse';
import { Router } from '@angular/router';

@Injectable()
export class LoginService {
  public username: string;
  public password: string;

  constructor(
    private http: HttpService,
    private router: Router
  ) { }

  public Login(request: LoginRequest): void {
    this.http.Post<LoginResponse>('/api/user/login', request).subscribe(response => {
      this.http.token = response.token;
      this.router.navigateByUrl('/');
    });
  }

  public Login1(): void {
    this.http.Post<LoginResponse>('/api/user/login', {
      username: this.username,
      password: this.password
    }).subscribe(response => {
      this.http.token = response.token;
      this.router.navigateByUrl('/');
    });
  }

  public log(): void {
    console.log(this);
  }
}
