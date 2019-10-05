import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SecurityService } from '../../../shared/services/security.service';
import { TitleService } from '../../../shared/services/title.service';

@Component({
    selector: 'atr-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
    company: string;
    isLoading = true;

    constructor(private securityService: SecurityService,
        private route: ActivatedRoute,
        private router: Router,
        private titleService: TitleService) { }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.titleService.setTitle('Admin');
        this.securityService.isSecurityReady().subscribe(() => {
            this.isLoading = false;
        });
    }

    navigate(route: string) {
        this.router.navigate(['/' + this.company + route]);
    }
}
