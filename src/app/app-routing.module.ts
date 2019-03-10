import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guard/auth.guard';
import { FriendComponent } from './components/friend/friend.component';
import { RegisterComponent } from './components/register/register.component';
import { UserDetailComponent } from './components/setting/user-detail/user-detail.component';
import { SettingComponent } from './components/setting/setting.component';
import { UserAvatarComponent } from './components/setting/user-avatar/user-avatar.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/main',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'main',
    component: MainComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'friends',
    component: FriendComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'setting',
    component: SettingComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: '/setting/user-avatar',
        pathMatch: 'full'
      },
      {
        path: 'user-detail',
        component: UserDetailComponent
      },
      {
        path: 'user-avatar',
        component: UserAvatarComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
