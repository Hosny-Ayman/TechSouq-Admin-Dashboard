import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IDashboardParams } from '../../interfaces/IDashboardParams';
import * as signalR from '@microsoft/signalr';
import { MessagesService } from './messages.service';
import { environment } from '@/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    private _http = inject(HttpClient);

    private _hubConnection: signalR.HubConnection | undefined;

    private _message = inject(MessagesService);

    public startConnection = () => {
        this._hubConnection = new signalR.HubConnectionBuilder().withUrl('https://teckseq-api.runasp.net/notificationHub', { withCredentials: true }).withAutomaticReconnect().build();

        this._hubConnection.start();
    };

    public addReceiveOrderListener = (callback: (notification: any) => void) => {
        if (this._hubConnection) {
            this._hubConnection.on('ReceiveNewOrder', (data) => {
                callback(data);
            });
        }
    };

    RecentSales(Dashboard: IDashboardParams): Observable<any> {
        let params: any = { PageNumber: Dashboard.PageNumber, PageSize: Dashboard.PageSize };

        if (Dashboard.SortField !== undefined && Dashboard.SortField !== null && Dashboard.SortField !== 'undefined') {
            params.SortField = Dashboard.SortField;
        }

        if (Dashboard.SortOrder !== undefined && Dashboard.SortOrder !== null) {
            params.SortOrder = Dashboard.SortOrder;
        }
        return this._http.get(`${environment.apiUrl}Dashboard/RecentSales`, { params: params });
    }

    ShowDashboardInfo(): Observable<any> {
        return this._http.get(`${environment.apiUrl}Dashboard/ShowDashboardInfo`);
    }

    SalesLast7Days(): Observable<any> {
        return this._http.get(`${environment.apiUrl}Dashboard/SalesLast7Days`);
    }

    BestSellingProducts(): Observable<any> {
        return this._http.get(`${environment.apiUrl}Dashboard/BestSellingProducts`);
    }
}
