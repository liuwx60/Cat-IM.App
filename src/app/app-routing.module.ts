import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guard/auth.guard';
import { FriendComponent } from './components/friend/friend.component';

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
    path: 'main',
    component: MainComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'friends',
    component: FriendComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
