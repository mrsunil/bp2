import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { OAuthService, UrlHelperService } from 'angular-oauth2-oidc';
import { CookieService } from 'ngx-cookie-service';
import { MockFeatureFlagService } from '../mocks/mock-feature-flag-service';
import { CookiesService } from '../services/cookies.service';
import { FeatureFlagService } from '../services/http-services/feature-flag.service';
import { FeatureFlagDirective } from './app-flag.directive';

@Component({
    selector: 'atlas-app-test',
    template: `
        <input type="text" *atlasFeatureFlag="gapTest" />
    `,
})
class AtlasAppTestComponent {
    gapTest = '';
}

describe('Directive: FeatureFlagDirective', () => {
    let component: AtlasAppTestComponent;
    let fixture: ComponentFixture<AtlasAppTestComponent>;
    let inputEl: DebugElement;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AtlasAppTestComponent, FeatureFlagDirective],
            imports: [HttpClientTestingModule, RouterTestingModule],
            providers: [
                OAuthService,
                UrlHelperService,
                CookiesService,
                CookieService,
                { provide: FeatureFlagService, useClass: MockFeatureFlagService },
            ],
        });
        fixture = TestBed.createComponent(AtlasAppTestComponent);
        component = fixture.componentInstance;
    }));

    it('should display the test component when the value of the variable "testValue" is gap110', () => {
        component.gapTest = 'gap110';
        fixture.detectChanges();
        inputEl = fixture.debugElement.query(By.css('input'));
        expect(inputEl).toBeDefined();
    });

    it('should not display the test component when the value of the variable "testValue" is gap112', () => {
        component.gapTest = 'gap112';
        fixture.detectChanges();
        inputEl = fixture.debugElement.query(By.css('input'));
        expect(inputEl).toBeNull();
    });

    it('should not display the test component when the value of the variable "testValue" is !gap110', () => {
        component.gapTest = '!gap110';
        fixture.detectChanges();
        inputEl = fixture.debugElement.query(By.css('input'));
        expect(inputEl).toBeNull();
    });

    it('should not display the test component when the value of the variable "testValue" is !gap112', () => {
        component.gapTest = '!gap112';
        fixture.detectChanges();
        inputEl = fixture.debugElement.query(By.css('input'));
        expect(inputEl).toBeNull();
    });
});
