import { Injectable } from '@angular/core';

@Injectable()
export class NotificationService {
  private notification = Notification;

  public init() {
    if (this.notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }

  public show(title: string, body: string, icon: string) {
    if (this.notification.permission !== 'granted') {
      return;
    }

    const instance = new Notification(title, { body, icon });

    instance.onshow = () => {
      setTimeout(() => {
        instance.close();
      }, 3000);
    };
  }
}
