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
  actionUrl = ClientConfig.uploadUrl;

  constructor(
    private data: DataService,
    private msg: NzMessageService
  ) { }

  ngOnInit(): void {
    this.avatarUrl = `${ClientConfig.avatarUrl}/${this.data.user.id}?v=${this.data.v}`;
  }

  beforeUpload = (file: File) => {
    return new Observable((observer: Observer<boolean>) => {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJPG) {
        this.msg.error('You can only upload JPG/PNG file!');
        observer.complete();
        return;
      }
      const isLtdot5M = file.size / 1024 / 1024 < 0.5;
      if (!isLtdot5M) {
        this.msg.error('Image must smaller than 0.5MB!');
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
        const v = Math.random();
        this.data.v = v.toString();
        localStorage.setItem('v', v.toString());
        this.avatarUrl = `${ClientConfig.avatarUrl}/${this.data.user.id}?v=${v}`;
        this.loading = false;
        break;
      case 'error':
        this.msg.error('Network error');
        this.loading = false;
        break;
    }
  }
}
