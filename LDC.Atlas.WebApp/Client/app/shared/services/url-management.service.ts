import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class UrlManagementService {

    constructor(private router: Router) { }

    navigateToCompany(company: string, oldCompany: string) {
        const values = this.router.url.split('/');

        let newUrl: string = '/' + company;
        if (values.length > 0 && values[1] !== oldCompany) {
            newUrl += '/' + values[1];
        }

        for (let i = 2; i < values.length; i++) {
            newUrl += '/' + values[i];
        }
        this.router.navigateByUrl(newUrl);
    }

    getCurrentCompanyId(): string {
        const url: string = this.router.url;
        return this.getCompanyFromUrl(url);
    }

    getCompanyFromUrl(url: string): string {
        return url.split('/')[1];
    }

    resetToCompany(company: string) {
        this.router.navigate(['/', company]);
    }
}
