import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Cat } from '../utils/protobuf/CatMessage';
import { ClientConfig } from '../utils/client-config';
import { NotificationService } from './notification.service';
import { FriendService } from './friend.service';
import { IChatList } from '../models/ChatList';

@Injectable()
export class ReceiveService {
  private contentMap: Map<Cat.MessageType, string> = new Map([
    [Cat.MessageType.IMG, '[图片]']
  ]);

  constructor(
    private data: DataService,
    private notificationService: NotificationService,
    private friendService: FriendService
  ) { }

  public chat(data: Cat.IChat, type: Cat.MessageType): void {
    const message: IChatList = {
      id: data.Info.Id,
      body: data.Body,
      sender: data.Info.Sender,
      receiver: data.Info.Receiver,
      sendOn: new Date(data.Info.SendOn),
      type,
      read: true,
      success: true,
      sending: false
    };

    this.getMessageRecord(data.Info.Sender).push(message);

    this.pushLatelyChat(data.Info.Sender, message);

    if (data.Info.Sender === this.data.chatUserId) {
      this.data.change.count++;
    }

    if (this.data.chatUserId === message.sender && this.data.windowOut) {
      this.notificationService.show(
        this.data.friendMap.get(message.sender).nickName,
        message.type === Cat.MessageType.CHAT ? message.body : this.contentMap.get(message.type),
        `${ClientConfig.avatarUrl}/${message.sender}?v=${this.data.v}`
      );
    }
  }

  public getMessageRecord(key: string): IChatList[] {
    const messageList = this.data.messageRecord.get(key);

    if (!messageList) {
      this.data.messageRecord.set(key, []);

      return this.data.messageRecord.get(key);
    }

    return messageList;
  }

  public pushLatelyChat(friendId: string, chat?: IChatList): void {
    const friend = this.data.friendMap.get(friendId);

    if (!friend) {
      return;
    }

    let newChat = false;
    const set = new Set([friend.id, ...this.data.latelyChats.map(x => x.userId)]);

    if (set.size !== this.data.latelyChatMap.size) {
      this.data.latelyChatMap.set(friend.id, {
        userId: friend.id,
        nickName: friend.nickName,
        body: null,
        count: 0,
        time: new Date()
      });

      newChat = true;
    }

    if (chat) {
      const latelyChat = this.data.latelyChatMap.get(friend.id);
      latelyChat.body = chat.type === Cat.MessageType.CHAT ? chat.body : this.contentMap.get(chat.type);
      latelyChat.count++;
      latelyChat.time = new Date(chat.sendOn);

      if (this.data.chatUserId === friend.id && !this.data.windowOut) {
        latelyChat.count = 0;
      }

      localStorage.setItem(`${this.data.user.id}:latelyChat:time:${friend.id}`, latelyChat.time.getTime().toString());
    }

    this.data.latelyChats = [];

    set.forEach(x => {
      this.data.latelyChats.push(this.data.latelyChatMap.get(x));
    });

    if (newChat) {
      localStorage.setItem(`${this.data.user.id}:latelyChat`, JSON.stringify(this.data.latelyChats));
    }
  }

  public addFriend(): void {
    this.friendService.get();
  }
}
