import { Component, OnInit } from '@angular/core';
import { FriendService } from 'src/app/services/friend.service';
import { FriendResponse } from 'src/app/models/FriendResponse';
import { ChatService } from 'src/app/services/chat.service';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.scss']
})
export class FriendComponent implements OnInit {
  friend: FriendResponse = null;

  constructor(
    private friendService: FriendService,
    private chatService: ChatService,
    private router: Router,
    private data: DataService
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
    this.chatService.pushLatelyChat(this.friend);
    this.data.chatUserId = this.friend.id;
    this.router.navigateByUrl('/main');
  }
}
