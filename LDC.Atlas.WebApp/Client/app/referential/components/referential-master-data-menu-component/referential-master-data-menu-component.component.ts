import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Menu } from '../../../shared/entities/menu.entity';
import { MasterdataManagementService } from '../../../shared/services/masterdata-management.service';

@Component({
    selector: 'atlas-referential-master-data-menu-component',
    templateUrl: './referential-master-data-menu-component.component.html',
    styleUrls: ['./referential-master-data-menu-component.component.scss'],
})
export class ReferentialMasterDataMenuComponentComponent implements OnInit {
    company: string;
    isLoading = false;
    menus: Menu[];

    constructor(
        protected masterdataService: MasterdataManagementService,
        private route: ActivatedRoute,
        private router: Router) { }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.menus = this.masterdataService.menus;
    }

    onNavigateButtonClicked(route: string) {
        this.router.navigate(['/' + this.company + route]);
    }

}
