export class Filter {
	filterId: string;
	filters: string[];

	constructor(filterId: string, filters: string[]) {
		this.filterId = filterId;
		this.filters = filters;
	}
}
