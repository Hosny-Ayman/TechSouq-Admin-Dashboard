import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CouponsAdminService {
    private _http = inject(HttpClient);

    getAllPaged(pageNumber: number, pageSize: number, codeSearch: string = '') {
        let params: any = { pageNumber: pageNumber, pageSize: pageSize, CodeSearch: codeSearch };
        return this._http.get(`${environment.apiUrl}Coupons/GetAllCouponsPaged`, { params: params });
    }

    getCoupon(id: number) {
        let params: any = { id: id };
        return this._http.get(`${environment.apiUrl}Coupons/GetCouponById`, { params: params });
    }

    addCoupon(coupon: any) {
        return this._http.post(`${environment.apiUrl}Coupons/Add`, coupon);
    }

    updateCoupon(coupon: any) {
        return this._http.put(`${environment.apiUrl}Coupons/Update`, coupon);
    }

    deleteCoupon(id: number) {
        return this._http.delete(`${environment.apiUrl}Coupons/Delete/${id}`);
    }
}
