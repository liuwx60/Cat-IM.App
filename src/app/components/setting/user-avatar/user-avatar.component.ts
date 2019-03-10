import { Component, OnInit } from '@angular/core';
import { ClientConfig } from 'src/app/utils/client-config';
import { DataService } from 'src/app/services/data.service';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { Observable, Observer } from 'rxjs';

@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss']
})
export class UserAvatarComponent implements OnInit {
  loading = false;
  avatarUrl: string;
  actionUrl = `${ClientConfig.baseUrl}/api/user/upload/avatar`;

  constructor(
    private data: DataService,
    private msg: NzMessageService
  ) { }

  ngOnInit(): void {
    this.avatarUrl = `${ClientConfig.baseUrl}/upload/avatar/${this.data.user.id}.jpg`;
  }

  beforeUpload = (file: File) => {
    return new Observable((observer: Observer<boolean>) => {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJPG) {
        this.msg.error('You can only upload JPG file!');
        observer.complete();
        return;
      }
      const isLtdot5M = file.size / 1024 / 1024 < 0.5;
      if (!isLtdot5M) {
        this.msg.error('Image must smaller than .5MB!');
        observer.complete();
        return;
      }

      observer.next(isJPG && isLtdot5M);
      observer.complete();
    });
  }

  headers = () => {
    return {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`
    };
  }

  handleChange(info: { file: UploadFile }): void {
    switch (info.file.status) {
      case 'uploading':
        this.loading = true;
        break;
      case 'done':
        // Get this url from response in real world.
        // this.getBase64(info.file.originFileObj, (img: string) => {
        //   this.avatarUrl = img;
        // });
        this.avatarUrl = `${ClientConfig.baseUrl}/upload/avatar/${this.data.user.id}.jpg?v=${Math.random()}`;
        this.loading = false;
        break;
      case 'error':
        this.msg.error('Network error');
        this.loading = false;
        break;
    }
  }
}
