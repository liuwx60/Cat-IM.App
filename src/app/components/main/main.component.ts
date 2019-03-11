import { Component, OnInit } from '@angular/core';
import { FriendResponse } from 'src/app/models/FriendResponse';
import { UserResponse } from 'src/app/models/UserResponse';
import { FriendService } from 'src/app/services/friend.service';
import { UserService } from 'src/app/services/user.service';
import { ChatService } from 'src/app/services/chat.service';
import { SendMessageRequest } from 'src/app/models/SendMessageRequest';
import { DataService } from 'src/app/services/data.service';
import { ClientConfig } from 'src/app/utils/client-config';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  sendContent: string;
  avatarUrl = ClientConfig.avatarUrl + '/';

  constructor(
    private friendService: FriendService,
    private userService: UserService,
    private chatService: ChatService,
    private data: DataService
  ) {}

  ngOnInit(): void {
  }

  switchChat(userId: string): void {
    this.data.chatUserId = userId;
    this.chatService.clearChatCount(userId);
  }

  send(): void {
    const sendMsg = new SendMessageRequest();
    sendMsg.body = this.sendContent;
    sendMsg.sender = this.data.user.id;
    sendMsg.receiver = this.data.chatUserId;
    sendMsg.sendOn = new Date();

    this.chatService.send(sendMsg);

    this.sendContent = '';
  }
}
