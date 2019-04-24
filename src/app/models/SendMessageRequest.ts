import { Cat } from '../utils/protobuf/CatMessage';

export class SendMessageRequest {
  constructor() {
    this.id = this.GUID();
  }
  public id: string;
  public body: string;
  public sender: string;
  public receiver: string;
  public sendOn: Date;
  public type: Cat.MessageType;

  private S4() {
    // tslint:disable-next-line:no-bitwise
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }

  private GUID() {
    return (this.S4() + this.S4() + '-' + this.S4() + '-' + this.S4() + '-' + this.S4() + '-' + this.S4() + this.S4() + this.S4());
  }
}
