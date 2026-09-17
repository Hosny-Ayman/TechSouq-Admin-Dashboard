import { MessagesService } from '@/app/core/core/services/messages.service';
import { SystemSettingsService } from '@/app/core/core/services/system-settings.service';
import { UtilityService } from '@/app/core/core/services/utility.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-system-settings',
    imports: [CommonModule, FormsModule, ButtonModule, InputTextModule],
    templateUrl: './system-settings.html',
    styleUrl: './system-settings.scss'
})
export class SystemSettings implements OnInit {
    private _settingsService = inject(SystemSettingsService);
    private _message = inject(MessagesService);
    private _cdr = inject(ChangeDetectorRef);
    private _uitlati = inject(UtilityService);

    isFetching: boolean = false;
    isLogoSaving: boolean = false;
    isShippingSaving: boolean = false;

    logoSetting: any = { id: 0, settingKey: 'SiteLogo', settingValue: '', description: 'Website Main Logo URL' };
    shippingSetting: any = { id: 0, settingKey: 'FreeShippingThreshold', settingValue: '2000', description: 'Free Shipping Minimum Amount' };

    ngOnInit(): void {
        this.loadSettings();
    }

    loadSettings() {
        this.isFetching = true;
        this._settingsService.getAllSettings().subscribe({
            next: (res: any) => {
                const settingsList = res.data;

                const foundLogo = settingsList.find((s: any) => s.settingKey === 'SiteLogo');
                if (foundLogo) this.logoSetting = foundLogo;

                const foundShipping = settingsList.find((s: any) => s.settingKey === 'FreeShippingThreshold');
                if (foundShipping) this.shippingSetting = foundShipping;

                this.isFetching = false;
                this._cdr.detectChanges();
            },
            error: (err) => {
                this.isFetching = false;
                this._cdr.detectChanges();
            }
        });
    }

    saveLogoSetting() {
        this.isLogoSaving = true;

        const payload = {
            ...this.logoSetting,
            settingValue: this.logoSetting.settingValue?.toString() || '',
            description: this.logoSetting.description || 'Website Main Logo URL'
        };

        const request = payload.id === 0 ? this._settingsService.addSetting(payload) : this._settingsService.updateSetting(payload);

        request.subscribe({
            next: () => {
                this._message.showSuccess('Logo settings saved successfully!');
                this.loadSettings();
                this.isLogoSaving = false;
            },
            error: (err: any) => {
                err?.error?.errors?.forEach((er: string) => this._message.showError(er));
                this.isLogoSaving = false;
            }
        });
    }

    saveShippingSetting() {
        this.isShippingSaving = true;

        const payload = {
            ...this.shippingSetting,
            settingValue: this.shippingSetting.settingValue?.toString() || '0',
            description: this.shippingSetting.description || 'Free Shipping Minimum Amount'
        };

        const request = payload.id === 0 ? this._settingsService.addSetting(payload) : this._settingsService.updateSetting(payload);

        request.subscribe({
            next: () => {
                this._message.showSuccess('Shipping threshold saved successfully!');
                this.loadSettings();
                this.isShippingSaving = false;
            },
            error: (err: any) => {
                err?.error?.errors?.forEach((er: string) => this._message.showError(er));
                this.isShippingSaving = false;
            }
        });
    }

    getImageUrl(): string {
        return this._uitlati.getImageUrl({ imageFile: 'SiteImages', imagePath: this.logoSetting.settingValue });
    }
}
