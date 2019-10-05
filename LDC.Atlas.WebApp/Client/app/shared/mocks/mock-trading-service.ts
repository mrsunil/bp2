
import { Observable, of as observableOf } from 'rxjs';
import { FixPricedSection } from '../entities/fix-priced-section.entity';
import { Section } from '../entities/section.entity';
import { Trade } from '../entities/trade.entity';
import { ContractTypes } from '../enums/contract-type.enum';
import { PricingMethods } from '../enums/pricing-method.enum';
import { TradingService } from '../services/http-services/trading.service';

export class MockTradingService extends TradingService {
    getSection(sectionId: number): Observable<Section> {
        const section = CreateFakeFixedSection(ContractTypes.Purchase);
        return observableOf(section);
    }
}

export function CreateFakeFixedSection(contractType: ContractTypes): FixPricedSection {
    const section: FixPricedSection = new FixPricedSection();
    section.pricingMethod = PricingMethods.Priced;
    section.header = new Trade<Section>();
    const contractDate = new Date(Date.now());
    const deliveryPeriodStartDate = new Date(Date.now());
    const deliveryPeriodEndDate = new Date(Date.now());
    section.header.type = contractType;
    section.header.contractDate = contractDate;
    section.deliveryPeriodStartDate = deliveryPeriodStartDate;
    section.deliveryPeriodEndDate = deliveryPeriodEndDate;
    return section;
}
