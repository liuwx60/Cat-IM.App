import { Gender } from './Gender';

export class FriendFindResponse {
  public id: string;
  public nickName: string;
  public username: string;
  public gender: Gender;
  public isFriend: boolean;
}
