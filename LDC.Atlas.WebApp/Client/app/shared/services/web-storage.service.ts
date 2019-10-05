import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class WebStorageService {

    constructor() { }

    saveToStorage(key: string, data: any): void {
        if (data) {
            sessionStorage.setItem(key, JSON.stringify(data));
        }
    }

    loadFromStorage(key: string): any {
        const config = sessionStorage.getItem(key);
        return JSON.parse(config);
    }

    isInStorage(key: string): boolean {
        if (key) {
            return sessionStorage.getItem(key) !== null;
        }
        return false;
    }

    updateStorage(key: string, data: any): void {
        if (data) {
            sessionStorage.setItem(key, JSON.stringify(data));
        }
    }
}
