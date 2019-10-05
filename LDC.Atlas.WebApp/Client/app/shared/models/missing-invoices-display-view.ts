export class MissingInvoicesDisplayView {
	sectionID: number;
	contractRef: string;
	department: string;
	counterparty: string;
	vessel: string;
	blDate: Date;
	period: string;
	commodity: string;
	quantity: number;
	total: number;
	price: number;
	priceDiff: number;
	lots: number;
	user: string;
	entityFilter: string;
	blDateFilter: number;
	transportFilter: string;
	contractTypeFilter: string;

	constructor(sectionID: number, contractRef: string, department: string, counterparty: string, vessel: string, blDate: Date, period: string, commodity: string, quantity: number, total: number, price: number, priceDiff: number, lots: number, user: string, entityFilter: string, blDateFilter: number, transportFilter: string, contractTypeFilter: string) {
		this.contractRef = contractRef;
		this.department = department;
		this.counterparty = counterparty;
		this.vessel = vessel;
		this.blDate = blDate;
		this.period = period;
		this.commodity = commodity;
		this.quantity = quantity;
		this.total = total;
		this.price = price;
		this.priceDiff = priceDiff;
		this.lots = lots;
		this.user = user;
		this.entityFilter = entityFilter;
		this.blDateFilter = blDateFilter;
		this.transportFilter = transportFilter;
		this.contractTypeFilter = contractTypeFilter;
		this.sectionID = sectionID;
	}
}
