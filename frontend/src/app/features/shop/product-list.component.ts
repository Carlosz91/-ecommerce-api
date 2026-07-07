import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../shared/toast.component';
import { Producto } from '../../core/models/producto';
import { LoadingComponent } from '../../shared/loading.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LoadingComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 class="text-3xl font-bold text-gray-800">Productos</h1>
        <div class="relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input type="text" [(ngModel)]="searchTerm" (input)="filterProducts()" placeholder="Buscar productos..."
            class="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm w-full sm:w-72">
        </div>
      </div>

      <app-loading [visible]="loading" />

      @if (!loading && filteredProductos.length === 0) {
        <div class="text-center py-16">
          <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
          </svg>
          <p class="text-gray-500 text-lg">No se encontraron productos</p>
        </div>
      }

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        @for (producto of filteredProductos; track producto.id) {
          <div class="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer" [routerLink]="['/productos', producto.id]">
            <div class="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <svg class="w-16 h-16 text-gray-400 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
            <div class="p-5">
              <div class="flex items-start justify-between mb-2">
                <h3 class="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">{{ producto.nombre }}</h3>
                <span [class]="producto.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700' + ' text-xs font-medium px-2.5 py-1 rounded-full'">
                  {{ producto.stock > 0 ? (producto.stock + ' en stock') : 'Agotado' }}
                </span>
              </div>
              @if (producto.categoriaNombre) {
                <span class="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{{ producto.categoriaNombre }}</span>
              }
              <p class="text-gray-500 text-sm mt-2 line-clamp-2">{{ producto.descripcion }}</p>
              <div class="flex items-center justify-between mt-4">
                <span class="text-2xl font-bold text-blue-600">\${{ producto.precio.toFixed(2) }}</span>
                @if (isLoggedIn) {
                  <button (click)="addToCart($event, producto)" [disabled]="producto.stock === 0"
                    class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    Agregar
                  </button>
                }
              </div>
            </div>
          </div>
        }
      </div>

      @if (totalPages > 1) {
        <div class="flex items-center justify-center gap-2 mt-10">
          <button (click)="goToPage(currentPage - 1)" [disabled]="currentPage === 0"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            Anterior
          </button>
          @for (page of getPageNumbers(); track page) {
            <button (click)="goToPage(page)"
              [class]="page === currentPage ? 'px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg' : 'px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'">
              {{ page + 1 }}
            </button>
          }
          <button (click)="goToPage(currentPage + 1)" [disabled]="currentPage >= totalPages - 1"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            Siguiente
          </button>
        </div>
      }
    </div>
  `
})
export class ProductListComponent implements OnInit {
  productos: Producto[] = [];
  filteredProductos: Producto[] = [];
  currentPage = 0;
  totalPages = 0;
  searchTerm = '';
  loading = false;
  isLoggedIn = false;

  constructor(
    private api: ApiService,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.authService.isLoggedIn$.subscribe(v => this.isLoggedIn = v);
  }

  ngOnInit() {
    this.loadPage();
  }

  loadPage() {
    this.loading = true;
    this.api.getProductosPage(this.currentPage, 12).subscribe({
      next: (res) => {
        this.productos = res.content;
        this.filteredProductos = [...this.productos];
        this.totalPages = res.totalPages;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  goToPage(page: number) {
    if (page < 0 || page >= this.totalPages) return;
    this.currentPage = page;
    this.loadPage();
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const start = Math.max(0, this.currentPage - 2);
    const end = Math.min(this.totalPages - 1, this.currentPage + 2);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  filterProducts() {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredProductos = this.productos.filter(p =>
      p.nombre.toLowerCase().includes(term) ||
      p.descripcion.toLowerCase().includes(term)
    );
  }

  addToCart(event: MouseEvent, producto: Producto) {
    event.stopPropagation();
    if (!producto.id) return;
    this.api.agregarCarrito(producto.id, 1).subscribe({
      next: () => this.toastService.show('Producto agregado al carrito', 'success'),
      error: (err) => this.toastService.show(err.error?.message || 'Error al agregar', 'error')
    });
  }
}
