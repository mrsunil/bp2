//import { Injectable, Injector } from "@angular/core";
//import { HttpEvent, HttpHandler, HttpInterceptor } from "@angular/common/http";
//import { HttpRequest } from "@angular/common/http";
//import { Observable } from "rxjs/Observable";
//import { OAuthService } from "angular-oauth2-oidc";
//import { ActivatedRoute } from "@angular/router";

//@Injectable()
//export class AuthInterceptor implements HttpInterceptor {

//    private oAuthService: OAuthService;

//    constructor(private injector: Injector) {
//    }

//    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {


//        this.oAuthService = this.injector.get(OAuthService); // get it here within intercept

//        const clonedRequest = req.clone({
//            headers: req.headers.set('Authorization', "Bearer " + this.oAuthService.getAccessToken())});

//        return next.handle(clonedRequest);
//    }

//}
