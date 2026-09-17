import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError, BehaviorSubject, filter, take } from 'rxjs';
import { AuthService } from '../services/auth-service.service';
import { Router } from '@angular/router';

let isRefreshing = false;
const refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const clonedReq = req.clone({
        withCredentials: true
    });

    return next(clonedReq).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401 && !req.url.includes('/Auth/LoginAdmin') && !req.url.includes('/Auth/RefreshToken')) {
                if (!isRefreshing) {
                    isRefreshing = true;
                    refreshTokenSubject.next(null);

                    return authService.RefreshToken().pipe(
                        switchMap(() => {
                            isRefreshing = false;
                            refreshTokenSubject.next(true);

                            return next(req.clone({ withCredentials: true }));
                        }),
                        catchError((refreshErr) => {
                            isRefreshing = false;
                            if (typeof window !== 'undefined') {
                                localStorage.removeItem('userData');
                                window.location.href = '/login';
                            }
                            return throwError(() => refreshErr);
                        })
                    );
                } else {
                    return refreshTokenSubject.pipe(
                        filter((result) => result !== null),
                        take(1),
                        switchMap(() => {
                            return next(req.clone({ withCredentials: true }));
                        })
                    );
                }
            }

            if (error.status === 403) {
                authService.clearAuthData();
                router.navigate(['/auth/login']);
            }
            return throwError(() => error);
        })
    );
};
