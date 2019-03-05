import { Injectable } from '@angular/core';
import { ChatService } from './chat.service';
import { Cat } from '../utils/protobuf/CatMessage';

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

  constructor(
    private chatService: ChatService
  ) {}

  public connect(): void {
    this.webSocket = new WebSocket('ws://127.0.0.1:8850/ws');
    this.webSocket.onopen = this.onOpen;
    this.webSocket.onclose = this.onClose;
    this.webSocket.onerror = this.onError;
    this.webSocket.onmessage = this.onMessage;
  }

  private onOpen = (event: Event): void => {
    event.preventDefault();
    console.log('webSocker连接成功！');
    this.ping();
    this.login();
  }

  private onMessage = (event: MessageEvent): void => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(event.data);
    reader.onload = () => {
      const buffer = new Uint8Array(reader.result as ArrayBuffer);
      const catMessage = Cat.CatMessage.decode(buffer);

      switch (catMessage.Type) {
        case Cat.CatMessage.MessageType.PING:
          this.chatService.ping(catMessage);
          break;
        case Cat.CatMessage.MessageType.CHAT:
          this.chatService.chat(catMessage.Chat);
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
    console.log('webSocket断开连接！Code：' + event.code);
  }

  private onError = (event: Event): void => {
    console.log('webSocket发生错误！');
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
