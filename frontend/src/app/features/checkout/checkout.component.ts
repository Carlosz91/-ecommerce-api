import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../shared/toast.component';
import { Carrito } from '../../core/models/carrito';
import { LoadingComponent } from '../../shared/loading.component';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LoadingComponent],
  template: `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      @if (!success) {
        <div>
          <h1 class="text-3xl font-bold text-gray-800 mb-8">Finalizar Pedido</h1>

          <app-loading [visible]="loading" />

          @if (!loading && (!carrito || carrito.items.length === 0)) {
            <div class="text-center py-16 bg-white rounded-2xl shadow-sm">
              <p class="text-gray-500 text-lg mb-4">No hay productos en tu carrito</p>
              <a routerLink="/productos" class="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                Ir a productos
              </a>
            </div>
          }

          @if (carrito && carrito.items.length > 0) {
            <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div class="lg:col-span-3">
                <div class="bg-white rounded-2xl shadow-sm p-6">
                  <h2 class="text-lg font-semibold text-gray-800 mb-4">Resumen del pedido</h2>
                  <div class="space-y-3">
                    @for (item of carrito.items; track item.id) {
                      <div class="flex items-center justify-between py-2 border-b border-gray-100">
                        <div>
                          <p class="text-sm font-medium text-gray-800">{{ item.productoNombre }}</p>
                          <p class="text-xs text-gray-500">{{ item.cantidad }} x \${{ item.precioUnitario.toFixed(2) }}</p>
                        </div>
                        <span class="text-sm font-semibold text-gray-800">\${{ item.subtotal.toFixed(2) }}</span>
                      </div>
                    }
                  </div>
                  <div class="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                    <span class="text-lg font-semibold text-gray-700">Total</span>
                    <span class="text-2xl font-bold text-blue-600">\${{ carrito.total.toFixed(2) }}</span>
                  </div>
                </div>
              </div>

              <div class="lg:col-span-2">
                <div class="bg-white rounded-2xl shadow-sm p-6">
                  <h2 class="text-lg font-semibold text-gray-800 mb-4">Detalles de env\u00edo</h2>
                  <form (ngSubmit)="confirmarPedido()" class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Direcci\u00f3n</label>
                      <textarea [(ngModel)]="direccion" name="direccion" required rows="3"
                        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm"
                        placeholder="Calle, n\u00famero, ciudad..."></textarea>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Notas adicionales</label>
                      <textarea [(ngModel)]="notas" name="notas" rows="2"
                        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm"
                        placeholder="Opcional"></textarea>
                    </div>
                    <button type="submit" [disabled]="submitting || !direccion.trim()"
                      class="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm">
                      @if (submitting) {
                        <span class="inline-flex items-center gap-2">
                          <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                          </svg>
                          Procesando...
                        </span>
                      } @else {
                        Confirmar pedido
                      }
                    </button>
                  </form>
                </div>
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="text-center py-16 bg-white rounded-2xl shadow-sm">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Pedido realizado</h1>
          <p class="text-gray-500 mb-8">Tu pedido se ha procesado correctamente</p>
          <a routerLink="/productos" class="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
            Seguir comprando
          </a>
        </div>
      }
    </div>
  `
})
export class CheckoutComponent implements OnInit {
  carrito: Carrito | null = null;
  direccion = '';
  notas = '';
  loading = false;
  submitting = false;
  success = false;

  constructor(
    private api: ApiService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    const carritoId = localStorage.getItem('carrito_id');
    if (!carritoId) {
      return;
    }
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

  confirmarPedido() {
    if (!this.carrito?.id || !this.direccion.trim()) return;
    this.submitting = true;
    this.api.crearPedido(this.carrito.id).subscribe({
      next: () => {
        this.success = true;
        this.submitting = false;
        localStorage.removeItem('carrito_id');
        this.toastService.show('Pedido creado exitosamente', 'success');
      },
      error: (err) => {
        this.submitting = false;
        this.toastService.show(err.error?.message || 'Error al crear pedido', 'error');
      }
    });
  }
}
