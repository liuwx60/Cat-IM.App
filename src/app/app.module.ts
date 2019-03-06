import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { AppComponent } from './components/app/app.component';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { HttpService } from './services/http.service';
import { LoginService } from './services/login.service';
import { FriendService } from './services/friend.service';
import { WebSocketService } from './services/webSocket.service';
import { ChatService } from './services/chat.service';
import { UserService } from './services/user.service';
import { FriendComponent } from './components/friend/friend.component';
import { NavComponent } from './components/shared/nav/nav.component';
import { InitService } from './services/init.service';
import { DataService } from './services/data.service';
import { SearchComponent } from './components/shared/search/search.component';

registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    FriendComponent,
    NavComponent,
    SearchComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgZorroAntdModule,
    BrowserAnimationsModule
  ],
  providers: [
    HttpService,
    LoginService,
    FriendService,
    WebSocketService,
    ChatService,
    UserService,
    InitService,
    DataService,
    { provide: NZ_I18N, useValue: zh_CN }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
