import { DashboardService } from '@/app/core/core/services/dashboard.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';

@Component({
    standalone: true,
    selector: 'app-notifications-widget',
    imports: [CommonModule, ButtonModule, MenuModule],
    template: `<div class="card">
        <div class="flex items-center justify-between mb-6">
            <div class="font-semibold text-xl">
                Live Notifications
                <span class="inline-block w-2 h-2 ml-2 bg-green-500 rounded-full animate-pulse"></span>
            </div>
            <div>
                <button pButton type="button" icon="pi pi-ellipsis-v" class="p-button-rounded p-button-text p-button-plain" (click)="menu.toggle($event)"></button>
                <p-menu #menu [popup]="true" [model]="items"></p-menu>
            </div>
        </div>

        <span class="block text-muted-color font-medium mb-4">RECENT</span>
        <ul class="p-0 mx-0 mt-0 mb-6 list-none">
            @if (notifications.length === 0) {
                <li class="flex justify-center items-center py-4 text-surface-500">No new notifications right now.</li>
            }

            @for (notif of notifications; track notif.date) {
                <li class="flex items-center py-3 border-b border-surface fadein animation-duration-500">
                    <div class="w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-full mr-4 shrink-0">
                        <i class="pi pi-bell text-xl! text-blue-500"></i>
                    </div>
                    <span class="text-surface-900 dark:text-surface-0 leading-normal flex-1">
                        {{ notif.message }}
                        <span class="block text-sm text-surface-500 mt-1">{{ notif.date | date: 'shortTime' }}</span>
                    </span>
                </li>
            }
        </ul>
    </div>`
})
export class NotificationsWidget implements OnInit {
    private _dashboardService = inject(DashboardService);
    private cdr = inject(ChangeDetectorRef);

    notifications: any[] = [];

    items = [
        {
            label: 'Clear All',
            icon: 'pi pi-fw pi-trash',
            command: () => {
                this.notifications = [];
                this.cdr.detectChanges();
            }
        }
    ];

    ngOnInit(): void {
        this._dashboardService.startConnection();

        this._dashboardService.addReceiveOrderListener((notification) => {
            this.notifications.unshift(notification);

            this.cdr.detectChanges();
        });
    }
}
