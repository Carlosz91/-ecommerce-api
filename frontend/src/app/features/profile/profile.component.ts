import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../shared/toast.component';
import { LoadingComponent } from '../../shared/loading.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LoadingComponent],
  template: `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-3xl font-bold text-stone-800 mb-8">Mi Perfil</h1>

      <app-loading [visible]="loading" />

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="bg-white rounded-2xl shadow-sm p-6">
          <h2 class="text-lg font-semibold text-stone-800 mb-4">Información personal</h2>
          <form (ngSubmit)="updateProfile()" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-stone-700 mb-1">Nombre</label>
              <input type="text" [(ngModel)]="profile.nombre" name="nombre" required
                class="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none transition-colors text-sm">
            </div>
            <div>
              <label class="block text-sm font-medium text-stone-700 mb-1">Email</label>
              <input type="email" [ngModel]="profile.email" name="email" disabled
                class="w-full px-4 py-2.5 border border-stone-200 rounded-lg bg-stone-50 text-stone-500 text-sm cursor-not-allowed">
            </div>
            <div>
              <label class="block text-sm font-medium text-stone-700 mb-1">Teléfono</label>
              <input type="text" [(ngModel)]="profile.telefono" name="telefono"
                class="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none transition-colors text-sm"
                placeholder="+56 9 1234 5678">
            </div>
            <div>
              <label class="block text-sm font-medium text-stone-700 mb-1">Dirección</label>
              <textarea [(ngModel)]="profile.direccion" name="direccion" rows="2"
                class="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none transition-colors text-sm"
                placeholder="Tu dirección"></textarea>
            </div>
            <button type="submit" [disabled]="saving"
              class="w-full py-2.5 px-4 bg-gold-600 text-white font-medium rounded-lg hover:bg-gold-700 transition-colors disabled:opacity-50 text-sm">
              {{ saving ? 'Guardando...' : 'Guardar cambios' }}
            </button>
          </form>
        </div>

        <div class="bg-white rounded-2xl shadow-sm p-6">
          <h2 class="text-lg font-semibold text-stone-800 mb-4">Cambiar contraseña</h2>
          <form (ngSubmit)="changePassword()" class="space-y-4">
            @if (passwordError) {
              <div class="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{{ passwordError }}</div>
            }
            @if (passwordSuccess) {
              <div class="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">{{ passwordSuccess }}</div>
            }
            <div>
              <label class="block text-sm font-medium text-stone-700 mb-1">Contraseña actual</label>
              <input type="password" [(ngModel)]="passwordData.currentPassword" name="currentPassword" required
                class="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none transition-colors text-sm">
            </div>
            <div>
              <label class="block text-sm font-medium text-stone-700 mb-1">Nueva contraseña</label>
              <input type="password" [(ngModel)]="passwordData.newPassword" name="newPassword" required
                class="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none transition-colors text-sm">
            </div>
            <div>
              <label class="block text-sm font-medium text-stone-700 mb-1">Confirmar nueva contraseña</label>
              <input type="password" [(ngModel)]="passwordData.confirmPassword" name="confirmPassword" required
                class="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none transition-colors text-sm">
            </div>
            <button type="submit" [disabled]="passwordSaving"
              class="w-full py-2.5 px-4 bg-gradient-to-r from-gold-600 to-bronze-600 text-white font-medium rounded-lg hover:from-gold-700 hover:to-bronze-700 transition-all disabled:opacity-50 text-sm">
              {{ passwordSaving ? 'Actualizando...' : 'Actualizar contraseña' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  profile: any = { nombre: '', email: '', telefono: '', direccion: '' };
  loading = false;
  saving = false;
  passwordError = '';
  passwordSuccess = '';
  passwordSaving = false;

  passwordData = { currentPassword: '', newPassword: '', confirmPassword: '' };

  constructor(
    private api: ApiService,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.loading = true;
    this.api.getProfile().subscribe({
      next: (res) => {
        this.profile = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toastService.show('Error al cargar perfil', 'error');
      }
    });
  }

  updateProfile() {
    this.saving = true;
    this.api.updateProfile({ nombre: this.profile.nombre, telefono: this.profile.telefono, direccion: this.profile.direccion }).subscribe({
      next: () => {
        this.toastService.show('Perfil actualizado', 'success');
        this.saving = false;
      },
      error: (err) => {
        this.toastService.show(err.error?.message || 'Error al actualizar', 'error');
        this.saving = false;
      }
    });
  }

  changePassword() {
    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      this.passwordError = 'Las contraseñas no coinciden';
      return;
    }
    this.passwordError = '';
    this.passwordSuccess = '';
    this.passwordSaving = true;
    this.api.changePassword({ currentPassword: this.passwordData.currentPassword, newPassword: this.passwordData.newPassword }).subscribe({
      next: () => {
        this.passwordSuccess = 'Contraseña actualizada correctamente';
        this.passwordSaving = false;
        this.passwordData = { currentPassword: '', newPassword: '', confirmPassword: '' };
      },
      error: (err) => {
        this.passwordError = err.error?.message || 'Error al cambiar contraseña';
        this.passwordSaving = false;
      }
    });
  }
}
