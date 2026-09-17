import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '@/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private _http = inject(HttpClient);
    private _router = inject(Router);

    loginAdmin(credentials: any): Observable<any> {
        return this._http.post(`${environment.apiUrl}Auth/LoginAdmin`, credentials).pipe(
            tap((response: any) => {
                if (response && response.isSuccess) {
                    const { id, ...userDataWithoutId } = response.data;
                    localStorage.setItem('userData', JSON.stringify(userDataWithoutId));
                }
            })
        );
    }

    RefreshToken(): Observable<any> {
        return this._http.post(`${environment.apiUrl}Auth/RefreshToken`, {});
    }

    logout(): Observable<any> {
        return this._http.post(`${environment.apiUrl}Auth/Logout`, {}).pipe(
            tap(() => {
                this.clearAuthData();
            })
        );
    }

    clearAuthData() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('userData');
            this._router.navigate(['/auth/login']);
        }
    }

    getCurrentUser(): any {
        if (typeof window !== 'undefined') {
            const userStr = localStorage.getItem('userData');
            return userStr ? JSON.parse(userStr) : null;
        }
        return null;
    }

    isAdmin(): boolean {
        const user = this.getCurrentUser();
        return user !== null && user.roleId !== 2;
    }
}
