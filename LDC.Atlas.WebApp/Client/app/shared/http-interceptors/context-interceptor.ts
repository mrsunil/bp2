import { Injectable, Injector } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor } from "@angular/common/http";
import { HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { Router, ActivatedRouteSnapshot, RouterState, RouterStateSnapshot } from "@angular/router";

@Injectable()
export class ContextInterceptor implements HttpInterceptor {
	private router: Router;

	constructor(private injector: Injector, route: Router
		) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		this.router = this.injector.get(Router);

		const state: RouterState = this.router.routerState;
		const snapshot: RouterStateSnapshot = state.snapshot;
		const root: ActivatedRouteSnapshot = snapshot.root;
		const child = root.firstChild;

		// TODO: to refine
		const screen = child && child.data.title ? child.data.title : "Atlas";
		
        const clonedRequest = req.clone({
			headers: req.headers.set('Atlas-Program-Id', screen)});

        return next.handle(clonedRequest);
    }
}
