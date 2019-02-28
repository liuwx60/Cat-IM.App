import { Injectable } from '@angular/core';
import { Cat } from '../protobuf/CatMessage';
import { HttpService } from './http.service';
import { SendMessageRequest } from 'src/app/main/models/SendMessageRequest';
import { Observable } from 'rxjs';

@Injectable()
export class ChatService {
  public messageRecord: Map<string, Cat.IChat[]> = new Map<string, Cat.IChat[]>();

  constructor(
    private http: HttpService
  ) {}

  public ping(input: Cat.CatMessage): void {
    console.log(input);
  }

  public send(data: SendMessageRequest): Observable<{}> {
    const messageList = this.messageRecord.get(data.receiver) || [];
    messageList.push({
      Id: data.id,
      Body: data.body,
      Sender: data.sender,
      Receiver: data.receiver,
      SendOn: data.sendOn.toString()
    });

    this.messageRecord.set(data.receiver, messageList);
    return this.http.post('/api/chat/sendMessage', data);
  }

  public chat(data: Cat.IChat): void {
    const messageList = this.messageRecord.get(data.Sender) || [];
    messageList.push(data);

    this.messageRecord.set(data.Sender, messageList);
  }
}
