import { Component, OnInit } from '@angular/core';
import { FriendService } from '../utils/services/friend.service';
import { FriendResponse } from './models/FriendResponse';
import { WebSocketService } from '../utils/services/webSocket.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  friends: FriendResponse[] = [];

  constructor(
    private friendService: FriendService,
    private webSocket: WebSocketService
  ) {}

  ngOnInit(): void {
    this.getFriends();
    this.webSocket.connect();
  }

  getFriends(): void {
    this.friendService.get().subscribe(x => {
      this.friends = x;
    });
  }
}
