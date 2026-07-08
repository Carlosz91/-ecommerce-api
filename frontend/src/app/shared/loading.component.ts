import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (visible) {
      <div class="fixed inset-0 bg-stone-900/40 z-40 flex items-center justify-center">
        <div class="bg-white rounded-xl p-6 shadow-2xl flex flex-col items-center gap-3">
          <div class="animate-spin rounded-full h-10 w-10 border-4 border-gold-500 border-t-transparent"></div>
          <p class="text-stone-600 text-sm font-medium">Cargando...</p>
        </div>
      </div>
    }
  `
})
export class LoadingComponent {
  @Input() visible = false;
}
