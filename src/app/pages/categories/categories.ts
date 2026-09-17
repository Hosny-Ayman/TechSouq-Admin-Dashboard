import { PRIME_ICONS_LIST } from '@/app/core/core/constants/prime-icons';
import { CategoryService } from '@/app/core/core/services/category.service';
import { MessagesService } from '@/app/core/core/services/messages.service';
import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';

@Component({
    selector: 'app-categories',
    imports: [CommonModule, FormsModule, TableModule, ButtonModule, DialogModule, InputTextModule, SelectModule],
    templateUrl: './categories.html',
    styleUrl: './categories.scss'
})
export class Categories {
    private _categoryService = inject(CategoryService);
    private _message = inject(MessagesService);
    private _cdr = inject(ChangeDetectorRef);

    primeIcons = PRIME_ICONS_LIST;

    categories: any[] = [];
    displayDialog: boolean = false;
    isEditMode: boolean = false;
    first: number = 0;

    categoryForm: any = { id: 0, name: '', imageUrl: '' };

    totalRecords: number = 0;
    pageSize: number = 20;
    pageNumber: number = 1;
    loading: boolean = false;

    loadCategories(event: TableLazyLoadEvent) {
        this.loading = true;
        this.first = event.first || 0;
        const rows = event.rows || this.pageSize;
        this.pageNumber = (event.first || 0) / rows + 1;
        this.pageSize = rows;
        this._categoryService.getAllCategoriesPaged(this.pageNumber, this.pageSize).subscribe({
            next: (res: any) => {
                this.categories = res.data.data;
                this.totalRecords = res.data.totalRecords;
                this.loading = false;
                this._cdr.detectChanges();
            },
            error: (err) => {
                this.loading = false;

                this._cdr.detectChanges();
            }
        });
    }

    openNew() {
        this.categoryForm = { id: 0, name: '', imageUrl: '' };
        this.isEditMode = false;
        this.displayDialog = true;
    }

    editCategory(cat: any) {
        this.categoryForm = { ...cat };
        this.isEditMode = true;
        this.displayDialog = true;
    }

    saveCategory() {
        if (this.isEditMode) {
            this._categoryService.updateCategory(this.categoryForm).subscribe({
                next: () => {
                    this._message.showSuccess('Category Updated!');
                    this.loadCategories({ first: this.first, rows: this.pageSize });
                    this.displayDialog = false;
                }
            });
        } else {
            this._categoryService.createCategory(this.categoryForm).subscribe({
                next: () => {
                    this._message.showSuccess('Category Created!');
                    this.loadCategories({ first: this.first, rows: this.pageSize });
                    this.displayDialog = false;
                }
            });
        }
    }

    deleteCategory(id: number) {
        if (confirm('Are you sure you want to delete this category?')) {
            this._categoryService.deleteCategory(id).subscribe({
                next: () => {
                    this._message.showSuccess('Category Deleted!');
                    this.loadCategories({ first: this.first, rows: this.pageSize });
                }
            });
        }
    }
}
