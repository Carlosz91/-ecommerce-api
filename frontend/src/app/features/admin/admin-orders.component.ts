import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { Pedido, DetallePedido } from '../../core/models/pedido';
import { LoadingComponent } from '../../shared/loading.component';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, LoadingComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">Gestionar Pedidos</h1>

      <app-loading [visible]="loading" />

      @if (pedidos.length === 0 && !loading) {
        <div class="text-center py-16 bg-white rounded-2xl shadow-sm">
          <p class="text-gray-500">No hay pedidos registrados</p>
        </div>
      }

      <div class="space-y-4">
        @for (pedido of pedidos; track pedido.id) {
          <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div class="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors" (click)="togglePedido(pedido.id)">
              <div class="flex items-center gap-6">
                <span class="text-sm font-semibold text-gray-800">#{{ pedido.id }}</span>
                <span class="text-sm text-gray-500">{{ pedido.fecha | date:'dd/MM/yyyy HH:mm' }}</span>
                <span class="text-sm font-medium text-blue-600">\${{ pedido.total.toFixed(2) }}</span>
              </div>
              <svg class="w-5 h-5 text-gray-400 transition-transform" [class.rotate-180]="expandedPedido === pedido.id" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </div>
            @if (expandedPedido === pedido.id) {
              <div class="border-t border-gray-100 px-6 py-4">
                <table class="w-full">
                  <thead>
                    <tr class="border-b border-gray-200">
                      <th class="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Producto</th>
                      <th class="text-center px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Cantidad</th>
                      <th class="text-right px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Precio unit.</th>
                      <th class="text-right px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (det of pedido.detalles; track $index) {
                      <tr class="border-b border-gray-50">
                        <td class="px-4 py-3 text-sm text-gray-800">{{ det.productoNombre }}</td>
                        <td class="px-4 py-3 text-sm text-center text-gray-600">{{ det.cantidad }}</td>
                        <td class="px-4 py-3 text-sm text-right text-gray-600">\${{ det.precioUnitario.toFixed(2) }}</td>
                        <td class="px-4 py-3 text-sm text-right font-medium text-gray-800">\${{ det.subtotal.toFixed(2) }}</td>
                      </tr>
                    }
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colspan="3" class="px-4 py-3 text-sm font-semibold text-gray-700 text-right">Total</td>
                      <td class="px-4 py-3 text-sm font-bold text-blue-600 text-right">\${{ pedido.total.toFixed(2) }}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `
})
export class AdminOrdersComponent implements OnInit {
  pedidos: Pedido[] = [];
  expandedPedido: number | null = null;
  loading = false;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.api.getPedidos().subscribe({
      next: (res) => { this.pedidos = res; this.loading = false; },
      error: () => this.loading = false
    });
  }

  togglePedido(id: number) {
    this.expandedPedido = this.expandedPedido === id ? null : id;
  }
}
