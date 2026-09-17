import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { window } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem('userData');

        if (userStr) {
            const user = JSON.parse(userStr);

            if (user.roleId !== 2) {
                return true;
            }
        }
    }

    router.navigate(['/auth/login']);
    return false;
};
