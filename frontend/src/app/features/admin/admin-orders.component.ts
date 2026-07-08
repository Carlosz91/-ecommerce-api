import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../shared/toast.component';
import { Pedido, DetallePedido } from '../../core/models/pedido';
import { LoadingComponent } from '../../shared/loading.component';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-3xl font-bold text-stone-800 mb-8">Gestionar Pedidos</h1>

      <app-loading [visible]="loading" />

      @if (pedidos.length === 0 && !loading) {
        <div class="text-center py-16 bg-white rounded-2xl shadow-sm">
          <p class="text-stone-500">No hay pedidos registrados</p>
        </div>
      }

      <div class="space-y-4">
        @for (pedido of pedidos; track pedido.id) {
          <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div class="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-stone-50 transition-colors" (click)="togglePedido(pedido.id)">
              <div class="flex items-center gap-6">
                <span class="text-sm font-semibold text-stone-800">#{{ pedido.id }}</span>
                <span class="text-sm text-stone-500">{{ pedido.fecha | date:'dd/MM/yyyy HH:mm' }}</span>
                <span class="text-sm font-medium text-gold-600">\${{ pedido.total.toFixed(2) }}</span>
                  <span [class]="getEstadoClass(pedido.estado || 'PENDIENTE') + ' text-xs font-semibold px-3 py-1 rounded-full'">{{ pedido.estado || 'PENDIENTE' }}</span>
              </div>
              <svg class="w-5 h-5 text-stone-400 transition-transform" [class.rotate-180]="expandedPedido === pedido.id" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </div>
            @if (expandedPedido === pedido.id) {
              <div class="border-t border-stone-100 px-6 py-4">
                <div class="mb-4 flex items-center gap-3">
                  <label class="text-sm font-medium text-stone-700">Cambiar estado:</label>
                  <select [(ngModel)]="pedido.estado" (change)="updateEstado(pedido)"
                    class="px-3 py-1.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none text-sm">
                    <option value="PENDIENTE">Pendiente</option>
                    <option value="CONFIRMADO">Confirmado</option>
                    <option value="ENVIADO">Enviado</option>
                    <option value="ENTREGADO">Entregado</option>
                    <option value="CANCELADO">Cancelado</option>
                  </select>
                </div>
                <table class="w-full">
                  <thead>
                    <tr class="border-b border-stone-200">
                      <th class="text-left px-4 py-2 text-xs font-semibold text-stone-500 uppercase">Producto</th>
                      <th class="text-center px-4 py-2 text-xs font-semibold text-stone-500 uppercase">Cantidad</th>
                      <th class="text-right px-4 py-2 text-xs font-semibold text-stone-500 uppercase">Precio unit.</th>
                      <th class="text-right px-4 py-2 text-xs font-semibold text-stone-500 uppercase">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (det of pedido.detalles; track $index) {
                      <tr class="border-b border-stone-50">
                        <td class="px-4 py-3 text-sm text-stone-800">{{ det.productoNombre }}</td>
                        <td class="px-4 py-3 text-sm text-center text-stone-600">{{ det.cantidad }}</td>
                        <td class="px-4 py-3 text-sm text-right text-stone-600">\${{ det.precioUnitario.toFixed(2) }}</td>
                        <td class="px-4 py-3 text-sm text-right font-medium text-stone-800">\${{ det.subtotal.toFixed(2) }}</td>
                      </tr>
                    }
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colspan="3" class="px-4 py-3 text-sm font-semibold text-stone-700 text-right">Total</td>
                      <td class="px-4 py-3 text-sm font-bold text-gold-600 text-right">\${{ pedido.total.toFixed(2) }}</td>
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

  constructor(private api: ApiService, private toastService: ToastService) {}

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

  getEstadoClass(estado: string): string {
    const map: Record<string, string> = {
      PENDIENTE: 'bg-yellow-100 text-yellow-700',
      CONFIRMADO: 'bg-blue-100 text-blue-700',
      ENVIADO: 'bg-gold-100 text-gold-700',
      ENTREGADO: 'bg-emerald-100 text-emerald-700',
      CANCELADO: 'bg-red-100 text-red-700'
    };
    return map[estado] || 'bg-stone-100 text-stone-700';
  }

  updateEstado(pedido: Pedido) {
    if (!pedido.id || !pedido.estado) return;
    this.api.updatePedidoEstado(pedido.id, pedido.estado!).subscribe({
      next: () => this.toastService.show('Estado actualizado', 'success'),
      error: (err) => this.toastService.show(err.error?.message || 'Error al actualizar', 'error')
    });
  }
}
