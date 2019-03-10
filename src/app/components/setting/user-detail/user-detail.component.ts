import { Component, OnInit } from '@angular/core';
import { EditUserRequest } from 'src/app/models/EditUserRequest';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  form: EditUserRequest = new EditUserRequest();

  constructor(
    private data: DataService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.form.nickName = this.data.user.nickName;
    this.form.gender = this.data.user.gender;
  }

  submitForm() {
    this.userService.edit(this.form);
  }
}
