import { orderStatus } from '../core/enums/orderStatus';

export interface IOrderParams {
    PageNumber: number;
    PageSize: number;
    OrderStatus?: orderStatus | null;
    search?: string;
}
