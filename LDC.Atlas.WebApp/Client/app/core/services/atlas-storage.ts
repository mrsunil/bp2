import { OAuthStorage } from 'angular-oauth2-oidc';

export class AtlasStorage extends OAuthStorage {
    prefix = '';

    constructor(private baseRef: string) {
        super();
        this.prefix = `${window.location.hostname}-${baseRef.replace(/\//gi, '')}`;
    }

    getItem(key: string): string | null {
        return localStorage.getItem(`${this.prefix}-${key}`);
    }

    removeItem(key: string): void {
        localStorage.removeItem(`${this.prefix}-${key}`);
    }

    setItem(key: string, data: string): void {
        localStorage.setItem(`${this.prefix}-${key}`, data);
    }
}
