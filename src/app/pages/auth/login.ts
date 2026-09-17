import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { AuthService } from '@/app/core/core/services/auth-service.service';
import { SystemStettings } from '@/app/core/core/services/system-stettings.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ButtonModule, CheckboxModule, InputTextModule, PasswordModule, RouterModule, RippleModule, AppFloatingConfigurator],
    template: `
        <app-floating-configurator />
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-screen overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                        <div class="text-center mb-8">
                            @if (Logo) {
                                <img [src]="getLogo()" alt="TechSouq Logo" class="mb-8 w-64 h-64 shrink-0 mx-auto" />
                            }
                            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">TechSouq Admin</div>
                            <span class="text-muted-color font-medium">Sign in to manage your store</span>
                        </div>

                        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                            <div>
                                <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                                <input pInputText id="email1" name="email" type="email" placeholder="admin@techsouq.com" class="w-full md:w-120 mb-2" formControlName="email" autocomplete="username" />

                                <div class="h-6 mb-4">
                                    @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
                                        <small class="text-red-700 font-bold">Please enter a valid email.</small>
                                    }
                                </div>

                                <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Password</label>
                                <p-password inputId="password1" name="password" formControlName="password" placeholder="Password" [toggleMask]="true" class="mb-2" [fluid]="true" [feedback]="false" autocomplete="current-password"></p-password>

                                <div class="h-6 mb-4">
                                    @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
                                        <small class="text-red-700 font-bold">Password is required.</small>
                                    }
                                </div>

                                @if (errorMessage) {
                                    <div class="p-3 bg-red-100 text-red-700 font-bold rounded-lg text-sm text-center border border-red-200 mb-4">
                                        {{ errorMessage }}
                                    </div>
                                }

                                <div class="flex items-center justify-center mt-2 mb-8 gap-8">
                                    <div class="flex items-center"></div>
                                    <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">Forgot password?</span>
                                </div>

                                <p-button label="Sign In" styleClass="w-full" type="submit" [loading]="isLoading"></p-button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class Login implements OnInit {
    private _fb = inject(FormBuilder);
    private _authService = inject(AuthService);
    private _router = inject(Router);
    private _cdr = inject(ChangeDetectorRef);
    private _systemSettings = inject(SystemStettings);

    loginForm!: FormGroup;
    isLoading: boolean = false;
    errorMessage: string = '';
    Logo: string = '';

    ngOnInit(): void {
        this.loginForm = this._fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            rememberMe: [false]
        });

        this._systemSettings.GetSystemSettingByKey('SiteLogo').subscribe({
            next: (req: any) => {
                this.Logo = req.data.settingValue;
                this._cdr.detectChanges();
            },
            error: (err: any) => {}
        });
    }

    onSubmit(): void {
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';

        const { email, password } = this.loginForm.value;

        this._authService.loginAdmin({ email, password }).subscribe({
            next: (res) => {
                this.isLoading = false;
                this._router.navigate(['/']);
            },
            error: (err) => {
                this.isLoading = false;
                if (err.error && err.error.message) {
                    this.errorMessage = err.error.message;
                } else {
                    this.errorMessage = 'حدث خطأ أثناء تسجيل الدخول. تأكد من بياناتك.';
                }
                this._cdr.detectChanges();
            }
        });
    }

    getLogo(): string {
        return this.Logo;
    }
}
