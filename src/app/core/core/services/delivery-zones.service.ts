import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class DeliveryZonesService {
    private _http = inject(HttpClient);

    getAllPaged(pageNumber: number, pageSize: number, nameSearch: string = '') {
        let params: any = { pageNumber: pageNumber, pageSize: pageSize, NameSearch: nameSearch };
        return this._http.get(`${environment.apiUrl}DeliveryZones/GetAllDeliveryZonesPaged`, { params: params });
    }

    addZone(zone: any) {
        return this._http.post(`${environment.apiUrl}DeliveryZones`, zone);
    }

    updateZone(zone: any) {
        return this._http.put(`${environment.apiUrl}DeliveryZones/UpdateDeliveryZone`, zone);
    }

    deleteZone(id: number) {
        let params: any = { DeliveryZoneId: id };
        return this._http.delete(`${environment.apiUrl}DeliveryZones/DeleteDeliveryZone`, { params: params });
    }
}
