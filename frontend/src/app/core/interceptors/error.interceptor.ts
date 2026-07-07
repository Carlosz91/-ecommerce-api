import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, catchError, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../../shared/toast.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private toastService: ToastService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !req.url.includes('/auth/login') && !req.url.includes('/auth/refresh')) {
          const refreshToken = this.authService.getRefreshToken();
          if (refreshToken) {
            return this.authService.refresh(refreshToken).pipe(
              switchMap(res => {
                const cloned = req.clone({
                  setHeaders: { Authorization: `Bearer ${res.accessToken}` }
                });
                return next.handle(cloned);
              }),
              catchError(() => {
                this.authService.clearAuth();
                this.toastService.show('Sesi\u00f3n expirada. Inicie sesi\u00f3n nuevamente.', 'error');
                return throwError(() => error);
              })
            );
          } else {
            this.authService.clearAuth();
            this.toastService.show('Sesi\u00f3n expirada', 'error');
          }
        } else if (error.status === 429) {
          this.toastService.show('Demasiados intentos. Intente m\u00e1s tarde.', 'error');
        } else if (error.status !== 401) {
          const msg = error.error?.message || error.message || 'Error desconocido';
          this.toastService.show(msg, 'error');
        }
        return throwError(() => error);
      })
    );
  }
}
