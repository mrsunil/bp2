export class ProductVariation {
	public productVariationId: string;
	public commodityCode: string;
	public cropYear: number;
	public positionMonthDate: Date;
	public marketZone: string;
	public quantity: number;
	public currency: string;
	public priceCode: string;
	public price: number;
	public valid: boolean = true;
	public errorMessage: string = "";
}
