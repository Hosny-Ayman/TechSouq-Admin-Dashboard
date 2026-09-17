import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        @for (item of model; track item.label) {
            @if (!item.separator) {
                <li app-menuitem [item]="item" [root]="true"></li>
            } @else {
                <li class="menu-separator"></li>
            }
        }
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
            },
            {
                label: 'Store Management',
                items: [
                    { label: 'Orders', icon: 'pi pi-fw pi-shopping-cart', routerLink: ['/orders'] },
                    { label: 'Products', icon: 'pi pi-fw pi-box', routerLink: ['/products'] },
                    { label: 'Categories', icon: 'pi pi-fw pi-tags', routerLink: ['/categories'] },
                    { label: 'Brands', icon: 'pi pi-fw pi-tag', routerLink: ['/brands'] }
                ]
            },
            {
                label: 'Marketing & Customers',
                items: [
                    { label: 'Customers', icon: 'pi pi-fw pi-users', routerLink: ['/customers'] },
                    { label: 'Coupons', icon: 'pi pi-fw pi-ticket', routerLink: ['/coupons'] }
                ]
            },
            {
                label: 'Settings',
                items: [
                    { label: 'Delivery Zones', icon: 'pi pi-fw pi-truck', routerLink: ['/deliveryzones'] },
                    { label: 'System Settings', icon: 'pi pi-fw pi-cog', routerLink: ['/settings'] }
                ]
            }
        ];
    }
}
