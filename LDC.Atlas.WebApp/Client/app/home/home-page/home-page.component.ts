import { Component, OnInit } from '@angular/core';
import { UserIdentityService } from '../../shared/services/http-services/user-identity.service';
import { TitleService } from '../../shared/services/title.service';

@Component({
    selector: 'atr-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

    constructor(private userIdentityService: UserIdentityService,
        private titleService: TitleService) { }

    isTradingUser = false;
    isExecutionUser = true;

    ngOnInit() {
        this.titleService.setTitle('Home');
    }

}
