import { Injectable, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationStart } from '@angular/router';
import { environment } from '../../../environments/environment';
import { CompanyManagerService } from '../../core/services/company-manager.service';

@Injectable()
export class TitleService implements OnDestroy {
    
    constructor(private title: Title,
                private router: Router,
                private companyManager: CompanyManagerService)
    {

        router.events.forEach((event) => {
            if (event instanceof NavigationStart) {
                this.clear();                
            }
        });
    }

    getDefaultTitle() {
        const company: string = this.companyManager.getCurrentCompanyId();
        return environment.environmentType.toUpperCase() + ' ' + company.toUpperCase();
    }

    setTitle(newTitle: string) {
        this.title.setTitle(this.getDefaultTitle() + ' - ' + newTitle);
    }

    clear() {
        this.title.setTitle(this.getDefaultTitle())
    }

    ngOnDestroy(): void {
        this.clear();
    }
}
