import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Cat } from '../utils/protobuf/CatMessage';
import { SendMessageRequest } from '../models/SendMessageRequest';
import { FriendResponse } from '../models/FriendResponse';
import { DataService } from './data.service';
import { ILatelyChat } from '../models/LatelyChat';
import { IChatList } from '../models/ChatList';

@Injectable()
export class ChatService {

  constructor(
    private http: HttpService,
    private data: DataService
  ) {}

  public ping(input: Cat.CatMessage): void {
    console.log(input);
  }

  public send(data: SendMessageRequest): void {
    const messageList = this.data.messageRecord.get(data.receiver) || [];

    const message: IChatList = {
      id: data.id,
      body: data.body,
      sender: data.sender,
      receiver: data.receiver,
      sendOn: data.sendOn,
      read: true,
      success: true,
      sending: true
    };

    messageList.push(message);

    this.data.messageRecord.set(data.receiver, messageList);
    this.pushLatelyChat(this.data.friendMap.get(data.receiver), {
      Id: data.id,
      Body: data.body,
      Sender: data.receiver,
      Receiver: data.receiver,
      SendOn: data.sendOn.toString()
    });

    this.http.post('/api/chat/sendMessage', data).subscribe(() => {
      message.sending = false;
    }, () => {
      message.success = false;
    });
  }

  public chat(data: Cat.IChat): void {
    const messageList = this.data.messageRecord.get(data.Sender) || [];

    messageList.push({
      id: data.Id,
      body: data.Body,
      sender: data.Sender,
      receiver: data.Receiver,
      sendOn: new Date(data.SendOn),
      read: true,
      success: true,
      sending: false
    });

    this.data.messageRecord.set(data.Sender, messageList);

    this.pushLatelyChat(this.data.friendMap.get(data.Sender), data);
  }

  public pushLatelyChat(friend: FriendResponse, chat?: Cat.IChat): void {
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
      latelyChat.body = chat.Body;
      latelyChat.count++;
      latelyChat.time = new Date(chat.SendOn);

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

  public getLatelyChat(): void {
    this.data.latelyChats = (
      JSON.parse(
        localStorage.getItem(`${this.data.user.id}:latelyChat`) || '[]'
      ) as ILatelyChat[]
    ).map(x => {
      // tslint:disable-next-line:radix
      x.time = new Date(parseInt(localStorage.getItem(`${this.data.user.id}:latelyChat:time:${x.userId}`)));
      return x;
    }).sort((a, b) => {
      return b.time.getTime() - a.time.getTime();
    });

    this.data.latelyChats.forEach(x => {
      x.count = 0;
      x.body = '';
      this.data.latelyChatMap.set(x.userId, x);
    });
  }

  public clearChatCount(userId: string): void {
    if (!userId) {
      return;
    }

    const latelyChat = this.data.latelyChatMap.get(userId);

    if (latelyChat.count === 0) {
      return;
    }

    latelyChat.count = 0;
  }
}
