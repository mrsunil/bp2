import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { TradeAllocation } from '../../shared/entities/trade-allocation.entity';
import { PricingMethods } from '../../shared/enums/pricing-method.enum';
import { TradePartialDisplayView } from '../../shared/models/trade-partial-display-view';
import { ExecutionService } from '../../shared/services/http-services/execution.service';
import { TradingService } from '../../shared/services/http-services/trading.service';
import { SecurityService } from '../../shared/services/security.service';
import { SnackbarService } from '../../shared/services/snackbar.service';

@Component({
    selector: 'atr-execution-allocation',
    templateUrl: './execution-allocation.component.html',
    styleUrls: ['./execution-allocation.component.css'],
})
export class ExecutionAllocationComponent implements OnInit {
    company: string;

    model: TradeAllocation = {} as any;
    searchContractReferenceCtrl: FormControl;
    tradeRecords: TradePartialDisplayView[];
    displayedColumns = ['contractLabel', 'type', 'status', 'commodityCode', 'quantity', 'lastModifiedDate', 'lastModifiedBy', 'selection'];
    dataSource: MatTableDataSource<TradePartialDisplayView>;
    selectedRowReference: number;
    originalsectionId: number;
    allocatedTo: string;
    trade: any;
    pricingMethod: PricingMethods;
    selectionManager = new SelectionModel<TradePartialDisplayView>(true, []);

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private securityService: SecurityService,
        private executionService: ExecutionService,
        private tradingService: TradingService,
        private route: ActivatedRoute,
        private router: Router,
        private snackbarService: SnackbarService) {
        this.searchContractReferenceCtrl = new FormControl({ value: '' }, [Validators.required]);
        this.originalsectionId = Number(this.route.snapshot.paramMap.get('sectionId'));
        this.pricingMethod = PricingMethods[this.route.snapshot.paramMap.get('pricingMethod')];
    }

    onSearchTrade() {
        this.executionService.findContractToAllocate(this.originalsectionId, this.model.searchContractReference, this.pricingMethod).pipe(
            map((data) => {
                this.tradeRecords = data.value.map((trade) => {
                    return new TradePartialDisplayView(trade);
                });

                this.dataSource = new MatTableDataSource(this.tradeRecords);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;

                if (this.tradeRecords == null || this.tradeRecords.length === 0) {
                    this.snackbarService.informationSnackBar('No matching contracts found');
                }
            }))
            .subscribe();
    }

    onRowClicked(row: any) {
        if (this.selectionManager.isSelected(row)) {
            this.selectedRowReference = null;
            this.allocatedTo = null;
        } else {
            this.selectionManager.clear();
            this.selectedRowReference = row.sectionId;
            this.allocatedTo = row.contractLabel;
        }
        this.selectionManager.toggle(row);
    }

    doNothing(): boolean {
        return false;
    }

    getTrade(tradeId: number) {
        this.tradingService.getSection(tradeId, this.pricingMethod).pipe(
            map((trade) => {
                this.trade = trade;
            }))
            .subscribe();
    }

    ngOnInit() {
        this.securityService.isSecurityReady().subscribe(() => {
            this.route.params.subscribe((params) => {
                this.getTrade(Number(params['sectionId']));
                this.company = this.route.snapshot.paramMap.get('company');
            });
        });

        this.model.searchContractReference = '';
    }

    @HostListener('window:beforeunload', ['$event'])
    unloadNotification($event: any) {
        if (this.searchContractReferenceCtrl.dirty) {
            $event.returnValue = true;
        }
    }
}
