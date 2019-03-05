import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from './http.service';
import { LoginRequest } from '../models/LoginResquest';
import { LoginResponse } from '../models/LoginResponse';
import { InitService } from './init.service';

@Injectable()
export class LoginService {

  constructor(
    private http: HttpService,
    private router: Router,
    private initService: InitService
  ) { }

  public Login(request: LoginRequest): void {
    this.http.post<LoginResponse>('/api/user/login', request).subscribe(response => {
      sessionStorage.setItem('token', response.token);
      this.router.navigateByUrl('/');
      this.initService.init();
    });
  }
}
