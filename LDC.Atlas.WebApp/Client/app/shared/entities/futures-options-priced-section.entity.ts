import { FixingFamily } from './fixing-family.entity';
import { Section } from './section.entity';

export class FuturesOptionsPricedSection extends Section {
    constructor() {
        super();
    }
    fixingFamily: FixingFamily = new FixingFamily();
}
