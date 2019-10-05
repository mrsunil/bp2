import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'atr-user-avatar',
	templateUrl: './user-avatar.component.html',
	styleUrls: ['./user-avatar.component.scss']
})
export class UserAvatarComponent implements OnInit {
	@Input() text: string;

	constructor() { }

	ngOnInit() {

	}

}
