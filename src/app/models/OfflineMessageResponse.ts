import { Cat } from '../utils/protobuf/CatMessage';

export class OfflineMessageResponse {
  public id: string;
  public body: string;
  public sender: string;
  public receiver: string;
  public sendOn: Date;
  public type: Cat.MessageType;
}
