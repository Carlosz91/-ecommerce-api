import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/productos', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./features/auth/register.component').then(m => m.RegisterComponent) },
  { path: 'productos', loadComponent: () => import('./features/shop/product-list.component').then(m => m.ProductListComponent) },
  { path: 'productos/:id', loadComponent: () => import('./features/shop/product-detail.component').then(m => m.ProductDetailComponent) },
  { path: 'carrito', loadComponent: () => import('./features/shop/cart.component').then(m => m.CartComponent), canActivate: [authGuard] },
  { path: 'checkout', loadComponent: () => import('./features/checkout/checkout.component').then(m => m.CheckoutComponent), canActivate: [authGuard] },
  { path: 'admin', loadComponent: () => import('./features/admin/dashboard.component').then(m => m.DashboardComponent), canActivate: [adminGuard] },
  { path: 'admin/productos', loadComponent: () => import('./features/admin/admin-products.component').then(m => m.AdminProductsComponent), canActivate: [adminGuard] },
  { path: 'admin/categorias', loadComponent: () => import('./features/admin/admin-categories.component').then(m => m.AdminCategoriesComponent), canActivate: [adminGuard] },
  { path: 'admin/pedidos', loadComponent: () => import('./features/admin/admin-orders.component').then(m => m.AdminOrdersComponent), canActivate: [adminGuard] },
  { path: '**', redirectTo: '/productos' },
];
