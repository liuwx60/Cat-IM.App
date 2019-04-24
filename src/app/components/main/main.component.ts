import { Component, OnInit, ViewChild } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { SendMessageRequest } from 'src/app/models/SendMessageRequest';
import { DataService } from 'src/app/services/data.service';
import { ClientConfig } from 'src/app/utils/client-config';
import { PerfectScrollbarConfigInterface, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { Md5FileHasher } from 'ts-md5/dist/md5_file_hasher';
import { Cat } from 'src/app/utils/protobuf/CatMessage';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  moduleId: 'src/app/components/app/main.component'
})
export class MainComponent implements OnInit {
  sendContent: string;
  base64Img: string;
  file: File;
  imgExt: Map<string, string> = new Map([
    ['image/png', '.png'],
    ['image/jpg', '.jpg']
  ]);
  avatarUrl = ClientConfig.avatarUrl + '/';
  imageUrl = ClientConfig.imageUrl + '/';
  messageType = Cat.MessageType;

  config: PerfectScrollbarConfigInterface = {};

  @ViewChild('chatList', { read: PerfectScrollbarDirective }) directiveRef?: PerfectScrollbarDirective;

  constructor(
    private chatService: ChatService,
    public data: DataService
  ) {}

  ngOnInit(): void {
    Object.defineProperty(this.data.change, 'count', {
      set: () => {
        this.scrollToBottom();
      }
    });

    if (this.data.chatUserId) {
      setTimeout(() => {
        this.scrollToBottom();
      }, 300);
    }
  }

  switchChat(userId: string): void {
    this.data.chatUserId = userId;
    this.chatService.clearChatCount(userId);
    this.scrollToBottom();
  }

  send(): void {
    const sendMsg = new SendMessageRequest();
    sendMsg.body = this.sendContent || '';
    sendMsg.sender = this.data.user.id;
    sendMsg.receiver = this.data.chatUserId;
    sendMsg.sendOn = new Date();
    sendMsg.type = Cat.MessageType.CHAT;

    this.chatService.send(sendMsg);

    this.sendContent = '';

    this.scrollToBottom();
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && event.ctrlKey) {
      this.sendContent += '\n';
      event.preventDefault();
    } else if (event.key === 'Enter') {
      this.send();
      event.preventDefault();
    }
  }

  onPaste(e: ClipboardEvent): void {
    if (!(e.clipboardData && e.clipboardData.items)) {
      return;
    }

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < e.clipboardData.items.length; i++) {
      const item = e.clipboardData.items[i];

      if (item.kind !== 'file') {
        continue;
      }

      this.file = item.getAsFile();

      this.getBase64(this.file, (img: string) => {
        this.base64Img = img;
      });
    }
  }

  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result.toString()));
    reader.readAsDataURL(img);
  }

  sendImg(): void {
    const hasher = new Md5FileHasher((res: any) => {
      if (res.success) {
        const md5: string = res.result;
        const fileName = md5 + this.imgExt.get(this.file.type);
        const sendMsg = new SendMessageRequest();
        sendMsg.sender = this.data.user.id;
        sendMsg.receiver = this.data.chatUserId;
        sendMsg.sendOn = new Date();
        sendMsg.type = Cat.MessageType.IMG;
        sendMsg.body = fileName;
        this.chatService.sendImg(sendMsg, this.file, this.base64Img);

        this.cancelSendImg();

        this.scrollToBottom();
      }
    });
    hasher.hash(this.file);
  }

  cancelSendImg(): void {
    this.file = null;
    this.base64Img = null;
  }

  scrollToBottom(): void {
    if (this.directiveRef) {
      setTimeout(() => {
        this.directiveRef.scrollToBottom();
      }, 300);
    }
  }
}
