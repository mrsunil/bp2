import { Component, Input, OnInit } from '@angular/core';
import { ContractStatus } from '../../enums/contract-status.enum';

@Component({
	selector: 'atr-contract-status-label',
	templateUrl: './contract-status-label.component.html',
	styleUrls: ['./contract-status-label.component.scss'],
})

export class ContractStatusLabelComponent implements OnInit {

	statusCode: ContractStatus = null;
	statusLabel: string = null;

	@Input() set status(status: ContractStatus) {
		this.statusLabel = ContractStatus[status];
		this.statusCode = status;
	}

	@Input() set statusString(status: string) {
		this.statusLabel = status;
		this.statusCode = ContractStatus[status];
	}

	constructor() {	}

	ngOnInit() {
		// this.statusLabel = ContractStatus[status];
	}
}
