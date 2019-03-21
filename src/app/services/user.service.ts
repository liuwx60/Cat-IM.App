import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { UserResponse } from '../models/UserResponse';
import { DataService } from './data.service';
import { ChatService } from './chat.service';
import { RegisterRequest } from '../models/RegisterRequest';
import { Router } from '@angular/router';
import { EditUserRequest } from '../models/EditUserRequest';
import { NzNotificationService } from 'ng-zorro-antd';
import { GetRouterResponse } from '../models/GetRouterResponse';
import { Observable } from 'rxjs';

@Injectable()
export class UserService {

  constructor(
    private http: HttpService,
    private data: DataService,
    private chatService: ChatService,
    private router: Router,
    private notification: NzNotificationService
  ) {}

  public get(): void {
    this.http.get<UserResponse>('/api/user/get').subscribe(x => {
      this.data.user = x;
      this.chatService.getLatelyChat();
    });
  }

  public register(request: RegisterRequest): void {
    this.http.post('/api/user/register', request).subscribe(() => {
      this.router.navigateByUrl('/login');
    });
  }

  public edit(request: EditUserRequest): void {
    this.http.put('/api/user/edit', request).subscribe(() => {
      this.data.user.nickName = request.nickName;
      this.data.user.gender = request.gender;
      this.notification.create('success', '成功', '保存成功！');
    });
  }

  public getRouter(): Observable<GetRouterResponse> {
    return this.http.get<GetRouterResponse>('/api/router/get');
  }
}
