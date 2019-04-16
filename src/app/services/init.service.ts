import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { FriendService } from './friend.service';
import { WebSocketService } from './webSocket.service';
import { DataService } from './data.service';
import { ChatService } from './chat.service';
import { NotificationService } from './notification.service';

@Injectable()
export class InitService {
  constructor(
    private userService: UserService,
    private friendService: FriendService,
    private webSocket: WebSocketService,
    private data: DataService,
    private chatService: ChatService,
    private notificationService: NotificationService
  ) {}

  public init(): void {
    if (!sessionStorage.getItem('token')) {
      return;
    }
    this.userService.getRouter().subscribe(x => {
      this.webSocket.connect(`${x.serviceAddress}:${x.servicePort}`);
    });
    this.userService.get();
    this.friendService.get();
    this.notificationService.init();

    window.onblur = () => {
      this.data.windowOut = true;
    };

    window.onfocus = () => {
      this.data.windowOut = false;
      this.chatService.clearChatCount(this.data.chatUserId);
    };
  }
}
