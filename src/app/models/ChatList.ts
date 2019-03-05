export interface IChatList {
  id: string;
  body: string;
  sender: string;
  receiver: string;
  sendOn: Date;
  read: boolean;
  success: boolean;
  sending: boolean;
}
