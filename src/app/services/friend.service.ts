import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { FriendResponse } from '../models/FriendResponse';
import { DataService } from './data.service';
import { FriendFindResponse } from '../models/FriendFindResponse';
import { Observable } from 'rxjs';

@Injectable()
export class FriendService {

  constructor(
    private http: HttpService,
    private data: DataService
  ) {}

  public get(): void {
    this.http.get<FriendResponse[]>('/api/friend/get').subscribe(x => {
      this.data.friends = x;
      x.map(friend => {
        this.data.friendMap.set(friend.id, friend);
      });
    });
  }

  public find(username: string): Observable<FriendFindResponse> {
    return this.http.get<FriendFindResponse>(`/api/friend/find/${username}`);
  }

  public addFriend(id: string): Observable<{}> {
    return this.http.post(`/api/friend/add/${id}`, {});
  }
}
