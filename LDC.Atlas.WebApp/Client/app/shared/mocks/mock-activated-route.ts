
import {of as observableOf,  Observable } from 'rxjs';
import { ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from "@angular/router";

let mockSnapShot = new ActivatedRouteSnapshot();
let mockCompanyUrlSegment = new UrlSegment("s4", {});
let mockTradesUrlSegment = new UrlSegment("trades", {});
let mockNewTradeUrlSegment = new UrlSegment("new", {});
mockSnapShot.url = new Array<UrlSegment>();
mockSnapShot.url.push(mockCompanyUrlSegment);
mockSnapShot.url.push(mockTradesUrlSegment);
mockSnapShot.url.push(mockNewTradeUrlSegment);

export class MockActivatedRoute extends ActivatedRoute {
	snapshot = mockSnapShot;
	public params = observableOf({id: 123});
}
