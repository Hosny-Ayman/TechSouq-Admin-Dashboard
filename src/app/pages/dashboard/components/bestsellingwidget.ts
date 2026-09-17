import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { DashboardService } from '@/app/core/core/services/dashboard.service';

@Component({
    standalone: true,
    selector: 'app-best-selling-widget',
    imports: [CommonModule, ButtonModule, MenuModule],
    template: ` <div class="card">
        <div class="flex justify-between items-center mb-6">
            <div class="font-semibold text-xl">Best Selling Products</div>
        </div>

        <ul class="list-none p-0 m-0">
            @for (Product of bestSellingProducts; track $index) {
                <li class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <div>
                        <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">{{ Product.productName }}</span>
                        <div class="mt-1 text-muted-color">{{ Product.categoryName }}</div>
                    </div>
                    <div class="mt-2 md:mt-0 flex items-center">
                        <div class="bg-surface-300 dark:bg-surface-500 rounded-border overflow-hidden w-40 lg:w-24" style="height: 8px">
                            <div class="h-full" [class]="colors[$index % colors.length]" [style.width.%]="Product?.percentageOfSell ?? 0"></div>
                        </div>
                        <span class="text-orange-500 ml-4 font-medium">{{ Product?.percentageOfSell ?? 0 }}%</span>
                    </div>
                </li>
            }
        </ul>
    </div>`
})
export class BestSellingWidget implements OnInit {
    private _dashboardService = inject(DashboardService);

    bestSellingProducts: any[] = [];
    colors = ['bg-orange-500', 'bg-cyan-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-red-500'];

    ngOnInit(): void {
        this._dashboardService.BestSellingProducts().subscribe({
            next: (req: any) => {
                this.bestSellingProducts = req.data;
            },
            error: (err: any) => {}
        });
    }
}
