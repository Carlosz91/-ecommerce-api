import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../shared/toast.component';
import { AuthService } from '../../core/services/auth.service';
import { Carrito } from '../../core/models/carrito';
import { LoadingComponent } from '../../shared/loading.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingComponent],
  template: `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">Tu Carrito</h1>

      <app-loading [visible]="loading" />

      @if (!loading && (!carrito || carrito.items.length === 0)) {
        <div class="text-center py-16 bg-white rounded-2xl shadow-sm">
          <svg class="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/>
          </svg>
          <p class="text-gray-500 text-lg mb-4">Tu carrito est\u00e1 vac\u00edo</p>
          <a routerLink="/productos" class="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
            Explorar productos
          </a>
        </div>
      }

      @if (carrito && carrito.items.length > 0) {
        <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-200 bg-gray-50">
                  <th class="text-left px-6 py-4 text-sm font-semibold text-gray-600">Producto</th>
                  <th class="text-center px-6 py-4 text-sm font-semibold text-gray-600">Precio unit.</th>
                  <th class="text-center px-6 py-4 text-sm font-semibold text-gray-600">Cantidad</th>
                  <th class="text-center px-6 py-4 text-sm font-semibold text-gray-600">Subtotal</th>
                  <th class="text-center px-6 py-4 text-sm font-semibold text-gray-600"></th>
                </tr>
              </thead>
              <tbody>
                @for (item of carrito.items; track item.id) {
                  <tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4">
                      <span class="text-sm font-medium text-gray-800">{{ item.productoNombre }}</span>
                    </td>
                    <td class="px-6 py-4 text-center text-sm text-gray-600">\${{ item.precioUnitario.toFixed(2) }}</td>
                    <td class="px-6 py-4 text-center">
                      <span class="text-sm font-medium text-gray-800">{{ item.cantidad }}</span>
                    </td>
                    <td class="px-6 py-4 text-center text-sm font-semibold text-gray-800">\${{ item.subtotal.toFixed(2) }}</td>
                    <td class="px-6 py-4 text-center">
                      <button (click)="removeItem(item.id)" class="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <div class="px-6 py-6 bg-gray-50 border-t border-gray-200">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div class="flex items-center gap-2">
                <span class="text-lg font-semibold text-gray-600">Total:</span>
                <span class="text-3xl font-bold text-blue-600">\${{ carrito.total.toFixed(2) }}</span>
              </div>
              <div class="flex gap-3">
                <button (click)="vaciarCarrito()" class="px-5 py-2.5 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                  Vaciar carrito
                </button>
                <a routerLink="/checkout" class="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all">
                  Realizar pedido
                </a>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class CartComponent implements OnInit {
  carrito: Carrito | null = null;
  loading = false;

  constructor(
    private api: ApiService,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    const carritoId = localStorage.getItem('carrito_id');
    if (!carritoId) return;
    this.loading = true;
    this.api.getCarrito(Number(carritoId)).subscribe({
      next: (res) => {
        this.carrito = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.carrito = { id: 0, items: [], total: 0 };
      }
    });
  }

  removeItem(itemId: number) {
    this.api.eliminarItemCarrito(itemId).subscribe({
      next: () => {
        this.toastService.show('Producto eliminado del carrito', 'success');
        this.loadCart();
      },
      error: (err) => this.toastService.show(err.error?.message || 'Error al eliminar', 'error')
    });
  }

  vaciarCarrito() {
    if (!this.carrito?.id) return;
    this.api.vaciarCarrito(this.carrito.id).subscribe({
      next: () => {
        this.toastService.show('Carrito vaciado', 'success');
        this.carrito = { id: this.carrito!.id, items: [], total: 0 };
      },
      error: (err) => this.toastService.show(err.error?.message || 'Error al vaciar', 'error')
    });
  }
}
