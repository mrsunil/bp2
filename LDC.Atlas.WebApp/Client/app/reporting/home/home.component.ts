import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SecurityService } from '../../shared/services/security.service';
import { TitleService } from '../../shared/services/title.service';

@Component({
    selector: 'atlas-reporting-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
    company: string;
    isLoading = false;

    constructor(private securityService: SecurityService,
        private route: ActivatedRoute,
        private router: Router,
        private titleService: TitleService) { }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.titleService.setTitle('Reports');
    }

    onNavigateButtonClicked(route: string) {
        this.router.navigate(['/' + this.company + route]);
    }
}
