import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../shared/toast.component';
import { Producto } from '../../core/models/producto';
import { LoadingComponent } from '../../shared/loading.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LoadingComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button (click)="goBack()" class="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-6 text-sm font-medium">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
        Volver a productos
      </button>

      <app-loading [visible]="loading" />

      @if (!loading && producto) {
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-0">
            <div class="h-80 md:h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-12">
              <svg class="w-40 h-40 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
            <div class="p-8 lg:p-12 flex flex-col justify-between">
              <div>
                <div class="flex items-center gap-3 mb-2">
                  <h1 class="text-3xl font-bold text-gray-800">{{ producto.nombre }}</h1>
                  <span [class]="(producto.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700') + ' text-xs font-medium px-3 py-1 rounded-full'">
                    {{ producto.stock > 0 ? 'En stock' : 'Agotado' }}
                  </span>
                </div>
                @if (producto.categoriaNombre) {
                  <span class="inline-block text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full mb-4">{{ producto.categoriaNombre }}</span>
                }
                <p class="text-gray-600 leading-relaxed mb-6">{{ producto.descripcion }}</p>
                <div class="text-4xl font-bold text-blue-600 mb-6">\${{ producto.precio.toFixed(2) }}</div>
                <p class="text-sm text-gray-500">Stock disponible: <strong>{{ producto.stock }}</strong> unidades</p>
              </div>

              @if (isLoggedIn && producto.stock > 0) {
                <div class="flex items-center gap-4 mt-8 pt-6 border-t border-gray-200">
                  <div class="flex items-center border border-gray-300 rounded-lg">
                    <button (click)="decrement()" class="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors">-</button>
                    <span class="px-4 py-2 text-gray-800 font-medium border-x border-gray-300">{{ cantidad }}</span>
                    <button (click)="increment()" class="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors">+</button>
                  </div>
                  <button (click)="addToCart()"
                    class="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm">
                    Agregar al carrito
                  </button>
                </div>
              }
            </div>
          </div>
        </div>
      }

      @if (!loading && !producto) {
        <div class="text-center py-16">
          <p class="text-gray-500 text-lg">Producto no encontrado</p>
        </div>
      }
    </div>
  `
})
export class ProductDetailComponent implements OnInit {
  producto: Producto | null = null;
  cantidad = 1;
  loading = false;
  isLoggedIn = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private authService: AuthService,
    private toastService: ToastService
  ) {
    this.authService.isLoggedIn$.subscribe(v => this.isLoggedIn = v);
  }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loading = true;
      this.api.getProducto(id).subscribe({
        next: (res) => {
          this.producto = res;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.toastService.show('Error al cargar el producto', 'error');
        }
      });
    }
  }

  increment() {
    if (this.cantidad < (this.producto?.stock || 99)) this.cantidad++;
  }

  decrement() {
    if (this.cantidad > 1) this.cantidad--;
  }

  addToCart() {
    if (!this.producto?.id) return;
    this.api.agregarCarrito(this.producto.id, this.cantidad).subscribe({
      next: () => {
        this.toastService.show('Producto agregado al carrito', 'success');
        this.cantidad = 1;
      },
      error: (err) => this.toastService.show(err.error?.message || 'Error al agregar', 'error')
    });
  }

  goBack() {
    this.router.navigate(['/productos']);
  }
}
