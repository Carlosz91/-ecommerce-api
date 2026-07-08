import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap, finalize } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse } from '../models/auth-response';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private accessToken = '';
  private refreshToken = '';
  private userSubject = new BehaviorSubject<{ email: string; rol: string } | null>(null);
  user$ = this.userSubject.asObservable();
  isLoggedIn$ = this.user$.pipe(map(u => u !== null));
  isAdmin$ = this.user$.pipe(map(u => u?.rol === 'ADMIN'));

  constructor(private http: HttpClient, private apiService: ApiService) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    const token = localStorage.getItem('access_token');
    if (token) {
      this.accessToken = token;
      this.refreshToken = localStorage.getItem('refresh_token') || '';
    const decoded = this.decodeToken(token);
    if (decoded) {
      this.userSubject.next({ email: decoded.sub || decoded.email, rol: decoded.rol });
    }
    }
  }

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }

  getAccessToken() { return this.accessToken; }
  getRefreshToken() { return this.refreshToken; }

  login(dto: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, dto).pipe(
      tap(res => this.handleAuthResponse(res))
    );
  }

  register(dto: { nombre: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/register`, dto);
  }

  refresh(token: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/refresh`, { refreshToken: token }).pipe(
      tap(res => this.handleAuthResponse(res))
    );
  }

  googleLogin(idToken: string): Observable<any> {
    return this.apiService.googleLogin(idToken).pipe(
      tap(res => this.handleAuthResponse(res))
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/logout`, {}).pipe(
      finalize(() => this.clearAuth())
    );
  }

  private handleAuthResponse(res: AuthResponse) {
    this.accessToken = res.accessToken;
    this.refreshToken = res.refreshToken;
    localStorage.setItem('access_token', res.accessToken);
    localStorage.setItem('refresh_token', res.refreshToken);
    const decoded = this.decodeToken(res.accessToken);
    if (decoded) {
      this.userSubject.next({ email: decoded.sub || decoded.email, rol: res.rol });
    }
  }

  clearAuth() {
    this.accessToken = '';
    this.refreshToken = '';
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.userSubject.next(null);
  }
}
