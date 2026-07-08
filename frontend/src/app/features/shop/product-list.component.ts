import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
        <h1 class="text-3xl font-bold text-stone-800">Productos</h1>
        <div class="relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input type="text" [(ngModel)]="searchTerm" (input)="filterProducts()" placeholder="Buscar productos..."
            class="pl-10 pr-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none transition-colors text-sm w-full sm:w-72">
        </div>
      </div>

      <app-loading [visible]="loading" />

      @if (!loading && filteredProductos.length === 0) {
        <div class="text-center py-16">
          <svg class="w-16 h-16 mx-auto text-stone-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
          </svg>
          <p class="text-stone-500 text-lg">No se encontraron productos</p>
        </div>
      }

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        @for (producto of filteredProductos; track producto.id) {
          <div class="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer relative" [routerLink]="['/productos', producto.id]">
            <div class="h-48 bg-gradient-to-br from-gold-100 to-gold-200 flex items-center justify-center relative overflow-hidden">
              @if (producto.imagenUrl) {
                <img [src]="producto.imagenUrl" [alt]="producto.nombre" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300">
              } @else {
                <svg class="w-16 h-16 text-gold-400 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                </svg>
              }
              <div class="absolute top-2 left-2 flex flex-col gap-1">
                @if (producto.destacado) {
                  <span class="text-xs font-medium text-white bg-gold-600 px-2 py-0.5 rounded-full">Destacado</span>
                }
                @if (producto.descuento && producto.descuento > 0) {
                  <span class="text-xs font-medium text-white bg-red-500 px-2 py-0.5 rounded-full">-{{ producto.descuento }}%</span>
                }
              </div>
              @if (isLoggedIn) {
                <button (click)="toggleWishlist($event, producto)" class="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                  <svg class="w-5 h-5" [class.text-red-500]="producto._inWishlist" [class.text-stone-400]="!producto._inWishlist" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                  </svg>
                </button>
              }
            </div>
            <div class="p-5">
              <div class="flex items-start justify-between mb-2">
                <h3 class="text-lg font-semibold text-stone-800 group-hover:text-gold-600 transition-colors">{{ producto.nombre }}</h3>
                <span [class]="producto.stock > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700' + ' text-xs font-medium px-2.5 py-1 rounded-full'">
                  {{ producto.stock > 0 ? (producto.stock + ' en stock') : 'Agotado' }}
                </span>
              </div>
              @if (producto.marca) {
                <span class="text-xs text-stone-400 mr-2">{{ producto.marca }}</span>
              }
              @if (producto.categoriaNombre) {
                <span class="text-xs text-stone-500 bg-gold-50 px-2 py-0.5 rounded-full">{{ producto.categoriaNombre }}</span>
              }
              @if (producto.calificacionPromedio) {
                <div class="flex items-center gap-0.5 mt-1">
                  @for (star of [1,2,3,4,5]; track star) {
                    <svg class="w-3 h-3" [class.text-gold-500]="star <= Math.round(producto.calificacionPromedio)" [class.text-stone-300]="star > Math.round(producto.calificacionPromedio)" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  }
                  <span class="text-xs text-stone-500 ml-1">({{ producto.totalReviews || 0 }})</span>
                </div>
              }
              <p class="text-stone-500 text-sm mt-2 line-clamp-2">{{ producto.descripcion }}</p>
              <div class="flex items-center justify-between mt-4">
                <div class="flex flex-col">
                  @if (producto.descuento && producto.descuento > 0) {
                    <span class="text-xs text-stone-400 line-through">\${{ (producto.precioOriginal || producto.precio).toFixed(2) }}</span>
                  }
                  <span class="text-2xl font-bold text-gold-600">\${{ producto.precio.toFixed(2) }}</span>
                </div>
                @if (isLoggedIn) {
                  <button (click)="addToCart($event, producto)" [disabled]="producto.stock === 0"
                    class="px-4 py-2 text-sm font-medium text-white bg-gold-600 hover:bg-gold-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
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
            class="px-4 py-2 text-sm font-medium text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            Anterior
          </button>
          @for (page of getPageNumbers(); track page) {
            <button (click)="goToPage(page)"
              [class]="page === currentPage ? 'px-4 py-2 text-sm font-medium text-white bg-gold-600 rounded-lg' : 'px-4 py-2 text-sm font-medium text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors'">
              {{ page + 1 }}
            </button>
          }
          <button (click)="goToPage(currentPage + 1)" [disabled]="currentPage >= totalPages - 1"
            class="px-4 py-2 text-sm font-medium text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            Siguiente
          </button>
        </div>
      }
    </div>
  `
})
export class ProductListComponent implements OnInit {
  Math = Math;
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
    private router: Router,
    private cdr: ChangeDetectorRef
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
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
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
    const prodId = producto.id;
    if (!prodId) return;
    let carritoId = localStorage.getItem('carrito_id');
    const doAdd = (id: number) => {
      this.api.agregarItemCarrito(id, prodId, 1).subscribe({
        next: () => this.toastService.show('Producto agregado al carrito', 'success'),
        error: (err) => this.toastService.show(err.error?.message || 'Error al agregar', 'error')
      });
    };
    if (carritoId) {
      doAdd(Number(carritoId));
    } else {
      this.api.crearCarrito().subscribe({
        next: (res: any) => {
          const id = res.carritoId;
          localStorage.setItem('carrito_id', String(id));
          doAdd(id);
        },
        error: () => this.toastService.show('Error al crear carrito', 'error')
      });
    }
  }

  toggleWishlist(event: MouseEvent, producto: Producto) {
    event.stopPropagation();
    if (!producto.id) return;
    if (producto._inWishlist) {
      this.api.removeFromWishlist(producto.id).subscribe({
        next: () => {
          producto._inWishlist = false;
          this.toastService.show('Eliminado de favoritos', 'success');
        },
        error: (err) => this.toastService.show(err.error?.message || 'Error', 'error')
      });
    } else {
      this.api.addToWishlist(producto.id).subscribe({
        next: () => {
          producto._inWishlist = true;
          this.toastService.show('Agregado a favoritos', 'success');
        },
        error: (err) => this.toastService.show(err.error?.message || 'Error', 'error')
      });
    }
  }
}
