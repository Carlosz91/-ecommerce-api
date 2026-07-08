import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { LoadingComponent } from '../../shared/loading.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-3xl font-bold text-stone-800 mb-8">Panel de Administraci\u00f3n</h1>

      <app-loading [visible]="loading" />

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div class="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-gold-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-stone-500 font-medium">Productos</p>
              <p class="text-3xl font-bold text-stone-800 mt-1">{{ stats.productos }}</p>
            </div>
            <div class="w-12 h-12 bg-gold-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-bronze-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-stone-500 font-medium">Categor\u00edas</p>
              <p class="text-3xl font-bold text-stone-800 mt-1">{{ stats.categorias }}</p>
            </div>
            <div class="w-12 h-12 bg-bronze-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-bronze-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-yellow-600">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-stone-500 font-medium">Pedidos</p>
              <p class="text-3xl font-bold text-stone-800 mt-1">{{ stats.pedidos }}</p>
            </div>
            <div class="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-orange-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-stone-500 font-medium">Clientes</p>
              <p class="text-3xl font-bold text-stone-800 mt-1">{{ stats.clientes }}</p>
            </div>
            <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-emerald-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-stone-500 font-medium">Ventas hoy</p>
              <p class="text-3xl font-bold text-stone-800 mt-1">\${{ (stats.ventasDia || 0).toFixed(0) }}</p>
            </div>
            <div class="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-blue-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-stone-500 font-medium">Ventas del mes</p>
              <p class="text-3xl font-bold text-stone-800 mt-1">\${{ (stats.ventasMes || 0).toFixed(0) }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-red-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-stone-500 font-medium">Sin stock</p>
              <p class="text-3xl font-bold text-stone-800 mt-1">{{ stats.productosSinStock }}</p>
            </div>
            <div class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-purple-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-stone-500 font-medium">Pedidos pendientes</p>
              <p class="text-3xl font-bold text-stone-800 mt-1">{{ stats.pedidosPendientes }}</p>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a routerLink="/admin/productos" class="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow group">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-gold-100 rounded-xl flex items-center justify-center group-hover:bg-gold-200 transition-colors">
              <svg class="w-6 h-6 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-stone-800">Gestionar Productos</h3>
              <p class="text-sm text-stone-500">Administrar cat\u00e1logo de productos</p>
            </div>
          </div>
        </a>
        <a routerLink="/admin/categorias" class="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow group">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-bronze-100 rounded-xl flex items-center justify-center group-hover:bg-bronze-200 transition-colors">
              <svg class="w-6 h-6 text-bronze-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-stone-800">Gestionar Categor\u00edas</h3>
              <p class="text-sm text-stone-500">Administrar categor\u00edas de productos</p>
            </div>
          </div>
        </a>
        <a routerLink="/admin/pedidos" class="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow group">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-stone-800">Gestionar Pedidos</h3>
              <p class="text-sm text-stone-500">Ver pedidos de clientes</p>
            </div>
          </div>
        </a>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  stats = { productos: 0, categorias: 0, pedidos: 0, clientes: 0, ventasDia: 0, ventasMes: 0, productosSinStock: 0, pedidosPendientes: 0 };
  loading = true;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getDashboardStats().subscribe({
      next: (res) => {
        this.stats = {
          productos: res.productos || 0,
          categorias: res.categorias || 0,
          pedidos: res.pedidos || 0,
          clientes: res.clientes || 0,
          ventasDia: res.ventasDia || 0,
          ventasMes: res.ventasMes || 0,
          productosSinStock: res.productosSinStock || 0,
          pedidosPendientes: res.pedidosPendientes || 0
        };
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.loadFallback();
      }
    });
  }

  private loadFallback() {
    this.api.getProductos().subscribe(res => { this.stats.productos = res.length; this.checkLoaded(); });
    this.api.getCategorias().subscribe(res => { this.stats.categorias = res.length; this.checkLoaded(); });
    this.api.getPedidos().subscribe(res => { this.stats.pedidos = res.length; this.checkLoaded(); });
    this.api.getClientes().subscribe(res => { this.stats.clientes = res.length; this.checkLoaded(); });
  }

  private loadedCount = 0;
  private checkLoaded() {
    this.loadedCount++;
    if (this.loadedCount >= 4) this.loading = false;
  }
}
