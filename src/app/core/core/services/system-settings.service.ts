import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SystemSettingsService {
    private _http = inject(HttpClient);

    getAllSettings() {
        return this._http.get(`${environment.apiUrl}SystemSettings/GetAllSystemSettings`);
    }

    getSettingByKey(key: string) {
        return this._http.get(`${environment.apiUrl}SystemSettings/${key}`);
    }

    addSetting(setting: any) {
        return this._http.post(`${environment.apiUrl}SystemSettings/Add`, setting);
    }

    updateSetting(setting: any) {
        return this._http.put(`${environment.apiUrl}SystemSettings/Update`, setting);
    }
}
