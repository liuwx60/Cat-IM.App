import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { FriendResponse } from 'src/app/main/models/FriendResponse';
import { Observable } from 'rxjs';

@Injectable()
export class FriendService {

  constructor(private http: HttpService) {}

  public get(): Observable<FriendResponse[]> {
    return this.http.get<FriendResponse[]>('/api/friend/get');
  }
}
