import { CouponsAdminService } from '@/app/core/core/services/coupons-admin.service';
import { MessagesService } from '@/app/core/core/services/messages.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';

@Component({
    selector: 'app-coupons',
    imports: [CommonModule, FormsModule, TableModule, ButtonModule, DialogModule, InputTextModule, SelectModule, DatePickerModule, CheckboxModule],
    templateUrl: './coupons.html',
    styleUrl: './coupons.scss'
})
export class Coupons implements OnInit {
    private _couponService = inject(CouponsAdminService);
    private _message = inject(MessagesService);
    private _cdr = inject(ChangeDetectorRef);

    searchCode: string = '';
    coupons: any[] = [];
    displayDialog: boolean = false;
    isEditMode: boolean = false;

    loading: boolean = false;
    first: number = 0;
    pageSize: number = 30;
    pageNumber: number = 1;
    totalRecords: number = 0;

    discountTypes = [
        { label: 'Percentage (%)', value: 1 },
        { label: 'Fixed Amount ($)', value: 2 }
    ];

    couponForm: any = {
        id: 0,
        code: '',
        discountValue: 0,
        discountType: 1,
        expiryDate: new Date(),
        isActive: true,
        isApplicableOnDiscountedItems: false,
        usageLimit: 1
    };

    ngOnInit(): void {
        this.loadCoupons();
    }

    loadCoupons(event?: TableLazyLoadEvent) {
        this.loading = true;
        const rows = event?.rows || this.pageSize;
        this.pageNumber = (event?.first || 0) / rows + 1;
        this.first = event?.first || 0;
        this.pageSize = rows;

        this._couponService.getAllPaged(this.pageNumber, this.pageSize, this.searchCode).subscribe({
            next: (res: any) => {
                this.coupons = res.data.data;
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
        if (!this.searchCode || this.searchCode.trim() === '') {
            this.loadCoupons({ first: 0, rows: this.pageSize });
        }
    }

    openNew() {
        this.couponForm = { id: 0, code: '', discountValue: 0, discountType: 0, expiryDate: new Date(), isActive: true, isApplicableOnDiscountedItems: false, usageLimit: 1 };
        this.isEditMode = false;
        this.displayDialog = true;
    }

    editCoupon(coupon: any) {
        this.getCoupone(coupon.id);
        this.isEditMode = true;
        this.displayDialog = true;
    }

    saveCoupon() {
        if (this.isEditMode) {
            this._couponService.updateCoupon(this.couponForm).subscribe({
                next: () => {
                    this._message.showSuccess('Updated!');
                    this.loadCoupons({ first: this.first, rows: this.pageSize });
                    this.displayDialog = false;
                },
                error: (err: any) => {
                    err?.error?.errors?.forEach((er: string) => this._message.showError(er));
                }
            });
        } else {
            this._couponService.addCoupon(this.couponForm).subscribe({
                next: () => {
                    this._message.showSuccess('Added!');

                    this.loadCoupons({ first: 0, rows: this.pageSize });
                    this.displayDialog = false;
                },
                error: (err: any) => {
                    err?.error?.errors?.forEach((er: string) => this._message.showError(er));
                }
            });
        }
    }

    getCoupone(id: number): void {
        this._couponService.getCoupon(id).subscribe({
            next: (res: any) => {
                this.couponForm = res.data;
                this.couponForm.expiryDate = new Date(res.data.expiryDate);
                this.couponForm.discountType = res.data.discountType === 'FixedAmount' ? 2 : 1;
                this._cdr.detectChanges();
            }
        });
    }

    deleteCoupon(id: number) {
        if (confirm('Delete this coupon?')) {
            this._couponService.deleteCoupon(id).subscribe({
                next: () => {
                    this._message.showSuccess('Deleted!');
                    this.loadCoupons({ first: this.first, rows: this.pageSize });
                }
            });
        }
    }
}
