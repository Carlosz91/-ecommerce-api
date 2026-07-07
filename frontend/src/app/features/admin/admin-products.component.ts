import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../shared/toast.component';
import { Producto } from '../../core/models/producto';
import { Categoria } from '../../core/models/categoria';
import { LoadingComponent } from '../../shared/loading.component';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 class="text-3xl font-bold text-gray-800">Gestionar Productos</h1>
        <div class="flex gap-3">
          <div class="relative">
            <input type="text" [(ngModel)]="searchTerm" (input)="search()" placeholder="Buscar..."
              class="pl-4 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm w-48">
          </div>
          <button (click)="openModal()" class="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
            + Nuevo producto
          </button>
        </div>
      </div>

      <app-loading [visible]="loading" />

      @if (filteredProductos.length === 0 && !loading) {
        <div class="text-center py-16 bg-white rounded-2xl shadow-sm">
          <p class="text-gray-500">No hay productos registrados</p>
        </div>
      }

      <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-200 bg-gray-50">
                <th class="text-left px-6 py-4 text-sm font-semibold text-gray-600">ID</th>
                <th class="text-left px-6 py-4 text-sm font-semibold text-gray-600">Nombre</th>
                <th class="text-left px-6 py-4 text-sm font-semibold text-gray-600">Categor\u00eda</th>
                <th class="text-right px-6 py-4 text-sm font-semibold text-gray-600">Precio</th>
                <th class="text-center px-6 py-4 text-sm font-semibold text-gray-600">Stock</th>
                <th class="text-center px-6 py-4 text-sm font-semibold text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (p of filteredProductos; track p.id) {
                <tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 text-sm text-gray-500">{{ p.id }}</td>
                  <td class="px-6 py-4 text-sm font-medium text-gray-800">{{ p.nombre }}</td>
                  <td class="px-6 py-4 text-sm text-gray-500">{{ p.categoriaNombre || '-' }}</td>
                  <td class="px-6 py-4 text-sm text-right font-medium text-gray-800">\${{ p.precio.toFixed(2) }}</td>
                  <td class="px-6 py-4 text-sm text-center">
                    <span [class]="(p.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700') + ' text-xs font-medium px-2.5 py-1 rounded-full'">
                      {{ p.stock }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-center">
                    <div class="flex items-center justify-center gap-2">
                      <button (click)="editProducto(p)" class="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                      </button>
                      <button (click)="deleteProducto(p)" class="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
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
        <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto" (click)="$event.stopPropagation()">
          <h2 class="text-xl font-bold text-gray-800 mb-6">{{ editingProducto ? 'Editar' : 'Nuevo' }} producto</h2>
          <form (ngSubmit)="saveProducto()" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input type="text" [(ngModel)]="formProducto.nombre" name="nombre" required
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Descripci\u00f3n</label>
              <textarea [(ngModel)]="formProducto.descripcion" name="descripcion" rows="3"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm"></textarea>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                <input type="number" step="0.01" [(ngModel)]="formProducto.precio" name="precio" required
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                <input type="number" [(ngModel)]="formProducto.stock" name="stock" required
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm">
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Categor\u00eda</label>
              <select [(ngModel)]="formProducto.categoriaId" name="categoriaId"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm">
                <option [value]="null">Sin categor\u00eda</option>
                @for (cat of categorias; track cat.id) {
                  <option [value]="cat.id">{{ cat.nombre }}</option>
                }
              </select>
            </div>
            <div class="flex gap-3 pt-4">
              <button type="button" (click)="closeModal()" class="flex-1 py-2.5 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm">
                Cancelar
              </button>
              <button type="submit" class="flex-1 py-2.5 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm">
                {{ editingProducto ? 'Guardar cambios' : 'Crear producto' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `
})
export class AdminProductsComponent implements OnInit {
  productos: Producto[] = [];
  filteredProductos: Producto[] = [];
  categorias: Categoria[] = [];
  searchTerm = '';
  loading = false;
  modalOpen = false;
  editingProducto: Producto | null = null;

  formProducto: Partial<Producto> = {
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    categoriaId: undefined
  };

  constructor(private api: ApiService, private toastService: ToastService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.api.getProductos().subscribe(res => {
      this.productos = res;
      this.filteredProductos = [...res];
      this.loading = false;
    });
    this.api.getCategorias().subscribe(res => this.categorias = res);
  }

  search() {
    const term = this.searchTerm.toLowerCase();
    this.filteredProductos = this.productos.filter(p =>
      p.nombre.toLowerCase().includes(term) ||
      p.categoriaNombre?.toLowerCase().includes(term)
    );
  }

  openModal(producto?: Producto) {
    if (producto) {
      this.editingProducto = producto;
      this.formProducto = { ...producto };
    } else {
      this.editingProducto = null;
      this.formProducto = { nombre: '', descripcion: '', precio: 0, stock: 0, categoriaId: undefined };
    }
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.editingProducto = null;
  }

  saveProducto() {
    if (this.editingProducto) {
      this.api.updateProducto(this.editingProducto.id!, this.formProducto).subscribe({
        next: () => {
          this.toastService.show('Producto actualizado', 'success');
          this.closeModal();
          this.loadData();
        },
        error: (err) => this.toastService.show(err.error?.message || 'Error al actualizar', 'error')
      });
    } else {
      this.api.createProducto(this.formProducto).subscribe({
        next: () => {
          this.toastService.show('Producto creado', 'success');
          this.closeModal();
          this.loadData();
        },
        error: (err) => this.toastService.show(err.error?.message || 'Error al crear', 'error')
      });
    }
  }

  editProducto(p: Producto) {
    this.openModal(p);
  }

  deleteProducto(p: Producto) {
    if (!confirm(`¿Eliminar producto "${p.nombre}"?`)) return;
    this.api.deleteProducto(p.id!).subscribe({
      next: () => {
        this.toastService.show('Producto eliminado', 'success');
        this.loadData();
      },
      error: (err) => this.toastService.show(err.error?.message || 'Error al eliminar', 'error')
    });
  }
}
