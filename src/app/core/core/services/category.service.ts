import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private _http = inject(HttpClient);

    createCategory(category: any) {
        return this._http.post(`${environment.apiUrl}Categories/Create`, category);
    }

    updateCategory(category: any) {
        return this._http.put(`${environment.apiUrl}Categories/Update`, category);
    }

    deleteCategory(id: number) {
        return this._http.delete(`${environment.apiUrl}Categories/Delete?CategorieId=${id}`);
    }

    GetAllCategorieForSelect(): Observable<any> {
        return this._http.get(`${environment.apiUrl}Categories/GetAllCategorieForSelect`);
    }

    getAllCategoriesPaged(pageNumber: number, pageSize: number, RealTimeData: boolean = true) {
        const params: any = { PageNumber: pageNumber, PageSize: pageSize, RealTimeData: RealTimeData };
        return this._http.get(`${environment.apiUrl}Categories/GetAllCategoriesAsync`, { params: params });
    }
}
