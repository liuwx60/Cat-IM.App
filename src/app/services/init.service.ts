import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { FriendService } from './friend.service';
import { WebSocketService } from './webSocket.service';
import { DataService } from './data.service';
import { ChatService } from './chat.service';

@Injectable()
export class InitService {
  constructor(
    private userService: UserService,
    private friendService: FriendService,
    private webSocket: WebSocketService,
    private data: DataService,
    private chatService: ChatService
  ) {}

  public init(): void {
    if (!sessionStorage.getItem('token')) {
      return;
    }
    this.webSocket.connect();
    this.friendService.get();
    this.userService.get();

    window.onblur = () => {
      this.data.windowOut = true;
    };

    window.onfocus = () => {
      this.data.windowOut = false;
      this.chatService.clearChatCount(this.data.chatUserId);
    };
  }
}
