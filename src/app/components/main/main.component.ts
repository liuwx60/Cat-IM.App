import { Component, OnInit, ViewChild } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { SendMessageRequest } from 'src/app/models/SendMessageRequest';
import { DataService } from 'src/app/services/data.service';
import { ClientConfig } from 'src/app/utils/client-config';
import { PerfectScrollbarConfigInterface, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  moduleId: 'src/app/components/app/main.component'
})
export class MainComponent implements OnInit {
  sendContent: string;
  avatarUrl = ClientConfig.avatarUrl + '/';

  config: PerfectScrollbarConfigInterface = {};

  @ViewChild('chatList', { read: PerfectScrollbarDirective }) directiveRef?: PerfectScrollbarDirective;

  constructor(
    private chatService: ChatService,
    public data: DataService
  ) {}

  ngOnInit(): void {
    Object.defineProperty(this.data.change, 'count', {
      set: () => {
        if (this.directiveRef) {
          setTimeout(() => {
            this.directiveRef.scrollToBottom();
          }, 100);
        }
      }
    });
  }

  switchChat(userId: string): void {
    this.data.chatUserId = userId;
    this.chatService.clearChatCount(userId);
    if (this.directiveRef) {
      setTimeout(() => {
        this.directiveRef.scrollToBottom();
      }, 100);
    }
  }

  send(): void {
    const sendMsg = new SendMessageRequest();
    sendMsg.body = this.sendContent || '';
    sendMsg.sender = this.data.user.id;
    sendMsg.receiver = this.data.chatUserId;
    sendMsg.sendOn = new Date();

    this.chatService.send(sendMsg);

    this.sendContent = '';

    if (this.directiveRef) {
      setTimeout(() => {
        this.directiveRef.scrollToBottom();
      }, 100);
    }
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
}
