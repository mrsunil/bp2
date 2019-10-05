import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorDisplayView } from '../../models/error-display-view';

@Component({
    selector: 'atlas-error-page',
    templateUrl: './error-page.component.html',
    styleUrls: ['./error-page.component.scss'],
})
export class ErrorPageComponent implements OnInit {
    company: string;
    error: ErrorDisplayView;

    constructor(
        private route: ActivatedRoute,
        private router: Router) {
        this.company = this.route.snapshot.paramMap.get('company');
        this.company = this.company != null && this.company.length > 2 ? null : this.company;
        const status = this.route.snapshot.paramMap.get('status');
        this.error = new ErrorDisplayView(status);
    }

    ngOnInit() {
    }

    goToHomePage() {
        this.router.navigate([this.company + '/home']);
    }
}
