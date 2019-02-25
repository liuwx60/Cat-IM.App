import { Injectable } from '@angular/core';
import { HttpService } from '../services/http.service';
import { Router } from '@angular/router';
import { LoginRequest } from './models/LoginResquest';
import { LoginResponse } from './models/LoginResponse';

@Injectable()
export class LoginService {

  constructor(
    private http: HttpService,
    private router: Router
  ) { }

  public Login(request: LoginRequest): void {
    this.http.post<LoginResponse>('/api/user/login', request).subscribe(response => {
      this.http.token = response.token;
      this.router.navigateByUrl('/');
    });
  }
}
