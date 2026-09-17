import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CustomersAdminService {
    private _http = inject(HttpClient);

    getAllCustomersPaged(pageNumber: number, pageSize: number, emailSearch: string = '') {
        let params: any = { pageNumber: pageNumber, pageSize: pageSize, EmailSearch: emailSearch };
        return this._http.get(`${environment.apiUrl}Users/GetAllCustomersPaged`, { params: params });
    }

    getCustomerDetails(customerId: number) {
        let params: any = { customerId: customerId };
        return this._http.get(`${environment.apiUrl}Users/GetCustomerDetails`, { params: params });
    }

    toggleCustomerActive(customerId: number) {
        let params: any = { customerId: customerId };
        return this._http.get(`${environment.apiUrl}Users/IsActive`, { params: params });
    }
}
