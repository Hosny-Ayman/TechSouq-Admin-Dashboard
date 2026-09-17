import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '@/app/layout/service/layout.service';
import { AuthService } from '@/app/core/core/services/auth-service.service';
import { MenuModule } from 'primeng/menu';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator, MenuModule],
    template: ` <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                <i class="pi pi-bars"></i>
            </button>
            <a class="layout-topbar-logo" routerLink="/">
                <span>TechSouq Admin</span>
            </a>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                    <i [ngClass]="{ 'pi ': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
                </button>
                <div class="relative">
                    <button
                        class="layout-topbar-action layout-topbar-action-highlight"
                        pStyleClass="@next"
                        enterFromClass="hidden"
                        enterActiveClass="animate-scalein"
                        leaveToClass="hidden"
                        leaveActiveClass="animate-fadeout"
                        [hideOnOutsideClick]="true"
                    >
                        <i class="pi pi-palette"></i>
                    </button>
                    <app-configurator />
                </div>
            </div>

            <button class="layout-topbar-menu-button layout-topbar-action" pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true">
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <button type="button" class="layout-topbar-action" (click)="menu.toggle($event)">
                        <i class="pi pi-user"></i>
                        <span class="hidden lg:inline ml-2 text-sm font-bold">{{ currentUser?.firstName || 'Admin' }}</span>
                        <span class="lg:hidden">Profile</span>
                    </button>

                    <p-menu #menu [model]="userMenuItems" [popup]="true" appendTo="body" />
                </div>
            </div>
        </div>
    </div>`
})
export class AppTopbar implements OnInit {
    layoutService = inject(LayoutService);
    private _authService = inject(AuthService);

    userMenuItems: MenuItem[] = [];
    currentUser: any;

    ngOnInit(): void {
        this.currentUser = this._authService.getCurrentUser();

        this.userMenuItems = [
            {
                label: `<div class="font-bold text-primary text-lg border-b border-surface-200 dark:border-surface-700 pb-2 mb-2">Welcome, ${this.currentUser.firstName}</div>`,
                escape: false,
                items: [
                    {
                        label: 'My Profile',
                        icon: 'pi pi-user-edit',
                        routerLink: '/profile'
                    },
                    {
                        separator: true
                    },
                    {
                        label: 'Logout',
                        icon: 'pi pi-power-off',
                        command: () => this.onLogout()
                    }
                ]
            }
        ];
    }

    onLogout() {
        this._authService.logout().subscribe();
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({
            ...state,
            darkTheme: !state.darkTheme
        }));
    }
}
