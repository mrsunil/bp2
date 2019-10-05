import { Injectable, OnInit } from '@angular/core';
import { CookieService } from "ngx-cookie-service";

@Injectable()
export class CookiesService {


    constructor(private cookieService: CookieService) { }

    setCookie(property: string, value: string) {
		localStorage.setItem(property, value);
    }

    getCookie(property: string): string
    {
		return localStorage.getItem(property);
    }
}

export class CookiesProps {
    public static readonly currentCompany = "currentCompany";
}
