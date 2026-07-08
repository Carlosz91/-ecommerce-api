import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="bg-gradient-to-r from-stone-900 to-stone-800 shadow-lg border-b border-gold-600/30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center gap-8">
            <a routerLink="/productos" class="flex items-center gap-2 text-xl font-bold text-gold-400 hover:text-gold-300 transition-colors">
              <svg class="w-8 h-8 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
              E-Commerce
            </a>
            <div class="hidden md:flex items-center gap-6">
              <a routerLink="/productos" routerLinkActive="text-gold-400 font-semibold" class="text-stone-300 hover:text-gold-400 transition-colors text-sm font-medium">Productos</a>
              @if (isLoggedIn) {
                <a routerLink="/carrito" routerLinkActive="text-gold-400 font-semibold" class="relative text-stone-300 hover:text-gold-400 transition-colors text-sm font-medium">
                  Carrito
                </a>
                <a routerLink="/wishlist" routerLinkActive="text-gold-400 font-semibold" class="relative text-stone-300 hover:text-gold-400 transition-colors text-sm font-medium">
                  Favoritos
                </a>
              }
              @if (isAdmin) {
                <a routerLink="/admin" routerLinkActive="text-gold-400 font-semibold" class="text-stone-300 hover:text-gold-400 transition-colors text-sm font-medium">Admin</a>
              }
            </div>
          </div>
          <div class="flex items-center gap-4">
            @if (isLoggedIn) {
              <span class="hidden md:block text-sm text-stone-400">{{ email }}</span>
              <button (click)="logout()" class="hidden md:inline-flex items-center px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg transition-colors">Cerrar sesi\u00f3n</button>
            } @else {
              <a routerLink="/login" class="hidden md:inline-flex items-center px-4 py-2 text-sm font-medium text-stone-900 bg-gold-500 hover:bg-gold-400 rounded-lg transition-colors">Iniciar sesi\u00f3n</a>
            }
            <button (click)="menuOpen = !menuOpen" class="md:hidden p-2 rounded-lg text-stone-300 hover:bg-stone-700 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                @if (menuOpen) {
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                } @else {
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                }
              </svg>
            </button>
          </div>
        </div>
      </div>
      @if (menuOpen) {
        <div class="md:hidden border-t border-gold-600/30 bg-stone-800">
          <div class="px-4 py-3 space-y-2">
            <a routerLink="/productos" (click)="menuOpen = false" class="block px-3 py-2 rounded-lg text-stone-300 hover:bg-stone-700 transition-colors text-sm font-medium">Productos</a>
            @if (isLoggedIn) {
              <a routerLink="/carrito" (click)="menuOpen = false" class="block px-3 py-2 rounded-lg text-stone-300 hover:bg-stone-700 transition-colors text-sm font-medium">Carrito</a>
              <a routerLink="/wishlist" (click)="menuOpen = false" class="block px-3 py-2 rounded-lg text-stone-300 hover:bg-stone-700 transition-colors text-sm font-medium">Favoritos</a>
            }
            @if (isAdmin) {
              <a routerLink="/admin" (click)="menuOpen = false" class="block px-3 py-2 rounded-lg text-stone-300 hover:bg-stone-700 transition-colors text-sm font-medium">Admin</a>
            }
            <hr class="border-gold-600/30">
            @if (isLoggedIn) {
              <span class="block px-3 py-2 text-sm text-stone-400">{{ email }}</span>
              <button (click)="logout(); menuOpen = false" class="block w-full text-left px-3 py-2 rounded-lg text-red-400 hover:bg-red-900/30 transition-colors text-sm font-medium">Cerrar sesi\u00f3n</button>
            } @else {
              <a routerLink="/login" (click)="menuOpen = false" class="block px-3 py-2 rounded-lg text-gold-400 hover:bg-stone-700 transition-colors text-sm font-medium">Iniciar sesi\u00f3n</a>
            }
          </div>
        </div>
      }
    </nav>
  `
})
export class NavbarComponent implements OnDestroy {
  isLoggedIn = false;
  isAdmin = false;
  email = '';
  menuOpen = false;
  private sub: Subscription;

  constructor(private authService: AuthService, private router: Router) {
    this.sub = this.authService.user$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.isAdmin = user?.rol === 'ADMIN';
      this.email = user?.email || '';
    });
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/']),
      error: () => this.router.navigate(['/'])
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
