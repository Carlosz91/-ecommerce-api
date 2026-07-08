import { Component, Injectable, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private subject = new BehaviorSubject<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  toast$ = this.subject.asObservable();

  show(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.subject.next({ message, type });
    setTimeout(() => this.subject.next(null), 4000);
  }
}

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (toast) {
      <div class="fixed top-4 right-4 z-50 animate-bounce-in" [class]="toastClass">
        <div class="flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium">
          @if (toast.type === 'success') {
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          }
          @if (toast.type === 'error') {
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          }
          @if (toast.type === 'info') {
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          }
          <span>{{ toast.message }}</span>
        </div>
      </div>
    }
  `,
  styles: [`
    @keyframes bounce-in {
      0% { transform: translateX(100%); opacity: 0; }
      60% { transform: translateX(-10px); opacity: 1; }
      100% { transform: translateX(0); opacity: 1; }
    }
    .animate-bounce-in { animation: bounce-in 0.3s ease-out; }
  `]
})
export class ToastComponent implements OnDestroy {
  toast: { message: string; type: string } | null = null;
  private sub: Subscription;

  constructor(private toastService: ToastService, private cdr: ChangeDetectorRef) {
    this.sub = this.toastService.toast$.subscribe(t => {
      this.toast = t;
      this.cdr.detectChanges();
    });
  }

  get toastClass(): string {
    if (!this.toast) return '';
    const base = 'pointer-events-auto';
    switch (this.toast.type) {
      case 'success': return `${base} bg-emerald-500`;
      case 'error': return `${base} bg-red-500`;
      default: return `${base} bg-gold-600`;
    }
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
