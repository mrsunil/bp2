import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorizationService } from '../../../core/services/authorization.service';
import { FinancialTabGroupComponent } from './../tab-group/financial-tab-group.component';

@Component({
    selector: 'atlas-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
    @ViewChild('tabGroup') tabGroupComponent: FinancialTabGroupComponent;

    company: string;
    isLoading = true;

    constructor(private route: ActivatedRoute,
        private router: Router,
        private authorizationService: AuthorizationService) {

    }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        const numberOfTabs = this.tabGroupComponent.routeLinks.length;
        let i = 0;
        while (i < numberOfTabs) {
            const route = this.tabGroupComponent.routeLinks[i];
            const privileges = route.privilege ? route.privilege.split('.') : [];
            const privilege = privileges.length > 0 ? privileges[privileges.length - 1] : '';
            if (privilege !== '' && this.authorizationService.isPrivilegeAllowed(
                this.company,
                privilege)) {
                i = numberOfTabs;
                this.router.navigate([route.link]);
            }
            i = i + 1;
        }
    }
}
