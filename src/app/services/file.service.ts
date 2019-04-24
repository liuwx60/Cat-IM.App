import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { FileExistsResponse } from '../models/FileExistsResponse';
import { Observable } from 'rxjs';

@Injectable()
export class FileService {

  constructor(private http: HttpService) {}

  public exists(fileName: string): Observable<FileExistsResponse> {
    return this.http.post<FileExistsResponse>('/api/upload/exists', { fileName });
  }

  public image(file: File): Observable<{}> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post('/api/upload/image', formData);
  }
}
