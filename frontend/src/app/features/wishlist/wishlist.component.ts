import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../shared/toast.component';
import { LoadingComponent } from '../../shared/loading.component';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingComponent],
  template: `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-3xl font-bold text-stone-800 mb-8">Mis Favoritos</h1>

      <app-loading [visible]="loading" />

      @if (!loading && items.length === 0) {
        <div class="text-center py-16 bg-white rounded-2xl shadow-sm">
          <svg class="w-20 h-20 mx-auto text-stone-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
          <p class="text-stone-500 text-lg mb-4">No tienes productos favoritos</p>
          <a routerLink="/productos" class="inline-flex items-center px-6 py-3 bg-gold-600 text-white font-medium rounded-lg hover:bg-gold-700 transition-colors">
            Explorar productos
          </a>
        </div>
      }

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (item of items; track item.id) {
          <div class="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
            <div class="h-40 bg-gradient-to-br from-gold-100 to-gold-200 flex items-center justify-center relative">
              @if (item.imagenUrl) {
                <img [src]="item.imagenUrl" [alt]="item.nombre" class="w-full h-full object-cover">
              } @else {
                <svg class="w-12 h-12 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                </svg>
              }
              <button (click)="remove(item.id)" class="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full text-red-500 hover:bg-white hover:text-red-700 transition-colors shadow-sm">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>
            <div class="p-4">
              <a [routerLink]="['/productos', item.id]" class="text-base font-semibold text-stone-800 hover:text-gold-600 transition-colors block mb-1">{{ item.nombre }}</a>
              @if (item.categoriaNombre) {
                <span class="text-xs text-stone-500 bg-gold-50 px-2 py-0.5 rounded-full">{{ item.categoriaNombre }}</span>
              }
              <div class="flex items-center justify-between mt-3">
                <span class="text-xl font-bold text-gold-600">\${{ item.precio.toFixed(2) }}</span>
                <a [routerLink]="['/productos', item.id]"
                  class="px-3 py-1.5 text-xs font-medium text-white bg-gold-600 hover:bg-gold-700 rounded-lg transition-colors">
                  Ver producto
                </a>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class WishlistComponent implements OnInit {
  items: any[] = [];
  loading = false;

  constructor(private api: ApiService, private toastService: ToastService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadWishlist();
  }

  loadWishlist() {
    this.loading = true;
    this.api.getWishlist().subscribe({
      next: (res: any[]) => {
        this.items = res.map(i => ({
          id: i.productoId,
          nombre: i.productoNombre,
          precio: i.productoPrecio,
          categoriaNombre: i.productoCategoria,
          imagenUrl: i.productoImagen,
          _wishlistId: i.id
        }));
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
        this.toastService.show('Error al cargar favoritos', 'error');
      }
    });
  }

  remove(productoId: number) {
    this.api.removeFromWishlist(productoId).subscribe({
      next: () => {
        this.items = this.items.filter(i => i.id !== productoId);
        this.toastService.show('Eliminado de favoritos', 'success');
      },
      error: (err) => this.toastService.show(err.error?.message || 'Error al eliminar', 'error')
    });
  }
}
