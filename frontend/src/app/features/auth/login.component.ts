import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';
declare const google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-stone-800 via-gold-800 to-stone-900 flex items-center justify-center px-4 py-12">
      <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-gold-100 rounded-full mb-4">
            <svg class="w-8 h-8 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-stone-800">Iniciar sesi\u00f3n</h1>
          <p class="text-stone-500 text-sm mt-1">Accede a tu cuenta</p>
        </div>
        @if (error) {
          <div class="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{{ error }}</div>
        }
        <form (ngSubmit)="login()" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-stone-700 mb-1">Email</label>
            <input type="email" [(ngModel)]="email" name="email" required
              class="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none transition-colors text-sm"
              placeholder="tu@email.com">
          </div>
          <div>
            <label class="block text-sm font-medium text-stone-700 mb-1">Contrase\u00f1a</label>
            <input type="password" [(ngModel)]="password" name="password" required
              class="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none transition-colors text-sm"
              placeholder="******">
          </div>
          <button type="submit" [disabled]="loading"
            class="w-full py-2.5 px-4 bg-gradient-to-r from-gold-600 to-bronze-600 text-white font-medium rounded-lg hover:from-gold-700 hover:to-bronze-700 focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm">
            @if (loading) {
              <span class="inline-flex items-center gap-2">
                <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Ingresando...
              </span>
            } @else {
              Ingresar
            }
          </button>
        </form>
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-stone-300"></div></div>
          <div class="relative flex justify-center text-sm"><span class="px-2 bg-white text-stone-500">O continúa con</span></div>
        </div>
        <button (click)="loginWithGoogle()"
          class="w-full py-2.5 px-4 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors flex items-center justify-center gap-3 text-sm font-medium text-stone-700">
          <svg class="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Iniciar sesión con Google
        </button>
        <p class="mt-6 text-center text-sm text-stone-500">
          ¿No tienes cuenta?
          <a routerLink="/register" class="text-gold-600 hover:text-gold-700 font-medium">Regístrate</a>
        </p>
        <p class="mt-2 text-center text-sm text-stone-500">
          <a routerLink="/forgot-password" class="text-gold-600 hover:text-gold-700 font-medium">¿Olvidaste tu contraseña?</a>
        </p>
      </div>
    </div>
  `
})
export class LoginComponent implements OnInit, OnDestroy {
  email = '';
  password = '';
  error = '';
  loading = false;
  private googleBtn: any = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.initGoogle();
  }

  ngOnDestroy() {
    this.googleBtn = null;
  }

  private initGoogle() {
    if (!environment.googleClientId) return;
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => this.renderGoogleButton();
    document.body.appendChild(script);
  }

  private renderGoogleButton() {
    if (typeof google === 'undefined' || !google.accounts) return;
    this.googleBtn = google.accounts.id;
    this.googleBtn.initialize({
      client_id: environment.googleClientId,
      callback: (res: any) => this.handleGoogleResponse(res)
    });
  }

  private handleGoogleResponse(response: any) {
    if (!response.credential) {
      this.error = 'Error al autenticar con Google';
      return;
    }
    this.loading = true;
    this.error = '';
    this.authService.googleLogin(response.credential).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        this.error = err.error?.message || 'Error al iniciar sesión con Google';
        this.loading = false;
      }
    });
  }

  login() {
    if (!this.email || !this.password) return;
    this.loading = true;
    this.error = '';
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        this.error = err.error?.message || 'Error al iniciar sesión';
        this.loading = false;
      }
    });
  }

  loginWithGoogle() {
    if (!environment.googleClientId) {
      this.error = 'Google OAuth no configurado. Configura googleClientId en environment.ts';
      return;
    }
    if (this.googleBtn) {
      this.googleBtn.prompt();
    }
  }
}
