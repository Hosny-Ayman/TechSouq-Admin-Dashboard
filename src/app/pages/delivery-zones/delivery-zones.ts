import { DeliveryZonesService } from '@/app/core/core/services/delivery-zones.service';
import { MessagesService } from '@/app/core/core/services/messages.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';

@Component({
    selector: 'app-delivery-zones',
    imports: [CommonModule, FormsModule, TableModule, ButtonModule, DialogModule, InputTextModule],
    templateUrl: './delivery-zones.html',
    styleUrl: './delivery-zones.scss'
})
export class DeliveryZones implements OnInit {
    private _zoneService = inject(DeliveryZonesService);
    private _message = inject(MessagesService);
    private _cdr = inject(ChangeDetectorRef);

    searchName: string = '';
    zones: any[] = [];
    displayDialog: boolean = false;
    isEditMode: boolean = false;

    loading: boolean = false;
    first: number = 0;
    pageSize: number = 30;
    pageNumber: number = 1;
    totalRecords: number = 0;

    zoneForm: any = { id: 0, name: '', shippingCost: 0 };

    ngOnInit(): void {
        this.loadZones();
    }

    loadZones(event?: TableLazyLoadEvent) {
        this.loading = true;
        const rows = event?.rows || this.pageSize;
        this.pageNumber = (event?.first || 0) / rows + 1;
        this.first = event?.first || 0;
        this.pageSize = rows;

        this._zoneService.getAllPaged(this.pageNumber, this.pageSize, this.searchName).subscribe({
            next: (res: any) => {
                this.zones = res.data.data;
                this.totalRecords = res.data.totalRecords;
                this.loading = false;
                this._cdr.detectChanges();
            },
            error: (err) => {
                this.loading = false;

                this._cdr.detectChanges();
            }
        });
    }

    onSearchChange() {
        if (!this.searchName || this.searchName.trim() === '') {
            this.loadZones({ first: 0, rows: this.pageSize });
        }
    }

    openNew() {
        this.zoneForm = { id: 0, name: '', shippingCost: 0 };
        this.isEditMode = false;
        this.displayDialog = true;
    }

    editZone(zone: any) {
        this.zoneForm = { ...zone };
        this.isEditMode = true;
        this.displayDialog = true;
    }

    saveZone() {
        if (this.isEditMode) {
            this._zoneService.updateZone(this.zoneForm).subscribe({
                next: () => {
                    this._message.showSuccess('Updated!');
                    this.loadZones({ first: this.first, rows: this.pageSize });
                    this.displayDialog = false;
                },
                error: (err: any) => {
                    err?.error?.errors?.forEach((er: string) => this._message.showError(er));
                }
            });
        } else {
            this._zoneService.addZone(this.zoneForm).subscribe({
                next: () => {
                    this._message.showSuccess('Added!');
                    this.loadZones({ first: 0, rows: this.pageSize });
                    this.displayDialog = false;
                },
                error: (err: any) => {
                    err?.error?.errors?.forEach((er: string) => this._message.showError(er));
                }
            });
        }
    }

    deleteZone(id: number) {
        if (confirm('Are you sure you want to delete this zone?')) {
            this._zoneService.deleteZone(id).subscribe({
                next: () => {
                    this._message.showSuccess('Deleted successfully!');
                    this.loadZones({ first: this.first, rows: this.pageSize });
                },
                error: (err: any) => {
                    err?.error?.errors?.forEach((er: string) => this._message.showError(er));
                }
            });
        }
    }
}
