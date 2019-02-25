import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';

@Injectable()
export class HttpService {
  private baseUrl = 'http://localhost:5000';
  public token: string;

  constructor(
    private http: HttpClient,
    private modalService: NzModalService
  ) { }

  public get<T>(url: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${url}`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    }).pipe(catchError(this.handleError));
  }

  public post<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${url}`, body, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    }).pipe(catchError(this.handleError));
  }

  private handleError = (error: any) => {
    switch (error.status) {
      case 400:
        this.modalService.error({
          nzTitle: 'Error',
          nzContent: error.error.message
        });
        break;
      case 500:
        this.modalService.error({
          nzTitle: 'Error',
          nzContent: '服务器发生错误！'
        });
        break;
    }
    return Promise.reject(error.message || error);
  }
}
