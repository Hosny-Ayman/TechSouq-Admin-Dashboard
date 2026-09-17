import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private _http = inject(HttpClient);

    CreateProduct(formData: FormData): Observable<any> {
        return this._http.post(`${environment.apiUrl}Products/Create`, formData);
    }

    GetProduct(productId: number, deatils: boolean = false): Observable<any> {
        let params: any = { productId: productId, deatils: deatils };

        return this._http.get(`${environment.apiUrl}Products/Get`, {
            params: params
        });
    }

    public GetProductsPaged(PageNumber: number, PageSize: number, searchTerm: string = '', Catogrie: string = '', bypassCache: boolean = false, deatails: boolean = false): Observable<any> {
        let params: any = { PageNumber: PageNumber, PageSize: PageSize };

        if (searchTerm) {
            params.searchTerm = searchTerm;
        }
        if (Catogrie) {
            params.Catogrie = Catogrie;
        }
        params.bypassCache = bypassCache;
        params.deatails = deatails;

        return this._http.get(`${environment.apiUrl}Products/GetProductsPaged`, {
            params: params
        });
    }

    UpdateProduct(formData: FormData): Observable<any> {
        return this._http.put(`${environment.apiUrl}Products`, formData);
    }

    DeleteProduct(productId: number): Observable<any> {
        return this._http.delete(`${environment.apiUrl}Products/Delete`, {
            params: new HttpParams().set('productId', productId)
        });
    }
}
