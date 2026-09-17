import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { RippleModule } from 'primeng/ripple';
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { DashboardService } from '@/app/core/core/services/dashboard.service';
import { LazyLoadEvent } from 'primeng/api';
import { IDashboardParams } from '@/app/core/interfaces/IDashboardParams';
import { UtilityService } from '@/app/core/core/services/utility.service';
import { ImageInfo } from '@/app/core/interfaces/IImageInfo';
import { RouterLink } from '@angular/router';
import { ProductService } from '@/app/core/core/services/product.service';

@Component({
    standalone: true,
    selector: 'app-recent-sales-widget',
    imports: [CommonModule, TableModule, ButtonModule, RippleModule, RouterLink],
    template: `<div class="card mb-8!">
        <div class="font-semibold text-xl mb-4">Recent Sales</div>
        <p-table
            [value]="products"
            [lazy]="true"
            (onLazyLoad)="loadProducts($event)"
            [paginator]="true"
            [rows]="PageSize"
            [totalRecords]="totalRecords"
            [loading]="loading"
            [rowsPerPageOptions]="[5, 10, 20, 50]"
            [scrollable]="true"
            scrollHeight="400px"
        >
            <ng-template #header>
                <tr>
                    <th>Image</th>
                    <th pSortableColumn="name">Name <p-sortIcon field="name"></p-sortIcon></th>
                    <th pSortableColumn="price">Price <p-sortIcon field="price"></p-sortIcon></th>
                    <th pSortableColumn="inventoryStatus">
                        Status
                        <p-sortIcon field="inventoryStatus"></p-sortIcon>
                    </th>
                    <th>View</th>
                </tr>
            </ng-template>
            <ng-template #body let-product>
                <tr>
                    <td style="width: 15%; min-width: 5rem;">
                        <img [src]="getImageUrl('ProductImages', product.productImage)" class="shadow-lg" alt="{{ product.name }}" width="50" />
                    </td>
                    <td style="width: 35%; min-width: 7rem;">{{ product.productName }}</td>
                    <td style="width: 35%; min-width: 8rem;">{{ product.price | currency: 'USD' }}</td>
                    <td style="width: 20%; min-width: 8rem;">
                        {{ product.status }}
                    </td>
                    <td style="width: 15%;">
                        <button pButton pRipple type="button" icon="pi pi-search" class="p-button p-component p-button-text p-button-icon-only" [routerLink]="['/orderDetils', product.id]"></button>
                    </td>
                </tr>
            </ng-template>
        </p-table>
    </div>`,
    providers: [ProductService]
})
export class RecentSalesWidget {
    private _dashboardService = inject(DashboardService);
    private _cdr = inject(ChangeDetectorRef);
    private _utilaty = inject(UtilityService);

    products: any[] = [];
    PageSize: number = 5;
    PageNumber: number = 1;
    totalRecords: number = 0;
    loading: boolean = false;

    loadProducts(event: TableLazyLoadEvent) {
        this.loading = true;
        this._cdr.detectChanges();

        const rows = event.rows || this.PageSize;
        this.PageSize = rows;
        this.PageNumber = (event.first || 0) / rows + 1;

        const params: IDashboardParams = { PageNumber: this.PageNumber, PageSize: this.PageSize };

        if (event.sortField) {
            params.SortField = event.sortField;
        }

        if (event.sortField || event.sortOrder != null) {
            params.SortOrder = event.sortOrder;
        }

        this._dashboardService.RecentSales(params).subscribe({
            next: (req: any) => {
                this.products = req.data.data;
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

    getImageUrl(imageFile: string, imagePath: string): string {
        const imageinfo: ImageInfo = { imageFile: imageFile, imagePath: imagePath };

        return this._utilaty.getImageUrl(imageinfo);
    }
}
