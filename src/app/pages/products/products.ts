import { Component, inject, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { CheckboxModule } from 'primeng/checkbox';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';

import { ProductDto } from '../../core/interfaces/product.interface';
import { ProductService } from '@/app/core/core/services/product.service';
import { CategoryService } from '@/app/core/core/services/category.service';
import { BrandService } from '@/app/core/core/services/brand.service';
import { merge } from 'rxjs';
import { MessagesService } from '@/app/core/core/services/messages.service';
import { ImagePreview } from '@/app/core/interfaces/image-preview';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { UtilityService } from '@/app/core/core/services/utility.service';
import { ImageInfo } from '@/app/core/interfaces/IImageInfo';

@Component({
    selector: 'app-products',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, ReactiveFormsModule, DialogModule, InputTextModule, InputNumberModule, TextareaModule, SelectModule, DatePickerModule, CheckboxModule, FormsModule, ConfirmDialogModule],
    templateUrl: './products.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ConfirmationService]
})
export class Products implements OnInit {
    private _confirmationService = inject(ConfirmationService);
    private _productService = inject(ProductService);
    private _categoryService = inject(CategoryService);
    private _brandService = inject(BrandService);
    private _fb = inject(FormBuilder);
    private _cdr = inject(ChangeDetectorRef);
    private _messageService = inject(MessagesService);
    private _utilaty = inject(UtilityService);

    products: ProductDto[] = [];
    categories: any[] = [];
    brands: any[] = [];

    totalRecords: number = 0;
    loading: boolean = false;
    pageSize: number = 10;
    pageNumber: number = 1;
    searchTerm: string = '';
    category: string = '';

    productDialog: boolean = false;
    productForm!: FormGroup;

    MainimagePreviewUrl: string = '';
    imagesPreviewUrl: ImagePreview[] = [];
    mainImageFile: File | null = null;
    additionalImageFiles: File[] = [];

    minDate: Date = new Date();

    isEditing: boolean = false;
    selectedProductId: number = 0;

    RemovedImagesUrls?: string[] = [];

    ngOnInit(): void {
        this.initForm();
        this.loadCategoriesAndBrands();
    }

    initForm() {
        this.productForm = this._fb.group({
            name: ['', Validators.required],
            description: ['', Validators.required],
            price: [null, [Validators.required, Validators.min(1)]],
            stock: [null, [Validators.required, Validators.min(0)]],
            categoryId: [null, Validators.required],
            brandId: [null, Validators.required],
            discountAmount: [null],
            priceAfterDiscount: [{ value: null, disabled: true }],
            discountStartDate: [null],
            discountEndDate: [null],
            isFreeShipping: [false]
        });

        merge(this.productForm.get('price')!.valueChanges, this.productForm.get('discountAmount')!.valueChanges).subscribe(() => {
            this.calculateDiscount();
        });
        merge(this.productForm.get('discountStartDate')!.valueChanges, this.productForm.get('discountEndDate')!.valueChanges).subscribe(() => {
            this.checkDateRange();
        });
    }

    checkDateRange() {
        const start = this.productForm.get('discountStartDate')?.value;
        const end = this.productForm.get('discountEndDate')?.value;
        const endControl = this.productForm.get('discountEndDate');

        if (start && end && new Date(start) >= new Date(end)) {
            endControl?.setErrors({ dateInvalid: true });
        } else {
            if (endControl?.hasError('dateInvalid')) {
                const errors = { ...endControl.errors };
                delete errors['dateInvalid'];
                endControl.setErrors(Object.keys(errors).length ? errors : null);
            }
        }
    }

    calculateDiscount() {
        const price = this.productForm.get('price')?.value || 0;
        const discount = this.productForm.get('discountAmount')?.value || 0;
        const finalPrice = price - discount;

        this.productForm.get('priceAfterDiscount')?.patchValue(finalPrice > 0 ? finalPrice : null, { emitEvent: false });
    }

    loadCategoriesAndBrands() {
        this._categoryService.GetAllCategorieForSelect().subscribe({
            next: (res: any) => {
                this.categories = res.data || [];
                this._cdr.markForCheck();
            }
        });

        this._brandService.GetAllBrands().subscribe({
            next: (res: any) => {
                this.brands = res.data || [];
                this._cdr.markForCheck();
            }
        });
    }

    loadProducts(event: TableLazyLoadEvent) {
        this.loading = true;
        this._cdr.markForCheck();

        const rows = event.rows || this.pageSize;
        this.pageNumber = (event.first || 0) / rows + 1;
        this.pageSize = rows;

        this._productService.GetProductsPaged(this.pageNumber, this.pageSize, this.searchTerm, this.category, true, true).subscribe({
            next: (response: any) => {
                if (response && response.data) {
                    this.products = response.data.data || [];
                    this.totalRecords = response.data.totalRecords || 0;
                }
                this.loading = false;
                this._cdr.markForCheck();
            },
            error: () => {
                this.loading = false;
                this._cdr.markForCheck();
            }
        });
    }

    openNew() {
        this.productForm.reset({ isFreeShipping: false });
        this.mainImageFile = null;
        this.additionalImageFiles = [];
        this.MainimagePreviewUrl = '';
        this.imagesPreviewUrl = [];
        this.isEditing = false;
        this.selectedProductId = 0;
        this.productDialog = true;
        this._cdr.markForCheck();
    }

    onImageSelect(event: any) {
        if (event.target.files && event.target.files.length > 0) {
            this.mainImageFile = event.target.files[0];
            this.MainimagePreviewUrl = URL.createObjectURL(this.mainImageFile!);
            this._cdr.markForCheck();
        }
    }

