import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BrandService {
    private _http = inject(HttpClient);

    createBrand(brand: any) {
        return this._http.post(`${environment.apiUrl}Brands/Create`, brand);
    }

    updateBrand(brand: any) {
        return this._http.put(`${environment.apiUrl}Brands/Update`, brand);
    }

    deleteBrand(id: number) {
        return this._http.delete(`${environment.apiUrl}Brands/Delete?BrandId=${id}`);
    }

    GetAllBrands(): Observable<any> {
        return this._http.get(`${environment.apiUrl}Brands/GetAllBrands`);
    }

    getAllBrandsPaged(PageNumber: number, PageSize: number, RealTimeData: boolean = true) {
        let params: any = { PageNumber: PageNumber, PageSize: PageSize, RealTimeData: RealTimeData };
        return this._http.get(`${environment.apiUrl}Brands/GetAllBrandsPaged`, { params: params });
    }
}
