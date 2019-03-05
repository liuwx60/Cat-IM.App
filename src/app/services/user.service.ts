import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { UserResponse } from '../models/UserResponse';
import { DataService } from './data.service';
import { ChatService } from './chat.service';

@Injectable()
export class UserService {

  constructor(
    private http: HttpService,
    private data: DataService,
    private chatService: ChatService
  ) {}

  public get() {
    return this.http.get<UserResponse>('/api/user/get').subscribe(x => {
      this.data.user = x;
      this.chatService.getLatelyChat();
    });
  }
}
