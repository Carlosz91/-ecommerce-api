import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-stone-800 via-gold-800 to-stone-900 flex items-center justify-center px-4 py-12">
      <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-gold-100 rounded-full mb-4">
            <svg class="w-8 h-8 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-stone-800">Recuperar contraseña</h1>
          <p class="text-stone-500 text-sm mt-1">Te enviaremos un enlace a tu email</p>
        </div>
        @if (success) {
          <div class="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm mb-4">
            Se ha enviado un enlace de recuperación a tu email.
          </div>
        }
        @if (error) {
          <div class="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{{ error }}</div>
        }
        @if (!success) {
          <form (ngSubmit)="submit()" class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-stone-700 mb-1">Email</label>
              <input type="email" [(ngModel)]="email" name="email" required
                class="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none transition-colors text-sm"
                placeholder="tu@email.com">
            </div>
            <button type="submit" [disabled]="loading"
              class="w-full py-2.5 px-4 bg-gradient-to-r from-gold-600 to-bronze-600 text-white font-medium rounded-lg hover:from-gold-700 hover:to-bronze-700 transition-all disabled:opacity-50 text-sm">
              {{ loading ? 'Enviando...' : 'Enviar enlace' }}
            </button>
          </form>
        }
        <p class="mt-6 text-center text-sm text-stone-500">
          <a routerLink="/login" class="text-gold-600 hover:text-gold-700 font-medium">Volver a inicio de sesión</a>
        </p>
      </div>
    </div>
  `
})
export class ForgotPasswordComponent {
  email = '';
  error = '';
  loading = false;
  success = false;
  constructor(private api: ApiService) {}
  submit() {
    if (!this.email) return;
    this.loading = true;
    this.error = '';
    this.api.forgotPassword(this.email).subscribe({
      next: () => { this.success = true; this.loading = false; },
      error: (err) => { this.error = err.error?.message || 'Error'; this.loading = false; }
    });
  }
}
