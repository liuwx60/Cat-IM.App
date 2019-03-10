import { Component, OnInit } from '@angular/core';
import { FriendService } from 'src/app/services/friend.service';
import { FriendFindResponse } from 'src/app/models/FriendFindResponse';
import { ClientConfig } from 'src/app/utils/client-config';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  avatarUrl = `${ClientConfig.baseUrl}/upload/avatar/`;
  isVisible = false;
  friend: FriendFindResponse;

  constructor(
    private friendService: FriendService,
    private notification: NzNotificationService
  ) { }

  ngOnInit(): void { }

  onSearch(username: string): void {
    this.friendService.find(username).subscribe(x => {
      this.friend = x;
      this.isVisible = true;
    });
  }

  handleCancel(): void {
    this.friend = null;
    this.isVisible = false;
  }

  addFriend(id: string): void {
    this.friendService.addFriend(id).subscribe(() => {
      this.friend = null;
      this.isVisible = false;
      this.friendService.get();

      this.notification.create('success', '成功', '添加好友成功');
    });
  }
}
