import { Component } from '@angular/core';
import { Routes } from '@angular/router';

export default [
    { path: '', loadComponent: () => import('./dashboard/dashboard').then((c) => c.Dashboard) },

    { path: 'orders', loadComponent: () => import('./orders/orders').then((c) => c.Orders) },
    { path: 'products', loadComponent: () => import('./products/products').then((c) => c.Products) },
    { path: 'customers', loadComponent: () => import('./customers/customers').then((c) => c.Customers) },
    { path: 'coupons', loadComponent: () => import('./coupons/coupons').then((c) => c.Coupons) },
    { path: 'categories', loadComponent: () => import('./categories/categories').then((c) => c.Categories) },
    { path: 'brands', loadComponent: () => import('./brands/brands').then((c) => c.Brands) },
    { path: 'orderDetils/:id', loadComponent: () => import('./order-details/order-details').then((c) => c.OrderDetails) },
    { path: 'deliveryzones', loadComponent: () => import('./delivery-zones/delivery-zones').then((c) => c.DeliveryZones) },
    { path: 'settings', loadComponent: () => import('./system-settings/system-settings').then((c) => c.SystemSettings) },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
