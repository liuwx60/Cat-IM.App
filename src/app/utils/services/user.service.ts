import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { UserResponse } from 'src/app/main/models/UserResponse';
import { Observable } from 'rxjs';

@Injectable()
export class UserService {

  constructor(
    private http: HttpService
  ) {}

  public get(): Observable<UserResponse> {
    return this.http.get<UserResponse>('/api/user/get');
  }
}
