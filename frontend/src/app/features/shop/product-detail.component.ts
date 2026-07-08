import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
      <button (click)="goBack()" class="inline-flex items-center gap-2 text-stone-600 hover:text-gold-600 transition-colors mb-6 text-sm font-medium">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
        Volver a productos
      </button>

      <app-loading [visible]="loading" />

      @if (!loading && producto) {
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-0">
            <div class="h-80 md:h-full bg-gradient-to-br from-gold-100 to-gold-200 flex items-center justify-center p-12 relative">
              @if (producto.imagenUrl) {
                <img [src]="producto.imagenUrl" [alt]="producto.nombre" class="w-full h-full object-cover absolute inset-0">
              } @else {
                <svg class="w-40 h-40 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                </svg>
              }
              @if (isLoggedIn) {
                <button (click)="toggleWishlist()" class="absolute top-4 right-4 p-2 bg-white/80 rounded-full shadow-sm hover:bg-white transition-colors">
                  <svg class="w-6 h-6" [class.text-red-500]="inWishlist" [class.text-stone-400]="!inWishlist" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                  </svg>
                </button>
              }
            </div>
            <div class="p-8 lg:p-12 flex flex-col justify-between">
              <div>
                <div class="flex items-center gap-3 mb-2">
                  <h1 class="text-3xl font-bold text-stone-800">{{ producto.nombre }}</h1>
                  <span [class]="(producto.stock > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700') + ' text-xs font-medium px-3 py-1 rounded-full'">
                    {{ producto.stock > 0 ? 'En stock' : 'Agotado' }}
                  </span>
                </div>
                @if (producto.categoriaNombre) {
                  <span class="inline-block text-xs text-stone-500 bg-gold-50 px-3 py-1 rounded-full mb-4">{{ producto.categoriaNombre }}</span>
                }
                @if (producto.marca) {
                  <span class="text-xs text-stone-500 mr-2">{{ producto.marca }}</span>
                }
                @if (producto.calificacionPromedio) {
                  <div class="flex items-center gap-1 mb-2">
                    @for (star of [1,2,3,4,5]; track star) {
                      <svg class="w-4 h-4" [class.text-gold-500]="star <= Math.round(producto.calificacionPromedio)" [class.text-stone-300]="star > Math.round(producto.calificacionPromedio)" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    }
                    <span class="text-xs text-stone-500 ml-1">({{ producto.totalReviews || 0 }})</span>
                  </div>
                }
                <p class="text-stone-600 leading-relaxed mb-6">{{ producto.descripcion }}</p>
                <div class="flex items-center gap-3 mb-6">
                  @if (producto.descuento && producto.descuento > 0) {
                    <div class="text-4xl font-bold text-gold-600">\${{ (producto.precio).toFixed(2) }}</div>
                    <div class="text-lg text-stone-400 line-through">\${{ (producto.precioOriginal || producto.precio).toFixed(2) }}</div>
                    <span class="text-xs font-medium text-white bg-red-500 px-2 py-1 rounded-full">-{{ producto.descuento }}%</span>
                  } @else {
                    <div class="text-4xl font-bold text-gold-600">\${{ producto.precio.toFixed(2) }}</div>
                  }
                </div>
                <p class="text-sm text-stone-500">Stock disponible: <strong>{{ producto.stock }}</strong> unidades</p>
              </div>

              @if (isLoggedIn && producto.stock > 0) {
                <div class="flex items-center gap-4 mt-8 pt-6 border-t border-stone-200">
                  <div class="flex items-center border border-stone-300 rounded-lg">
                    <button (click)="decrement()" class="px-3 py-2 text-stone-600 hover:bg-stone-100 transition-colors">-</button>
                    <span class="px-4 py-2 text-stone-800 font-medium border-x border-stone-300">{{ cantidad }}</span>
                    <button (click)="increment()" class="px-3 py-2 text-stone-600 hover:bg-stone-100 transition-colors">+</button>
                  </div>
                  <button (click)="addToCart()"
                    class="flex-1 py-3 px-6 bg-gold-600 hover:bg-gold-700 text-white font-medium rounded-lg transition-colors text-sm">
                    Agregar al carrito
                  </button>
                </div>
              }
            </div>
          </div>
        </div>

        <div class="mt-8 bg-white rounded-2xl shadow-sm p-6">
          <h2 class="text-xl font-bold text-stone-800 mb-6">Reseñas</h2>

          @if (reviewStats) {
            <div class="flex items-center gap-4 mb-6 p-4 bg-stone-50 rounded-xl">
              <div class="text-center">
                <div class="text-4xl font-bold text-gold-600">{{ (reviewStats.promedio || 0).toFixed(1) }}</div>
                <div class="flex items-center gap-0.5 mt-1">
                  @for (star of [1,2,3,4,5]; track star) {
                    <svg class="w-4 h-4" [class.text-gold-500]="star <= Math.round(reviewStats.promedio || 0)" [class.text-stone-300]="star > Math.round(reviewStats.promedio || 0)" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  }
                </div>
                <div class="text-xs text-stone-500 mt-1">{{ reviewStats.total || 0 }} reseñas</div>
              </div>
            </div>
          }

          <div class="space-y-4 mb-8">
            @for (review of reviews; track review.id) {
              <div class="border-b border-stone-100 pb-4">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-sm font-semibold text-stone-800">{{ review.usuarioNombre || 'Anónimo' }}</span>
                  <div class="flex items-center gap-0.5">
                    @for (star of [1,2,3,4,5]; track star) {
                      <svg class="w-3 h-3" [class.text-gold-500]="star <= review.calificacion" [class.text-stone-300]="star > review.calificacion" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    }
                  </div>
                </div>
                @if (review.comentario) {
                  <p class="text-sm text-stone-600">{{ review.comentario }}</p>
                }
              </div>
            } @empty {
              <p class="text-sm text-stone-500 text-center py-4">No hay reseñas aún. ¡Sé el primero en opinar!</p>
            }
          </div>

          @if (isLoggedIn) {
            <div class="border-t border-stone-200 pt-6">
              <h3 class="text-lg font-semibold text-stone-800 mb-4">Escribir una reseña</h3>
              @if (reviewError) {
                <div class="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{{ reviewError }}</div>
              }
              <form (ngSubmit)="submitReview()" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-stone-700 mb-1">Calificación</label>
                  <div class="flex items-center gap-1">
                    @for (star of [1,2,3,4,5]; track star) {
                      <button type="button" (click)="reviewCalificacion = star" class="p-1">
                        <svg class="w-6 h-6" [class.text-gold-500]="star <= reviewCalificacion" [class.text-stone-300]="star > reviewCalificacion" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      </button>
                    }
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-stone-700 mb-1">Comentario (opcional)</label>
                  <textarea [(ngModel)]="reviewComentario" name="comentario" rows="3"
                    class="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none transition-colors text-sm"
                    placeholder="Tu opinión sobre este producto..."></textarea>
                </div>
                <button type="submit" [disabled]="reviewSubmitting"
                  class="px-6 py-2.5 bg-gold-600 text-white font-medium rounded-lg hover:bg-gold-700 transition-colors disabled:opacity-50 text-sm">
                  {{ reviewSubmitting ? 'Enviando...' : 'Enviar reseña' }}
                </button>
              </form>
            </div>
          }
        </div>
      }

      @if (!loading && !producto) {
        <div class="text-center py-16">
          <p class="text-stone-500 text-lg">Producto no encontrado</p>
        </div>
      }
    </div>
  `
})
export class ProductDetailComponent implements OnInit {
  Math = Math;
  producto: Producto | null = null;
  cantidad = 1;
  loading = false;
  isLoggedIn = false;
  inWishlist = false;
  reviews: any[] = [];
  reviewStats: any = null;
  reviewCalificacion = 5;
  reviewComentario = '';
  reviewSubmitting = false;
  reviewError = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private authService: AuthService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {
    this.authService.isLoggedIn$.subscribe(v => {
      this.isLoggedIn = v;
    });
  }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loading = true;
      this.api.getProducto(id).subscribe({
        next: (res) => {
          this.producto = res;
          this.loading = false;
          this.cdr.detectChanges();
          this.loadReviews();
          this.loadReviewStats();
          if (this.isLoggedIn) this.checkWishlist();
        },
        error: () => {
          this.loading = false;
          this.toastService.show('Error al cargar el producto', 'error');
          this.cdr.detectChanges();
        }
      });
    }
  }

  loadReviews() {
    if (!this.producto?.id) return;
    this.api.getReviews(this.producto.id).subscribe({
      next: (res) => { this.reviews = res; },
      error: () => {}
    });
  }

  loadReviewStats() {
    if (!this.producto?.id) return;
    this.api.getReviewStats(this.producto.id).subscribe({
      next: (res) => { this.reviewStats = res; },
      error: () => {}
    });
  }

  checkWishlist() {
    if (!this.producto?.id) return;
    this.api.checkWishlist(this.producto.id).subscribe({
      next: (res: any) => { this.inWishlist = res.existe; },
      error: () => {}
    });
  }

  toggleWishlist() {
    if (!this.producto?.id) return;
    if (this.inWishlist) {
      this.api.removeFromWishlist(this.producto.id).subscribe({
        next: () => {
          this.inWishlist = false;
          this.toastService.show('Eliminado de favoritos', 'success');
        },
        error: (err) => this.toastService.show(err.error?.message || 'Error', 'error')
      });
    } else {
      this.api.addToWishlist(this.producto.id).subscribe({
        next: () => {
          this.inWishlist = true;
          this.toastService.show('Agregado a favoritos', 'success');
        },
        error: (err) => this.toastService.show(err.error?.message || 'Error', 'error')
      });
    }
  }

  submitReview() {
    if (!this.producto?.id) return;
    this.reviewError = '';
    this.reviewSubmitting = true;
    this.api.createReview(this.producto.id, { calificacion: this.reviewCalificacion, comentario: this.reviewComentario }).subscribe({
      next: () => {
        this.toastService.show('Reseña enviada', 'success');
        this.reviewSubmitting = false;
        this.reviewComentario = '';
        this.reviewCalificacion = 5;
        this.loadReviews();
        this.loadReviewStats();
      },
      error: (err) => {
        this.reviewError = err.error?.message || 'Error al enviar reseña';
        this.reviewSubmitting = false;
      }
    });
  }

  increment() {
    if (this.cantidad < (this.producto?.stock || 99)) this.cantidad++;
  }

  decrement() {
    if (this.cantidad > 1) this.cantidad--;
  }

  addToCart() {
    if (!this.producto?.id) return;
    const prodId = this.producto?.id;
    if (!prodId) return;
    let carritoId = localStorage.getItem('carrito_id');
    const doAdd = (id: number) => {
      this.api.agregarItemCarrito(id, prodId, this.cantidad).subscribe({
        next: () => {
          this.toastService.show('Producto agregado al carrito', 'success');
          this.cantidad = 1;
        },
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

  goBack() {
    this.router.navigate(['/productos']);
  }
}
