import { BrandService } from '@/app/core/core/services/brand.service';
import { MessagesService } from '@/app/core/core/services/messages.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';

@Component({
    selector: 'app-brands',
    imports: [CommonModule, FormsModule, TableModule, ButtonModule, DialogModule, InputTextModule, SelectModule],
    templateUrl: './brands.html',
    styleUrl: './brands.scss'
})
export class Brands {
    private _brandsService = inject(BrandService);
    private _cdr = inject(ChangeDetectorRef);
    private _message = inject(MessagesService);

    brands: any[] = [];
    brand: any = { id: 0, name: '' };
    isEditMode: boolean = false;

    loading: boolean = false;

    first: number = 0;
    pageSize: number = 30;
    pageNumber: number = 1;
    totalRecords: number = 0;

    displayDialog: boolean = false;

    loadBrands(event: TableLazyLoadEvent) {
        this.loading = true;
        const rwos = event.rows || this.pageSize;
        this.pageNumber = (event.first || 0) / rwos + 1;
        this.first = event.first || 0;
        this.pageSize = rwos;

        this._brandsService.getAllBrandsPaged(this.pageNumber, this.pageSize).subscribe({
            next: (res: any) => {
                this.brands = res.data.data;
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

    openNew() {
        this.brand = { id: 0, name: '' };
        this.isEditMode = false;
        this.displayDialog = true;
    }

    editbrands(brand: any) {
        this.brand = { ...brand };
        this.displayDialog = true;
        this.isEditMode = true;
    }

    savebrands() {
        if (this.isEditMode) {
            this._brandsService.updateBrand(this.brand).subscribe({
                next: () => {
                    this._message.showSuccess('brand Updated!');
                    this.loadBrands({ first: this.first, rows: this.pageSize });
                    this.displayDialog = false;
                }
            });
        } else {
            this._brandsService.createBrand(this.brand).subscribe({
                next: () => {
                    this._message.showSuccess('brand Created!');
                    this.loadBrands({ first: this.first, rows: this.pageSize });
                    this.displayDialog = false;
                }
            });
        }
    }

    deletebrand(id: number) {
        if (confirm('Are you sure you want to delete this brand?')) {
            this._brandsService.deleteBrand(id).subscribe({
                next: () => {
                    this._message.showSuccess('brand Deleted!');
                    this.loadBrands({ first: this.first, rows: this.pageSize });
                }
            });
        }
    }
}
