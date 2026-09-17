import { afterNextRender, Component, effect, inject, OnInit, signal } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { LayoutService } from '@/app/layout/service/layout.service';
import { DashboardService } from '@/app/core/core/services/dashboard.service';

@Component({
    standalone: true,
    selector: 'app-revenue-stream-widget',
    imports: [ChartModule],
    template: `<div class="card mb-8!">
        <div class="font-semibold text-xl mb-4">Sales Last 7 Days</div>
        <p-chart type="bar" [data]="chartData()" [options]="chartOptions()" class="h-100" />
    </div>`
})
export class RevenueStreamWidget implements OnInit {
    layoutService = inject(LayoutService);
    private _dashboardService = inject(DashboardService);

    salesLast7Days: number[] = [];

    chartData = signal<any>(null);
    chartOptions = signal<any>(null);

    constructor() {
        effect(() => {
            this.layoutService.layoutConfig().darkTheme;
            if (this.salesLast7Days.length > 0) {
                this.initChart();
            }
        });
    }

    ngOnInit(): void {
        this._dashboardService.SalesLast7Days().subscribe({
            next: (req: any) => {
                this.salesLast7Days = req.data;
                this.initChart();
            },
            error: (err: any) => {}
        });
    }

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const borderColor = documentStyle.getPropertyValue('--surface-border');
        const textMutedColor = documentStyle.getPropertyValue('--text-color-secondary');

        const last7DaysLabels = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d.toLocaleDateString('en-US', { weekday: 'short' });
        });

        this.chartData.set({
            labels: last7DaysLabels,
            datasets: [
                {
                    type: 'bar',
                    label: 'Revenue ($)',
                    backgroundColor: documentStyle.getPropertyValue('--p-primary-500'),
                    data: this.salesLast7Days,
                    borderRadius: 6,
                    barThickness: 32
                }
            ]
        });

        this.chartOptions.set({
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    stacked: false,
                    ticks: { color: textMutedColor },
                    grid: { color: 'transparent', borderColor: 'transparent' }
                },
                y: {
                    stacked: false,
                    ticks: { color: textMutedColor },
                    grid: { color: borderColor, borderColor: 'transparent', drawTicks: false }
                }
            }
        });
    }
}
