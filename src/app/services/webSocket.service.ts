import { Injectable } from '@angular/core';
import { ChatService } from './chat.service';
import { Cat } from '../utils/protobuf/CatMessage';
import { UserService } from './user.service';
import { NzMessageService } from 'ng-zorro-antd';
import { concatMap } from 'rxjs/operators';

@Injectable()
export class WebSocketService {
  private webSocket: WebSocket;
  private timer;
  private pingMessage = Cat.CatMessage.create({
    Type: Cat.CatMessage.MessageType.PING,
    Ping: {
      Body: 'ping'
    }
  });
  private pingBuffer = Cat.CatMessage.encode(this.pingMessage).finish();

  private reConnectCount = 0;

  constructor(
    private chatService: ChatService,
    private userService: UserService,
    private message: NzMessageService
  ) {}

  public connect(router: string): void {
    this.webSocket = new WebSocket(`ws://${router}/ws`);
    this.webSocket.onopen = this.onOpen;
    this.webSocket.onclose = this.onClose;
    this.webSocket.onerror = this.onError;
    this.webSocket.onmessage = this.onMessage;
  }

  public close(): void {
    this.webSocket.close(1000);
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  private onOpen = (event: Event): void => {
    event.preventDefault();
    console.log('webSocker连接成功！');
    this.ping();
    this.login();
    this.chatService.getOfflineMsg();
  }

  private onMessage = (event: MessageEvent): void => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(event.data);
    reader.onload = () => {
      const buffer = new Uint8Array(reader.result as ArrayBuffer);
      const catMessage = Cat.CatMessage.decode(buffer);

      switch (catMessage.Type) {
        case Cat.CatMessage.MessageType.CHAT:
          this.chatService.chat(catMessage.Chat);
          break;
        case Cat.CatMessage.MessageType.ADD_FRIEND:
          this.chatService.addFriend();
          break;
        default:
          break;
      }
    };
  }

  private onClose = (event: CloseEvent): void => {
    if (this.timer) {
      clearInterval(this.timer);
    }

    if (event.code !== 1000 && this.reConnectCount < 5) {
      // tslint:disable-next-line:no-non-null-assertion
      this.message.create('error', '网络连接已断开！', { nzDuration: 2500 }).onClose!.pipe(
        concatMap(() => this.message.loading('连接中..', { nzDuration: 2500 }).messageId)
      ).subscribe();

      setTimeout(() => {
        this.userService.getRouter().subscribe(x => {
          this.connect(`${x.serviceAddress}:${x.servicePort}`);
          this.reConnectCount++;
        });
      }, 5000);

      return;
    }

    if (event.code !== 1000) {
      this.message.create('error', '网络连接已断开！', { nzDuration: 0 });
    }
  }

  private onError = (event: Event): void => {
    console.log('webSocket发生错误！', event);
  }

  private ping(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }

    this.timer = setInterval(() => {
      this.webSocket.send(this.pingBuffer);
    }, 13000);
  }

  private login(): void {
    const loginMessage = Cat.CatMessage.create({
      Type: Cat.CatMessage.MessageType.LOGIN,
      Login: {
        Token: sessionStorage.getItem('token')
      }
    });

    this.send(loginMessage);
  }

  public send(data: Cat.CatMessage): void {
    this.ping();
    this.webSocket.send(Cat.CatMessage.encode(data).finish());
  }
}
