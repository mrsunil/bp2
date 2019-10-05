import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'atlas-operations',
    templateUrl: './operations.component.html',
    styleUrls: ['./operations.component.scss']
})
export class OperationsComponent implements OnInit {
    company: string;
    constructor(private router: Router,
        private route: ActivatedRoute, ) { }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
    }

    onNavigateButtonClicked(route: string) {
        this.router.navigate(['/' + this.company + route]);
    }
}