    onAdditionalImagesSelect(event: any) {
        if (event.target.files && event.target.files.length > 0) {
            this.additionalImageFiles = Array.from(event.target.files);

            this.imagesPreviewUrl.push(
                ...this.additionalImageFiles.map((file) => ({
                    imagepath: URL.createObjectURL(file),
                    imagename: file.name
                }))
            );
            this._cdr.markForCheck();
        }
    }

    removeMainImage() {
        this.mainImageFile = null;
        this.MainimagePreviewUrl = '';
        this.RemovedImagesUrls?.push(this.MainimagePreviewUrl);
        this._cdr.markForCheck();
    }

    removeSelectedImage(imagename: string) {
        this.additionalImageFiles = this.additionalImageFiles.filter((file) => file.name !== imagename);
        this.imagesPreviewUrl = this.imagesPreviewUrl.filter((image) => image.imagename !== imagename);
        this.RemovedImagesUrls?.push(imagename);
        this._cdr.markForCheck();
    }

    getImageUrl(imageFile: string, imagePath: string): string {
        const imageinfo: ImageInfo = { imageFile: imageFile, imagePath: imagePath };

        return this._utilaty.getImageUrl(imageinfo);
    }

    onSearch() {
        const searchEvent: TableLazyLoadEvent = {
            first: 0,
            rows: this.pageSize
        };
        this.loadProducts(searchEvent);
    }

    onSearchChange() {
        if (!this.searchTerm || this.searchTerm.trim() === '') {
            this.onSearch();
        }
    }

    EditProduct(prod: any) {
        this.selectedProductId = prod.id;
        this._productService.GetProduct(prod.id, true).subscribe({
            next: (req: any) => {
                const product = req.data;
                this.openNew();
                this.isEditing = true;
                this.selectedProductId = prod.id;
                this.SetData(product);
            },
            error: (err: any) => {
                console.error('get product Failed', err);
            }
        });
    }

    SetData(product: ProductDto) {
        this.productForm.patchValue(product);
        this.productForm.get('categoryId')?.setValue(this.categories.find((c) => c.name === product.categoryName)?.id);
        this.productForm.get('brandId')?.setValue(this.brands.find((b) => b.name === product.brandName)?.id);
        this.productForm.get('discountAmount')?.setValue(product.price - (product.priceAfterDiscount ?? product.price));
        this.productForm.get('discountStartDate')?.setValue(product.discountStartDate ? new Date(product.discountStartDate) : null);
        this.productForm.get('discountEndDate')?.setValue(product.discountEndDate ? new Date(product.discountEndDate) : null);

        this.MainimagePreviewUrl = this.getImageUrl('ProductImages', product.firstImage);
        this.mainImageFile = null;

        this.imagesPreviewUrl = [];
        if (product.images && product.images.length > 0) {
            product.images.forEach((image) => {
                const imageP: ImagePreview = { imagepath: this.getImageUrl('ProductImages', image), imagename: image! };
                this.imagesPreviewUrl.push(imageP);
            });
        }

        this.additionalImageFiles = [];
        this._cdr.markForCheck();
    }

    saveProduct() {
        if (this.productForm.invalid) {
            this.productForm.markAllAsTouched();
            return;
        }

        if (!this.isEditing && !this.mainImageFile) {
            alert('لو سمحت اختار الصورة الرئيسية للمنتج!');
            return;
        }

        const formData = new FormData();
        const rawValues = this.productForm.getRawValue();

        this.RemovedImagesUrls?.forEach((image) => {
            formData.append('RemovedImagesUrls', image);
        });

        if (this.isEditing) {
            formData.append('Id', this.selectedProductId.toString());
        }

        Object.keys(rawValues).forEach((key) => {
            const value = rawValues[key];
            if (value !== null && value !== undefined && key !== 'discountAmount') {
                if (value instanceof Date) {
                    formData.append(key, value.toISOString());
                } else {
                    formData.append(key, value);
                }
            }
        });

        if (this.mainImageFile) {
            formData.append('MainImage', this.mainImageFile);
        }

        if (this.additionalImageFiles.length > 0) {
            this.additionalImageFiles.forEach((file) => {
                formData.append('AdditionalImages', file);
            });
        }

        if (!this.isEditing) {
            this._productService.CreateProduct(formData).subscribe({
                next: () => {
                    this.productDialog = false;
                    this.loadProducts({ first: 0, rows: this.pageSize });
                    this._messageService.showSuccess('Product Added Successfully');
                },
                error: (err) => {
                    console.error('Error saving product:', err);
                    this._messageService.showError('Product Add Failed');
                }
            });
        } else {
            this._productService.UpdateProduct(formData).subscribe({
                next: () => {
                    this.productDialog = false;
                    this.loadProducts({ first: 0, rows: this.pageSize });
                    this._messageService.showSuccess('Product Updated Successfully');
                },
                error: (err) => {
                    console.error('Error updating product:', err);
                    this._messageService.showError('Product Update Failed');
                }
            });
        }
    }

    deleteProduct(product: any): void {
        this._confirmationService.confirm({
            message: `Are you sure you want to delete ${product.name}?`,
            header: 'Delete Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Yes',
            rejectLabel: 'No',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-text',
            accept: () => {
                this._productService.DeleteProduct(product.id).subscribe({
                    next: () => {
                        this._messageService.showSuccess('Product deleted successfully');
                        this.loadProducts({ first: 0, rows: this.pageSize });
                    },
                    error: (err) => {
                        console.error('Error deleting product', err);
                        this._messageService.showError('Error deleting product');
                    }
                });
            },
            reject: () => {}
        });
    }
}
