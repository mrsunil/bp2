import { BigNumber } from 'bignumber.js';

export class AtlasNumber {
    bigNumber: BigNumber;

    constructor(nb: string) {
        let nbCleaned = nb;
        if (nb) {
            const ngToString = nb.toString();
            nbCleaned = ngToString.replace(/\,/gi, '');
        }
        this.bigNumber = new BigNumber(nbCleaned);
    }

    public times(toMultiply) {
        this.bigNumber = this.bigNumber.times(toMultiply);
        return this;
    }

    public dividedBy(toDivide) {
        this.bigNumber = this.bigNumber.dividedBy(new BigNumber(toDivide));
        return this;
    }

    public plus(toAdd) {
        this.bigNumber = this.bigNumber.plus(toAdd);
        return this;
    }

    public strictlyBiggerThan(numberToCompare: string | number): boolean {
        return this.bigNumber.comparedTo(numberToCompare) > 0;
    }

    public equal(numberToCompare: string | number): boolean {
        return this.bigNumber.comparedTo(numberToCompare) === 0;
    }

    public toString() {
        return this.bigNumber.toString(10);
    }
}
