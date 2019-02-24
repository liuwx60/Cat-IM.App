import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable()
export class HttpService {
  private baseUrl = 'http://localhost:60857';
  public token: string;

  constructor(private http: HttpClient) {

  }

  public Get<T>(url: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${url}`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    }).pipe(catchError(this.HandleError));
  }

  public Post<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${url}`, body, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    }).pipe(catchError(this.HandleError));
  }

  public HandleError(error: any): Promise<never> {
    console.log(error);
    switch (error.status) {
      case 400:
        alert(error.error.message);
        break;
      case 500:
        alert('服务器发生错误!');
        break;
    }
    return Promise.reject(error.message || error);
  }
}
