import { Injectable } from '@angular/core';
import { Cat } from '../protobuf/CatMessage';

@Injectable()
export class WebSocketService {
  private webSocket: WebSocket;

  constructor() {}

  public connect(): void {
    this.webSocket = new WebSocket('ws://127.0.0.1:8850/ws');
    this.webSocket.onopen = this.onOpen;
    this.webSocket.onclose = this.onClose;
    this.webSocket.onerror = this.onError;
  }

  private onOpen = (event: Event) => {
    event.preventDefault();
    console.log('webSocker连接成功！');

    const ping = Cat.CatMessage.create({
      Type: Cat.CatMessage.MessageType.PING,
      Ping: {
        Body: 'ping'
      }
    });

    setInterval(() => {
      this.send(ping);
    }, 1300);
  }

  private onClose(event: CloseEvent): void {
    console.log('webSocket断开连接！Code：' + event.code);
  }

  private onError(event: Event): void {
    console.log('webSocket发生错误！');
  }

  public send(data: Cat.CatMessage): void {
    console.log(data);
    this.webSocket.send(Cat.CatMessage.encode(data).finish());
  }
}
