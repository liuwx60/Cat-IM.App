import { Injectable } from '@angular/core';
import { IChatList } from '../models/ChatList';
import { ILatelyChat } from '../models/LatelyChat';
import { FriendResponse } from '../models/FriendResponse';
import { UserResponse } from '../models/UserResponse';

@Injectable()
export class DataService {
  public chatUserId: string = null;
  public messageRecord: Map<string, IChatList[]> = new Map<string, IChatList[]>();
  public latelyChats: ILatelyChat[] = [];
  public latelyChatMap: Map<string, ILatelyChat> = new Map<string, ILatelyChat>();

  public friendMap: Map<string, FriendResponse> = new Map<string, FriendResponse>();
  public friends: FriendResponse[] = [];

  public user: UserResponse = null;

  public windowOut: boolean;

  public change: { count: number } = { count: 1 };

  public v = localStorage.getItem('v');

  constructor() {}
}
