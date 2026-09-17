import { orderStatus } from '@/app/core/core/enums/orderStatus';
import { IOrderParams } from './../../core/interfaces/IOrderPrams';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { OrderService } from '@/app/core/core/services/order.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-orders',
    imports: [CommonModule, FormsModule, TableModule, SelectModule, ButtonModule, TagModule, InputTextModule, RouterLink],
    templateUrl: './orders.html',
    styleUrl: './orders.scss'
})
export class Orders implements OnInit {
    ngOnInit(): void {
        const savedState = this._order.tableState;
        this.first = savedState.first;
        this.rows = savedState.rows;
        this.searchTerm = savedState.searchTerm;
        this.selectedStatus = savedState.selectedStatus;
    }
    private _order = inject(OrderService);
    private _cdr = inject(ChangeDetectorRef);
    orders: any[] = [];
    totalRecords: number = 0;
    loading: boolean = false;

    selectedStatus: orderStatus | null = null;
    searchTerm: string = '';

    rows: number = 10;
    first: number = 0;

    statuses = [
        { label: 'All', value: null },
        { label: 'Pending', value: orderStatus.Pending },
        { label: 'Processing', value: orderStatus.Processing },
        { label: 'Shipped', value: orderStatus.Shipped },
        { label: 'Delivered', value: orderStatus.Delivered },
        { label: 'Cancelled', value: orderStatus.Cancelled }
    ];

    onLazyLoad(event: TableLazyLoadEvent) {
        this.first = event.first ?? 0;
        this.rows = event.rows ?? 10;

        this.fetchOrdersFromServer();
    }

    fetchOrdersFromServer() {
        this.loading = true;

        this._cdr.detectChanges();

        this._order.tableState = {
            first: this.first,
            rows: this.rows,
            searchTerm: this.searchTerm,
            selectedStatus: this.selectedStatus
        };

        const pageNumber = this.first / this.rows + 1;
        const pageSize = this.rows;

        const params: IOrderParams = {
            PageNumber: pageNumber,
            PageSize: pageSize,
            OrderStatus: this.selectedStatus,
            search: this.searchTerm
        };

        this._order.GetAllOrdersPaged(params).subscribe({
            next: (req: any) => {
                this.orders = req.data.data;

                this.totalRecords = req.data.totalRecords;

                this.loading = false;
                this._cdr.detectChanges();
            },
            error: (err: any) => {
                this.loading = false;
                this._cdr.detectChanges();
            }
        });
    }

    onStatusChange() {
        this.resetTableAndFetch();
    }

    onSearchEnter() {
        this.resetTableAndFetch();
        this.loading = false;
    }

    onSearchChange() {
        if (!this.searchTerm || this.searchTerm.trim() === '') {
            this.onSearchEnter();
        }
    }

    resetTableAndFetch() {
        this.first = 0;
        this.fetchOrdersFromServer();
    }

    getSeverity(status: orderStatus): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
        switch (status) {
            case orderStatus.Delivered:
                return 'success';
            case orderStatus.Shipped:
                return 'info';
            case orderStatus.Processing:
                return 'warn';
            case orderStatus.Cancelled:
                return 'danger';
            default:
                return 'secondary';
        }
    }
}
