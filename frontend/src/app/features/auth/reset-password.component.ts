import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-stone-800 via-gold-800 to-stone-900 flex items-center justify-center px-4 py-12">
      <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-gold-100 rounded-full mb-4">
            <svg class="w-8 h-8 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-stone-800">Nueva contraseña</h1>
          <p class="text-stone-500 text-sm mt-1">Ingresa tu nueva contraseña</p>
        </div>
        @if (success) {
          <div class="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm mb-4">
            Contraseña actualizada correctamente.
          </div>
          <a routerLink="/login" class="block w-full py-2.5 px-4 bg-gradient-to-r from-gold-600 to-bronze-600 text-white font-medium rounded-lg hover:from-gold-700 hover:to-bronze-700 text-center text-sm">
            Iniciar sesión
          </a>
        }
        @if (error) {
          <div class="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{{ error }}</div>
        }
        @if (!success) {
          <form (ngSubmit)="submit()" class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-stone-700 mb-1">Nueva contraseña</label>
              <input type="password" [(ngModel)]="newPassword" name="newPassword" required
                class="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none transition-colors text-sm"
                placeholder="******">
            </div>
            <div>
              <label class="block text-sm font-medium text-stone-700 mb-1">Confirmar contraseña</label>
              <input type="password" [(ngModel)]="confirmPassword" name="confirmPassword" required
                class="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none transition-colors text-sm"
                placeholder="******">
            </div>
            <button type="submit" [disabled]="loading"
              class="w-full py-2.5 px-4 bg-gradient-to-r from-gold-600 to-bronze-600 text-white font-medium rounded-lg hover:from-gold-700 hover:to-bronze-700 transition-all disabled:opacity-50 text-sm">
              {{ loading ? 'Actualizando...' : 'Actualizar contraseña' }}
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
export class ResetPasswordComponent implements OnInit {
  token = '';
  newPassword = '';
  confirmPassword = '';
  error = '';
  loading = false;
  success = false;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    if (!this.token) {
      this.error = 'Token de recuperación inválido o expirado.';
    }
  }

  submit() {
    if (!this.token || !this.newPassword) return;
    if (this.newPassword !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }
    this.loading = true;
    this.error = '';
    this.api.resetPassword(this.token, this.newPassword).subscribe({
      next: () => { this.success = true; this.loading = false; },
      error: (err) => { this.error = err.error?.message || 'Error al actualizar'; this.loading = false; }
    });
  }
}
