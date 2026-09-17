import { orderStatus } from '@/app/core/core/enums/orderStatus';
import { MessagesService } from '@/app/core/core/services/messages.service';
import { OrderService } from '@/app/core/core/services/order.service';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ImageInfo } from '@/app/core/interfaces/IImageInfo';
import { UtilityService } from '@/app/core/core/services/utility.service';

@Component({
    selector: 'app-order-details',
    imports: [CommonModule, FormsModule, TableModule, SelectModule, ButtonModule, TagModule],
    templateUrl: './order-details.html',
    styleUrl: './order-details.scss'
})
export class OrderDetails implements OnInit {
    private _orderService = inject(OrderService);
    private _cdr = inject(ChangeDetectorRef);
    private _message = inject(MessagesService);
    private _route = inject(ActivatedRoute);
    private _location = inject(Location);
    private _utilaty = inject(UtilityService);

    orderId!: number;
    orderDetails: any = null;
    loading: boolean = true;
    updatingStatus: boolean = false;

    selectedStatus: orderStatus | null = null;

    statuses = [
        { label: 'Pending', value: orderStatus.Pending },
        { label: 'Processing', value: orderStatus.Processing },
        { label: 'Shipped', value: orderStatus.Shipped },
        { label: 'Delivered', value: orderStatus.Delivered },
        { label: 'Cancelled', value: orderStatus.Cancelled }
    ];

    ngOnInit(): void {
        this.orderId = Number(this._route.snapshot.paramMap.get('id'));

        if (this.orderId) {
            this.fetchOrderDetails();
        }
    }

    fetchOrderDetails() {
        this.loading = true;
        this._orderService.GetOrderDtailsAdmin(this.orderId).subscribe({
            next: (req: any) => {
                this.orderDetails = req.data;
                if (typeof this.orderDetails.status === 'string') {
                    this.selectedStatus = orderStatus[this.orderDetails.status as keyof typeof orderStatus];
                } else {
                    this.selectedStatus = this.orderDetails.status;
                }
                this.loading = false;
                this._cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error fetching order details', err);
                this.loading = false;
                this._cdr.detectChanges();
            }
        });
    }

    updateStatus() {
        if (!this.selectedStatus) return;

        this.updatingStatus = true;
        this._orderService.UpdateStatus(this.orderId, this.selectedStatus).subscribe({
            next: (res) => {
                this.orderDetails.status = orderStatus[this.selectedStatus!];
                this.updatingStatus = false;
                this._cdr.detectChanges();
                this._message.showSuccess('Status updated successfully');
            },
            error: (err) => {
                console.error('Failed to update status', err);
                this.updatingStatus = false;
                this._cdr.detectChanges();
                this._message.showError('Status updated Failed');
            }
        });
    }

    goBack() {
        this._location.back();
    }

    getImageUrl(imageFile: string, imagePath: string): string {
        const imageinfo: ImageInfo = { imageFile: imageFile, imagePath: imagePath };

        return this._utilaty.getImageUrl(imageinfo);
    }

    getSeverity(status: any): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
        let currentStatus = typeof status === 'string' ? orderStatus[status as keyof typeof orderStatus] : status;
        switch (currentStatus) {
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
