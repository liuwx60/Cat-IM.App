import { Component, OnInit } from '@angular/core';
import { FriendService } from '../utils/services/friend.service';
import { FriendResponse } from './models/FriendResponse';
import { WebSocketService } from '../utils/services/webSocket.service';
import { UserService } from '../utils/services/user.service';
import { UserResponse } from './models/UserResponse';
import { ChatService } from '../utils/services/chat.service';
import { SendMessageRequest } from './models/SendMessageRequest';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  friends: FriendResponse[] = [];
  selectUserId: string = null;
  user: UserResponse;
  sendContent: string;

  constructor(
    private friendService: FriendService,
    private webSocket: WebSocketService,
    private userService: UserService,
    private chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.getUser();
    this.getFriends();
    this.webSocket.connect();
  }

  getUser(): void {
    this.userService.get().subscribe(x => {
      this.user = x;
    });
  }

  getFriends(): void {
    this.friendService.get().subscribe(x => {
      this.friends = x;
    });
  }

  switchChat(userId: string): void {
    this.selectUserId = userId;
  }

  send(): void {
    const sendMsg = new SendMessageRequest();
    sendMsg.body = this.sendContent;
    sendMsg.sender = this.user.id;
    sendMsg.receiver = this.selectUserId;
    sendMsg.sendOn = new Date();

    this.chatService.send(sendMsg).subscribe(() => {
      console.log('asdasd');
    });

    this.sendContent = '';
  }
}
