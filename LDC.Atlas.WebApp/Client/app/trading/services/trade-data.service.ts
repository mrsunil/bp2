import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, mergeMap, shareReplay } from 'rxjs/operators';
import { Allocation } from '../../shared/entities/allocation.entity';
import { InvoiceMarkingDetails } from '../../shared/entities/invoice-marking-status-tab.entity';
import { SectionTraffic } from '../../shared/entities/section-traffic.entity';
import { InvoiceMarking } from '../../shared/services/execution/dtos/invoice-marking';
import { ExecutionService } from '../../shared/services/http-services/execution.service';
import { SectionReference } from '../entities/section-reference';

@Injectable()
export class TradeDataService {
    private sectionId: number;
    private dataVersionId: number;
    private trafficDetails$: Observable<SectionTraffic>;
    private allocationDetails$: Observable<Allocation>;
    private invoiceMarkingDetails$: Observable<InvoiceMarkingDetails>;
    private sectionReferenceSubject = new BehaviorSubject<SectionReference>(null);
    sectionReference$ = this.sectionReferenceSubject.asObservable();

    constructor(private executionService: ExecutionService) { }

    setSectionData(sectionId: number, dataVersionId: number) {
        if (this.isParameterChanged(sectionId, dataVersionId)) {
            this.sectionId = sectionId;
            this.dataVersionId = dataVersionId;
            this.resetStreams();
        }

        this.sectionReferenceSubject.next(new SectionReference(sectionId, dataVersionId));
    }

    getTrafficDetails(): Observable<SectionTraffic> {
        if (!this.trafficDetails$) {
            this.trafficDetails$ = this.sectionReference$
                .pipe(
                    filter((data) => data !== null),
                    mergeMap((sectionReference: SectionReference) => {
                        return this.executionService.GetSectionTrafficDetails(
                            sectionReference.sectionId,
                            sectionReference.dataVersionId);
                    }),
                    shareReplay(1),
                );
        }

        return this.trafficDetails$;
    }

    getAllocationDetails(): Observable<Allocation> {
        if (!this.allocationDetails$) {
            this.allocationDetails$ = this.sectionReference$
                .pipe(
                    filter((data) => data !== null),
                    mergeMap((sectionReference: SectionReference) => {
                        return this.executionService.getAllocationBySectionId(
                            sectionReference.sectionId,
                            sectionReference.dataVersionId);
                    }),
                    shareReplay(1),
                );
        }

        return this.allocationDetails$;
    }

    getInvoiceMarkingDetails(): Observable<InvoiceMarkingDetails> {
        if (!this.invoiceMarkingDetails$) {
            this.invoiceMarkingDetails$ = this.sectionReference$
                .pipe(
                    filter((data) => data !== null),
                    mergeMap((sectionReference: SectionReference) => {
                        return this.executionService.getInvoiceMarkingDetailsByCompanyAndSectionId(
                            sectionReference.sectionId,
                            sectionReference.dataVersionId);
                    }),
                    shareReplay(1),
                );
        }

        return this.invoiceMarkingDetails$;
    }

    private resetStreams(): void {
        this.trafficDetails$ = null;
        this.allocationDetails$ = null;
        this.invoiceMarkingDetails$ = null;
    }

    private isParameterChanged(sectionId: number, dataVersionId: number): boolean {
        return (this.sectionId !== sectionId) || (this.dataVersionId !== dataVersionId);
    }
}
