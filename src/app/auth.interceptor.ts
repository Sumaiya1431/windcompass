import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

// import { Observable } from 'rxjs/Observable';
import { Observable } from 'rxjs'
// import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({
      setHeaders: {
        'Content-Type' : 'application/json; charset=utf-8',
        'Accept'       : 'application/json',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIwNzNkYjQ3NC04YzAzLTRjOTktYmVjNC02M2EzNjA4NzA4OTUiLCJpYXQiOjE2MzA0OTAxMjQsInN1YiI6ImF1dGgwfDYxMmQzZWI0ODFjZDk0MDA3MTdkMTExZSIsImlzcyI6Imh0dHBzOi8vYXBpLjMwbWh6LmNvbSIsImF1ZCI6Imh0dHBzOi8vYXBpLjMwbWh6LmNvbSIsImVtYWlsIjoic3VtYWl5YS5nYXJhZ0BnbWFpbC5jb20ifQ.1BW_Y7evGi71ov9tPp46Zomal2zrarwKThR0OliWFHg`,
      },
    });

    return next.handle(req);
  }
}