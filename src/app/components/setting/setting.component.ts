import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WebSocketService } from 'src/app/services/webSocket.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {
  constructor(
    private router: Router,
    private webSocket: WebSocketService
  ) { }

  ngOnInit(): void { }

  logOut() {
    sessionStorage.removeItem('token');
    this.webSocket.close();
    this.router.navigateByUrl('/login');
  }
}
