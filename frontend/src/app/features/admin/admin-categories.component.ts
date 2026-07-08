import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../shared/toast.component';
import { Categoria } from '../../core/models/categoria';
import { LoadingComponent } from '../../shared/loading.component';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingComponent],
  template: `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold text-stone-800">Gestionar Categor\u00edas</h1>
        <button (click)="openModal()" class="px-5 py-2.5 bg-gold-600 text-white text-sm font-medium rounded-lg hover:bg-gold-700 transition-colors">
          + Nueva categor\u00eda
        </button>
      </div>

      <app-loading [visible]="loading" />

      @if (categorias.length === 0 && !loading) {
        <div class="text-center py-16 bg-white rounded-2xl shadow-sm">
          <p class="text-stone-500">No hay categor\u00edas registradas</p>
        </div>
      }

      <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-stone-200 bg-stone-50">
                <th class="text-left px-6 py-4 text-sm font-semibold text-stone-600">ID</th>
                <th class="text-left px-6 py-4 text-sm font-semibold text-stone-600">Nombre</th>
                <th class="text-left px-6 py-4 text-sm font-semibold text-stone-600">Descripci\u00f3n</th>
                <th class="text-center px-6 py-4 text-sm font-semibold text-stone-600">Acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (cat of categorias; track cat.id) {
                <tr class="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                  <td class="px-6 py-4 text-sm text-stone-500">{{ cat.id }}</td>
                  <td class="px-6 py-4 text-sm font-medium text-stone-800">{{ cat.nombre }}</td>
                  <td class="px-6 py-4 text-sm text-stone-500">{{ cat.descripcion }}</td>
                  <td class="px-6 py-4 text-sm text-center">
                    <div class="flex items-center justify-center gap-2">
                      <button (click)="editCategoria(cat)" class="p-1.5 text-gold-600 hover:text-gold-800 hover:bg-gold-50 rounded-lg transition-colors" title="Editar">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                      </button>
                      <button (click)="deleteCategoria(cat)" class="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>

    @if (modalOpen) {
      <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" (click)="closeModal()">
        <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md" (click)="$event.stopPropagation()">
          <h2 class="text-xl font-bold text-stone-800 mb-6">{{ editingCategoria ? 'Editar' : 'Nueva' }} categor\u00eda</h2>
          <form (ngSubmit)="saveCategoria()" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-stone-700 mb-1">Nombre</label>
              <input type="text" [(ngModel)]="formCategoria.nombre" name="nombre" required
                class="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none transition-colors text-sm">
            </div>
            <div>
              <label class="block text-sm font-medium text-stone-700 mb-1">Descripci\u00f3n</label>
              <textarea [(ngModel)]="formCategoria.descripcion" name="descripcion" rows="3"
                class="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none transition-colors text-sm"></textarea>
            </div>
            <div class="flex gap-3 pt-4">
              <button type="button" (click)="closeModal()" class="flex-1 py-2.5 px-4 border border-stone-300 text-stone-700 font-medium rounded-lg hover:bg-stone-50 transition-colors text-sm">
                Cancelar
              </button>
              <button type="submit" class="flex-1 py-2.5 px-4 bg-gold-600 text-white font-medium rounded-lg hover:bg-gold-700 transition-colors text-sm">
                {{ editingCategoria ? 'Guardar cambios' : 'Crear categor\u00eda' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `
})
export class AdminCategoriesComponent implements OnInit {
  categorias: Categoria[] = [];
  loading = false;
  modalOpen = false;
  editingCategoria: Categoria | null = null;

  formCategoria: Partial<Categoria> = { nombre: '', descripcion: '' };

  constructor(private api: ApiService, private toastService: ToastService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.api.getCategorias().subscribe({
      next: (res) => { this.categorias = res; this.loading = false; },
      error: () => this.loading = false
    });
  }

  openModal(cat?: Categoria) {
    if (cat) {
      this.editingCategoria = cat;
      this.formCategoria = { ...cat };
    } else {
      this.editingCategoria = null;
      this.formCategoria = { nombre: '', descripcion: '' };
    }
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.editingCategoria = null;
  }

  saveCategoria() {
    if (this.editingCategoria) {
      this.api.updateCategoria(this.editingCategoria.id!, this.formCategoria).subscribe({
        next: () => {
          this.toastService.show('Categor\u00eda actualizada', 'success');
          this.closeModal();
          this.loadData();
        },
        error: (err) => this.toastService.show(err.error?.message || 'Error al actualizar', 'error')
      });
    } else {
      this.api.createCategoria(this.formCategoria).subscribe({
        next: () => {
          this.toastService.show('Categor\u00eda creada', 'success');
          this.closeModal();
          this.loadData();
        },
        error: (err) => this.toastService.show(err.error?.message || 'Error al crear', 'error')
      });
    }
  }

  editCategoria(cat: Categoria) {
    this.openModal(cat);
  }

  deleteCategoria(cat: Categoria) {
    if (!confirm(`\u00bfEliminar categor\u00eda "${cat.nombre}"?`)) return;
    this.api.deleteCategoria(cat.id!).subscribe({
      next: () => {
        this.toastService.show('Categor\u00eda eliminada', 'success');
        this.loadData();
      },
      error: (err) => this.toastService.show(err.error?.message || 'Error al eliminar', 'error')
    });
  }
}
