import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '@/app/core/core/services/dashboard.service';
import { LazyLoadEvent } from 'primeng/api';
import { IDashboardParams } from '@/app/core/interfaces/IDashboardParams';

@Component({
    standalone: true,
    selector: 'app-stats-widget',
    imports: [CommonModule],
    template: ` <div class="grid grid-cols-12 gap-8">
        <div class="col-span-12 sm:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Total Sales</span>
                        <div class="text-900 font-medium text-xl">{{ DashboardInfo.totalSales | currency }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-blue-100 border-round" style="width:2.5rem;height:2.5rem">
                        <i class="pi pi-dollar text-blue-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium">From </span>
                <span class="text-500">Orders table</span>
            </div>
        </div>

        <div class="col-span-12 sm:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Total Orders</span>
                        <div class="text-900 font-medium text-xl">{{ DashboardInfo.totalOrders }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-orange-100 border-round" style="width:2.5rem;height:2.5rem">
                        <i class="pi pi-shopping-cart text-orange-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium">Active </span>
                <span class="text-500">purchases</span>
            </div>
        </div>

        <div class="col-span-12 sm:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Customers</span>
                        <div class="text-900 font-medium text-xl">{{ DashboardInfo.totalCustomers }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-cyan-100 border-round" style="width:2.5rem;height:2.5rem">
                        <i class="pi pi-users text-cyan-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium">Registered </span>
                <span class="text-500">users</span>
            </div>
        </div>

        <div class="col-span-12 sm:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Out of Stock</span>
                        <div class="text-900 font-medium text-xl">{{ DashboardInfo.outOfStockProducts }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-purple-100 border-round" style="width:2.5rem;height:2.5rem">
                        <i class="pi pi-box text-purple-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-red-500 font-medium">Needs </span>
                <span class="text-500">restock</span>
            </div>
        </div>
    </div>`
})
export class StatsWidget implements OnInit {
    private _dashboardService = inject(DashboardService);

    DashboardInfo: any = null;

    ngOnInit(): void {
        this._dashboardService.ShowDashboardInfo().subscribe({
            next: (req: any) => {
                this.DashboardInfo = req.data;
            },
            error: (err: any) => {}
        });
    }
}
