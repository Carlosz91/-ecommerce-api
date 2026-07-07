import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.isAdmin$.pipe(
    take(1),
    map(isAdmin => {
      if (!isAdmin) {
        router.navigate(['/']);
        return false;
      }
      return true;
    })
  );
};
