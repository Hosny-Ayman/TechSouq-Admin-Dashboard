export interface ProductDto {
    id: number;
    name: string;
    description: string;
    stock: number;
    price: number;
    images: string[];
    firstImage: string;
    categoryName: string;
    brandName: string;
    averageRating: number;
    totalReviews: number;
    discountStartDate?: string;
    discountEndDate?: string;
    isFreeShipping: boolean;
    priceAfterDiscount?: number;
}
