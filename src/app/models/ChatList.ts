import { Cat } from '../utils/protobuf/CatMessage';

export interface IChatList {
  id: string;
  body: string;
  sender: string;
  receiver: string;
  sendOn: Date;
  type: Cat.MessageType;
  read: boolean;
  success: boolean;
  sending: boolean;
}
