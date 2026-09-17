import { CustomersAdminService } from '@/app/core/core/services/customers-admin.service';
import { MessagesService } from '@/app/core/core/services/messages.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';

@Component({
    selector: 'app-customers',
    imports: [CommonModule, FormsModule, TableModule, ButtonModule, DialogModule, InputTextModule],
    templateUrl: './customers.html',
    styleUrl: './customers.scss'
})
export class Customers implements OnInit {
    private _customerService = inject(CustomersAdminService);
    private _message = inject(MessagesService);
    private _cdr = inject(ChangeDetectorRef);

    searchEmail: string = '';
    customers: any[] = [];
    customerDetails: any = null;
    displayDetailsDialog: boolean = false;

    loading: boolean = false;
    first: number = 0;
    pageSize: number = 30;
    pageNumber: number = 1;
    totalRecords: number = 0;

    ngOnInit(): void {
        this.loadCustomers();
    }

    loadCustomers(event?: TableLazyLoadEvent) {
        this.loading = true;
        const rows = event?.rows || this.pageSize;
        this.pageNumber = (event?.first || 0) / rows + 1;
        this.first = event?.first || 0;
        this.pageSize = rows;

        this._customerService.getAllCustomersPaged(this.pageNumber, this.pageSize, this.searchEmail).subscribe({
            next: (res: any) => {
                this.customers = res.data.data;
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
        if (!this.searchEmail || this.searchEmail.trim() === '') {
            this.loadCustomers({ first: 0, rows: this.pageSize });
        }
    }

    viewDetails(cust: any) {
        this._customerService.getCustomerDetails(cust.id).subscribe({
            next: (res: any) => {
                this.customerDetails = res.data;
                this.customerDetails.isActive = cust.isActive;
                this.displayDetailsDialog = true;
                this._cdr.detectChanges();
            },
            error: (err) => this._message.showError('Failed to load details')
        });
    }

    toggleStatus(customer: any) {
        if (confirm(`Are you sure you want to ${customer.isActive ? 'Block' : 'Unblock'} this customer?`)) {
            this._customerService.toggleCustomerActive(customer.id).subscribe({
                next: () => {
                    this._message.showSuccess('Status updated successfully!');
                    this.loadCustomers({ first: this.first, rows: this.pageSize });
                },
                error: (err: any) => {
                    err?.error?.errors?.forEach((er: string) => this._message.showError(er));
                }
            });
        }
    }
}
