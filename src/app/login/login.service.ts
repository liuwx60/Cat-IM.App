import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginRequest } from './models/LoginResquest';
import { LoginResponse } from './models/LoginResponse';
import { HttpService } from '../utils/services/http.service';

@Injectable()
export class LoginService {

  constructor(
    private http: HttpService,
    private router: Router
  ) { }

  public Login(request: LoginRequest): void {
    this.http.post<LoginResponse>('/api/user/login', request).subscribe(response => {
      sessionStorage.setItem('token', response.token);
      this.router.navigateByUrl('/');
    });
  }
}
