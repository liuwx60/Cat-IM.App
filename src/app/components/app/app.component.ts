import { Component, OnInit } from '@angular/core';
import { InitService } from 'src/app/services/init.service';
import { Md5FileHasher } from 'ts-md5/dist/md5_file_hasher';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(
    private initService: InitService
  ) {}

  ngOnInit(): void {
    this.initService.init();

    const box = document.getElementById('app-container');

    box.addEventListener('dragover', (e) => {
      e.preventDefault();
    });

    box.addEventListener('drop', (e) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      const hasher = new Md5FileHasher((res: any) => {
        console.log(res);
      });
      hasher.hash(file);
    });
  }
}
