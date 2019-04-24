import { Component, OnInit } from '@angular/core';
import { FriendService } from 'src/app/services/friend.service';
import { FriendResponse } from 'src/app/models/FriendResponse';
import { ChatService } from 'src/app/services/chat.service';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { ClientConfig } from 'src/app/utils/client-config';
import { ReceiveService } from 'src/app/services/receive.service';

@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.scss']
})
export class FriendComponent implements OnInit {
  avatarUrl = ClientConfig.avatarUrl + '/';
  friend: FriendResponse = null;

  constructor(
    private friendService: FriendService,
    private chatService: ChatService,
    private router: Router,
    public data: DataService,
    private receiverService: ReceiveService
  ) { }

  ngOnInit(): void {
  }

  switchFriend(friend: FriendResponse): void {
    this.friend = friend;
  }

  sendMsg(): void {
    if (!this.friend) {
      return;
    }
    this.receiverService.pushLatelyChat(this.friend.id);
    this.data.chatUserId = this.friend.id;
    this.router.navigateByUrl('/main');
  }
}
