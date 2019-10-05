import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'atlas-privilege-level1-icon',
    templateUrl: './privilege-level1-icon.component.html',
    styleUrls: ['./privilege-level1-icon.component.scss'],
})
export class PrivilegeLevel1IconComponent implements OnInit {
    @Input() privilegeLevel1Name: string;
    previousLevel1Name: string;

    customIconName: string;
    matIconName: string;

    constructor() { }

    ngOnInit() {
    }

    getMatIconForPrivilegeLevel1(): string {
        if (this.privilegeLevel1Name === this.previousLevel1Name) {
            return this.matIconName;
        }
        this.getIcons();
        return this.matIconName;
    }

    getCustomIconForPrivilegeLevel1(): string {
        if (this.privilegeLevel1Name === this.previousLevel1Name) {
            return this.customIconName;
        }
        this.getIcons();
        return this.customIconName;
    }

    getIcons() {

        this.customIconName = null;
        this.matIconName = null;
        switch (this.privilegeLevel1Name) {
            case 'Home': {
                this.matIconName = 'home';
                break;
            }
            case 'Trades': {
                this.customIconName = 'trades';
                break;
            }
            case 'Cash': {
                this.matIconName = 'account_balance_wallet';
                break;
            }
            case 'Charters': {
                this.matIconName = 'directions_boat';
                break;
            }
            case 'Invoices': {
                this.matIconName = 'description';
                break;
            }
            case 'Documents': {
                this.customIconName = 'documents';
                break;
            }
            case 'Reports': {
                this.matIconName = 'bar_chart';
                break;
            }
            case 'Administration': {
                this.matIconName = 'vpn_key';
                break;
            }
            case 'Dashboards': {
                this.matIconName = 'dashboard';
                break;
            }
            case 'Financials': {
                this.matIconName = 'account_balance';
                break;
            }
            case 'MasterData': {
                this.matIconName = 'view_quilt';
                break;
            }
            case 'Referential': {
                this.matIconName = 'view_quilt';
                break;
            }
        }

        this.previousLevel1Name = this.privilegeLevel1Name;
    }
}
