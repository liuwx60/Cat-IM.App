import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { SendMessageRequest } from '../models/SendMessageRequest';
import { DataService } from './data.service';
import { ILatelyChat } from '../models/LatelyChat';
import { IChatList } from '../models/ChatList';
import { PagedList } from '../models/PagedList';
import { OfflineMessageResponse } from '../models/OfflineMessageResponse';
import { ReceiveService } from './receive.service';
import { FileService } from './file.service';
import { ClientConfig } from '../utils/client-config';

@Injectable()
export class ChatService {

  constructor(
    private http: HttpService,
    private data: DataService,
    private receiverService: ReceiveService,
    private fileService: FileService
  ) { }

  public send(data: SendMessageRequest): void {
    const message: IChatList = {
      id: data.id,
      body: data.body,
      sender: data.sender,
      receiver: data.receiver,
      sendOn: data.sendOn,
      type: data.type,
      read: true,
      success: true,
      sending: true
    };

    this.receiverService.getMessageRecord(data.receiver).push(message);

    this.receiverService.pushLatelyChat(data.receiver, message);

    this.sendMessage(data, message);
  }

  public sendImg(data: SendMessageRequest, file: File, img: string): void {
    const message: IChatList = {
      id: data.id,
      body: img,
      sender: data.sender,
      receiver: data.receiver,
      sendOn: data.sendOn,
      type: data.type,
      read: true,
      success: true,
      sending: true
    };

    this.receiverService.getMessageRecord(data.receiver).push(message);

    this.receiverService.pushLatelyChat(data.receiver, message);

    this.fileService.exists(data.body).subscribe(res => {
      data.body = `${ClientConfig.imageUrl}/${data.body[0]}/${data.body[1]}/${data.body[2]}/${data.body}`;
      if (!res.exists) {
        this.fileService.image(file).subscribe(() => this.sendMessage(data, message));
        return;
      }

      this.sendMessage(data, message);
    });
  }

  public sendMessage(data: SendMessageRequest, message: IChatList): void {
    this.http.post('/api/chat/sendMessage', data).subscribe(() => {
      message.sending = false;
    }, () => {
      message.success = false;
      message.sending = false;
    });
  }

  public getLatelyChat(): void {
    this.data.latelyChats = (
      JSON.parse(
        localStorage.getItem(`${this.data.user.id}:latelyChat`) || '[]'
      ) as ILatelyChat[]
    ).map(x => {
      // tslint:disable-next-line:radix
      x.time = new Date(parseInt(localStorage.getItem(`${this.data.user.id}:latelyChat:time:${x.userId}`) || '0'));

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

  public getOfflineMsg(): void {
    this.http.get<PagedList<OfflineMessageResponse[]>>('/api/chat/offlineMessage').subscribe(x => {
      x.rows.forEach(msg => {
        const message: IChatList = {
          id: msg.id,
          body: msg.body,
          sender: msg.sender,
          receiver: msg.receiver,
          sendOn: msg.sendOn,
          type: msg.type,
          read: true,
          success: true,
          sending: false
        };

        this.receiverService.getMessageRecord(msg.sender).push(message);

        this.receiverService.pushLatelyChat(msg.sender, message);
      });

      if (x.total > 100) {
        this.getOfflineMsg();
      }
    });
  }
}
